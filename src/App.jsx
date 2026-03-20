import React, { useState } from "react";

const INITIAL_PLAYERS = [
  { id: 1, shirt: "1", name: "Rossi", x: 12, y: 50 },
  { id: 2, shirt: "2", name: "Varela", x: 24, y: 82 },
  { id: 3, shirt: "3", name: "Léo Ortiz", x: 24, y: 38 },
  { id: 4, shirt: "4", name: "Léo Pereira", x: 24, y: 62 },
  { id: 5, shirt: "6", name: "Ayrton Lucas", x: 24, y: 18 },
  { id: 6, shirt: "21", name: "Jorginho", x: 44, y: 38 },
  { id: 7, shirt: "8", name: "Saúl", x: 44, y: 62 },
  { id: 8, shirt: "10", name: "Arrascaeta", x: 62, y: 50 },
  { id: 9, shirt: "11", name: "Everton", x: 76, y: 18 },
  { id: 10, shirt: "9", name: "Pedro", x: 82, y: 50 },
  { id: 11, shirt: "7", name: "Luiz Araújo", x: 76, y: 82 },
];

const INITIAL_BENCH = [
  { id: 100, shirt: "27", name: "Bruno Henrique" },
  { id: 101, shirt: "18", name: "De La Cruz" },
  { id: 102, shirt: "26", name: "Alex Sandro" },
  { id: 103, shirt: "13", name: "Danilo" },
  { id: 104, shirt: "20", name: "L. Paquetá" },
  { id: 105, shirt: "15", name: "Carrascal" },
  { id: 106, shirt: "19", name: "G. Plata" },
];

const INITIAL_OPPONENTS = Array.from({ length: 11 }, (_, i) => ({
  id: `opp-${i + 1}`,
  shirt: String(i + 1),
  name: `ADV ${i + 1}`,
  x: 96,
  y: 8 + i * 8.2,
  inField: false,
}));

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function rotatePoint180(p) {
  return { ...p, x: 100 - p.x, y: 100 - p.y };
}

const buttonStyle = {
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  borderRadius: 12,
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
};

const sectionTitleStyle = {
  margin: "0 0 10px 0",
  fontSize: 16,
  fontWeight: 800,
};

const cardStyle = {
  borderRadius: 18,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: 14,
};

const chipStyle = {
  padding: "8px 10px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.06)",
  cursor: "grab",
  userSelect: "none",
  minWidth: 140,
  textAlign: "center",
};

