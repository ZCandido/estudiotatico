import React, { useEffect, useMemo, useState } from "react";
import { branding } from "./config/branding";

const ALL_PLAYERS = [
  { id: 1, shirt: "1", name: "Rossi", image: "/players/rossi.png" },
  { id: 2, shirt: "2", name: "Varela", image: "/players/varela.png" },
  { id: 3, shirt: "3", name: "Léo Ortiz", image: "/players/leo_ortiz.png" },
  { id: 4, shirt: "4", name: "Léo Pereira", image: "/players/leo_pereira.png" },
  { id: 5, shirt: "6", name: "Ayrton Lucas", image: "/players/ayrton_lucas.png" },
  { id: 6, shirt: "21", name: "Jorginho", image: "/players/jorginho.png" },
  { id: 7, shirt: "8", name: "Saúl", image: "/players/saul.png" },
  { id: 8, shirt: "10", name: "Arrascaeta", image: "/players/arrascaeta.png" },
  { id: 9, shirt: "11", name: "Everton", image: "/players/everton.png" },
  { id: 10, shirt: "9", name: "Pedro", image: "/players/pedro.png" },
  { id: 11, shirt: "7", name: "Luiz Araújo", image: "/players/luiz_araujo.png" },

  { id: 100, shirt: "27", name: "Bruno Henrique", image: "/players/bruno_henrique.png" },
  { id: 101, shirt: "18", name: "De La Cruz", image: "/players/de_la_cruz.png" },
  { id: 102, shirt: "26", name: "Alex Sandro", image: "/players/alex_sandro.png" },
  { id: 103, shirt: "13", name: "Danilo", image: "/players/danilo.png" },
  { id: 104, shirt: "20", name: "L. Paquetá", image: "/players/paqueta.png" },
  { id: 105, shirt: "15", name: "Carrascal", image: "/players/carrascal.png" },
  { id: 106, shirt: "19", name: "G. Plata", image: "/players/plata.png" },

  { id: 107, shirt: "42", name: "Andrew", image: "/players/andrew.png" },
  { id: 108, shirt: "49", name: "Dyogo Alves", image: "/players/dyogo_alves.png" },
  { id: 109, shirt: "5", name: "Erick Pulgar", image: "/players/erick_pulgar.png" },
  { id: 110, shirt: "52", name: "Everton Araujo", image: "/players/everton_araujo.png" },
  { id: 111, shirt: "71", name: "Joao Victor", image: "/players/joao_victor.png" },
  { id: 112, shirt: "22", name: "E. Royal", image: "/players/royal.png" },
  { id: 113, shirt: "16", name: "Samu Lino", image: "/players/s_lino.png" },
  { id: 114, shirt: "44", name: "Vitao", image: "/players/vitao.png" },
  { id: 115, shirt: "64", name: "Wallace Yan", image: "/players/wallace_yan.png" },
];

const DEFAULT_STARTER_LAYOUT = [
  { id: 1, x: 14, y: 50 },
  { id: 2, x: 30, y: 82 },
  { id: 3, x: 24, y: 38 },
  { id: 4, x: 24, y: 62 },
  { id: 5, x: 46, y: 20 },
  { id: 6, x: 40, y: 38 },
  { id: 7, x: 40, y: 62 },
  { id: 8, x: 60, y: 50 },
  { id: 9, x: 78, y: 18 },
  { id: 10, x: 82, y: 50 },
  { id: 11, x: 78, y: 82 },
];

const DEFAULT_STARTER_IDS = DEFAULT_STARTER_LAYOUT.map((p) => p.id);
const DEFAULT_BENCH_IDS = [100, 101, 103, 104, 105, 110, 112, 113, 109, 102, 106, 115];
const DEFAULT_RELATED_IDS = [...DEFAULT_STARTER_IDS, ...DEFAULT_BENCH_IDS];

