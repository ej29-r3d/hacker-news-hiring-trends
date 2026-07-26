// ============================================================
// COMPOSABLES BRIDGE — theme-aware wrapper for composable functions
// ============================================================

const ComposablesBridge = (() => {

  /**
   * Returns a proxy object where all 12 composable functions are pre-filled
   * with fontFamily, color, bg, and sentiment colors (positiveColor /
   * negativeColor / neutralColor) from the given theme.
   *
   * Usage:
   *   const comp = ComposablesBridge.withTheme(theme);
   *   comp.addReferenceLine(g, { orientation: "horizontal", ... });
   *   // No need to pass fontFamily/color — they come from theme.
   *
   * Note: upColor/downColor are deliberately NOT themed — legacy
   * sign-based call sites keep today's exact colors.
   *
   * @param {object} theme - Chart theme object (with .font, .colors)
   * @returns {object} Proxy with all Composables functions
   */
  function withTheme(theme) {
    const defaults = {
      fontFamily: theme.font,
      color: theme.colors.text,
      bg: theme.colors.background || "#fff",
      positiveColor: theme.colors.positive,
      negativeColor: theme.colors.negative,
      neutralColor: theme.colors.textMuted,
    };

    const proxy = {};

    Object.keys(Composables).forEach(fnName => {
      proxy[fnName] = function(g, config) {
        // Merge defaults under config (config wins)
        const merged = Object.assign({}, defaults, config);
        return Composables[fnName](g, merged);
      };
    });

    return proxy;
  }

  return { withTheme };
})();

if (typeof module !== "undefined") module.exports = ComposablesBridge;
