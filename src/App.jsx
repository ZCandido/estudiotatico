import { useMemo, useState } from "react";

const INITIAL_HOME = [
  { id: 1, shirt: "1", name: "Rossi", x: 8, y: 50 },
  { id: 2, shirt: "2", name: "Varela", x: 22, y: 82 },
  { id: 3, shirt: "3", name: "Léo Ortiz", x: 22, y: 38 },
  { id: 4, shirt: "4", name: "Léo Pereira", x: 22, y: 62 },
  { id: 5, shirt: "6", name: "Ayrton", x: 22, y: 18 },
  { id: 6, shirt: "21", name: "Jorginho", x: 42, y: 38 },
  { id: 7, shirt: "10", name: "Arrascaeta", x: 60, y: 50 },
  { id: 8, shirt: "11", name: "Everton", x: 72, y: 18 },
  { id: 9, shirt: "9", name: "Pedro", x: 80, y: 50 },
  { id: 10, shirt: "7", name: "Luiz Araújo", x: 72, y: 82 },
  { id: 11, shirt: "8", name: "Saúl", x: 42, y: 62 },
];

const INITIAL_AWAY = Array.from({ length: 11 }, (_, i) => ({
  id: `a-${i + 1}`,
  shirt: String(i + 1),
  name: `ADV ${i + 1}`,
  x: 88,
  y: 8 + i * 8.2,
}));

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rotate180(list) {
  return list.map((p) => ({
    ...p,
    x: 100 - p.x,
    y: 100 - p.y,
  }));
}

