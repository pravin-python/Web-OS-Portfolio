import React from "react";

export const Trash: React.FC = () => {
  const deletedItems = [
    { name: "self-doubt.exe", size: "∞ KB", date: "Every day" },
    { name: "imposter-syndrome.dll", size: "99.9 MB", date: "Weekly" },
    { name: "comfort-zone.zip", size: "0 KB (empty!)", date: "2024-01-01" },
    { name: "procrastination.bat", size: "24 hours", date: "Yesterday" },
    { name: "fear-of-failure.log", size: "404 KB", date: "Not found" },
  ];

  return (
    <div
      style={{
        padding: "var(--sp-4)",
        fontFamily: "var(--font-system)",
        color: "var(--text-primary)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: "var(--sp-4)",
          paddingBottom: "var(--sp-3)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span style={{ fontSize: 32 }}>🗑️</span>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "var(--text-lg)",
              fontWeight: 600,
            }}
          >
            Trash
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "var(--text-xs)",
              color: "var(--text-secondary)",
            }}
          >
            {deletedItems.length} items — things I no longer need
          </p>
        </div>
      </div>

      {/* Table header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 100px 100px",
          gap: 8,
          padding: "6px 8px",
          fontSize: "var(--text-xs)",
          fontWeight: 500,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span>Name</span>
        <span>Size</span>
        <span>Deleted</span>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {deletedItems.map((item, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 100px 100px",
              gap: 8,
              padding: "10px 8px",
              fontSize: "var(--text-sm)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              transition: "background 100ms",
              borderRadius: 4,
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <span style={{ color: "var(--text-primary)" }}>📄 {item.name}</span>
            <span style={{ color: "var(--text-secondary)" }}>{item.size}</span>
            <span style={{ color: "var(--text-muted)" }}>{item.date}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "var(--sp-3)",
          paddingTop: "var(--sp-3)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          fontSize: "var(--text-xs)",
          color: "var(--text-muted)",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        💡 These items have been permanently deleted from my personality.
      </div>
    </div>
  );
};
