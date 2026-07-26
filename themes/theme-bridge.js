// ============================================================
// THEME BRIDGE — resolves theme from URL/default, injects fonts,
// converts ThemeDefinitions output to chart-ready shape
// ============================================================

const ThemeBridge = (() => {

  const DEFAULT_THEME_ID = "T07";

  /**
   * Resolve current theme from multiple sources:
   *   1. overrideId argument
   *   2. ?theme=T04 URL param
   *   3. data-theme attribute on <body>
   *   4. DEFAULT_THEME_ID ("T07")
   *
   * @param {string} [overrideId] - Force a specific theme ID
   * @returns {object} Resolved theme from ThemeDefinitions
   */
  function resolveCurrentTheme(overrideId) {
    let themeId = overrideId || null;

    if (!themeId) {
      const params = new URLSearchParams(window.location.search);
      themeId = params.get("theme");
    }

    if (!themeId) {
      themeId = document.body.getAttribute("data-theme");
    }

    if (!themeId) {
      themeId = DEFAULT_THEME_ID;
    }

    const resolved = ThemeDefinitions.getById(themeId);
    return resolved || ThemeDefinitions.getById(DEFAULT_THEME_ID);
  }

  /**
   * Inject Google Fonts <link> for the resolved theme's fonts.
   * @param {object} resolved - Output of ThemeDefinitions.resolve()
   */
  function injectFonts(resolved) {
    if (!resolved || !resolved.font) return;

    const importSpec = resolved.font.import;
    if (!importSpec) return;

    const href = "https://fonts.googleapis.com/css2?family=" + importSpec + "&display=swap";

    // Avoid duplicates
    if (document.querySelector(`link[href="${href}"]`)) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  /**
   * Convert ThemeDefinitions.resolve() output to the flat shape charts expect.
   * Adds derived fields: categorical, gridLine, crosshair, positive, negative,
   * primaryLight, cardBg, borderHover, lineWidth.
   *
   * @param {object} resolved - Output of ThemeDefinitions.resolve()
   * @returns {object} Chart-ready theme fragment (colors + font fields)
   */
  function toChartTheme(resolved) {
    const p = resolved.palette || resolved.colors;
    const f = resolved.font || {};

    return {
      // Font shortcuts
      font: resolved.fontFamily || f.body,
      headlineFont: resolved.headlineFont || f.headline,

      // Colors — direct from palette
      colors: {
        primary:       p.primary,
        primaryEnd:    p.primaryEnd,
        primaryLight:  hexToRgba(p.primary, 0.08),
        accent:        p.accent,
        text:          p.text,
        textMuted:     p.textMuted,
        textLight:     p.textLight,
        barText:       p.barText,
        background:    p.background,
        cardBg:        p.dark ? "#1E293B" : "#fff",
        border:        p.border,
        borderHover:   p.primary,
        tooltipBorder: p.tooltipBorder,
        // Derived
        gridLine:      p.dark ? "rgba(255,255,255,0.08)" : "#eaeaea",
        crosshair:     p.dark ? "rgba(255,255,255,0.35)" : "#888",
        positive:      p.dark ? "#34D399" : "#1a9850",
        negative:      p.accent || "#DB444B",
        // Categorical palette
        categorical:   p.categorical || [],
      },

      // Mark defaults — data-line stroke width for time-series charts
      lineWidth: 3,

      // Dark mode flag
      dark: p.dark || false,

      // Theme metadata
      id: resolved.id,
      name: resolved.name,
    };
  }

  // ── Helpers ─────────────────────────────────────────────
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return { resolveCurrentTheme, injectFonts, toChartTheme };
})();

if (typeof module !== "undefined") module.exports = ThemeBridge;