export default function App() {
  const [home, setHome] = useState(INITIAL_HOME);
  const [away, setAway] = useState(INITIAL_AWAY);
  const [dragging, setDragging] = useState(null);
  const [draggingTeam, setDraggingTeam] = useState(null);
  const [showNumbers, setShowNumbers] = useState(true);
  const [arrows, setArrows] = useState([]);
  const [circles, setCircles] = useState([]);
  const [drawingArrow, setDrawingArrow] = useState(null);

  const title = useMemo(() => "Quadro Tático", []);

  function updatePlayer(team, id, x, y) {
    const nextX = clamp(x, 4, 96);
    const nextY = clamp(y, 6, 94);

    if (team === "home") {
      setHome((prev) =>
        prev.map((p) => (p.id === id ? { ...p, x: nextX, y: nextY } : p))
      );
    } else {
      setAway((prev) =>
        prev.map((p) => (p.id === id ? { ...p, x: nextX, y: nextY } : p))
      );
    }
  }

  function handleInvertSides() {
    setHome((prev) => rotate180(prev));
    setAway((prev) => rotate180(prev));
  }

  function handleReset() {
    setHome(INITIAL_HOME);
    setAway(INITIAL_AWAY);
    setArrows([]);
    setCircles([]);
    setDrawingArrow(null);
  }

  function getRelativePoint(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }

  function handleMouseDownField(e) {
    if (dragging) return;

    const point = getRelativePoint(e);

    if (e.shiftKey) {
      setCircles((prev) => [...prev, point]);
      return;
    }

    setDrawingArrow({
      x1: point.x,
      y1: point.y,
      x2: point.x,
      y2: point.y,
    });
  }

  function handleMouseMoveField(e) {
    const point = getRelativePoint(e);

    if (dragging && draggingTeam) {
      updatePlayer(draggingTeam, dragging, point.x, point.y);
      return;
    }

    if (drawingArrow) {
      setDrawingArrow((prev) =>
        prev
          ? {
              ...prev,
              x2: point.x,
              y2: point.y,
            }
          : prev
      );
    }
  }

  function handleMouseUpField() {
    if (dragging) {
      setDragging(null);
      setDraggingTeam(null);
      return;
    }

    if (drawingArrow) {
      setArrows((prev) => [...prev, drawingArrow]);
      setDrawingArrow(null);
    }
  }

  function handleMouseLeaveField() {
    setDragging(null);
    setDraggingTeam(null);

    if (drawingArrow) {
      setArrows((prev) => [...prev, drawingArrow]);
      setDrawingArrow(null);
    }
  }

  const playerLabelStyle = {
    marginTop: 4,
    width: 72,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 1.1,
    color: "white",
    fontWeight: 600,
    textShadow: "0 1px 2px rgba(0,0,0,0.7)",
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
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            marginBottom: 20,
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
                background: "rgba(0,0,0,0.7)",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
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
                <div style={{ fontSize: 28, fontWeight: 900 }}>{title}</div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={buttonStyle} onClick={handleReset}>
                  Resetar
                </button>
                <button style={buttonStyle} onClick={handleInvertSides}>
                  Inverter lados
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => setShowNumbers((s) => !s)}
                >
                  {showNumbers ? "Ocultar números" : "Mostrar números"}
                </button>
                <button style={buttonStyle} onClick={() => setArrows([])}>
                  Limpar setas
                </button>
                <button style={buttonStyle} onClick={() => setCircles([])}>
                  Limpar círculos
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderRadius: 28,
            overflow: "hidden",
            border: "8px solid #14532d",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.25)",
            background:
              "repeating-linear-gradient(90deg, #3f7f2f 0 70px, #4b8f39 70px 140px)",
            position: "relative",
            aspectRatio: "16 / 9",
            userSelect: "none",
          }}
          onMouseDown={handleMouseDownField}
          onMouseMove={handleMouseMoveField}
          onMouseUp={handleMouseUpField}
          onMouseLeave={handleMouseLeaveField}
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
  d="M 180 241 A 40 40 0 0 1 180   321"
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

          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {circles.map((c, i) => (
              <circle
                key={`c-${i}`}
                cx={`${c.x}%`}
                cy={`${c.y}%`}
                r="12"
                fill="none"
                stroke="red"
                strokeWidth="3"
              />
            ))}

            {arrows.map((a, i) => (
              <line
                key={`a-${i}`}
                x1={`${a.x1}%`}
                y1={`${a.y1}%`}
                x2={`${a.x2}%`}
                y2={`${a.y2}%`}
                stroke="yellow"
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
              />
            ))}

            {drawingArrow && (
              <line
                x1={`${drawingArrow.x1}%`}
                y1={`${drawingArrow.y1}%`}
                x2={`${drawingArrow.x2}%`}
                y2={`${drawingArrow.y2}%`}
                stroke="yellow"
                strokeWidth="3"
              />
            )}

            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="yellow" />
              </marker>
            </defs>
          </svg>

          {home.map((p) => (
            <div
              key={p.id}
              onMouseDown={(e) => {
                e.stopPropagation();
                setDragging(p.id);
                setDraggingTeam("home");
              }}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -50%)",
                cursor: "grab",
                zIndex: 3,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "3px solid rgba(255,255,255,0.85)",
                  background:
                    "radial-gradient(circle at top, #2a2a2a 0%, #111 55%, #050505 100%)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
                }}
              >
                {showNumbers ? p.shirt : ""}
              </div>
              <div style={playerLabelStyle}>{p.name}</div>
            </div>
          ))}

          {away.map((p) => (
            <div
              key={p.id}
              onMouseDown={(e) => {
                e.stopPropagation();
                setDragging(p.id);
                setDraggingTeam("away");
              }}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -50%)",
                cursor: "grab",
                zIndex: 3,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "3px solid #93c5fd",
                  background:
                    "radial-gradient(circle at top, #1f4b7a 0%, #0f2744 55%, #07111e 100%)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
                }}
              >
                {showNumbers ? p.shirt : ""}
              </div>
              <div style={playerLabelStyle}>{p.name}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
          Dica: arraste jogadores normalmente. Segure <strong>Shift</strong> e clique no campo para criar círculos. Clique e arraste no campo para desenhar setas.
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  borderRadius: 14,
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 600,
};