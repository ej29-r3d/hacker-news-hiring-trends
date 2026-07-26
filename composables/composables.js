// ============================================================
// COMPOSABLE ELEMENTS — 13 reusable D3 overlay functions
// Each accepts (svgGroup, config) and returns the appended selection
// ============================================================

const Composables = (() => {

  // ============================================================
  // SEMANTIC DIRECTION — optional MetricBridge-aware sentiment
  // ============================================================

  // Resolve the sentiment direction for a change value.
  // Explicit config.direction wins; config.metric consults the
  // metric registry only when the semantics scripts are loaded
  // (higher_is_better -> "up-good", lower_is_better -> "down-good",
  // anything else -> "neutral"). Default is "up-good" so legacy
  // sign-based call sites render byte-identically.
  function resolveDirection(direction, metric) {
    if (direction) return direction;
    const m = (typeof MetricBridge !== "undefined" && metric) ? MetricBridge.resolve(metric) : null;
    if (m) {
      if (m.def.directionality === "higher_is_better") return "up-good";
      if (m.def.directionality === "lower_is_better") return "down-good";
      return "neutral";
    }
    return "up-good";
  }

  // "good" | "bad" | "neutral" for a change under a direction.
  function assessChange(direction, change) {
    if (direction === "up-good") return change >= 0 ? "good" : "bad";
    if (direction === "down-good") return change < 0 ? "good" : "bad";
    return "neutral";
  }

  // 1. addCallout — message bubble with pointer
  function addCallout(g, config) {
    const {
      x, y, label, color = "#333", bg = "#fff",
      fontSize = 10, fontFamily = "Inter, sans-serif",
      offsetY = -40, pointerSize = 6,
    } = config;

    const group = g.append("g")
      .attr("class", "composable-callout")
      .attr("transform", `translate(${x}, ${y + offsetY})`);

    const pillH = 28;

    // Text first to measure
    const text = group.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 4)
      .attr("fill", color)
      .attr("font-size", fontSize + "px")
      .attr("font-weight", 600)
      .attr("font-family", fontFamily)
      .attr("letter-spacing", "0.3px")
      .text(label);

    const bbox = text.node().getBBox();
    const pw = bbox.width + 20;

    // Bubble rect
    group.insert("rect", "text")
      .attr("x", -pw / 2).attr("y", -pillH / 2)
      .attr("width", pw).attr("height", pillH)
      .attr("rx", 6)
      .attr("fill", bg)
      .attr("stroke", color).attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.2);

    // Triangle pointer
    const triY = pillH / 2;
    group.append("polygon")
      .attr("points", `${-pointerSize},${triY} ${pointerSize},${triY} 0,${triY + pointerSize}`)
      .attr("fill", bg)
      .attr("stroke", color).attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.2).attr("stroke-linejoin", "round");

    // Cover line
    group.append("line")
      .attr("x1", -pointerSize + 1).attr("x2", pointerSize - 1)
      .attr("y1", triY).attr("y2", triY)
      .attr("stroke", bg).attr("stroke-width", 2);

    // Connector dashed line to original point
    group.append("line")
      .attr("x1", 0).attr("x2", 0)
      .attr("y1", triY + pointerSize).attr("y2", -offsetY)
      .attr("stroke", color).attr("stroke-opacity", 0.2)
      .attr("stroke-width", 1).attr("stroke-dasharray", "3 2");

    return group;
  }

  // 2. addReferenceLine — horizontal or vertical benchmark line
  function addReferenceLine(g, config) {
    const {
      orientation = "horizontal", // "horizontal" | "vertical"
      value, // pixel position
      x1 = 0, x2 = 0, y1 = 0, y2 = 0,
      label = "", color = "#E3120B",
      dashArray = "6 3", fontSize = 10,
      fontFamily = "Inter, sans-serif",
      labelAnchor = "start", labelDx = 4, labelDy = -6,
    } = config;

    const group = g.append("g").attr("class", "composable-reference-line");

    const lx1 = orientation === "horizontal" ? x1 : value;
    const lx2 = orientation === "horizontal" ? x2 : value;
    const ly1 = orientation === "horizontal" ? value : y1;
    const ly2 = orientation === "horizontal" ? value : y2;

    group.append("line")
      .attr("x1", lx1).attr("x2", lx2)
      .attr("y1", ly1).attr("y2", ly2)
      .attr("stroke", color).attr("stroke-width", 1.5)
      .attr("stroke-dasharray", dashArray);

    if (label) {
      group.append("text")
        .attr("x", orientation === "horizontal" ? x2 + labelDx : value + labelDx)
        .attr("y", orientation === "horizontal" ? value + labelDy : y1 + labelDy)
        .attr("text-anchor", labelAnchor)
        .attr("fill", color)
        .attr("font-size", fontSize + "px")
        .attr("font-weight", 600)
        .attr("font-family", fontFamily)
        .text(label);
    }

    return group;
  }

  // 3. addAnnotationBubble — rich multi-line annotation
  function addAnnotationBubble(g, config) {
    const {
      x, y, title = "", body = "",
      color = "#333", bg = "#fff",
      width = 160, fontSize = 11,
      fontFamily = "Inter, sans-serif",
      connectorX, connectorY,
    } = config;

    const group = g.append("g")
      .attr("class", "composable-annotation-bubble")
      .attr("transform", `translate(${x}, ${y})`);

    const padding = 12;
    let currentY = padding;

    // Title
    if (title) {
      group.append("text")
        .attr("x", padding).attr("y", currentY + fontSize)
        .attr("fill", color)
        .attr("font-size", fontSize + "px")
        .attr("font-weight", 700)
        .attr("font-family", fontFamily)
        .text(title);
      currentY += fontSize + 6;
    }

    // Body
    if (body) {
      const bodyText = group.append("text")
        .attr("x", padding).attr("y", currentY + fontSize - 1)
        .attr("fill", color).attr("opacity", 0.7)
        .attr("font-size", (fontSize - 1) + "px")
        .attr("font-weight", 400)
        .attr("font-family", fontFamily);

      body.split("\n").forEach((line, i) => {
        bodyText.append("tspan")
          .attr("x", padding)
          .attr("dy", i === 0 ? 0 : (fontSize + 2) + "px")
          .text(line);
      });
      currentY += (fontSize + 2) * body.split("\n").length + 4;
    }

    const boxH = currentY + padding / 2;

    // Background rect (inserted behind text)
    group.insert("rect", "text")
      .attr("width", width).attr("height", boxH)
      .attr("rx", 6)
      .attr("fill", bg)
      .attr("stroke", color).attr("stroke-opacity", 0.25)
      .attr("stroke-width", 1);

    // Connector line
    if (connectorX !== undefined && connectorY !== undefined) {
      group.append("line")
        .attr("x1", width / 2).attr("y1", boxH)
        .attr("x2", connectorX - x).attr("y2", connectorY - y)
        .attr("stroke", color).attr("stroke-opacity", 0.25)
        .attr("stroke-width", 1).attr("stroke-dasharray", "4 3");
    }

    return group;
  }

  // 3b. addEventPill — rounded event-label pill with a drop shadow and a
  // connector that terminates in a dot ON the data line (never the axis).
  // Designed for editorial event timelines above a time-series plot.
  //
  // config:
  //   x          - event x in plot coordinates (the dot lands at [x, anchorY])
  //   pillY      - pill center y (negative places it above the plot area)
  //   anchorY    - y of the data line at x; the connector stops here
  //   label      - pill text
  //   sublabel   - optional second line (e.g. the event month "Mar 2022");
  //                two-line pills default to pillH 34
  //   color      - pill border + connector + dot color
  //   textColor  - pill text color (defaults to color)
  //   bg         - pill fill / dot ring (themed via ComposablesBridge)
  //   fill       - true → solid pill in `color` with `bg` text (accent style)
  //   dx         - horizontal pill nudge to dodge neighbors; connector elbows
  //   dashed     - dashed connector (e.g. contextual vs causal events)
  //   fontSize / fontWeight / fontFamily / pillH / dotRadius / cornerRadius
  function addEventPill(g, config) {
    const {
      x, pillY, anchorY,
      label = "",
      sublabel = "",
      color = "#333",
      textColor,
      bg = "#fff",
      fill = false,
      dx = 0,
      dashed = false,
      fontSize = 11,
      fontWeight = 600,
      fontFamily = "Inter, sans-serif",
      dotRadius = 5,
      cornerRadius = 8,
    } = config;
    const pillH = config.pillH || (sublabel ? 34 : 24);

    // Shared drop-shadow filter — created once per owner SVG
    const svg = d3.select(g.node().ownerSVGElement);
    let defs = svg.select("defs");
    if (defs.empty()) defs = svg.append("defs");
    if (defs.select("#composable-pill-shadow").empty()) {
      defs.append("filter")
        .attr("id", "composable-pill-shadow")
        .attr("x", "-30%").attr("y", "-30%")
        .attr("width", "160%").attr("height", "160%")
        .append("feDropShadow")
        .attr("dx", 0).attr("dy", 1.5)
        .attr("stdDeviation", 2.5)
        .attr("flood-color", "rgba(0,0,0,0.18)");
    }

    const group = g.append("g").attr("class", "composable-event-pill");
    const px = x + dx;
    const pillBottom = pillY + pillH / 2;
    const connEnd = anchorY - dotRadius - 1;

    // Connector: straight drop, or — when nudged — a short diagonal at the
    // top (above the plot) then a vertical drop at the event x, so the long
    // segment can never cross a data line before reaching the anchor dot
    const bendY = Math.min(pillBottom + 18, connEnd - 8);
    const conn = group.append("path")
      .attr("d", dx
        ? `M ${px} ${pillBottom} L ${x} ${bendY} L ${x} ${connEnd}`
        : `M ${x} ${pillBottom} L ${x} ${connEnd}`)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-opacity", 0.55)
      .attr("stroke-width", 1);
    if (dashed) conn.attr("stroke-dasharray", "5 3");

    // Anchor dot sitting on the data line, ringed by the surface color
    group.append("circle")
      .attr("cx", x).attr("cy", anchorY)
      .attr("r", dotRadius)
      .attr("fill", color)
      .attr("stroke", bg)
      .attr("stroke-width", 1.5);

    // Pill
    const pill = group.append("g").attr("transform", `translate(${px}, ${pillY})`);
    const text = pill.append("text")
      .attr("text-anchor", "middle").attr("y", sublabel ? -1 : 4)
      .attr("fill", fill ? bg : (textColor || color))
      .attr("font-family", fontFamily)
      .attr("font-size", fontSize + "px")
      .attr("font-weight", fontWeight)
      .text(label);
    let pillW = text.node().getBBox().width;
    if (sublabel) {
      const sub = pill.append("text")
        .attr("text-anchor", "middle").attr("y", 12)
        .attr("fill", fill ? bg : (textColor || color))
        .attr("fill-opacity", 0.65)
        .attr("font-family", fontFamily)
        .attr("font-size", (fontSize - 1) + "px")
        .attr("font-weight", 500)
        .text(sublabel);
      pillW = Math.max(pillW, sub.node().getBBox().width);
    }
    pill.insert("rect", "text")
      .attr("x", -pillW / 2 - 10).attr("y", -pillH / 2)
      .attr("width", pillW + 20).attr("height", pillH).attr("rx", cornerRadius)
      .attr("fill", fill ? color : bg)
      .attr("stroke", color)
      .attr("stroke-opacity", fill ? 1 : 0.5)
      .attr("stroke-width", 1.2)
      .attr("filter", "url(#composable-pill-shadow)");

    return group;
  }

  // 4. addKpiBadge — floating KPI badge with value + delta
  function addKpiBadge(g, config) {
    const {
      x, y, label = "", value = "",
      delta = "", deltaColor = "#10B981",
      bg = "#fff", color = "#1a1a1a",
      fontFamily = "Inter, sans-serif",
      width = 120,
      direction, metric,
      positiveColor, negativeColor, neutralColor,
    } = config;

    // Derive delta color from direction/metric when the caller gave
    // no explicit deltaColor (explicit wins). The change sign is read
    // from a numeric or "+12.3%"-style delta; unparseable deltas keep
    // the literal deltaColor path.
    let resolvedDeltaColor = deltaColor;
    if (config.deltaColor == null && (direction || metric) && delta !== "" && delta != null) {
      const change = typeof delta === "number" ? delta : parseFloat(delta);
      if (isFinite(change)) {
        const sentiment = assessChange(resolveDirection(direction, metric), change);
        resolvedDeltaColor = sentiment === "good" ? (positiveColor || deltaColor)
          : sentiment === "bad" ? (negativeColor || "#EF4444")
          : (neutralColor || color);
      }
    }

    const group = g.append("g")
      .attr("class", "composable-kpi-badge")
      .attr("transform", `translate(${x}, ${y})`);

    const h = 56;

    group.append("rect")
      .attr("width", width).attr("height", h)
      .attr("rx", 8)
      .attr("fill", bg)
      .attr("stroke", color).attr("stroke-opacity", 0.12)
      .attr("stroke-width", 1)
      .style("filter", "drop-shadow(0 1px 3px rgba(0,0,0,0.08))");

    // Label
    group.append("text")
      .attr("x", width / 2).attr("y", 16)
      .attr("text-anchor", "middle")
      .attr("fill", color).attr("opacity", 0.5)
      .attr("font-size", "9px").attr("font-weight", 600)
      .attr("font-family", fontFamily)
      .attr("text-transform", "uppercase")
      .attr("letter-spacing", "0.5px")
      .text(label);

    // Value
    group.append("text")
      .attr("x", delta ? width / 2 - 12 : width / 2).attr("y", 38)
      .attr("text-anchor", "middle")
      .attr("fill", color)
      .attr("font-size", "18px").attr("font-weight", 700)
      .attr("font-family", fontFamily)
      .attr("font-variant-numeric", "tabular-nums")
      .text(value);

    // Delta
    if (delta) {
      group.append("text")
        .attr("x", width / 2 + 28).attr("y", 38)
        .attr("text-anchor", "start")
        .attr("fill", resolvedDeltaColor)
        .attr("font-size", "11px").attr("font-weight", 600)
        .attr("font-family", fontFamily)
        .text(delta);
    }

    return group;
  }

  // 5. addTrendIndicator — up/down arrow with percentage change
  function addTrendIndicator(g, config) {
    const {
      x, y, change = 0, fontSize = 12,
      fontFamily = "Inter, sans-serif",
      upColor = "#10B981", downColor = "#EF4444",
      direction, metric, formatter,
      positiveColor, negativeColor, neutralColor,
      color: textColor = "#1a1a1a",
    } = config;

    const group = g.append("g")
      .attr("class", "composable-trend-indicator")
      .attr("transform", `translate(${x}, ${y})`);

    // Arrow follows the sign; color follows the sentiment.
    const isUp = change >= 0;
    const sentiment = assessChange(resolveDirection(direction, metric), change);
    const color = sentiment === "good" ? (positiveColor || upColor)
      : sentiment === "bad" ? (negativeColor || downColor)
      : (neutralColor || textColor);
    const arrow = isUp ? "▲" : "▼";
    const pct = formatter ? formatter(change) : Math.abs(change * 100).toFixed(1) + "%";

    group.append("text")
      .attr("text-anchor", "start")
      .attr("fill", color)
      .attr("font-size", fontSize + "px")
      .attr("font-weight", 700)
      .attr("font-family", fontFamily)
      .text(`${arrow} ${pct}`);

    return group;
  }

  // 6. addDropOffIndicator — funnel drop-off bracket
  function addDropOffIndicator(g, config) {
    const {
      x, y1, y2, count = "", pct = "",
      color = "#EF4444", fontFamily = "Inter, sans-serif",
      bracketWidth = 10,
    } = config;

    const group = g.append("g")
      .attr("class", "composable-dropoff-indicator")
      .attr("transform", `translate(${x}, 0)`);

    const midY = (y1 + y2) / 2;

    // Bracket lines
    group.append("path")
      .attr("d", `M0,${y1} L${bracketWidth},${y1} L${bracketWidth},${y2} L0,${y2}`)
      .attr("fill", "none")
      .attr("stroke", color).attr("stroke-opacity", 0.5)
      .attr("stroke-width", 1.5);

    // Count label
    group.append("text")
      .attr("x", bracketWidth + 6).attr("y", midY - 2)
      .attr("fill", color)
      .attr("font-size", "11px").attr("font-weight", 700)
      .attr("font-family", fontFamily)
      .attr("font-variant-numeric", "tabular-nums")
      .text(`-${count}`);

    // Percentage
    if (pct) {
      group.append("text")
        .attr("x", bracketWidth + 6).attr("y", midY + 12)
        .attr("fill", color).attr("opacity", 0.7)
        .attr("font-size", "10px").attr("font-weight", 500)
        .attr("font-family", fontFamily)
        .text(pct);
    }

    return group;
  }

  // 7. addGoalMarker — diamond/flag marker at target point
  function addGoalMarker(g, config) {
    const {
      x, y, label = "Goal", color = "#E3120B",
      size = 8, fontFamily = "Inter, sans-serif",
    } = config;

    const group = g.append("g")
      .attr("class", "composable-goal-marker")
      .attr("transform", `translate(${x}, ${y})`);

    // Diamond
    group.append("polygon")
      .attr("points", `0,${-size} ${size},0 0,${size} ${-size},0`)
      .attr("fill", color);

    // Label
    group.append("text")
      .attr("x", size + 6).attr("y", 4)
      .attr("fill", color)
      .attr("font-size", "10px").attr("font-weight", 600)
      .attr("font-family", fontFamily)
      .text(label);

    return group;
  }

  // 8. addWatermark — subtle background text
  function addWatermark(g, config) {
    const {
      text = "DRAFT", x, y,
      fontSize = 64, color = "#000", opacity = 0.04,
      fontFamily = "Inter, sans-serif", rotate = -30,
    } = config;

    return g.append("text")
      .attr("class", "composable-watermark")
      .attr("x", x).attr("y", y)
      .attr("text-anchor", "middle")
      .attr("fill", color)
      .attr("opacity", opacity)
      .attr("font-size", fontSize + "px")
      .attr("font-weight", 900)
      .attr("font-family", fontFamily)
      .attr("letter-spacing", "8px")
      .attr("transform", `rotate(${rotate}, ${x}, ${y})`)
      .text(text);
  }

  // 9. addSourceBadge — "Source: ..." attribution line
  function addSourceBadge(g, config) {
    const {
      x, y, text = "Source: Internal analytics",
      color = "#999", fontSize = 10,
      fontFamily = "Inter, sans-serif",
      borderColor = "#e5e5e5", width = 0,
    } = config;

    const group = g.append("g")
      .attr("class", "composable-source-badge")
      .attr("transform", `translate(${x}, ${y})`);

    if (width > 0) {
      group.append("line")
        .attr("x1", 0).attr("x2", width)
        .attr("y1", 0).attr("y2", 0)
        .attr("stroke", borderColor).attr("stroke-width", 1);
    }

    group.append("text")
      .attr("x", 0).attr("y", width > 0 ? 14 : 0)
      .attr("fill", color)
      .attr("font-size", fontSize + "px")
      .attr("font-weight", 400)
      .attr("font-family", fontFamily)
      .text(text);

    return group;
  }

  // 10. addPeriodComparison — side-by-side period values with change arrow
  function addPeriodComparison(g, config) {
    const {
      x, y,
      label1 = "Previous", value1 = "",
      label2 = "Current", value2 = "",
      change = 0,
      color = "#1a1a1a", fontFamily = "Inter, sans-serif",
      upColor = "#10B981", downColor = "#EF4444",
      direction, metric, formatter,
      positiveColor, negativeColor, neutralColor,
    } = config;

    const group = g.append("g")
      .attr("class", "composable-period-comparison")
      .attr("transform", `translate(${x}, ${y})`);

    // Period 1
    group.append("text")
      .attr("x", 0).attr("y", 0)
      .attr("fill", color).attr("opacity", 0.5)
      .attr("font-size", "9px").attr("font-weight", 600)
      .attr("font-family", fontFamily)
      .text(label1);

    group.append("text")
      .attr("x", 0).attr("y", 18)
      .attr("fill", color)
      .attr("font-size", "16px").attr("font-weight", 700)
      .attr("font-family", fontFamily)
      .attr("font-variant-numeric", "tabular-nums")
      .text(value1);

    // Arrow — glyph follows the sign; color follows the sentiment
    const isUp = change >= 0;
    const sentiment = assessChange(resolveDirection(direction, metric), change);
    const arrowColor = sentiment === "good" ? (positiveColor || upColor)
      : sentiment === "bad" ? (negativeColor || downColor)
      : (neutralColor || color);
    group.append("text")
      .attr("x", 75).attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("fill", arrowColor)
      .attr("font-size", "14px").attr("font-weight", 700)
      .text(isUp ? "→ ▲" : "→ ▼");

    group.append("text")
      .attr("x", 75).attr("y", 32)
      .attr("text-anchor", "middle")
      .attr("fill", arrowColor)
      .attr("font-size", "10px").attr("font-weight", 600)
      .attr("font-family", fontFamily)
      .text(formatter ? formatter(change) : (change >= 0 ? "+" : "") + (change * 100).toFixed(1) + "%");

    // Period 2
    group.append("text")
      .attr("x", 120).attr("y", 0)
      .attr("fill", color).attr("opacity", 0.5)
      .attr("font-size", "9px").attr("font-weight", 600)
      .attr("font-family", fontFamily)
      .text(label2);

    group.append("text")
      .attr("x", 120).attr("y", 18)
      .attr("fill", color)
      .attr("font-size", "16px").attr("font-weight", 700)
      .attr("font-family", fontFamily)
      .attr("font-variant-numeric", "tabular-nums")
      .text(value2);

    return group;
  }

  // 11. addThresholdZone — colored background zones
  function addThresholdZone(g, config) {
    const {
      x = 0, y, width, height,
      color = "#EF4444", opacity = 0.06,
      label = "", labelColor,
      fontFamily = "Inter, sans-serif",
    } = config;

    const group = g.append("g")
      .attr("class", "composable-threshold-zone");

    group.insert("rect", ":first-child")
      .attr("x", x).attr("y", y)
      .attr("width", width).attr("height", height)
      .attr("fill", color).attr("opacity", opacity);

    if (label) {
      group.append("text")
        .attr("x", x + width - 4).attr("y", y + 12)
        .attr("text-anchor", "end")
        .attr("fill", labelColor || color)
        .attr("opacity", 0.6)
        .attr("font-size", "9px").attr("font-weight", 600)
        .attr("font-family", fontFamily)
        .attr("letter-spacing", "0.5px")
        .text(label);
    }

    return group;
  }

  // 12. addLegend — detached, positionable legend
  function addLegend(g, config) {
    const {
      x, y, items = [], // [{label, color, dashed?}]
      fontSize = 11, fontFamily = "Inter, sans-serif",
      color = "#1a1a1a", orientation = "horizontal", // "horizontal" | "vertical"
      swatchSize = 10, gap = 24,
    } = config;

    const group = g.append("g")
      .attr("class", "composable-legend")
      .attr("transform", `translate(${x}, ${y})`);

    let offsetX = 0, offsetY = 0;

    items.forEach((item) => {
      const itemG = group.append("g")
        .attr("transform", `translate(${offsetX}, ${offsetY})`);

      if (item.dashed) {
        itemG.append("line")
          .attr("x1", 0).attr("x2", swatchSize + 4)
          .attr("y1", swatchSize / 2).attr("y2", swatchSize / 2)
          .attr("stroke", item.color).attr("stroke-width", 2)
          .attr("stroke-dasharray", "4 2");
      } else {
        itemG.append("rect")
          .attr("width", swatchSize).attr("height", swatchSize)
          .attr("rx", 2)
          .attr("fill", item.color);
      }

      const textEl = itemG.append("text")
        .attr("x", swatchSize + 8).attr("y", swatchSize - 1)
        .attr("fill", color)
        .attr("font-size", fontSize + "px")
        .attr("font-weight", 400)
        .attr("font-family", fontFamily)
        .text(item.label);

      if (orientation === "horizontal") {
        const textW = textEl.node() ? textEl.node().getComputedTextLength() || item.label.length * 7 : item.label.length * 7;
        offsetX += swatchSize + 8 + textW + gap;
      } else {
        offsetY += swatchSize + 8;
      }
    });

    return group;
  }

  return {
    addCallout,
    addReferenceLine,
    addAnnotationBubble,
    addEventPill,
    addKpiBadge,
    addTrendIndicator,
    addDropOffIndicator,
    addGoalMarker,
    addWatermark,
    addSourceBadge,
    addPeriodComparison,
    addThresholdZone,
    addLegend,
  };
})();

if (typeof module !== "undefined") module.exports = Composables;
