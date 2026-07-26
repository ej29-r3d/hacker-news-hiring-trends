// ============================================================
// CHART TOOLTIP — unified tooltip creation, positioning, helpers
// ============================================================

const ChartTooltip = (() => {

  /**
   * Create a tooltip instance attached to a container element.
   * @param {HTMLElement} container - The .container element for positioning
   * @param {object} theme - Theme object with colors, font, tooltip props
   * @returns {{ show, hide, position, el }}
   */
  function create(container, theme) {
    const c = theme.colors;
    const t = theme;

    // Find or create tooltip element
    let el = container.querySelector(".tooltip-box");
    if (!el) {
      el = document.createElement("div");
      el.className = "tooltip-box";
      container.appendChild(el);
    }

    el.style.cssText = `
      position: absolute; pointer-events: none;
      background: ${c.background || c.cardBg || "#fff"};
      border: 1px solid ${c.tooltipBorder || "#d0d0d0"};
      padding: 14px 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      opacity: 0; transition: opacity 0.12s ease;
      z-index: 10; min-width: 180px;
      font-family: ${t.font}; font-size: ${(t.tooltip && t.tooltip.size) || 13}px;
      color: ${c.text};
    `;

    function show(html, event) {
      el.innerHTML = html;
      el.classList.add("visible");
      if (event) position(event);
    }

    function hide() {
      el.classList.remove("visible");
    }

    function position(event) {
      const rect = container.getBoundingClientRect();
      const [mx, my] = d3.pointer(event, container);
      const tw = el.offsetWidth;
      let tx = mx + 20;
      if (tx + tw > rect.width) tx = mx - tw - 20;
      let ty = my - 40;
      ty = Math.max(0, Math.min(ty, rect.height - el.offsetHeight));
      el.style.left = tx + "px";
      el.style.top  = ty + "px";
    }

    return { show, hide, position, el };
  }

  /**
   * Generate one tooltip row HTML (label–value flex pair).
   */
  function row(label, value, opts = {}) {
    const {
      labelColor = "inherit",
      valueColor = "inherit",
      valueWeight = 600,
      labelSize = 12,
      valueSize = 12,
    } = opts;
    return `
      <div style="display:flex; justify-content:space-between; padding:2px 0; gap:16px;">
        <span style="color:${labelColor}; font-size:${labelSize}px;">${label}</span>
        <span style="font-weight:${valueWeight}; color:${valueColor}; font-variant-numeric:tabular-nums; font-size:${valueSize}px;">${value}</span>
      </div>
    `;
  }

  /**
   * Tooltip section heading HTML.
   */
  function heading(text, opts = {}) {
    const { color = "inherit", size = 13, weight = 700, marginBottom = 8 } = opts;
    return `<div style="font-weight:${weight}; color:${color}; font-size:${size}px; margin-bottom:${marginBottom}px;">${text}</div>`;
  }

  /**
   * Horizontal separator HTML.
   */
  function divider(color = "#e5e5e5") {
    return `<div style="height:1px; background:${color}; margin:6px 0;"></div>`;
  }

  return { create, row, heading, divider };
})();

if (typeof module !== "undefined") module.exports = ChartTooltip;
