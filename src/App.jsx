{activePlayerId && (() => {
  const activePlayer = players.find((p) => p.id === activePlayerId);
  if (!activePlayer || !activePlayer.image) return null;

  return (
    <div
      style={{
        position: "absolute",
        right: "-6px",
        top: "50%",
        transform: "translate(100%, -50%)",
        width: 120,
        padding: 10,
        borderRadius: 14,
        background: "rgba(0,0,0,0.45)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
        zIndex: 4,
        textAlign: "center",
      }}
    >
      <img
        src={activePlayer.image}
        alt={activePlayer.name}
        style={{
          width: 72,
          height: 120,
          objectFit: "contain",
          display: "block",
          margin: "0 auto 8px auto",
        }}
      />
      <div style={{ fontWeight: 800, fontSize: 12 }}>
        {activePlayer.shirt} · {activePlayer.name}
      </div>
    </div>
  );
})()}