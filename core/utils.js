// ============================================================
// CHART UTILS — shared formatters, motion detection, helpers
// ============================================================

const ChartUtils = (() => {

  // ── Formatters ────────────────────────────────────────────
  const fmt = {
    number:    (v) => d3.format(",")(v),
    pct:       (v) => (v * 100).toFixed(1) + "%",
    dollar:    (v) => "$" + d3.format(",.0f")(v),
    dollarK:   (v) => "$" + d3.format(",.0f")(v / 1000) + "K",
    monthYear: (d) => d3.timeFormat("%b '%y")(d),
    date:      (d) => d3.timeFormat("%b %d, %Y")(d),
    shortDate: (d) => d3.timeFormat("%b %d")(d),
  };

  // ── Reduced Motion ────────────────────────────────────────
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function animDuration(ms) {
    return prefersReducedMotion() ? 0 : ms;
  }

  // ── Resize Observer ───────────────────────────────────────
  function observeResize(el, cb) {
    if (typeof ResizeObserver === "undefined") return null;
    const ro = new ResizeObserver(debounce((entries) => {
      const entry = entries[0];
      if (entry) cb(entry.contentRect);
    }, 150));
    ro.observe(el);
    return ro;
  }

  // ── Debounce ──────────────────────────────────────────────
  function debounce(fn, ms) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  return { fmt, prefersReducedMotion, animDuration, observeResize, debounce };
})();

if (typeof module !== "undefined") module.exports = ChartUtils;
