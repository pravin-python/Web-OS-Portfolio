import React, { useState, useMemo } from 'react';
import { parseCSV, searchData, paginateData } from '../../services/dataService';
import { readByPath } from '../../services/filesystem';
import './DatasetViewer.css';

const DATASETS = [
    { name: 'Invoices', path: '/home/researcher/datasets/invoices_dataset.csv' },
    { name: 'Phishing URLs', path: '/home/researcher/datasets/phishing_urls.csv' },
];

const PER_PAGE = 8;

export const DatasetViewer: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const raw = useMemo(() => {
        const content = readByPath(DATASETS[activeTab].path);
        return content ? parseCSV(content) : null;
    }, [activeTab]);

    const filtered = useMemo(() => {
        if (!raw) return null;
        return searchData(raw, search);
    }, [raw, search]);

    const paginated = useMemo(() => {
        if (!filtered) return null;
        return paginateData(filtered, page, PER_PAGE);
    }, [filtered, page]);

    const handleTabChange = (i: number) => {
        setActiveTab(i);
        setSearch('');
        setPage(1);
    };

    return (
        <div className="dv-root">
            <div className="dv-header">
                <span style={{ fontSize: 20 }}>📊</span>
                <h2>Dataset Viewer</h2>
            </div>

            <div className="dv-tabs">
                {DATASETS.map((ds, i) => (
                    <button
                        key={i}
                        className={`dv-tab ${activeTab === i ? 'active' : ''}`}
                        onClick={() => handleTabChange(i)}
                    >
                        {ds.name}
                    </button>
                ))}
            </div>

            <div className="dv-toolbar">
                <input
                    className="dv-search"
                    type="text"
                    placeholder="Search across all columns..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
                <span className="dv-count">
                    {filtered ? `${filtered.totalRows} rows` : '—'}
                </span>
            </div>

            <div className="dv-table-container">
                {filtered && paginated && (
                    <table className="dv-table">
                        <thead>
                            <tr>
                                {filtered.headers.map((h, i) => (
                                    <th key={i}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.rows.map((row, ri) => (
                                <tr key={ri}>
                                    {row.map((cell, ci) => (
                                        <td key={ci} className={getCellClass(filtered.headers[ci], cell)}>
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {paginated && paginated.rows.length === 0 && (
                    <div className="dv-empty">No matching rows found.</div>
                )}
            </div>

            {paginated && paginated.totalPages > 1 && (
                <div className="dv-pagination">
                    <button
                        className="dv-page-btn"
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        ←
                    </button>
                    <span className="dv-page-info">
                        Page {paginated.currentPage} of {paginated.totalPages}
                    </span>
                    <button
                        className="dv-page-btn"
                        disabled={page >= paginated.totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
};

function getCellClass(header: string, value: string): string {
    const h = header?.toLowerCase() || '';
    const v = value?.toLowerCase() || '';
    if (h === 'risk_level' || h === 'risk') {
        if (v === 'high' || v === 'critical') return 'cell-danger';
        if (v === 'medium') return 'cell-warn';
        if (v === 'low') return 'cell-ok';
    }
    if (h === 'status') {
        if (v === 'processed') return 'cell-ok';
        if (v === 'pending') return 'cell-warn';
        if (v === 'failed') return 'cell-danger';
    }
    if (h === 'confidence') {
        const n = parseFloat(v);
        if (n >= 0.9) return 'cell-ok';
        if (n >= 0.7) return 'cell-warn';
        if (n > 0) return 'cell-danger';
    }
    return '';
}
