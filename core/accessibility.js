// ============================================================
// CHART A11Y — ARIA labels, keyboard nav, screen-reader tables
// ============================================================

const ChartA11y = (() => {

  /**
   * Enhance SVG with role, title, desc, and aria-labelledby.
   * @param {d3.Selection} svg - D3 SVG selection
   * @param {object} opts - { title, description }
   */
  function enhanceSvg(svg, opts = {}) {
    const { title, description } = opts;
    const node = svg.node();
    const id = node.id || "chart-" + Math.random().toString(36).slice(2, 8);

    svg.attr("role", "img");

    const ids = [];

    if (title) {
      svg.attr("aria-label", title);
    }

    if (description) {
      const descId = id + "-desc";
      let descEl = svg.select("desc");
      if (descEl.empty()) descEl = svg.insert("desc", ":first-child");
      descEl.attr("id", descId).text(description);
      svg.attr("aria-describedby", descId);
    }
  }

  /**
   * Add a visually-hidden data table for screen readers.
   * @param {HTMLElement} container - Parent element
   * @param {object} opts - { columns: string[], rows: any[][], caption: string }
   */
  function addDataTable(container, opts = {}) {
    const { columns = [], rows = [], caption = "Chart data" } = opts;

    // Sr-only clipping lives on a wrapper div: tables lay out to their
    // content width regardless of width/max-width (auto table layout), so
    // styling the table itself lets wide tables widen the page. A 1px
    // overflow:hidden wrapper contains the table without touching its
    // display:table semantics for screen readers.
    const srWrapper = document.createElement("div");
    srWrapper.style.cssText = `
      position: absolute; width: 1px; height: 1px;
      padding: 0; margin: -1px; overflow: hidden;
      clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    `;

    const table = document.createElement("table");
    table.setAttribute("role", "table");

    // Caption
    const cap = document.createElement("caption");
    cap.textContent = caption;
    table.appendChild(cap);

    // Header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    columns.forEach(col => {
      const th = document.createElement("th");
      th.setAttribute("scope", "col");
      th.textContent = col;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement("tbody");
    rows.forEach(row => {
      const tr = document.createElement("tr");
      row.forEach((cell, i) => {
        const td = i === 0 ? document.createElement("th") : document.createElement("td");
        if (i === 0) td.setAttribute("scope", "row");
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    srWrapper.appendChild(table);
    container.appendChild(srWrapper);
    return table;
  }

  /**
   * Add keyboard navigation between data points.
   * @param {d3.Selection} svg - D3 SVG selection
   * @param {d3.Selection[]} dataPoints - Array of D3 selections for focusable elements
   * @param {object} opts - { onFocus(el, i), onBlur(el, i) }
   */
  function addKeyboardNav(svg, dataPoints, opts = {}) {
    const { onFocus, onBlur } = opts;

    dataPoints.forEach((point, i) => {
      const node = point.node ? point.node() : point;
      node.setAttribute("tabindex", "0");
      node.setAttribute("role", "graphics-symbol");

      node.addEventListener("focus", () => {
        if (onFocus) onFocus(node, i);
      });

      node.addEventListener("blur", () => {
        if (onBlur) onBlur(node, i);
      });

      node.addEventListener("keydown", (e) => {
        let target = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          target = i < dataPoints.length - 1 ? i + 1 : 0;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          target = i > 0 ? i - 1 : dataPoints.length - 1;
        }
        if (target !== null) {
          const targetNode = dataPoints[target].node ? dataPoints[target].node() : dataPoints[target];
          targetNode.focus();
        }
      });
    });
  }

  return { enhanceSvg, addDataTable, addKeyboardNav };
})();

if (typeof module !== "undefined") module.exports = ChartA11y;
