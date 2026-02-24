import React, { useState, useEffect, useCallback } from 'react';
import {
    analyzePassword, generateHashes, analyzeUrl, analyzeAuthLog,
    type PasswordAnalysis, type HashResult, type UrlAnalysis, type LogAnalysis
} from '../../services/securityService';
import { readByPath } from '../../services/filesystem';
import './SecurityToolkit.css';

type Tab = 'password' | 'hash' | 'url' | 'logs';

export const SecurityToolkit: React.FC = () => {
    const [tab, setTab] = useState<Tab>('password');

    return (
        <div className="stk-root">
            <div className="stk-header">
                <span style={{ fontSize: 20 }}>🔐</span>
                <h2>Security Toolkit</h2>
            </div>
            <div className="stk-tabs">
                {([
                    ['password', '🔑 Password'],
                    ['hash', '#️⃣ Hash Gen'],
                    ['url', '🌐 URL Scan'],
                    ['logs', '📋 Log Analysis'],
                ] as [Tab, string][]).map(([key, label]) => (
                    <button
                        key={key}
                        className={`stk-tab ${tab === key ? 'active' : ''}`}
                        onClick={() => setTab(key)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div className="stk-body">
                {tab === 'password' && <PasswordTab />}
                {tab === 'hash' && <HashTab />}
                {tab === 'url' && <UrlTab />}
                {tab === 'logs' && <LogsTab />}
            </div>
        </div>
    );
};

/* ─── Password Tab ─── */
const PasswordTab: React.FC = () => {
    const [pw, setPw] = useState('');
    const [result, setResult] = useState<PasswordAnalysis | null>(null);

    useEffect(() => {
        if (pw) setResult(analyzePassword(pw));
        else setResult(null);
    }, [pw]);

    const meterColor = result
        ? result.score < 25 ? '#ff3d00' : result.score < 50 ? '#ff9100' : result.score < 75 ? '#ffc400' : '#00c853'
        : '#333';

    return (
        <div className="stk-panel">
            <input
                className="stk-input"
                type="text"
                placeholder="Enter password to analyze..."
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="off"
            />
            {result && (
                <div className="stk-result-card animate-in">
                    <div className="stk-meter-bg">
                        <div
                            className="stk-meter-fill"
                            style={{ width: `${result.score}%`, background: meterColor }}
                        />
                    </div>
                    <div className="stk-kv">
                        <span>Strength</span>
                        <strong style={{ color: meterColor }}>{result.strength}</strong>
                    </div>
                    <div className="stk-kv">
                        <span>Entropy</span>
                        <strong>{result.entropy} bits</strong>
                    </div>
                    <div className="stk-kv">
                        <span>Crack Time (GPU)</span>
                        <strong>{result.crackTime}</strong>
                    </div>
                    <div className="stk-reasons">
                        {result.reasons.map((r, i) => <div key={i} className="stk-reason">• {r}</div>)}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Hash Tab ─── */
const HashTab: React.FC = () => {
    const [text, setText] = useState('');
    const [hashes, setHashes] = useState<HashResult | null>(null);

    useEffect(() => {
        if (text) {
            generateHashes(text).then(setHashes);
        } else {
            setHashes(null);
        }
    }, [text]);

    const copyHash = useCallback((val: string) => {
        navigator.clipboard.writeText(val).catch(() => { });
    }, []);

    return (
        <div className="stk-panel">
            <input
                className="stk-input"
                type="text"
                placeholder="Enter text to hash..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            {hashes && (
                <div className="stk-result-card animate-in">
                    {(['md5', 'sha1', 'sha256'] as const).map(algo => (
                        <div key={algo} className="stk-hash-row">
                            <div className="stk-hash-label">{algo.toUpperCase()}</div>
                            <div className="stk-hash-value">
                                <code>{hashes[algo]}</code>
                                <button className="stk-copy-btn" onClick={() => copyHash(hashes[algo])}>
                                    📋
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── URL Scanner Tab ─── */
const UrlTab: React.FC = () => {
    const [url, setUrl] = useState('');
    const [scanning, setScanning] = useState(false);
    const [scanStep, setScanStep] = useState('');
    const [result, setResult] = useState<UrlAnalysis | null>(null);

    const doScan = async () => {
        if (!url.trim()) return;
        setScanning(true);
        setResult(null);
        setScanStep('Initializing...');

        const analysis = await analyzeUrl(url, (step) => {
            setScanStep(step);
        });

        setResult(analysis);
        setScanning(false);
    };

    const riskColor = (r: string) =>
        r === 'CRITICAL' ? '#ff1744' : r === 'HIGH' ? '#ff5252' : r === 'MEDIUM' ? '#ffc107' : '#00c853';

    return (
        <div className="stk-panel">
            <div style={{ display: 'flex', gap: 8 }}>
                <input
                    className="stk-input"
                    type="text"
                    placeholder="Enter URL to scan..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && doScan()}
                    style={{ flex: 1 }}
                />
                <button className="stk-scan-btn" onClick={doScan} disabled={scanning}>
                    {scanning ? '...' : 'Scan'}
                </button>
            </div>

            {scanning && (
                <div className="stk-scanning animate-in">
                    <div className="stk-spinner" />
                    <span>{scanStep}</span>
                </div>
            )}

            {result && (
                <div className="stk-result-card animate-in">
                    <div className="stk-kv" style={{ fontSize: 16 }}>
                        <span>Risk Level</span>
                        <strong style={{ color: riskColor(result.riskLevel) }}>
                            {result.riskLevel}
                        </strong>
                    </div>
                    <div className="stk-meter-bg">
                        <div
                            className="stk-meter-fill"
                            style={{ width: `${result.score}%`, background: riskColor(result.riskLevel) }}
                        />
                    </div>

                    {/* 7-Check Results */}
                    <div style={{ marginTop: 10 }}>
                        {result.checks.map((c, i) => (
                            <div key={i} className="stk-kv" style={{ fontSize: 12, padding: '3px 0' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ color: c.passed ? '#00c853' : '#ff5252' }}>
                                        {c.passed ? '✓' : '✗'}
                                    </span>
                                    {c.name}
                                </span>
                                <span style={{ color: c.passed ? '#666' : '#ffab91', fontSize: 11 }}>
                                    {c.detail}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="stk-reasons">
                        {result.reasons.map((r, i) => <div key={i} className="stk-reason">• {r}</div>)}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Log Analyzer Tab ─── */
const LogsTab: React.FC = () => {
    const [analysis, setAnalysis] = useState<LogAnalysis | null>(null);

    useEffect(() => {
        const content = readByPath('/home/researcher/security/auth.log');
        if (content) setAnalysis(analyzeAuthLog(content));
    }, []);

    if (!analysis) return <div className="stk-panel"><p>Loading auth.log...</p></div>;

    return (
        <div className="stk-panel">
            <div className="stk-result-card">
                <h4 style={{ margin: '0 0 10px', color: '#00d2ff' }}>📋 auth.log Analysis</h4>
                <div className="stk-kv"><span>Total Entries</span><strong>{analysis.totalEntries}</strong></div>
                <div className="stk-kv"><span>Successful Logins</span><strong style={{ color: '#00c853' }}>{analysis.successfulLogins}</strong></div>
                <div className="stk-kv"><span>Failed Attempts</span><strong style={{ color: '#ff5252' }}>{analysis.failedAttempts}</strong></div>

                {analysis.flaggedIPs.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                        <h5 style={{ color: '#ff5252', margin: '0 0 6px' }}>🚨 Flagged IPs</h5>
                        {analysis.flaggedIPs.map((ip, i) => (
                            <div key={i} className="stk-ip-row">
                                <code>{ip.ip}</code>
                                <span>{ip.attempts} attempts</span>
                                <span className="stk-reason-badge">{ip.reason}</span>
                            </div>
                        ))}
                    </div>
                )}

                {analysis.alerts.length > 0 && (
                    <div className="stk-alerts">
                        {analysis.alerts.map((a, i) => <div key={i} className="stk-alert-line">{a}</div>)}
                    </div>
                )}
            </div>
        </div>
    );
};
