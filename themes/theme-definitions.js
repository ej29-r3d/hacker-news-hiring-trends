// ============================================================
// THEME DEFINITIONS — 20 curated themes (5 palettes × 5 fonts)
// ============================================================

const ThemeDefinitions = (() => {

  // ── Palettes ──────────────────────────────────────────────
  const palettes = {
    P1: {
      id: "P1", name: "WSJ Editorial",
      primary: "#014d64", primaryEnd: "#6794a7",
      accent: "#E3120B",
      categorical: ["#014d64","#01a2d9","#7abcff","#76c0c1","#6794a7","#b8d4e3"],
      text: "#1a1a1a", textMuted: "#666", textLight: "#999",
      barText: "#fff", background: "#fff", border: "#e5e5e5",
      tooltipBorder: "#d0d0d0",
      dark: false,
    },
    P2: {
      id: "P2", name: "Modern Tech",
      primary: "#1696D2", primaryEnd: "#a2d4ec",
      accent: "#EC008B",
      categorical: ["#1696D2","#FDBF11","#EC008B","#55B748","#5C5859","#0A4C6A"],
      text: "#1a1a1a", textMuted: "#666", textLight: "#999",
      barText: "#fff", background: "#fff", border: "#e5e5e5",
      tooltipBorder: "#d0d0d0",
      dark: false,
    },
    P3: {
      id: "P3", name: "Bold & Engaging",
      primary: "#0D7680", primaryEnd: "#8ed4d9",
      accent: "#DB444B",
      categorical: ["#0D7680","#DB444B","#3C76AF","#D6A019","#8B5E83","#59A89C"],
      text: "#1a1a1a", textMuted: "#555", textLight: "#999",
      barText: "#fff", background: "#fff", border: "#e5e5e5",
      tooltipBorder: "#d0d0d0",
      dark: false,
    },
    P4: {
      id: "P4", name: "Warm & Human",
      primary: "#5D8CA8", primaryEnd: "#bdd3e0",
      accent: "#CA5800",
      categorical: ["#5D8CA8","#CA5800","#8DB580","#D4A873","#7A6E87","#C4956A"],
      text: "#2a2a2a", textMuted: "#777", textLight: "#aaa",
      barText: "#fff", background: "#fff", border: "#e5e5e5",
      tooltipBorder: "#d0d0d0",
      dark: false,
    },
    P5: {
      id: "P5", name: "Dark Executive",
      primary: "#3B82F6", primaryEnd: "#93c5fd",
      accent: "#F59E0B",
      categorical: ["#3B82F6","#F59E0B","#10B981","#EF4444","#8B5CF6","#EC4899"],
      text: "#F1F5F9", textMuted: "#94A3B8", textLight: "#64748B",
      barText: "#0F172A", background: "#0F172A", border: "#1E293B",
      tooltipBorder: "#334155",
      dark: true,
    },
  };

  // ── Font Pairings ─────────────────────────────────────────
  const fonts = {
    F1: {
      id: "F1", name: "All Inter",
      headline: "'Inter', -apple-system, sans-serif",
      body: "'Inter', -apple-system, sans-serif",
      headlineLabel: "Inter 700", bodyLabel: "Inter 400/600",
      import: "Inter:wght@400;500;600;700",
    },
    F2: {
      id: "F2", name: "DM Serif + Inter",
      headline: "'DM Serif Display', serif",
      body: "'Inter', -apple-system, sans-serif",
      headlineLabel: "DM Serif Display", bodyLabel: "Inter 400/600",
      import: "DM+Serif+Display&family=Inter:wght@400;500;600;700",
    },
    F3: {
      id: "F3", name: "Source Serif + Source Sans",
      headline: "'Source Serif 4', serif",
      body: "'Source Sans 3', sans-serif",
      headlineLabel: "Source Serif 4 700", bodyLabel: "Source Sans 3 400/600",
      import: "Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Source+Sans+3:wght@400;500;600;700",
    },
    F4: {
      id: "F4", name: "IBM Plex",
      headline: "'IBM Plex Serif', serif",
      body: "'IBM Plex Sans', sans-serif",
      headlineLabel: "IBM Plex Serif 700", bodyLabel: "IBM Plex Sans 400/600",
      import: "IBM+Plex+Serif:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600;700",
    },
    F5: {
      id: "F5", name: "Playfair + Lato",
      headline: "'Playfair Display', serif",
      body: "'Lato', sans-serif",
      headlineLabel: "Playfair Display 700", bodyLabel: "Lato 400/700",
      import: "Playfair+Display:wght@400;600;700&family=Lato:wght@400;700;900",
    },
  };

  // ── 20 Curated Themes ─────────────────────────────────────
  const themes = [
    { id: "T01", name: "Clean Authority",      palette: "P1", font: "F1" },
    { id: "T02", name: "Classic Editorial",     palette: "P1", font: "F2" },
    { id: "T03", name: "Heritage",              palette: "P1", font: "F5" },
    { id: "T04", name: "SaaS Standard",         palette: "P2", font: "F1" },
    { id: "T05", name: "Data Engineering",      palette: "P2", font: "F4" },
    { id: "T06", name: "Open Source",           palette: "P2", font: "F3" },
    { id: "T07", name: "Presentation Ready",    palette: "P3", font: "F1" },
    { id: "T08", name: "Keynote Editorial",     palette: "P3", font: "F2" },
    { id: "T09", name: "Conference Stage",      palette: "P3", font: "F5" },
    { id: "T10", name: "Research Paper",        palette: "P3", font: "F3" },
    { id: "T11", name: "Friendly Dashboard",    palette: "P4", font: "F1" },
    { id: "T12", name: "Narrative Report",      palette: "P4", font: "F2" },
    { id: "T13", name: "Brand Story",           palette: "P4", font: "F5" },
    { id: "T14", name: "Annual Report",         palette: "P4", font: "F3" },
    { id: "T15", name: "Midnight Modern",       palette: "P5", font: "F1" },
    { id: "T16", name: "Command Center",        palette: "P5", font: "F4" },
    { id: "T17", name: "Dark Editorial",        palette: "P5", font: "F2" },
    { id: "T18", name: "Executive Noir",        palette: "P5", font: "F5" },
    { id: "T19", name: "Analyst Terminal",       palette: "P5", font: "F3" },
    { id: "T20", name: "Technical Journal",     palette: "P1", font: "F4" },
  ];

  // ── Resolve a theme into a full config ────────────────────
  function resolve(themeEntry) {
    const p = palettes[themeEntry.palette];
    const f = fonts[themeEntry.font];
    return {
      id: themeEntry.id,
      name: themeEntry.name,
      palette: p,
      font: f,
      // Convenience shortcuts matching funnel-chart.html theme shape
      colors: {
        primary: p.primary,
        primaryEnd: p.primaryEnd,
        accent: p.accent,
        text: p.text,
        textMuted: p.textMuted,
        textLight: p.textLight,
        barText: p.barText,
        background: p.background,
        border: p.border,
        tooltipBorder: p.tooltipBorder,
      },
      fontFamily: f.body,
      headlineFont: f.headline,
      dark: p.dark,
    };
  }

  function resolveAll() {
    return themes.map(resolve);
  }

  function getById(id) {
    const entry = themes.find(t => t.id === id);
    return entry ? resolve(entry) : null;
  }

  // ── Google Fonts URL for all font families ────────────────
  function allFontsUrl() {
    const families = Object.values(fonts).map(f => f.import);
    const unique = [...new Set(families)];
    return "https://fonts.googleapis.com/css2?" + unique.map(f => "family=" + f).join("&") + "&display=swap";
  }

  return { palettes, fonts, themes, resolve, resolveAll, getById, allFontsUrl };
})();

if (typeof module !== "undefined") module.exports = ThemeDefinitions;
