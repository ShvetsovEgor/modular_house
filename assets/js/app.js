/* =========================================================
   Славянская Сталь — конфигуратор и интерактив
   ========================================================= */
(function () {
  "use strict";

  const PHONE = "79271002324";
  const DELIVERY_PRICE = 15000;
  const fmt = new Intl.NumberFormat("ru-RU");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const formatMoney = (value) => fmt.format(Math.round(value)) + " ₽";
  const formatArea = (value) =>
    (Number.isInteger(value) ? String(value) : value.toFixed(1)).replace(".", ",");
  const formatDim = (value) => value.toFixed(1).replace(".", ",");
  const roundTo = (value, step) => Math.round(value / step) * step;
  const signed = (value) => (value > 0 ? "+" : value < 0 ? "−" : "") + fmt.format(Math.abs(value)) + " ₽";

  const icons = {
    bytovka:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v11H3V9Z"/><path d="M3 9l9-5 9 5"/><path d="M15.5 20v-5.5h3V20"/><path d="M7 13h3"/></svg>',
    house:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20H3v-9.5Z"/><path d="M9.5 20v-5.5h5V20"/><path d="M7 11h2.5M14.5 11H17"/></svg>',
  };

  const TYPES = {
    bytovka: {
      key: "bytovka",
      name: "Бытовка",
      tagline: "Склад, бригада, прорабская",
      start: "от 105 000 ₽",
      leadTime: "5–7 дней",
      leadTimeLong: "5–7 рабочих дней",
      availableInsulation: [50, 100, 150, 200],
      sizes: [
        { id: "3x2.4", l: 3, w: 2.4, note: "мини-склад" },
        { id: "6x2.4", l: 6, w: 2.4, note: "стандарт" },
        { id: "6x3", l: 6, w: 3, note: "шире" },
        { id: "8x2.4", l: 8, w: 2.4, note: "бригада" },
        { id: "9x3", l: 9, w: 3, note: "максимум" },
      ],
      trims: [
        {
          id: "econom",
          name: "Эконом",
          perM2: 7300,
          hint: "OSB · 50 мм · без электрики",
          included: { insulation: 50, windows: 0, door: "metal", electric: "none", finish: "osb", roof: "profnastil", terrace: "none" },
          preview: { wall: "#c7ccd0", edge: "#8d969d", line: "rgba(0,0,0,.10)", roof: "#2b2e33" },
        },
        {
          id: "standard",
          name: "Стандарт",
          perM2: 9375,
          hint: "вагонка · 100 мм · 1 окно",
          included: { insulation: 100, windows: 1, door: "insulated", electric: "basic", finish: "lining", roof: "profnastil", terrace: "none" },
          preview: { wall: "#e7dfcf", edge: "#a89c86", line: "rgba(0,0,0,.09)", roof: "#2b2e33" },
        },
        {
          id: "premium",
          name: "Премиум",
          perM2: 12150,
          hint: "чистовая · 150 мм · электрика",
          included: { insulation: 150, windows: 2, door: "insulated", electric: "full", finish: "lining", roof: "metal", terrace: "none" },
          preview: { wall: "#2f343a", edge: "#4d555d", line: "rgba(255,255,255,.08)", roof: "#17191c" },
        },
      ],
      costs: {
        insulation: { 50: 0, 100: 900, 150: 1700, 200: 2500 },
        window: 9500,
        door: { metal: 0, insulated: 7500, glass: 24000 },
        electric: { none: 0, basic: 9500, full: 21000 },
        finish: { osb: 0, lining: 14000, pvc: 26000 },
        roof: { profnastil: 0, metal: 16000 },
        terrace: { none: 0, "3": 42000, "6": 74000 },
      },
    },

    house: {
      key: "house",
      name: "Модульный дом",
      tagline: "Для жизни, дачи и бизнеса",
      start: "от 648 000 ₽",
      leadTime: "10–14 дней",
      leadTimeLong: "10–14 рабочих дней",
      availableInsulation: [100, 150, 200],
      sizes: [
        { id: "6x3", l: 6, w: 3, note: "компакт" },
        { id: "9x3", l: 9, w: 3, note: "1 спальня" },
        { id: "12x3", l: 12, w: 3, note: "2 спальни" },
        { id: "9x6", l: 9, w: 6, note: "семейный" },
        { id: "12x6", l: 12, w: 6, note: "большой" },
      ],
      trims: [
        {
          id: "base",
          name: "Базовый",
          perM2: 36000,
          hint: "100 мм · 2 окна · вагонка",
          included: { insulation: 100, windows: 2, door: "insulated", electric: "basic", finish: "lining", roof: "profnastil", terrace: "none" },
          preview: { wall: "#d9d0bf", edge: "#a99e8b", line: "rgba(0,0,0,.09)", roof: "#2b2e33" },
        },
        {
          id: "comfort",
          name: "Комфорт",
          perM2: 44000,
          hint: "150 мм · 3 окна · электрика",
          included: { insulation: 150, windows: 3, door: "insulated", electric: "full", finish: "lining", roof: "metal", terrace: "none" },
          preview: { wall: "#e7dfcf", edge: "#a89c86", line: "rgba(0,0,0,.09)", roof: "#2b2e33" },
        },
        {
          id: "premium",
          name: "Премиум",
          perM2: 54000,
          hint: "200 мм · панорама · отделка",
          included: { insulation: 200, windows: 3, door: "glass", electric: "full", finish: "pvc", roof: "metal", terrace: "none" },
          preview: { wall: "#2f343a", edge: "#4d555d", line: "rgba(255,255,255,.08)", roof: "#17191c" },
        },
      ],
      costs: {
        insulation: { 100: 0, 150: 1100, 200: 2100 },
        window: 14000,
        door: { metal: 0, insulated: 9000, glass: 32000 },
        electric: { none: 0, basic: 12000, full: 26000 },
        finish: { osb: 0, lining: 18000, pvc: 32000 },
        roof: { profnastil: 0, metal: 22000 },
        terrace: { none: 0, "3": 52000, "6": 92000 },
      },
    },
  };

  const LABELS = {
    door: { metal: "Металл", insulated: "Утеплённая", glass: "Стекло" },
    electric: { none: "Без", basic: "Базовая", full: "Полная" },
    finish: { osb: "OSB", lining: "Вагонка", pvc: "ЛДСП" },
    roof: { profnastil: "Профлист", metal: "Металлочерепица" },
    terrace: { none: "Нет", "3": "3 м", "6": "6 м" },
  };

  const state = {
    type: "bytovka",
    size: "6x2.4",
    trim: "standard",
    insulation: 100,
    windows: 1,
    door: "insulated",
    electric: "basic",
    finish: "lining",
    roof: "profnastil",
    terrace: "none",
    delivery: false,
  };

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

  const typeGrid = $("#typeGrid");
  const sizeGrid = $("#sizeGrid");
  const trimGrid = $("#trimGrid");
  const optionsEl = $("#options");
  const previewEl = $("#preview");
  const priceValue = $("#priceValue");
  const breakdownEl = $("#breakdown");
  const previewArea = $("#previewArea");
  const previewLabel = $("#previewLabel");
  const leadTimeEl = $("#leadTime");
  const summaryBadges = $("#summaryBadges");

  const getType = () => TYPES[state.type];
  const getSize = () => getType().sizes.find((size) => size.id === state.size) || getType().sizes[1];
  const getTrim = () => getType().trims.find((trim) => trim.id === state.trim) || getType().trims[0];
  const getArea = () => {
    const size = getSize();
    return Math.round(size.l * size.w * 10) / 10;
  };
  const getMaxWindows = () => {
    const size = getSize();
    return Math.max(1, Math.min(4, Math.floor(size.l / 3)));
  };
  const getMinWindows = () => Math.min(getTrim().included.windows, getMaxWindows());

  function clampWindows() {
    state.windows = Math.max(getMinWindows(), Math.min(state.windows, getMaxWindows()));
  }

  /* ---------- Расчёт ---------- */

  function calculate() {
    const type = getType();
    const size = getSize();
    const trim = getTrim();
    const area = getArea();
    const costs = type.costs;
    const inc = trim.included;
    const items = [];

    const base = roundTo(trim.perM2 * area, 1000);
    items.push({
      label: type.name + " «" + trim.name + "» · " + formatDim(size.l) + " × " + formatDim(size.w) + " м",
      value: base,
      kind: "base",
    });

    const push = (label, value) => {
      const rounded = roundTo(value, 100);
      if (rounded !== 0) items.push({ label: label, value: rounded, kind: rounded < 0 ? "minus" : "" });
    };

    const insulationBase = costs.insulation[inc.insulation] || 0;
    const insulationNow = costs.insulation[state.insulation] || 0;
    push("Утепление " + state.insulation + " мм", (insulationNow - insulationBase) * area);

    const extraWindows = state.windows - inc.windows;
    if (extraWindows > 0) {
      push("Дополнительные окна, " + extraWindows + " шт.", extraWindows * costs.window);
    }

    push("Дверь «" + LABELS.door[state.door] + "»", (costs.door[state.door] || 0) - (costs.door[inc.door] || 0));
    push("Электрика «" + LABELS.electric[state.electric] + "»", (costs.electric[state.electric] || 0) - (costs.electric[inc.electric] || 0));
    push("Отделка «" + LABELS.finish[state.finish] + "»", (costs.finish[state.finish] || 0) - (costs.finish[inc.finish] || 0));
    push("Кровля «" + LABELS.roof[state.roof] + "»", (costs.roof[state.roof] || 0) - (costs.roof[inc.roof] || 0));
    push("Терраса " + (state.terrace === "none" ? "" : LABELS.terrace[state.terrace]), (costs.terrace[state.terrace] || 0) - (costs.terrace[inc.terrace] || 0));

    if (state.delivery) {
      items.push({ label: "Доставка и монтаж по Саратову", value: DELIVERY_PRICE, kind: "" });
    }

    const total = items.reduce((sum, item) => sum + item.value, 0);
    return { items: items, total: total, base: base, area: area };
  }

  function getOptionDelta(key) {
    const type = getType();
    const trim = getTrim();
    const costs = type.costs;
    const inc = trim.included;
    if (key === "insulation") {
      return roundTo(((costs.insulation[state.insulation] || 0) - (costs.insulation[inc.insulation] || 0)) * getArea(), 100);
    }
    if (key === "windows") {
      const extra = state.windows - inc.windows;
      return extra > 0 ? extra * costs.window : 0;
    }
    if (key === "delivery") return state.delivery ? DELIVERY_PRICE : 0;
    return (costs[key][state[key]] || 0) - (costs[key][inc[key]] || 0);
  }

  const deltaLabel = (value, zeroText) => {
    if (value === 0) return zeroText || "включено";
    return signed(value);
  };

  /* ---------- Рендер контролов ---------- */

  function renderTypes() {
    typeGrid.innerHTML = Object.values(TYPES)
      .map((type) => {
        const active = state.type === type.key;
        return (
          '<button class="type-card' + (active ? " is-active" : "") + '" type="button" data-type="' + type.key + '" aria-pressed="' + active + '">' +
            '<span class="type-card__icon">' + icons[type.key] + "</span>" +
            '<span class="type-card__body"><strong>' + type.name + '</strong><span>' + type.tagline + ' · <span class="type-card__from">' + type.start + "</span></span></span>" +
            '<span class="type-card__check" aria-hidden="true"></span>' +
          "</button>"
        );
      })
      .join("");
  }

  function renderSizes() {
    const type = getType();
    sizeGrid.innerHTML = type.sizes
      .map((size) => {
        const area = Math.round(size.l * size.w * 10) / 10;
        const active = state.size === size.id;
        return (
          '<button class="size-chip' + (active ? " is-active" : "") + '" type="button" data-size="' + size.id + '" aria-pressed="' + active + '" title="' + size.note + '">' +
            "<strong>" + formatDim(size.l) + " × " + formatDim(size.w) + "</strong>" +
            "<span>" + formatArea(area) + " м²</span>" +
          "</button>"
        );
      })
      .join("");
  }

  function renderTrims() {
    trimGrid.innerHTML = getType().trims
      .map((trim) => {
        const active = state.trim === trim.id;
        const base = roundTo(trim.perM2 * getArea(), 1000);
        return (
          '<button class="trim-option' + (active ? " is-active" : "") + '" type="button" data-trim="' + trim.id + '" aria-pressed="' + active + '">' +
            '<span class="trim-option__name">' + trim.name + "</span>" +
            '<span class="trim-option__price">' + formatMoney(base) + "</span>" +
            '<span class="trim-option__hint">' + trim.hint + "</span>" +
          "</button>"
        );
      })
      .join("");
  }

  function segmented(key, values, labels) {
    return (
      '<div class="segmented" role="group" aria-label="' + labels.title + '">' +
        values
          .map((value) => {
            const active = String(state[key]) === String(value);
            return (
              '<button type="button" data-group="' + key + '" data-value="' + value + '" class="' + (active ? "is-active" : "") + '" aria-pressed="' + active + '">' +
                labels.map(value) +
              "</button>"
            );
          })
          .join("") +
      "</div>"
    );
  }

  function renderOptions() {
    const type = getType();
    const trim = getTrim();
    const minW = getMinWindows();
    const maxW = getMaxWindows();

    const insulation = segmented("insulation", type.availableInsulation, {
      title: "Утепление",
      map: (value) => value + " мм",
    });

    const windows =
      '<div class="stepper">' +
        '<button type="button" data-window="-1" aria-label="Меньше окон"' + (state.windows <= minW ? " disabled" : "") + ">−</button>" +
        '<output aria-live="polite">' + state.windows + "</output>" +
        '<button type="button" data-window="1" aria-label="Больше окон"' + (state.windows >= maxW ? " disabled" : "") + ">+</button>" +
      "</div>";

    const door = segmented("door", ["metal", "insulated", "glass"], {
      title: "Дверь",
      map: (value) => LABELS.door[value],
    });
    const electric = segmented("electric", ["none", "basic", "full"], {
      title: "Электрика",
      map: (value) => LABELS.electric[value],
    });
    const finish = segmented("finish", ["osb", "lining", "pvc"], {
      title: "Внутренняя отделка",
      map: (value) => LABELS.finish[value],
    });
    const roof = segmented("roof", ["profnastil", "metal"], {
      title: "Кровля",
      map: (value) => LABELS.roof[value],
    });
    const terrace = segmented("terrace", ["none", "3", "6"], {
      title: "Терраса",
      map: (value) => LABELS.terrace[value],
    });

    optionsEl.innerHTML = [
      optionRow("Утепление", "минвата, контур стены", insulation, deltaLabel(getOptionDelta("insulation"))),
      optionRow("Окна", "ПВХ, 1,2 × 1,2 м · от " + (trim.included.windows || 0) + " шт.", windows, deltaLabel(getOptionDelta("windows"))),
      optionRow("Дверь", "входная группа", door, deltaLabel(getOptionDelta("door"))),
      optionRow("Электрика", "розетки, свет, щит", electric, deltaLabel(getOptionDelta("electric"))),
      optionRow("Отделка", "внутренняя обшивка", finish, deltaLabel(getOptionDelta("finish"))),
      optionRow("Кровля", "внешнее покрытие", roof, deltaLabel(getOptionDelta("roof"))),
      optionRow("Терраса", "летняя площадка", terrace, deltaLabel(getOptionDelta("terrace"))),
      '<div class="option">' +
        '<div class="option__head"><span class="option__label">Доставка и монтаж</span><span class="option__hint">по Саратову, с выравниванием</span></div>' +
        '<div class="option__control">' +
          '<span class="option__price">' + (state.delivery ? formatMoney(DELIVERY_PRICE) : "не включена") + "</span>" +
          '<label class="switch"><input type="checkbox" id="deliverySwitch" aria-label="Доставка и монтаж по Саратову"' + (state.delivery ? " checked" : "") + '><span class="switch__track"></span></label>' +
        "</div>" +
      "</div>",
    ].join("");
  }

  function optionRow(label, hint, control, price) {
    return (
      '<div class="option">' +
        '<div class="option__head"><span class="option__label">' + label + '</span><span class="option__hint">' + hint + "</span></div>" +
        '<div class="option__control">' + control + '<span class="option__price">' + price + "</span></div>" +
      "</div>"
    );
  }

  /* ---------- Превью ---------- */

  function buildPreview() {
    const type = getType();
    const size = getSize();
    const trim = getTrim();
    const palette = trim.preview;
    const isHouse = state.type === "house";

    const ground = 330;
    const bodyH = isHouse ? 206 : 176;
    const bodyW = Math.round(250 + Math.min(160, (size.l / 12) * 160));
    const terraceW = state.terrace === "3" ? 78 : state.terrace === "6" ? 112 : 0;
    const totalW = bodyW + (terraceW ? terraceW + 8 : 0);
    const x0 = Math.round((560 - totalW) / 2);
    const top = ground - bodyH;
    const roofH = 38;
    const doorW = 46;
    const doorH = isHouse ? 114 : 102;
    const doorX = x0 + 26;
    const winY = top + (isHouse ? 50 : 40);
    const winH = isHouse ? 54 : 46;
    const winCount = state.windows;
    const winStart = doorX + doorW + 22;
    const winEnd = x0 + bodyW - 22;
    const avail = Math.max(40, winEnd - winStart);
    let winW = 52;
    let gap = 16;
    if (winCount > 0 && winCount * winW + (winCount - 1) * gap > avail) {
      gap = 9;
      winW = Math.max(24, Math.floor((avail - (winCount - 1) * gap) / winCount));
    }
    const winGroupW = winCount > 0 ? winCount * winW + (winCount - 1) * gap : 0;
    const winX = winStart + Math.max(0, (avail - winGroupW) / 2);

    let corrugation = "";
    for (let x = x0 + 9; x < x0 + bodyW - 7; x += 13) {
      corrugation += '<line x1="' + x + '" y1="' + (top + 5) + '" x2="' + x + '" y2="' + (ground - 5) + '"/>';
    }

    let windowsSvg = "";
    for (let i = 0; i < winCount; i += 1) {
      const wx = winX + i * (winW + gap);
      windowsSvg +=
        "<g>" +
          '<rect x="' + wx + '" y="' + winY + '" width="' + winW + '" height="' + winH + '" rx="1" fill="#171b1e"/>' +
          '<rect x="' + (wx + 3) + '" y="' + (winY + 3) + '" width="' + (winW - 6) + '" height="' + (winH - 6) + '" fill="#a9c4d2"/>' +
          '<path d="M' + (wx + 6) + " " + (winY + winH - 8) + " L" + (wx + winW - 8) + " " + (winY + 7) + '" stroke="rgba(255,255,255,.42)" stroke-width="1.5"/>' +
          '<line x1="' + (wx + winW / 2) + '" y1="' + (winY + 3) + '" x2="' + (wx + winW / 2) + '" y2="' + (winY + winH - 3) + '" stroke="#171b1e" stroke-width="1.2"/>' +
          '<rect x="' + (wx - 3) + '" y="' + (winY + winH) + '" width="' + (winW + 6) + '" height="3" fill="#d8d3c7"/>' +
        "</g>";
    }

    let terraceSvg = "";
    if (terraceW) {
      const tx = x0 + bodyW;
      const deckTop = ground - 4;
      let balusters = "";
      for (let bx = tx + 8; bx < tx + terraceW - 4; bx += 13) {
        balusters += '<line x1="' + bx + '" y1="' + (deckTop - 6) + '" x2="' + bx + '" y2="' + (deckTop - 54) + '"/>';
      }
      terraceSvg =
        "<g>" +
          '<rect x="' + tx + '" y="' + deckTop + '" width="' + terraceW + '" height="8" fill="#9b7c58"/>' +
          '<rect x="' + tx + '" y="' + (deckTop + 8) + '" width="' + terraceW + '" height="7" fill="#7c6247"/>' +
          '<line x1="' + tx + '" y1="' + (deckTop - 58) + '" x2="' + (tx + terraceW) + '" y2="' + (deckTop - 58) + '" stroke="#3b3e41" stroke-width="3"/>' +
          '<g stroke="#4b4e51" stroke-width="1.5">' + balusters + "</g>" +
          '<rect x="' + (tx + terraceW - 6) + '" y="' + (deckTop - 60) + '" width="6" height="64" fill="#33373a"/>' +
          '<rect x="' + tx + '" y="' + (top + 18) + '" width="' + (terraceW + 6) + '" height="5" fill="' + palette.roof + '"/>' +
          '<line x1="' + (tx + terraceW) + '" y1="' + (top + 23) + '" x2="' + (tx + terraceW) + '" y2="' + (deckTop - 58) + '" stroke="#33373a" stroke-width="4"/>' +
          '<text x="' + (tx + terraceW / 2) + '" y="' + (ground + 22) + '" fill="#7f817a" font-size="8" font-family="Manrope, Arial, sans-serif" text-anchor="middle" letter-spacing="1.5">ТЕРРАСА</text>' +
        "</g>";
    }

    const lengthM = formatDim(size.l) + " м";
    const heightLabel = isHouse ? "ВЫСОТА 3,2 М" : "ВЫСОТА 2,7 М";

    return (
      '<svg viewBox="0 0 560 420" role="img" aria-label="' + type.name + " " + formatDim(size.l) + " на " + formatDim(size.w) + " метра, комплектация " + trim.name + '">' +
        "<defs>" +
          '<pattern id="previewGrid" width="20" height="20" patternUnits="userSpaceOnUse">' +
            '<path d="M20 0H0V20" fill="none" stroke="rgba(247,244,238,.055)" stroke-width="1"/>' +
          "</pattern>" +
        "</defs>" +
        '<rect width="560" height="420" fill="url(#previewGrid)"/>' +
        '<ellipse cx="' + (x0 + totalW / 2) + '" cy="' + (ground + 16) + '" rx="' + (totalW / 2 + 24) + '" ry="14" fill="rgba(0,0,0,.25)"/>' +
        '<line x1="' + (x0 - 24) + '" y1="' + (ground + 18) + '" x2="' + (x0 + bodyW + terraceW + 18) + '" y2="' + (ground + 18) + '" stroke="rgba(247,244,238,.16)" stroke-width="1" stroke-dasharray="3 5"/>' +

        terraceSvg +

        '<g fill="#8f8c83">' +
          '<rect x="' + (x0 + 16) + '" y="' + (ground + 2) + '" width="46" height="16" rx="1"/>' +
          '<rect x="' + (x0 + bodyW / 2 - 23) + '" y="' + (ground + 2) + '" width="46" height="16" rx="1"/>' +
          '<rect x="' + (x0 + bodyW - 62) + '" y="' + (ground + 2) + '" width="46" height="16" rx="1"/>' +
        "</g>" +

        '<rect x="' + x0 + '" y="' + top + '" width="' + bodyW + '" height="' + bodyH + '" fill="' + palette.wall + '" stroke="' + palette.edge + '" stroke-width="1.5"/>' +
        '<g stroke="' + palette.line + '" stroke-width="1">' + corrugation + "</g>" +
        '<rect x="' + x0 + '" y="' + (ground - 5) + '" width="' + bodyW + '" height="5" fill="' + palette.edge + '"/>' +

        '<path d="M ' + (x0 - 20) + " " + top + " L " + (x0 + bodyW / 2) + " " + (top - roofH) + " L " + (x0 + bodyW + 20) + " " + top + ' Z" fill="' + palette.roof + '" stroke="#111315" stroke-width="1.5"/>' +
        '<path d="M ' + (x0 - 20) + " " + top + " L " + (x0 + bodyW + 20) + " " + top + '" stroke="#0d0f10" stroke-width="3"/>' +
        '<path d="M ' + (x0 - 12) + " " + top + " L " + (x0 + bodyW + 12) + " " + top + '" stroke="#f28a1e" stroke-width="1.5" opacity=".65"/>' +
        '<path d="M ' + (x0 + bodyW / 2) + " " + (top - roofH) + " L " + (x0 + bodyW / 2) + " " + (top - 1) + '" stroke="rgba(255,255,255,.08)" stroke-width="1"/>' +
        '<rect x="' + (x0 - 10) + '" y="' + (top + 4) + '" width="' + (bodyW + 20) + '" height="4" fill="rgba(0,0,0,.18)"/>' +

        windowsSvg +

        "<g>" +
          '<rect x="' + doorX + '" y="' + (ground - doorH) + '" width="' + doorW + '" height="' + doorH + '" fill="#f28a1e" stroke="#1a1d20" stroke-width="1.5"/>' +
          '<rect x="' + (doorX + 14) + '" y="' + (ground - doorH + 13) + '" width="18" height="26" fill="#a9c4d2" stroke="#1a1d20" stroke-width="1"/>' +
          '<rect x="' + (doorX + 7) + '" y="' + (ground - doorH + 50) + '" width="' + (doorW - 14) + '" height="' + (doorH - 60) + '" fill="none" stroke="rgba(22,24,26,.28)" stroke-width="1"/>' +
          '<circle cx="' + (doorX + doorW - 9) + '" cy="' + (ground - doorH / 2) + '" r="2.2" fill="#1a1d20"/>' +
        "</g>" +

        '<g stroke="#6c6f68" stroke-width="1">' +
          '<line x1="' + x0 + '" y1="' + (ground + 46) + '" x2="' + (x0 + bodyW) + '" y2="' + (ground + 46) + '"/>' +
          '<line x1="' + x0 + '" y1="' + (ground + 40) + '" x2="' + x0 + '" y2="' + (ground + 52) + '"/>' +
          '<line x1="' + (x0 + bodyW) + '" y1="' + (ground + 40) + '" x2="' + (x0 + bodyW) + '" y2="' + (ground + 52) + '"/>' +
        "</g>" +
        '<rect x="' + (x0 + bodyW / 2 - 27) + '" y="' + (ground + 54) + '" width="54" height="19" rx="3" fill="#181b1e"/>' +
        '<text x="' + (x0 + bodyW / 2) + '" y="' + (ground + 67) + '" fill="#d8d4c9" font-size="10" font-weight="700" font-family="Manrope, Arial, sans-serif" text-anchor="middle">' + lengthM + "</text>" +
        '<text x="' + (x0 + bodyW + terraceW) + '" y="' + (ground + 67) + '" fill="#6f726b" font-size="8" font-family="Manrope, Arial, sans-serif" text-anchor="end" letter-spacing="1">' + heightLabel + '</text>' +
      "</svg>"
    );
  }

  /* ---------- Обновление сводки ---------- */

  let displayedPrice = 0;
  let priceFrame = null;

  function animatePrice(to) {
    if (!priceValue) return;
    if (reduceMotion || !displayedPrice) {
      displayedPrice = to;
      priceValue.textContent = formatMoney(to);
      return;
    }
    if (priceFrame) cancelAnimationFrame(priceFrame);
    const from = displayedPrice;
    const start = performance.now();
    const duration = 300;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(from + (to - from) * eased);
      priceValue.textContent = formatMoney(value);
      if (progress < 1) {
        priceFrame = requestAnimationFrame(tick);
      } else {
        displayedPrice = to;
        priceValue.textContent = formatMoney(to);
      }
    };
    priceFrame = requestAnimationFrame(tick);
  }

  function updateSummary() {
    const result = calculate();
    const type = getType();
    const trim = getTrim();
    const size = getSize();

    if (previewLabel) previewLabel.textContent = type.name + " · " + trim.name;
    if (previewArea) previewArea.textContent = formatArea(result.area) + " м²";
    if (leadTimeEl) leadTimeEl.textContent = type.leadTime;
    if (summaryBadges) {
      summaryBadges.innerHTML = [type.name, trim.name, formatDim(size.l) + " × " + formatDim(size.w) + " м"]
        .map((label) => "<span>" + label + "</span>")
        .join("");
    }

    if (previewEl) previewEl.innerHTML = '<div class="preview__wrap">' + buildPreview() + "</div>";

    if (breakdownEl) {
      breakdownEl.innerHTML = result.items
        .map(
          (item) =>
            '<div class="breakdown__row' + (item.kind ? " breakdown__row--" + item.kind : "") + '">' +
              "<span>" + item.label + "</span>" +
              "<b>" + (item.value < 0 ? "−" : "") + fmt.format(Math.abs(item.value)) + " ₽</b>" +
            "</div>"
        )
        .join("");
    }

    animatePrice(result.total);
  }

  function renderAll(focus) {
    renderTypes();
    renderSizes();
    renderTrims();
    renderOptions();
    updateSummary();
    if (focus) {
      const el = $(focus);
      if (el) el.focus({ preventScroll: true });
    }
  }

  function syncFromTrim() {
    const trim = getTrim();
    Object.keys(trim.included).forEach((key) => {
      state[key] = trim.included[key];
    });
    clampWindows();
  }

  function setType(key) {
    if (!TYPES[key] || state.type === key) return;
    state.type = key;
    state.trim = "standard";
    if (key === "house") {
      state.trim = "base";
      state.size = "9x3";
    } else {
      state.size = "6x2.4";
    }
    syncFromTrim();
    renderAll('[data-type="' + key + '"]');
  }

  function setTrim(id) {
    if (!getType().trims.some((trim) => trim.id === id)) return;
    state.trim = id;
    syncFromTrim();
    renderAll('[data-trim="' + id + '"]');
  }

  /* ---------- События конфигуратора ---------- */

  typeGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-type]");
    if (button) setType(button.dataset.type);
  });

  sizeGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-size]");
    if (!button) return;
    state.size = button.dataset.size;
    clampWindows();
    renderAll('[data-size="' + state.size + '"]');
  });

  trimGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-trim]");
    if (button) setTrim(button.dataset.trim);
  });

  optionsEl.addEventListener("click", (event) => {
    const groupButton = event.target.closest("[data-group]");
    if (groupButton) {
      const key = groupButton.dataset.group;
      const raw = groupButton.dataset.value;
      state[key] = ["insulation", "windows"].includes(key) ? Number(raw) : raw;
      renderOptions();
      updateSummary();
      const active = $('[data-group="' + key + '"][data-value="' + raw + '"]');
      if (active) active.focus({ preventScroll: true });
      return;
    }

    const stepButton = event.target.closest("[data-window]");
    if (stepButton) {
      const step = Number(stepButton.dataset.window);
      state.windows = Math.max(getMinWindows(), Math.min(getMaxWindows(), state.windows + step));
      renderOptions();
      updateSummary();
      const nextStep = $('[data-window="' + step + '"]');
      if (nextStep && !nextStep.disabled) nextStep.focus({ preventScroll: true });
      else {
        const other = $('[data-window="' + (step > 0 ? -1 : 1) + '"]');
        if (other) other.focus({ preventScroll: true });
      }
    }
  });

  optionsEl.addEventListener("change", (event) => {
    if (event.target && event.target.id === "deliverySwitch") {
      state.delivery = event.target.checked;
      renderOptions();
      updateSummary();
      const sw = $("#deliverySwitch");
      if (sw) sw.focus({ preventScroll: true });
    }
  });

  // Быстрый выбор комплектации из каталога
  $$("[data-pick-trim]").forEach((button) => {
    button.addEventListener("click", () => {
      const typeKey = button.dataset.pickType || "bytovka";
      const trimId = button.dataset.pickTrim;
      state.type = typeKey;
      state.size = typeKey === "house" ? "9x3" : "6x2.4";
      state.trim = trimId;
      syncFromTrim();
      renderAll();
      document.getElementById("configurator").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---------- Текст расчёта / WhatsApp ---------- */

  function configText(includeContact) {
    const type = getType();
    const trim = getTrim();
    const size = getSize();
    const result = calculate();
    const lines = [
      (includeContact ? "Заявка с сайта" : "Предварительный расчёт") + " «Славянская Сталь»",
      "",
      "Тип: " + type.name,
      "Комплектация: " + trim.name,
      "Размер: " + formatDim(size.l) + " × " + formatDim(size.w) + " м (" + formatArea(result.area) + " м²)",
      "Утепление: " + state.insulation + " мм",
      "Окна: " + state.windows + " шт.",
      "Дверь: " + LABELS.door[state.door],
      "Электрика: " + LABELS.electric[state.electric],
      "Отделка: " + LABELS.finish[state.finish],
      "Кровля: " + LABELS.roof[state.roof],
      "Терраса: " + (state.terrace === "none" ? "нет" : LABELS.terrace[state.terrace]),
      "Доставка и монтаж: " + (state.delivery ? "да, по Саратову" : "нет"),
      "",
      "Предварительная стоимость: " + formatMoney(result.total),
      "Срок производства: " + type.leadTimeLong,
    ];

    if (includeContact) {
      const name = ($("#qf-name") && $("#qf-name").value.trim()) || "—";
      const phone = ($("#qf-phone") && $("#qf-phone").value.trim()) || "—";
      const comment = ($("#qf-comment") && $("#qf-comment").value.trim()) || "—";
      lines.push("", "Имя: " + name, "Телефон: " + phone, "Комментарий: " + comment);
    }

    lines.push("", "Расчёт предварительный, не является публичной офертой.", "Телефон: 8 927 100-23-24");
    return lines.join("\n");
  }

  const waLink = (text) => "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text);

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  const copyBtn = $("#copyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const text = configText(false);
      try {
        await navigator.clipboard.writeText(text);
        showToast("Расчёт скопирован — можно вставить в мессенджер");
      } catch (error) {
        const area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand("copy");
          showToast("Расчёт скопирован");
        } catch (err) {
          showToast("Не удалось скопировать. Позвоните: 8 927 100-23-24");
        }
        area.remove();
      }
    });
  }

  /* ---------- Модальное окно сметы ---------- */

  const quoteModal = $("#quoteModal");
  const quoteModalBody = $("#quoteModalBody");
  const quoteSuccess = $("#quoteSuccess");
  const quoteForm = $("#quoteForm");
  const modalSummary = $("#modalSummary");
  const quoteWaLink = $("#quoteWaLink");

  function renderModalSummary() {
    const type = getType();
    const trim = getTrim();
    const size = getSize();
    const result = calculate();
    const rows = [
      ["Тип и комплектация", type.name + " «" + trim.name + "»"],
      ["Размер", formatDim(size.l) + " × " + formatDim(size.w) + " м · " + formatArea(result.area) + " м²"],
      ["Утепление / окна", state.insulation + " мм · " + state.windows + " шт."],
      ["Дверь / электрика", LABELS.door[state.door] + " · " + LABELS.electric[state.electric]],
      ["Терраса", state.terrace === "none" ? "нет" : LABELS.terrace[state.terrace]],
      ["Доставка и монтаж", state.delivery ? "по Саратову" : "не включена"],
    ];
    modalSummary.innerHTML =
      rows.map((row) => '<div class="row"><span>' + row[0] + "</span><b>" + row[1] + "</b></div>").join("") +
      '<div class="row row--total"><span>Предварительно</span><b>' + formatMoney(result.total) + "</b></div>";
  }

  function openQuoteModal() {
    if (!quoteModal) return;
    renderModalSummary();
    quoteModalBody.hidden = false;
    quoteSuccess.hidden = true;
    if (!quoteModal.open) quoteModal.showModal();
  }

  const quoteBtn = $("#quoteBtn");
  if (quoteBtn) quoteBtn.addEventListener("click", openQuoteModal);

  // открыть/закрыть модалки и лайтбокс
  document.addEventListener("click", (event) => {
    const closer = event.target.closest("[data-close]");
    if (closer) {
      const dialog = closer.closest("dialog");
      if (dialog) dialog.close();
    }
  });

  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      if (!document.querySelector("dialog[open]")) document.body.classList.remove("modal-open");
    });
    const originalShow = dialog.showModal.bind(dialog);
    dialog.showModal = function () {
      originalShow();
      document.body.classList.add("modal-open");
    };
  });

  /* ---------- Валидация и отправка форм ---------- */

  function markInvalid(field, invalid) {
    field.classList.toggle("is-invalid", invalid);
    field.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  function validate(form) {
    let valid = true;
    $$("input[required], textarea[required]", form).forEach((field) => {
      if (field.type === "checkbox") {
        const wrap = field.closest(".checkbox");
        if (wrap) wrap.classList.toggle("is-invalid", !field.checked);
        if (!field.checked) valid = false;
        return;
      }
      let bad = !field.value.trim();
      if (field.type === "tel") {
        const digits = field.value.replace(/\D/g, "");
        bad = digits.length < 10;
      }
      markInvalid(field, bad);
      if (bad) valid = false;
    });
    return valid;
  }

  $$("form").forEach((form) => {
    form.addEventListener("input", (event) => {
      if (event.target.matches("input, textarea")) {
        event.target.classList.remove("is-invalid");
        event.target.setAttribute("aria-invalid", "false");
        const wrap = event.target.closest(".checkbox");
        if (wrap) wrap.classList.remove("is-invalid");
      }
    });
  });

  if (quoteForm) {
    quoteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validate(quoteForm)) {
        const status = $(".form-status", quoteForm);
        if (status) status.textContent = "Проверьте имя, телефон и согласие на обработку данных.";
        return;
      }
      const url = waLink(configText(true));
      quoteWaLink.href = url;
      window.open(url, "_blank", "noopener");
      quoteModalBody.hidden = true;
      quoteSuccess.hidden = false;
      quoteSuccess.scrollIntoView({ block: "nearest" });
    });
  }

  const contactForm = $("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validate(contactForm)) {
        const status = $(".form-status", contactForm);
        if (status) status.textContent = "Проверьте имя, телефон и согласие на обработку данных.";
        return;
      }
      const name = $("#cf-name").value.trim();
      const phone = $("#cf-phone").value.trim();
      const message = $("#cf-message").value.trim();
      const text = [
        "Заявка с сайта «Славянская Сталь»",
        "",
        "Имя: " + name,
        "Телефон: " + phone,
        "Задача: " + (message || "—"),
        "",
        "Отправитель с сайта, жду обратной связи.",
      ].join("\n");
      const url = waLink(text);
      window.open(url, "_blank", "noopener");
      const status = $(".form-status", contactForm);
      if (status) {
        status.innerHTML = 'Заявка сформирована. Если WhatsApp не открылся — <a href="' + url + '" target="_blank" rel="noopener">отправить вручную</a>.';
      }
      contactForm.reset();
    });
  }

  /* ---------- Лайтбокс ---------- */

  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxTitle = $("#lightboxTitle");
  const lightboxCaption = $("#lightboxCaption");

  $$(".work").forEach((work) => {
    work.addEventListener("click", () => {
      if (!lightbox) return;
      lightboxImg.src = work.dataset.img;
      lightboxImg.alt = work.dataset.title || "";
      lightboxTitle.textContent = work.dataset.title || "";
      lightboxCaption.textContent = work.dataset.caption || "";
      lightbox.showModal();
    });
  });

  /* ---------- Меню, шапка, якоря ---------- */

  const burger = $("#burger");
  const nav = $("#nav");

  function closeMenu() {
    document.body.classList.remove("nav-open");
    if (burger) {
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Открыть меню");
    }
  }

  const desktopQuery = window.matchMedia("(min-width: 1021px)");
  const onDesktop = (event) => {
    if (event.matches) closeMenu();
  };
  if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", onDesktop);

  if (burger) {
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    });
  }
  if (nav) {
    $$("a", nav).forEach((link) => link.addEventListener("click", closeMenu));
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) closeMenu();
  });

  const header = $("#header");
  const onScroll = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // активный пункт меню
  const navLinks = $$(".nav a[href^='#']");
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- Появление блоков ---------- */

  if ("IntersectionObserver" in window) {
    const revealer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    $$("[data-reveal]").forEach((el) => revealer.observe(el));
  } else {
    $$("[data-reveal]").forEach((el) => el.classList.add("is-revealed"));
  }

  /* ---------- Инициализация ---------- */

  syncFromTrim();
  renderAll();
  displayedPrice = calculate().total;
  if (priceValue) priceValue.textContent = formatMoney(displayedPrice);
})();