const INITIAL_OPPONENTS = Array.from({ length: 12 }, (_, i) => ({
  id: `opp-${i + 1}`,
  shirt: String(i + 1),
  name: `ADV ${i + 1}`,
  x: 96,
  y: 8 + i * 7.4,
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

function getPlayerById(id) {
  return ALL_PLAYERS.find((p) => p.id === id);
}

function buildStarters(starterIds, positionsMap = {}) {
  return starterIds
    .map((id, index) => {
      const base = getPlayerById(id);
      if (!base) return null;
      const fallback = DEFAULT_STARTER_LAYOUT[index] || { x: 50, y: 50 };
      const pos = positionsMap[id] || fallback;
      return { ...base, x: pos.x, y: pos.y };
    })
    .filter(Boolean);
}

function buildBench(benchIds) {
  return benchIds.map(getPlayerById).filter(Boolean);
}

const buttonStyle = {
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  borderRadius: 12,
  padding: "9px 13px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
};

const smallButtonStyle = {
  ...buttonStyle,
  padding: "6px 9px",
  fontSize: 12,
  borderRadius: 10,
};

const cardStyle = {
  borderRadius: 18,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: 12,
};

function getToolButtonStyle(active) {
  return {
    ...buttonStyle,
    background: active ? "rgba(245,158,11,0.22)" : "rgba(255,255,255,0.08)",
    border: active ? "1px solid rgba(245,158,11,0.65)" : "1px solid rgba(255,255,255,0.14)",
    color: active ? "#fde68a" : "white",
  };
}

export default function EstudioTatico() {
  const channelName = branding.channelName;
  const subtitle = branding.slogan;

  const [players, setPlayers] = useState(() => buildStarters(DEFAULT_STARTER_IDS));
  const [bench, setBench] = useState(() => buildBench(DEFAULT_BENCH_IDS));
  const [opponents, setOpponents] = useState(INITIAL_OPPONENTS);

  const [draggingPlayer, setDraggingPlayer] = useState(null);
  const [draggingBench, setDraggingBench] = useState(null);
  const [draggingOpponent, setDraggingOpponent] = useState(null);

  const [activePlayerId, setActivePlayerId] = useState(null);
  const [lastPos, setLastPos] = useState({ x: 50, y: 50 });

  const [showOpponent, setShowOpponent] = useState(true);
  const [showManager, setShowManager] = useState(false);

  const [drawMode, setDrawMode] = useState(null); // null | "arrow" | "circle"
  const [arrows, setArrows] = useState([]);
  const [circles, setCircles] = useState([]);
  const [draftArrow, setDraftArrow] = useState(null);
  const [draftCircle, setDraftCircle] = useState(null);

  const [relatedIds, setRelatedIds] = useState(DEFAULT_RELATED_IDS);
  const [starterIds, setStarterIds] = useState(DEFAULT_STARTER_IDS);
  const [benchIds, setBenchIds] = useState(DEFAULT_BENCH_IDS);
  const [savedLineups, setSavedLineups] = useState([]);
  const [lineupName, setLineupName] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("estudio-tatico-lineups");
    if (raw) {
      try {
        setSavedLineups(JSON.parse(raw));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("estudio-tatico-lineups", JSON.stringify(savedLineups));
  }, [savedLineups]);

  const activePlayer = players.find((p) => p.id === activePlayerId);

  const availableForStarters = useMemo(
    () => relatedIds.filter((id) => !starterIds.includes(id)),
    [relatedIds, starterIds]
  );

  const availableForBench = useMemo(
    () => relatedIds.filter((id) => !benchIds.includes(id)),
    [relatedIds, benchIds]
  );

  function syncTeamFromManager(nextStarterIds, nextBenchIds) {
    const currentPositions = Object.fromEntries(players.map((p) => [p.id, { x: p.x, y: p.y }]));
    setStarterIds(nextStarterIds);
    setBenchIds(nextBenchIds);
    setPlayers(buildStarters(nextStarterIds, currentPositions));
    setBench(buildBench(nextBenchIds));
    setActivePlayerId(null);
  }

  function toggleRelated(id) {
    const isRelated = relatedIds.includes(id);

    if (isRelated) {
      const nextRelated = relatedIds.filter((x) => x !== id);
      const nextStarters = starterIds.filter((x) => x !== id);
      const nextBench = benchIds.filter((x) => x !== id);
      setRelatedIds(nextRelated);
      syncTeamFromManager(nextStarters, nextBench);
      return;
    }

    if (relatedIds.length >= 23) return;
    setRelatedIds((prev) => [...prev, id]);
  }

  function addStarter(id) {
    if (!relatedIds.includes(id) || starterIds.includes(id) || starterIds.length >= 11) return;
    const nextStarters = [...starterIds, id];
    const nextBench = benchIds.filter((x) => x !== id);
    syncTeamFromManager(nextStarters, nextBench);
  }

  function removeStarter(id) {
    syncTeamFromManager(starterIds.filter((x) => x !== id), benchIds);
  }

  function addBench(id) {
    if (!relatedIds.includes(id) || benchIds.includes(id) || benchIds.length >= 12) return;
    const nextBench = [...benchIds, id];
    const nextStarters = starterIds.filter((x) => x !== id);
    syncTeamFromManager(nextStarters, nextBench);
  }

  function removeBench(id) {
    syncTeamFromManager(starterIds, benchIds.filter((x) => x !== id));
  }

  function autoCompleteBench() {
    const pool = relatedIds.filter((id) => !starterIds.includes(id));
    syncTeamFromManager(starterIds, pool.slice(0, 12));
  }

  function applyManagerSelection() {
    syncTeamFromManager(starterIds, benchIds);
    setShowManager(false);
  }

  function saveCurrentLineup() {
    const name = lineupName.trim() || `Formação ${savedLineups.length + 1}`;
    const positions = Object.fromEntries(players.map((p) => [p.id, { x: p.x, y: p.y }]));

    const payload = {
      id: `lineup-${Date.now()}`,
      name,
      relatedIds,
      starterIds,
      benchIds,
      positions,
      arrows,
      circles,
      createdAt: new Date().toISOString(),
    };

    setSavedLineups((prev) => [payload, ...prev]);
    setLineupName("");
  }

  function loadLineup(lineup) {
    setRelatedIds(lineup.relatedIds || []);
    setStarterIds(lineup.starterIds || []);
    setBenchIds(lineup.benchIds || []);
    setPlayers(buildStarters(lineup.starterIds || [], lineup.positions || {}));
    setBench(buildBench(lineup.benchIds || []));
    setArrows(lineup.arrows || []);
    setCircles(lineup.circles || []);
    setDraftArrow(null);
    setDraftCircle(null);
    setDrawMode(null);
    setShowManager(false);
  }

  function deleteLineup(id) {
    setSavedLineups((prev) => prev.filter((x) => x.id !== id));
  }

  function movePlayer(id, x, y) {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, x: clamp(x, 4, 96), y: clamp(y, 6, 94) }
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
          p.id === target.id ? { ...benchPlayer, x: target.x, y: target.y } : p
        )
      );

      setBench((prev) => [
        ...prev.filter((b) => b.id !== draggingBench),
        {
          id: target.id,
          shirt: target.shirt,
          name: target.name,
          image: target.image,
        },
      ]);

      setStarterIds((prev) => prev.map((id) => (id === target.id ? benchPlayer.id : id)));
      setBenchIds((prev) =>
        [...prev.filter((id) => id !== benchPlayer.id), target.id].slice(0, 12)
      );
      setActivePlayerId(benchPlayer.id);
    } else {
      setPlayers((prev) => [
        ...prev,
        {
          ...benchPlayer,
          x: clamp(lastPos.x, 4, 96),
          y: clamp(lastPos.y, 6, 94),
        },
      ].slice(0, 11));

      setBench((prev) => prev.filter((b) => b.id !== draggingBench));
      setStarterIds((prev) => [...prev, benchPlayer.id].slice(0, 11));
      setBenchIds((prev) => prev.filter((id) => id !== benchPlayer.id));
      setActivePlayerId(benchPlayer.id);
    }

    setDraggingBench(null);
  }

  function invertSides() {
    setPlayers((prev) => prev.map(rotatePoint180));
    setOpponents((prev) => prev.map((p) => (p.inField ? rotatePoint180(p) : p)));
    setArrows((prev) =>
      prev.map((a) => ({
        ...a,
        x1: 100 - a.x1,
        y1: 100 - a.y1,
        x2: 100 - a.x2,
        y2: 100 - a.y2,
      }))
    );
    setCircles((prev) =>
      prev.map((c) => ({
        ...c,
        x: 100 - c.x,
        y: 100 - c.y,
      }))
    );
  }

  function resetAll() {
    setPlayers(buildStarters(DEFAULT_STARTER_IDS));
    setBench(buildBench(DEFAULT_BENCH_IDS));
    setOpponents(INITIAL_OPPONENTS);
    setDraggingPlayer(null);
    setDraggingBench(null);
    setDraggingOpponent(null);
    setActivePlayerId(null);
    setLastPos({ x: 50, y: 50 });
    setArrows([]);
    setCircles([]);
    setDraftArrow(null);
    setDraftCircle(null);
    setDrawMode(null);
    setRelatedIds(DEFAULT_RELATED_IDS);
    setStarterIds(DEFAULT_STARTER_IDS);
    setBenchIds(DEFAULT_BENCH_IDS);
  }

  function clearDrawings() {
    setArrows([]);
    setCircles([]);
    setDraftArrow(null);
    setDraftCircle(null);
  }

  function getFieldPoint(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100),
    };
  }

  function handleFieldMouseDown(e) {
    if (e.target !== e.currentTarget) return;

    const point = getFieldPoint(e);
    setActivePlayerId(null);

    if (drawMode === "arrow") {
      setDraftArrow({ start: point, end: point });
      return;
    }

    if (drawMode === "circle" && e.shiftKey) {
      setDraftCircle({ x: point.x, y: point.y, r: 0 });
    }
  }

  function handleFieldMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setLastPos({ x, y });

    if (draggingPlayer) movePlayer(draggingPlayer, x, y);
    if (draggingOpponent) moveOpponent(draggingOpponent, x, y);

    if (draftArrow) {
      setDraftArrow((prev) => (prev ? { ...prev, end: { x, y } } : prev));
    }

    if (draftCircle) {
      const dx = x - draftCircle.x;
      const dy = y - draftCircle.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      setDraftCircle((prev) => (prev ? { ...prev, r } : prev));
    }
  }

  function handleFieldMouseUp() {
    if (draftArrow) {
      const dx = draftArrow.end.x - draftArrow.start.x;
      const dy = draftArrow.end.y - draftArrow.start.y;
      if (Math.sqrt(dx * dx + dy * dy) > 1.5) {
        setArrows((prev) => [
          ...prev,
          {
            id: `arrow-${Date.now()}-${Math.random()}`,
            x1: draftArrow.start.x,
            y1: draftArrow.start.y,
            x2: draftArrow.end.x,
            y2: draftArrow.end.y,
          },
        ]);
      }
      setDraftArrow(null);
    }

    if (draftCircle) {
      if (draftCircle.r > 1.5) {
        setCircles((prev) => [
          ...prev,
          {
            id: `circle-${Date.now()}-${Math.random()}`,
            x: draftCircle.x,
            y: draftCircle.y,
            r: draftCircle.r,
          },
        ]);
      }
      setDraftCircle(null);
    }

    setDraggingPlayer(null);
    setDraggingOpponent(null);
    handleDropBench();
  }

  function handleFieldMouseLeave() {
    setDraggingPlayer(null);
    setDraggingOpponent(null);
    setDraftArrow(null);
    setDraftCircle(null);
  }

  function SideMarker({ player, onMouseDown, side = "left", isOpponent = false }) {
    return (
      <div
        onMouseDown={onMouseDown}
        style={{
          display: "flex",
          flexDirection: side === "left" ? "row" : "row-reverse",
          alignItems: "center",
          gap: 6,
          cursor: "grab",
          userSelect: "none",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: isOpponent ? "2px solid #dbeafe" : "2px solid rgba(255,255,255,0.88)",
            background: isOpponent
              ? "radial-gradient(circle at top, #1f4b7a 0%, #0f2744 55%, #07111e 100%)"
              : "radial-gradient(circle at top, #2a2a2a 0%, #111 55%, #050505 100%)",
            boxShadow: "0 3px 10px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 800,
            color: "white",
            flexShrink: 0,
          }}
        >
          {player.shirt}
        </div>

        <div
          style={{
            fontSize: 11,
            lineHeight: 1.05,
            textAlign: side === "left" ? "left" : "right",
            color: "white",
            minWidth: 0,
            textShadow: "0 1px 2px rgba(0,0,0,0.75)",
          }}
        >
          <div style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
            {player.name}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #2b0d0d 0%, #140606 40%, #070303 100%)",
        padding: 12,
        color: "white",
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ maxWidth: 1600, margin: "0 auto" }}>
        <div
          style={{
            borderRadius: 22,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            marginBottom: 10,
            background:
              "linear-gradient(90deg, #3b0505 0%, #5b0a0a 28%, #3b0505 55%, #4b2a06 100%)",
          }}
        >
          <div
            style={{
              padding: "8px 12px",
              display: "grid",
              gridTemplateColumns: "1fr 1.6fr 1fr",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
              {branding.shield && (
                <img
                  src={branding.shield}
                  alt={`${channelName} escudo`}
                  style={{ width: "100%", maxWidth: 360, height: 86, objectFit: "contain" }}
                />
              )}
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                  color: "#fcd34d",
                  fontWeight: 900,
                  marginBottom: 2,
                }}
              >
                Estúdio tático
              </div>

              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.05 }}>
                {channelName}
              </div>

              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 2 }}>
                {subtitle}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              {branding.sponsor && (
                <img
                  src={branding.sponsor}
                  alt="Patrocinador"
                  style={{ width: "100%", maxWidth: 340, height: 86, objectFit: "contain" }}
                />
              )}
            </div>
          </div>

          <div
            style={{
              padding: "0 12px 10px 12px",
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <button style={getToolButtonStyle(drawMode === null)} onClick={() => setDrawMode(null)}>
              Jogador
            </button>
            <button style={getToolButtonStyle(drawMode === "arrow")} onClick={() => setDrawMode("arrow")}>
              Seta
            </button>
            <button style={getToolButtonStyle(drawMode === "circle")} onClick={() => setDrawMode("circle")}>
              Círculo
            </button>
            <button style={buttonStyle} onClick={clearDrawings}>
              Limpar desenhos
            </button>
            <button style={buttonStyle} onClick={invertSides}>
              Inverter lados
            </button>
            <button style={buttonStyle} onClick={() => setShowOpponent((s) => !s)}>
              {showOpponent ? "Ocultar adversário" : "Mostrar adversário"}
            </button>
            <button style={buttonStyle} onClick={() => setShowManager(true)}>
              Gerenciar time
            </button>
            <button style={buttonStyle} onClick={resetAll}>
              Resetar
            </button>
          </div>
        </div>

        <div style={{ ...cardStyle, padding: 10 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "92px minmax(0, 1fr) 92px",
              gap: 6,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateRows: "repeat(12, minmax(40px, 1fr))",
                gap: 6,
                padding: "6px 2px 6px 0",
              }}
            >
              {bench.slice(0, 12).map((p) => (
                <SideMarker
                  key={p.id}
                  player={p}
                  side="left"
                  onMouseDown={() => setDraggingBench(p.id)}
                />
              ))}
            </div>

            <div>
              <div
                style={{
                  borderRadius: 28,
                  overflow: "visible",
                  border: "8px solid #14532d",
                  background:
                    "repeating-linear-gradient(90deg, #3f7f2f 0 70px, #4b8f39 70px 140px)",
                  boxShadow: "inset 0 0 40px rgba(0,0,0,0.25)",
                  position: "relative",
                  aspectRatio: "16 / 9",
                  userSelect: "none",
                }}
                onMouseDown={handleFieldMouseDown}
                onMouseMove={handleFieldMouseMove}
                onMouseUp={handleFieldMouseUp}
                onMouseLeave={handleFieldMouseLeave}
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
                  <line x1="500" y1="0" x2="500" y2="562" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />
                  <circle cx="500" cy="281" r="62" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />
                  <circle cx="500" cy="281" r="4" fill="rgba(255,255,255,0.95)" />

                  <rect x="0" y="112" width="180" height="338" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />
                  <rect x="0" y="180" width="80" height="202" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />
                  <rect x="820" y="112" width="180" height="338" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />
                  <rect x="920" y="180" width="80" height="202" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />

                  <circle cx="120" cy="281" r="4" fill="rgba(255,255,255,0.95)" />
                  <circle cx="880" cy="281" r="4" fill="rgba(255,255,255,0.95)" />

                  <path d="M 180 241 A 40 40 0 0 1 180 321" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />
                  <path d="M 820 241 A 40 40 0 0 0 820 321" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />

                  <path d="M 0 0 Q 18 0 18 18" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />
                  <path d="M 0 562 Q 18 562 18 544" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />
                  <path d="M 1000 0 Q 982 0 982 18" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />
                  <path d="M 1000 562 Q 982 562 982 544" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />
                </svg>

                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                >
                  <defs>
                    <marker
                      id="tactical-arrowhead"
                      markerWidth="3"
                      markerHeight="3"
                      refX="2.4"
                      refY="1.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 3 1.5, 0 3" fill="white" />
                    </marker>
                  </defs>

                  {arrows.map((arrow) => (
                    <line
                      key={arrow.id}
                      x1={arrow.x1}
                      y1={arrow.y1}
                      x2={arrow.x2}
                      y2={arrow.y2}
                      stroke="white"
                      strokeWidth="0.85"
                      strokeLinecap="round"
                      markerEnd="url(#tactical-arrowhead)"
                    />
                  ))}

                  {circles.map((circle) => (
                    <circle
                      key={circle.id}
                      cx={circle.x}
                      cy={circle.y}
                      r={circle.r}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="0.95"
                    />
                  ))}

                  {draftArrow && (
                    <line
                      x1={draftArrow.start.x}
                      y1={draftArrow.start.y}
                      x2={draftArrow.end.x}
                      y2={draftArrow.end.y}
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="0.8"
                      strokeDasharray="1.5 1.5"
                      markerEnd="url(#tactical-arrowhead)"
                    />
                  )}

                  {draftCircle && (
                    <circle
                      cx={draftCircle.x}
                      cy={draftCircle.y}
                      r={draftCircle.r}
                      fill="none"
                      stroke="rgba(239,68,68,0.7)"
                      strokeWidth="0.9"
                      strokeDasharray="1.5 1.5"
                    />
                  )}
                </svg>

                {players.map((p) => (
                  <div
                    key={p.id}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggingPlayer(p.id);
                      setActivePlayerId(p.id);
                    }}
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
                    <div
                      style={{
                        marginTop: 6,
                        width: 96,
                        textAlign: "center",
                        fontSize: 12,
                        lineHeight: 1.15,
                        color: "white",
                        fontWeight: 700,
                        textShadow: "0 1px 2px rgba(0,0,0,0.75)",
                      }}
                    >
                      {p.name}
                    </div>
                  </div>
                ))}

                {activePlayer && (
                  <div
                    style={{
                      position: "absolute",
                      right: "-4px",
                      top: "50%",
                      transform: "translate(100%, -50%)",
                      width: 122,
                      padding: 8,
                      borderRadius: 14,
                      background: "rgba(0,0,0,0.45)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                      zIndex: 4,
                      textAlign: "center",
                    }}
                  >
                    {branding.shield && (
                      <img
                        src={branding.shield}
                        alt={channelName}
                        style={{
                          width: 22,
                          height: 22,
                          objectFit: "contain",
                          display: "block",
                          margin: "0 auto 6px auto",
                        }}
                      />
                    )}
                    <img
                      src={activePlayer.image}
                      alt={activePlayer.name}
                      style={{
                        width: 72,
                        height: 118,
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto 6px auto",
                      }}
                    />
                    <div style={{ fontWeight: 800, fontSize: 12 }}>
                      {activePlayer.shirt} · {activePlayer.name}
                    </div>
                  </div>
                )}

                {showOpponent &&
                  opponents
                    .filter((o) => o.inField)
                    .map((p) => (
                      <div
                        key={p.id}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setDraggingOpponent(p.id);
                        }}
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
                        <div
                          style={{
                            marginTop: 6,
                            width: 96,
                            textAlign: "center",
                            fontSize: 12,
                            lineHeight: 1.15,
                            color: "white",
                            fontWeight: 700,
                            textShadow: "0 1px 2px rgba(0,0,0,0.75)",
                          }}
                        >
                          {p.name}
                        </div>
                      </div>
                    ))}
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.72)",
                  display: "flex",
                  gap: 18,
                  flexWrap: "wrap",
                }}
              >
                <span>Seta: selecione "Seta" e arraste no campo vazio.</span>
                <span>Círculo: selecione "Círculo" e use Shift + arraste.</span>
                <span>Jogadores continuam arrastáveis a qualquer momento.</span>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateRows: "repeat(12, minmax(40px, 1fr))",
                gap: 6,
                padding: "6px 0 6px 2px",
              }}
            >
              {showOpponent &&
                opponents.slice(0, 12).map((p) => (
                  <SideMarker
                    key={p.id}
                    player={p}
                    side="right"
                    isOpponent
                    onMouseDown={() => {
                      setDraggingOpponent(p.id);
                      moveOpponent(p.id, 88, 50);
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {showManager && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.62)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 100,
          }}
          onClick={() => setShowManager(false)}
        >
          <div
            style={{
              width: "min(1300px, 100%)",
              maxHeight: "90vh",
              overflow: "auto",
              background: "#120606",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24,
              padding: 18,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>Gerenciar time</div>
                <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 13 }}>
                  Relacionados: {relatedIds.length}/23 · Titulares: {starterIds.length}/11 · Reservas: {benchIds.length}/12
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input
                  value={lineupName}
                  onChange={(e) => setLineupName(e.target.value)}
                  placeholder="Nome da formação"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    padding: "10px 12px",
                    minWidth: 220,
                  }}
                />
                <button style={buttonStyle} onClick={saveCurrentLineup}>
                  Salvar formação
                </button>
                <button style={buttonStyle} onClick={autoCompleteBench}>
                  Completar banco
                </button>
                <button style={buttonStyle} onClick={applyManagerSelection}>
                  Aplicar
                </button>
                <button style={buttonStyle} onClick={() => setShowManager(false)}>
                  Fechar
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 1fr",
                gap: 14,
                alignItems: "start",
              }}
            >
              <div style={cardStyle}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: 15, fontWeight: 800 }}>
                  Elenco completo
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {ALL_PLAYERS.map((p) => {
                    const related = relatedIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleRelated(p.id)}
                        style={{
                          textAlign: "left",
                          borderRadius: 12,
                          padding: "8px 10px",
                          border: related
                            ? "1px solid rgba(34,197,94,0.55)"
                            : "1px solid rgba(255,255,255,0.12)",
                          background: related
                            ? "rgba(34,197,94,0.14)"
                            : "rgba(255,255,255,0.05)",
                          color: "white",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        <strong>{p.shirt}</strong> · {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={cardStyle}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: 15, fontWeight: 800 }}>
                  Titulares
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {starterIds.map((id) => {
                    const p = getPlayerById(id);
                    if (!p) return null;
                    return (
                      <div
                        key={id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          padding: "8px 10px",
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.06)",
                        }}
                      >
                        <span>
                          <strong>{p.shirt}</strong> · {p.name}
                        </span>
                        <button style={smallButtonStyle} onClick={() => removeStarter(id)}>
                          Remover
                        </button>
                      </div>
                    );
                  })}

                  <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                    Adicionar dos relacionados:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {availableForStarters.map((id) => {
                      const p = getPlayerById(id);
                      return (
                        <button key={id} style={smallButtonStyle} onClick={() => addStarter(id)}>
                          {p?.shirt} · {p?.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={cardStyle}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: 15, fontWeight: 800 }}>
                  Reservas
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {benchIds.map((id) => {
                    const p = getPlayerById(id);
                    if (!p) return null;
                    return (
                      <div
                        key={id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          padding: "8px 10px",
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.06)",
                        }}
                      >
                        <span>
                          <strong>{p.shirt}</strong> · {p.name}
                        </span>
                        <button style={smallButtonStyle} onClick={() => removeBench(id)}>
                          Remover
                        </button>
                      </div>
                    );
                  })}

                  <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                    Adicionar dos relacionados:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {availableForBench.map((id) => {
                      const p = getPlayerById(id);
                      return (
                        <button key={id} style={smallButtonStyle} onClick={() => addBench(id)}>
                          {p?.shirt} · {p?.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...cardStyle, marginTop: 14 }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: 15, fontWeight: 800 }}>
                Formações salvas
              </h3>
              {savedLineups.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
                  Nenhuma formação salva ainda.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {savedLineups.map((lineup) => (
                    <div
                      key={lineup.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.06)",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800 }}>{lineup.name}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.68)" }}>
                          Titulares: {lineup.starterIds?.length || 0} · Reservas: {lineup.benchIds?.length || 0}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={smallButtonStyle} onClick={() => loadLineup(lineup)}>
                          Carregar
                        </button>
                        <button style={smallButtonStyle} onClick={() => deleteLineup(lineup.id)}>
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}