export default function EstudioTatico() {
  const [channelName] = useState("Estúdio Tático");
  const [subtitle] = useState("Substituição automática por arraste");

  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [bench, setBench] = useState(INITIAL_BENCH);
  const [opponents, setOpponents] = useState(INITIAL_OPPONENTS);

  const [draggingPlayer, setDraggingPlayer] = useState(null);
  const [draggingBench, setDraggingBench] = useState(null);
  const [draggingOpponent, setDraggingOpponent] = useState(null);

  const [lastPos, setLastPos] = useState({ x: 50, y: 50 });
  const [showOpponent, setShowOpponent] = useState(true);
  const [showBanks, setShowBanks] = useState(true);

  function movePlayer(id, x, y) {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              x: clamp(x, 4, 96),
              y: clamp(y, 6, 94),
            }
          : p
      )
    );
  }

  function moveOpponent(id, x, y) {
    setOpponents((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              x: clamp(x, 4, 96),
              y: clamp(y, 6, 94),
              inField: x > 8 && x < 92,
            }
          : p
      )
    );
  }

  function handleDropBench() {
    if (!draggingBench) return;

    const benchPlayer = bench.find((b) => b.id === draggingBench);
    if (!benchPlayer) {
      setDraggingBench(null);
      return;
    }

    const target = players.find((p) => distance(p, lastPos) < 6);

    if (target) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === target.id
            ? {
                ...benchPlayer,
                x: target.x,
                y: target.y,
              }
            : p
        )
      );

      setBench((prev) => [
        ...prev.filter((b) => b.id !== draggingBench),
        {
          id: target.id,
          shirt: target.shirt,
          name: target.name,
        },
      ]);
    } else {
      setPlayers((prev) => [
        ...prev,
        {
          ...benchPlayer,
          x: clamp(lastPos.x, 4, 96),
          y: clamp(lastPos.y, 6, 94),
        },
      ]);

      setBench((prev) => prev.filter((b) => b.id !== draggingBench));
    }

    setDraggingBench(null);
  }

  function invertSides() {
    setPlayers((prev) => prev.map(rotatePoint180));
    setOpponents((prev) =>
      prev.map((p) => (p.inField ? rotatePoint180(p) : p))
    );
  }

  function resetAll() {
    setPlayers(INITIAL_PLAYERS);
    setBench(INITIAL_BENCH);
    setOpponents(INITIAL_OPPONENTS);
    setDraggingPlayer(null);
    setDraggingBench(null);
    setDraggingOpponent(null);
    setLastPos({ x: 50, y: 50 });
  }

  const playerLabelStyle = {
    marginTop: 6,
    width: 96,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 1.15,
    color: "white",
    fontWeight: 700,
    textShadow: "0 1px 2px rgba(0,0,0,0.75)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #2b0d0d 0%, #140606 40%, #070303 100%)",
        padding: 20,
        color: "white",
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div
          style={{
            borderRadius: 22,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(90deg, #b91c1c 0%, #dc2626 45%, #f59e0b 100%)",
              padding: 4,
            }}
          >
            <div
              style={{
                background: "rgba(0,0,0,0.72)",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.3em",
                    color: "#fcd34d",
                    fontWeight: 800,
                    marginBottom: 4,
                  }}
                >
                  Estúdio tático
                </div>
                <div style={{ fontSize: 28, fontWeight: 900 }}>
                  {channelName}
                </div>
                <div style={{ color: "rgba(255,255,255,0.75)" }}>
                  {subtitle}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={buttonStyle} onClick={invertSides}>
                  Inverter lados
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => setShowOpponent((s) => !s)}
                >
                  {showOpponent ? "Ocultar adversário" : "Mostrar adversário"}
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => setShowBanks((s) => !s)}
                >
                  {showBanks ? "Ocultar bancos" : "Mostrar bancos"}
                </button>
                <button style={buttonStyle} onClick={resetAll}>
                  Resetar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            ...cardStyle,
            padding: 10,
          }}
        >
          <div
            style={{
              borderRadius: 28,
              overflow: "hidden",
              border: "8px solid #14532d",
              background:
                "repeating-linear-gradient(90deg, #3f7f2f 0 70px, #4b8f39 70px 140px)",
              boxShadow: "inset 0 0 40px rgba(0,0,0,0.25)",
              position: "relative",
              aspectRatio: "16 / 9",
              userSelect: "none",
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;

              setLastPos({ x, y });

              if (draggingPlayer) movePlayer(draggingPlayer, x, y);
              if (draggingOpponent) moveOpponent(draggingOpponent, x, y);
            }}
            onMouseUp={() => {
              setDraggingPlayer(null);
              setDraggingOpponent(null);
              handleDropBench();
            }}
            onMouseLeave={() => {
              setDraggingPlayer(null);
              setDraggingOpponent(null);
            }}
          >
            <svg
              viewBox="0 0 1000 562"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <line
                x1="500"
                y1="0"
                x2="500"
                y2="562"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />
              <circle
                cx="500"
                cy="281"
                r="62"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />
              <circle cx="500" cy="281" r="4" fill="rgba(255,255,255,0.95)" />

              <rect
                x="0"
                y="112"
                width="180"
                height="338"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />
              <rect
                x="0"
                y="180"
                width="80"
                height="202"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />
              <rect
                x="820"
                y="112"
                width="180"
                height="338"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />
              <rect
                x="920"
                y="180"
                width="80"
                height="202"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />

              <circle cx="120" cy="281" r="4" fill="rgba(255,255,255,0.95)" />
              <circle cx="880" cy="281" r="4" fill="rgba(255,255,255,0.95)" />

              <path
                d="M 180 241 A 40 40 0 0 1 180 321"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />
              <path
                d="M 820 241 A 40 40 0 0 0 820 321"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />

              <path
                d="M 0 0 Q 18 0 18 18"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />
              <path
                d="M 0 562 Q 18 562 18 544"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />
              <path
                d="M 1000 0 Q 982 0 982 18"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />
              <path
                d="M 1000 562 Q 982 562 982 544"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
              />
            </svg>

            {players.map((p) => (
              <div
                key={p.id}
                onMouseDown={() => setDraggingPlayer(p.id)}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%, -50%)",
                  cursor: "grab",
                  zIndex: 3,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "3px solid rgba(255,255,255,0.85)",
                    background:
                      "radial-gradient(circle at top, #2a2a2a 0%, #111 55%, #050505 100%)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
                  }}
                >
                  {p.shirt}
                </div>
                <div style={playerLabelStyle}>{p.name}</div>
              </div>
            ))}

            {showOpponent &&
              opponents
                .filter((o) => o.inField)
                .map((p) => (
                  <div
                    key={p.id}
                    onMouseDown={() => setDraggingOpponent(p.id)}
                    style={{
                      position: "absolute",
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      transform: "translate(-50%, -50%)",
                      cursor: "grab",
                      zIndex: 3,
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "3px solid #93c5fd",
                        background:
                          "radial-gradient(circle at top, #1f4b7a 0%, #0f2744 55%, #07111e 100%)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
                      }}
                    >
                      {p.shirt}
                    </div>
                    <div style={playerLabelStyle}>{p.name}</div>
                  </div>
                ))}
          </div>

          {showBanks && (
            <div
              style={{
                marginTop: 14,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div style={cardStyle}>
                <h3 style={sectionTitleStyle}>Banco</h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {bench.map((p) => (
                    <div
                      key={p.id}
                      onMouseDown={() => setDraggingBench(p.id)}
                      style={chipStyle}
                    >
                      <strong>{p.shirt ? `${p.shirt} · ` : ""}</strong>
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>

              <div style={cardStyle}>
                <h3 style={sectionTitleStyle}>Adversário</h3>
                {showOpponent ? (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {opponents
                      .filter((o) => !o.inField)
                      .map((p) => (
                        <div
                          key={p.id}
                          onMouseDown={() => {
                            setDraggingOpponent(p.id);
                            moveOpponent(p.id, 88, 50);
                          }}
                          style={chipStyle}
                        >
                          <strong>{p.shirt} · </strong>
                          {p.name}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    Adversário oculto.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}