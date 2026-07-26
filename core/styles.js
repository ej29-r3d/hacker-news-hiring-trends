// ============================================================
// CHART STYLES — shared page chrome (body, headline, deck, source)
// ============================================================

const ChartStyles = (() => {

  /**
   * Apply standard page chrome: body, container, headline, deck, source.
   * Also injects base stylesheet for .tooltip-box.visible and reduced-motion.
   *
   * @param {object} theme - Theme object with font, colors, headline, deck, source, layout, tooltip
   * @param {object} data  - Data object with title, subtitle, source
   * @param {object} [opts] - Optional overrides { extraStyles: string }
   */
  function applyPageChrome(theme, data, opts = {}) {
    const t = theme;
    const c = t.colors;

    // Embed mode — ?embed=1 strips full-page chrome so the chart fits tightly
    // inside an iframe or parent container, and posts its content height to
    // the parent window so the host can auto-size the iframe.
    const params = new URLSearchParams(window.location.search);
    const embed = params.get("embed") === "1";
    // ?title=hide force-hides the headline even when data.title is set, so a
    // host app can embed the chart and frame it with its own title control.
    const hideTitle = params.get("title") === "hide";

    // Body
    if (embed) {
      // overflow: hidden prevents the iframe from ever showing scrollbars.
      // body.scrollHeight can be unexpectedly large because of SVG overflow,
      // absolute-positioned helpers (tooltip, a11y table), and paint area
      // beyond the .container element. None of those should be scrollable
      // in an embedded chart — the visible content is bounded by .container.
      document.body.style.cssText = `
        font-family: ${t.font};
        background: ${c.background};
        padding: 12px 16px;
        overflow: hidden;
      `;
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.cssText = `
        font-family: ${t.font};
        background: ${c.background};
        display: flex; justify-content: center; align-items: center;
        min-height: 100vh; padding: 40px 24px;
      `;
    }

    // Container
    const container = document.querySelector(".container");
    const maxW = t.layout.maxWidth || t.layout.width || 760;
    container.style.cssText = embed
      ? `width: 100%; max-width: 100%; position: relative;`
      : `width: 100%; max-width: ${maxW}px; position: relative;`;

    // DEBUG — one-shot diagnostic to identify what extends body.scrollHeight.
    // Temporarily disables overflow:hidden so scrollHeight reflects the
    // uncapped overflow area, walks the DOM, and reports every element whose
    // rect extends past .container's bottom edge.
    if (embed) {
      setTimeout(() => {
        const prevBodyOv = document.body.style.overflow;
        const prevHtmlOv = document.documentElement.style.overflow;
        document.body.style.overflow = "visible";
        document.documentElement.style.overflow = "visible";
        // Force reflow
        void document.body.offsetHeight;

        const containerBottom = container
          ? container.getBoundingClientRect().bottom
          : 0;
        const offenders = [];
        const walk = (node, path) => {
          if (!(node instanceof Element)) return;
          const rect = node.getBoundingClientRect();
          if (rect.bottom > containerBottom + 1 && rect.height > 0) {
            offenders.push({
              path,
              tag: node.tagName.toLowerCase(),
              id: node.id || null,
              cls: node.className || null,
              rectBottom: Math.round(rect.bottom),
              rectTop: Math.round(rect.top),
              rectH: Math.round(rect.height),
              pos: getComputedStyle(node).position,
              overflow: getComputedStyle(node).overflow,
            });
          }
          for (let i = 0; i < node.children.length; i++) {
            walk(node.children[i], path + " > " + node.children[i].tagName.toLowerCase() + (node.children[i].id ? "#" + node.children[i].id : ""));
          }
        };
        walk(document.body, "body");

        offenders.sort((a, b) => b.rectBottom - a.rectBottom);
        console.log("[leak-scan]", {
          href: location.href.split("/").pop(),
          containerBottom: Math.round(containerBottom),
          bodyScrollH: document.body.scrollHeight,
          htmlScrollH: document.documentElement.scrollHeight,
          topOffenders: offenders.slice(0, 8),
        });

        document.body.style.overflow = prevBodyOv;
        document.documentElement.style.overflow = prevHtmlOv;
      }, 1500);
    }

    // In embed mode, broadcast the rendered height so a parent frame can
    // auto-resize the iframe. Listens for load + DOM / element size changes.
    if (embed && window.parent !== window) {
      let lastPosted = 0;
      // Measure the .container wrapper + body padding. This is the only
      // approach that's purely content-driven: body/html dimensions can
      // track the iframe viewport (especially in browsers that let html
      // fill the viewport by default), which creates a positive-feedback
      // loop where reporting height grows the iframe, which grows the
      // reported height.
      const measure = () => {
        const bodyStyle = getComputedStyle(document.body);
        const padTop    = parseFloat(bodyStyle.paddingTop)    || 0;
        const padBottom = parseFloat(bodyStyle.paddingBottom) || 0;
        if (container && container.getBoundingClientRect) {
          const rect = container.getBoundingClientRect();
          return Math.ceil(rect.height + padTop + padBottom);
        }
        return document.body.scrollHeight;
      };
      const post = () => {
        // +2px guards against subpixel rounding that would otherwise
        // introduce a 1px scrollbar in the parent iframe.
        const h = Math.ceil(measure()) + 2;
        if (h === lastPosted) return;
        lastPosted = h;
        window.parent.postMessage({ type: "chart-resize", height: h, href: location.href }, "*");
      };
      window.addEventListener("load", post);
      if (typeof ResizeObserver !== "undefined" && container) {
        new ResizeObserver(post).observe(container);
      }
      // Safety net: retries after fonts/animations settle.
      setTimeout(post, 150);
      setTimeout(post, 400);
      setTimeout(post, 1200);
    }

    // Headline
    const headline = document.querySelector(".headline");
    if (headline && data.title && !hideTitle) {
      headline.textContent = data.title;
      headline.style.cssText = `
        font-family: ${t.headlineFont || t.font};
        font-size: ${t.headline.size}px; font-weight: ${t.headline.weight};
        color: ${c.text}; line-height: 1.2; margin-bottom: 4px;
        letter-spacing: ${t.headline.letterSpacing || "-0.3px"};
      `;
    }

    // Deck
    const deck = document.querySelector(".deck");
    if (deck && data.subtitle) {
      deck.textContent = data.subtitle;
      deck.style.cssText = `
        font-family: ${t.font};
        font-size: ${t.deck.size}px; font-weight: ${t.deck.weight};
        color: ${c.textMuted}; line-height: 1.45; margin-bottom: 24px;
      `;
    }

    // Dynamic stylesheet
    const sheet = document.createElement("style");
    sheet.textContent = `
      .tooltip-box.visible { opacity: 1 !important; }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; }
      }
      ${opts.extraStyles || ""}
    `;
    document.head.appendChild(sheet);
  }

  return { applyPageChrome };
})();

if (typeof module !== "undefined") module.exports = ChartStyles;
