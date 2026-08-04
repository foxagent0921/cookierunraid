(() => {
  "use strict";

  const GROUP_RATES = [
    4.57, 4.57, 9.15, 4.57, 14.13, 13.72, 4.57, 4.57, 4.57, 9.15,
    0.14, 0.14, 2.22, 4.57, 4.57, 14.14, 0.28, 0.09, 0.25,
  ];
  const HIGH_GRADE_GROUP_ID = 19;
  // 群組3的截圖項目機率合計僅62.12%，未完整揭露；相關計算需附上提醒。
  const INCOMPLETE_GROUP_ID = 3;
  const GRADE_LOW = "low";
  const GRADE_INTERMEDIATE = "intermediate";
  const GRADE_HIGH = "high";
  const MAX_AUTOCOMPLETE_RESULTS = 20;

  // 遊戲參數整理.txt 的推薦標記：** ＝想要的中級（藍字）能力，# ＝想要的低級（白字）能力。
  // 依等級分開存放，名稱對不上等級就不會被標記，可在啟動檢查時抓出兩邊不同步。
  const RECOMMENDED_ITEMS_BY_GRADE = new Map([
    [GRADE_INTERMEDIATE, new Set([
      "餅乾造成的傷害量增加41-50%",
      "黃色技能傷害量增加41-50%",
      "紅色技能傷害量增加41-50%",
      "藍色技能傷害量增加41-50%",
      "出現更多技能能量果凍",
      "果凍魔法師餅乾傷害量增加50%",
      "閃避大師餅乾傷害量增加50%",
      "2個果凍魔法師以上時餅乾傷害量增加50%",
      "2個閃避大師以上時餅乾傷害量增加50%",
    ])],
    [GRADE_LOW, new Set([
      "餅乾造成的傷害量增加21-30%",
      "餅乾造成的傷害量增加31-40%",
      "黃色技能傷害量增加21-30%",
      "黃色技能傷害量增加31-40%",
      "紅色技能傷害量增加21-30%",
      "紅色技能傷害量增加31-40%",
      "藍色技能傷害量增加21-30%",
      "藍色技能傷害量增加31-40%",
      "黃色技能能量獲得量+10-12%",
      "紅色技能能量獲得量+10-12%",
      "藍色技能能量獲得量+10-12%",
      "遊戲速度加快16-20%",
      "體力恢復量增加16-20%",
      "無視障礙物衝撞機率70%",
      "無視障礙物衝撞機率85%",
      "果凍魔法師餅乾傷害量增加30%",
      "果凍魔法師餅乾傷害量增加40%",
      "閃避大師餅乾傷害量增加30%",
      "閃避大師餅乾傷害量增加40%",
      "2個果凍魔法師以上時餅乾傷害量增加30%",
      "2個果凍魔法師以上時餅乾傷害量增加40%",
      "2個閃避大師以上時餅乾傷害量增加30%",
      "2個閃避大師以上時餅乾傷害量增加40%",
    ])],
  ]);

  const isRecommended = (name, grade) =>
    RECOMMENDED_ITEMS_BY_GRADE.get(grade)?.has(name) ?? false;

  const entry = (name, rate, grade = GRADE_LOW) => ({ name, rate, grade });
  const intermediateEntry = (name, rate) => entry(name, rate, GRADE_INTERMEDIATE);
  const ranged = (prefix, values, rates, intermediateIndexes = []) =>
    values.map((value, index) => entry(
      `${prefix}${value}`,
      rates[index],
      intermediateIndexes.includes(index) ? GRADE_INTERMEDIATE : GRADE_LOW,
    ));
  const group = (id, entries) => ({
    id,
    rate: GROUP_RATES[id - 1],
    entries: id === HIGH_GRADE_GROUP_ID
      ? entries.map((currentEntry) => ({ ...currentEntry, grade: GRADE_HIGH }))
      : entries,
  });

  const fiveTier = (prefix, values, normalRate, rareRate) =>
    ranged(prefix, values, [normalRate, normalRate, normalRate, normalRate, rareRate], [4]);

  const colorSeries = (prefix, values, rates) =>
    ["黃色", "紅色", "藍色"].flatMap((color) =>
      ranged(`${color}${prefix}`, values, rates, [values.length - 1]));

  const groups = [
    group(1, fiveTier(
      "餅乾造成的傷害量增加",
      ["1-10%", "11-20%", "21-30%", "31-40%", "41-50%"],
      24.24,
      3.03,
    )),
    group(2, fiveTier(
      "怪物造成的傷害量增加",
      ["1-10%", "11-20%", "21-30%", "31-40%", "41-50%"],
      24.24,
      3.03,
    )),
    group(3, [
      entry("餅乾體力增加1-10%", 12.12),
      entry("餅乾體力增加11-20%", 12.12),
      entry("餅乾體力增加21-30%", 12.12),
      entry("餅乾體力增加31-40%", 12.12),
      intermediateEntry("餅乾體力增加41-50%", 1.52),
      entry("餅乾所受傷害量減少1-10%", 12.12),
    ]),
    group(4, fiveTier(
      "怪物體力增加",
      ["1-8%", "9-16%", "17-24%", "25-32%", "33-40%"],
      24.24,
      3.03,
    )),
    group(5, [
      ...colorSeries(
        "技能傷害量增加",
        ["1-10%", "11-20%", "21-30%", "31-40%", "41-50%"],
        [1.96, 1.96, 1.96, 1.96, 0.20],
      ),
      ...colorSeries(
        "技能能量獲得量減少",
        ["1-3%", "4-6%", "7-9%", "10-12%", "13-15%"],
        [1.96, 1.96, 1.96, 1.96, 0.20],
      ),
      entry("出現技能能量果凍", 3.24),
      intermediateEntry("出現更多技能能量果凍", 0.20),
      ...colorSeries(
        "技能傷害量減少",
        ["1-3%", "4-6%", "7-9%", "10-12%", "13-15%"],
        [1.96, 1.96, 1.96, 1.96, 0.20],
      ),
      ...colorSeries(
        "技能能量獲得量+",
        ["1-3%", "4-6%", "7-9%", "10-12%", "13-15%"],
        [1.96, 1.96, 1.96, 1.96, 0.20],
      ),
    ]),
    group(6, colorSeries(
      "技能所受傷害量減少",
      ["1-5%", "6-10%", "11-15%", "16-20%", "21-25%"],
      [8.08, 8.08, 8.08, 8.08, 1.01],
    ).map((item) => ({ ...item, name: `怪物因${item.name}` }))),
    group(7, fiveTier(
      "餅乾所受傷害量增加",
      ["1-10%", "11-20%", "21-30%", "31-40%", "41-50%"],
      24.24,
      3.03,
    )),
    group(8, [
      entry("視野變狹窄", 24.24),
      entry("視野更狹窄", 24.24),
      entry("視野非常狹窄", 24.24),
      entry("視野超級狹窄", 24.24),
      intermediateEntry("視野極為狹窄", 3.03),
    ]),
    group(9, fiveTier(
      "遊戲速度加快",
      ["1-5%", "6-10%", "11-15%", "16-20%", "21-30%"],
      24.24,
      3.03,
    )),
    group(10, [
      ...ranged(
        "體力恢復量增加",
        ["1-5%", "6-10%", "11-15%", "16-20%", "21-25%"],
        [12.12, 12.12, 12.12, 12.12, 1.52],
        [4],
      ),
      ...ranged(
        "體力恢復量減少",
        ["1-3%", "4-6%", "7-9%", "10-11%", "12-14%"],
        [12.12, 12.12, 12.12, 12.12, 1.52],
        [4],
      ),
    ]),
    group(11, [intermediateEntry("套用強度150的磁力", 100.00)]),
    group(12, [intermediateEntry("跳躍次數增加3次", 100.00)]),
    group(13, [
      intermediateEntry("每隔一段時間獲得熊熊果凍派對道具", 6.25),
      entry("掉下普通果凍", 18.75),
      entry("掉下黃色熊熊果凍", 18.75),
      entry("掉下粉紅熊熊果凍", 18.75),
      entry("掉下冰塊熊熊果凍", 18.75),
      entry("掉下彩虹熊熊果凍", 18.75),
    ]),
    group(14, fiveTier(
      "暴擊傷害增加",
      ["40-50%", "50-60%", "60-70%", "70-80%", "80-100%"],
      24.24,
      3.03,
    )),
    group(15, fiveTier(
      "無視障礙物衝撞機率",
      ["40%", "55%", "70%", "85%", "100%"],
      24.24,
      3.03,
    )),
    group(16, [
      ...["盾牌守護者", "果凍魔法師", "閃避大師"].flatMap((job) =>
        ranged(
          `${job}餅乾傷害量增加`,
          ["10%", "20%", "30%", "40%", "50%"],
          [3.92, 3.92, 3.92, 3.92, 0.98],
          [4],
        )),
      ...ranged(
        "2個盾牌守護者以上時餅乾傷害量增加",
        ["10%", "20%", "30%", "40%", "50%"],
        [3.92, 3.92, 3.92, 3.92, 0.98],
        [4],
      ),
      ...ranged(
        "2個果凍魔法師以上時餅乾傷害量增加",
        ["10%", "20%", "30%", "40%", "50%"],
        [3.92, 3.92, 3.92, 3.92, 0.98],
        [4],
      ),
      ...ranged(
        "2個閃避大師以上時餅乾傷害量增加",
        ["10%", "20%", "30%", "40%", "50%"],
        [3.92, 3.92, 3.92, 3.92, 0.98],
        [4],
      ),
    ]),
    group(17, [
      intermediateEntry("每隔一段時間弱化怪物防禦力（維持7秒）", 50.00),
      intermediateEntry("每隔一段時間強化怪物防禦力（維持35秒）", 50.00),
    ]),
    group(18, [
      intermediateEntry("討伐時100%獲得鑽石砂糖結晶", 1.52),
      intermediateEntry("討伐時100%獲得金砂糖結晶", 7.58),
      intermediateEntry("討伐時100%獲得隨機技能寶石(S)", 15.15),
      intermediateEntry("討伐時100%獲得隨機技能寶石(A)", 30.30),
      intermediateEntry("討伐時100%獲得隨機技能寶石(B)", 45.45),
    ]),
    group(19, [
      entry("所有分數X2倍", 11.11),
      entry("餅乾所受傷害量X3倍", 11.11),
      entry("體力恢復量-15%", 11.11),
      entry("畫面變黑", 11.11),
      entry("果凍隱形", 11.11),
      entry("超級磁力", 11.11),
      entry("裁剪畫面", 11.11),
      entry("遮蔽畫面", 11.11),
      entry("遊戲速度加快，餅乾造成的傷害量增加30%", 11.11),
    ]),
  ];

  const rows = groups.flatMap((currentGroup) =>
    currentGroup.entries.map((currentEntry, index) => ({
      key: `${currentGroup.id}-${index}`,
      groupId: currentGroup.id,
      groupRate: currentGroup.rate,
      item: currentEntry.name,
      itemRate: currentEntry.rate,
      grade: currentEntry.grade,
      recommended: isRecommended(currentEntry.name, currentEntry.grade),
      isGroupStart: index === 0,
    })),
  );

  const elements = {
    lookupTab: document.querySelector("#lookup-tab"),
    strategyTab: document.querySelector("#strategy-tab"),
    lookupPanel: document.querySelector("#lookup-panel"),
    strategyPanel: document.querySelector("#strategy-panel"),
    form: document.querySelector("#filter-form"),
    search: document.querySelector("#search-input"),
    group: document.querySelector("#group-filter"),
    recommended: document.querySelector("#recommended-filter"),
    clear: document.querySelector("#clear-button"),
    body: document.querySelector("#parameter-body"),
    empty: document.querySelector("#empty-state"),
    resultCount: document.querySelector("#result-count"),
    strategyTargets: document.querySelector("#strategy-targets"),
    strategyCount: document.querySelector("#strategy-count"),
    strategyEmpty: document.querySelector("#strategy-empty"),
    strategyResult: document.querySelector("#strategy-result"),
  };

  if (Object.values(elements).some((element) => !element)) {
    console.error("頁面元件不完整，無法載入參數表格。");
    return;
  }

  const formatRate = (rate) => `${rate.toFixed(2)}%`;
  const normalize = (value) =>
    value
      .normalize("NFKC")
      .toLocaleLowerCase("zh-Hant")
      .replace(/[‐‑‒–—―~～〜]/g, "-")
      .replace(/[，、|｜]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const propertyLookup = new Map(rows.map((row) => [normalize(row.item), row]));
  const rowsByGroup = new Map(groups.map((currentGroup) => [
    currentGroup.id,
    rows.filter((row) => row.groupId === currentGroup.id),
  ]));

  const baseSlot = (id) => ({
    id,
    value: "",
    isOpen: false,
    activeIndex: -1,
    suggestions: [],
  });

  const createTargetSlot = (id, grade) => ({
    ...baseSlot(id),
    grade,
    idPrefix: "target",
    getCandidates: getTargetCandidates,
    renderFeedback: (slot) => updateTargetFeedback(slot),
    onSelect: () => {
      // 任一能力選定後，其他欄位的同群組候選能力必須立即排除。
      strategyTargetStates.forEach((current) => updateTargetFeedback(current));
      renderStrategy();
    },
  });

  // 釘選策略固定為 1 紫、1 藍、3 白；至少設定一個白字，其餘白字可留空。
  const strategyTargetStates = [
    createTargetSlot("purple", GRADE_HIGH),
    createTargetSlot("blue", GRADE_INTERMEDIATE),
    createTargetSlot("whiteA", GRADE_LOW),
    createTargetSlot("whiteB", GRADE_LOW),
    createTargetSlot("whiteC", GRADE_LOW),
  ];
  // 已確認的預設順序是先紫、再藍；仍保留切換功能供玩家比較其他兩釘組合。
  const strategyPinnedIds = new Set(["purple", "blue"]);
  const slotCollections = [() => strategyTargetStates];

  function addHighlightedText(container, text, tokens) {
    const usableTokens = [...new Set(tokens.filter(Boolean))]
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp);

    if (usableTokens.length === 0) {
      container.textContent = text;
      return;
    }

    const expression = new RegExp(`(${usableTokens.join("|")})`, "gi");
    let cursor = 0;

    for (const match of text.matchAll(expression)) {
      const index = match.index ?? 0;
      if (index > cursor) {
        container.append(document.createTextNode(text.slice(cursor, index)));
      }

      const marker = document.createElement("mark");
      marker.textContent = match[0];
      container.append(marker);
      cursor = index + match[0].length;
    }

    if (cursor < text.length) {
      container.append(document.createTextNode(text.slice(cursor)));
    }
  }

  function createCell(label, className = "") {
    const cell = document.createElement("td");
    cell.dataset.label = label;
    if (className) cell.className = className;
    return cell;
  }

  function getGradeLabel(row) {
    if (row.grade === GRADE_HIGH) return "高級";
    if (row.grade === GRADE_INTERMEDIATE) return "中級";
    return "低級";
  }

  function getGradeSearchText(row) {
    if (row.grade === GRADE_HIGH) return "高級 高級能力 高級屬性 301階以上必定出現";
    if (row.grade === GRADE_INTERMEDIATE) return "中級 中級能力 中級屬性 31階以上必定出現";
    return "低級 低級能力 低級屬性";
  }

  function getRecommendedLabel(row) {
    return row.grade === GRADE_INTERMEDIATE ? "★ 推薦藍字" : "★ 推薦白字";
  }

  function getRecommendedSearchText(row) {
    if (!row.recommended) return "";
    return row.grade === GRADE_INTERMEDIATE
      ? "推薦 推薦藍字 推薦中級 推薦目標 ★"
      : "推薦 推薦白字 推薦低級 推薦目標 ★";
  }

  function applyAbilityGrade(element, row) {
    element.classList.add(`ability-grade--${row.grade}`);
  }

  function appendAbilityBadges(container, row) {
    if (row.grade !== GRADE_LOW) {
      const badge = document.createElement("span");
      badge.className = `grade-label grade-label--${row.grade}`;
      badge.textContent = getGradeLabel(row);
      container.append(badge);
    }

    if (row.recommended) {
      const badge = document.createElement("span");
      badge.className = "grade-label grade-label--recommended";
      badge.textContent = "★推薦";
      container.append(badge);
    }
  }

  // 手機版把每個 td 變成兩欄格線，名稱與徽章必須包在同一個 inline 容器裡才不會各自佔一格。
  function createAbilityContent(row, highlightTokens = []) {
    const content = document.createElement("span");
    content.className = "ability-cell";
    addHighlightedText(content, row.item, highlightTokens);
    appendAbilityBadges(content, row);
    return content;
  }

  function createGroupIdentity(groupId) {
    const identity = document.createElement("span");
    identity.className = "group-identity";

    const badge = document.createElement("span");
    badge.className = "group-badge";
    badge.textContent = `群組 ${groupId}`;
    identity.append(badge);

    if (groupId === HIGH_GRADE_GROUP_ID) {
      const guarantee = document.createElement("span");
      guarantee.className = "guarantee-badge";
      guarantee.textContent = "高級・301階以上必定出現";
      identity.append(guarantee);
    }

    return identity;
  }

  function createRow(row, highlightTokens) {
    const tableRow = document.createElement("tr");
    tableRow.dataset.item = row.item;
    tableRow.dataset.grade = row.grade;
    tableRow.dataset.recommended = String(row.recommended);
    if (row.isGroupStart) tableRow.classList.add("group-start");
    if (row.recommended) tableRow.classList.add("is-recommended");

    const groupCell = createCell("群組");
    groupCell.append(createGroupIdentity(row.groupId));

    const groupRateCell = createCell("群組機率", "rate");
    groupRateCell.textContent = formatRate(row.groupRate);

    const itemCell = createCell("附加能力");
    applyAbilityGrade(itemCell, row);
    itemCell.append(createAbilityContent(row, highlightTokens));

    const itemRateCell = createCell("項目機率", "rate");
    itemRateCell.textContent = formatRate(row.itemRate);

    tableRow.append(groupCell, groupRateCell, itemCell, itemRateCell);
    return tableRow;
  }

  function populateGroupFilter() {
    const options = document.createDocumentFragment();

    groups.forEach((currentGroup) => {
      const option = document.createElement("option");
      option.value = String(currentGroup.id);
      const highGradeLabel = currentGroup.id === HIGH_GRADE_GROUP_ID
        ? "｜高級，301階以上必定出現"
        : "";
      option.textContent = `群組 ${currentGroup.id}（${formatRate(currentGroup.rate)}${highGradeLabel}）`;
      options.append(option);
    });

    elements.group.append(options);
  }

  function applyFilters() {
    const rawQuery = elements.search.value.trim();
    const queryTokens = normalize(rawQuery).split(" ").filter(Boolean);
    const highlightTokens = rawQuery.split(/\s+/).filter(Boolean);
    const selectedGroup = elements.group.value;
    const recommendedOnly = Boolean(elements.recommended.checked);

    const filteredRows = rows.filter((row) => {
      if (recommendedOnly && !row.recommended) return false;

      const matchesGroup = selectedGroup === "all" || String(row.groupId) === selectedGroup;
      if (!matchesGroup) return false;

      const searchable = normalize([
        `群組 ${row.groupId}`,
        `附加能力群組${row.groupId}`,
        formatRate(row.groupRate),
        row.item,
        formatRate(row.itemRate),
        getGradeSearchText(row),
        getRecommendedSearchText(row),
      ].join(" "));

      return queryTokens.every((token) => searchable.includes(token));
    });

    const fragment = document.createDocumentFragment();
    let previousGroup = null;

    filteredRows.forEach((row) => {
      fragment.append(createRow(
        { ...row, isGroupStart: row.groupId !== previousGroup },
        highlightTokens,
      ));
      previousGroup = row.groupId;
    });

    elements.body.replaceChildren(fragment);
    elements.empty.hidden = filteredRows.length !== 0;
    elements.resultCount.textContent = `顯示 ${filteredRows.length} / ${rows.length} 筆`;
    elements.clear.disabled = rawQuery === "" && selectedGroup === "all" && !recommendedOnly;
  }

  function clearFilters() {
    elements.search.value = "";
    elements.group.value = "all";
    elements.recommended.checked = false;
    applyFilters();
    elements.search.focus();
  }

  const TAB_VIEWS = [
    ["strategy", () => elements.strategyTab, () => elements.strategyPanel],
    ["lookup", () => elements.lookupTab, () => elements.lookupPanel],
  ];

  function activateTab(tabName, shouldFocus = false) {
    const activeName = TAB_VIEWS.some(([name]) => name === tabName) ? tabName : "strategy";
    closeAllAutocompletes();

    TAB_VIEWS.forEach(([name, getTab, getPanel]) => {
      const tab = getTab();
      const isActive = name === activeName;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      getPanel().hidden = !isActive;
      if (isActive && shouldFocus) tab.focus();
    });
  }

  function resolveProperty(value) {
    const normalizedValue = normalize(value);
    return normalizedValue ? propertyLookup.get(normalizedValue) ?? null : null;
  }

  // 紫字限群組19；藍字與白字都列出該等級的完整能力，推薦項目僅加上標記。
  // 所有欄位都會排除其他已選欄位占用的群組。
  function getTargetCandidates(slot) {
    const occupiedGroups = new Set(strategyTargetStates
      .filter((current) => current.id !== slot.id)
      .map((current) => resolveProperty(current.value))
      .filter(Boolean)
      .map((row) => row.groupId));

    return rows.filter((row) => {
      if (occupiedGroups.has(row.groupId)) return false;
      if (slot.grade === GRADE_HIGH) {
        return row.groupId === HIGH_GRADE_GROUP_ID && row.grade === GRADE_HIGH;
      }
      if (slot.grade === GRADE_INTERMEDIATE) {
        return row.grade === GRADE_INTERMEDIATE;
      }
      return row.grade === GRADE_LOW;
    });
  }

  function getAutocompleteMatches(slot) {
    const query = normalize(slot.value);
    const tokens = query.split(" ").filter(Boolean);

    const matches = slot.getCandidates(slot)
      .map((row) => {
        const normalizedItem = normalize(row.item);
        const searchable = normalize([
          row.item,
          `群組 ${row.groupId}`,
          `群組${row.groupId}`,
          formatRate(row.groupRate),
          formatRate(row.itemRate),
          getGradeSearchText(row),
          getRecommendedSearchText(row),
        ].join(" "));

        if (!tokens.every((token) => searchable.includes(token))) return null;

        let score = 3;
        if (!query) score = 4;
        else if (normalizedItem === query) score = 0;
        else if (normalizedItem.startsWith(query)) score = 1;
        else if (tokens.every((token) => normalizedItem.includes(token))) score = 2;

        return {
          row,
          score,
        };
      })
      .filter(Boolean)
      .sort((left, right) =>
        left.score - right.score
        || left.row.groupId - right.row.groupId
        || left.row.item.localeCompare(right.row.item, "zh-Hant"));

    // 藍字與白字欄位依需求顯示排除後的完整列表；其他自動完成仍限制首批筆數。
    const visible = slot.grade !== GRADE_HIGH
      ? matches
      : matches.slice(0, MAX_AUTOCOMPLETE_RESULTS);
    return { total: matches.length, visible };
  }

  function closeAutocomplete(slot) {
    slot.isOpen = false;
    slot.activeIndex = -1;
    slot.suggestions = [];

    if (slot.input && slot.listbox) {
      slot.input.setAttribute("aria-expanded", "false");
      slot.input.setAttribute("aria-activedescendant", "");
      slot.listbox.hidden = true;
      slot.listbox.replaceChildren();
    }
  }

  function closeAllAutocompletes(excludedSlotId = null) {
    slotCollections.forEach((getSlots) => {
      getSlots().forEach((slot) => {
        if (slot.id !== excludedSlotId) closeAutocomplete(slot);
      });
    });
  }

  function selectAutocompleteRow(slot, row) {
    // 候選清單已套用該欄位的所有排除規則，不在清單內就代表這個選擇不合法。
    if (!slot.getCandidates(slot).includes(row)) return;

    slot.value = row.item;
    if (slot.input) slot.input.value = row.item;
    if (slot.feedback) slot.renderFeedback(slot);
    closeAutocomplete(slot);
    slot.onSelect(slot, row);
  }

  function createAutocompleteOption(slot, suggestion, index) {
    const { row } = suggestion;
    const option = document.createElement("button");
    option.id = `${slot.idPrefix}-option-${slot.id}-${index}`;
    option.className = "autocomplete-option";
    option.type = "button";
    option.tabIndex = -1;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(index === slot.activeIndex));

    if (index === slot.activeIndex) option.classList.add("is-active");

    const name = document.createElement("span");
    name.className = "autocomplete-option__name";
    name.textContent = row.item;
    applyAbilityGrade(name, row);

    const meta = document.createElement("span");
    meta.className = "autocomplete-option__meta";
    meta.textContent = `群組 ${row.groupId}｜群組機率 ${formatRate(row.groupRate)}｜群組內機率 ${formatRate(row.itemRate)}`;

    const badges = document.createElement("span");
    badges.className = "autocomplete-option__badges";

    if (row.grade === GRADE_HIGH) {
      const highGrade = document.createElement("span");
      highGrade.className = "autocomplete-tag autocomplete-tag--high";
      highGrade.textContent = "高級・301階以上必定出現";
      badges.append(highGrade);
    } else if (row.grade === GRADE_INTERMEDIATE) {
      const intermediateGrade = document.createElement("span");
      intermediateGrade.className = "autocomplete-tag autocomplete-tag--intermediate";
      intermediateGrade.textContent = "中級・31階以上必定出現";
      badges.append(intermediateGrade);
    }

    if (row.recommended) {
      const recommended = document.createElement("span");
      recommended.className = "autocomplete-tag autocomplete-tag--recommended";
      recommended.textContent = getRecommendedLabel(row);
      badges.append(recommended);
    }

    option.append(name, meta, badges);
    option.addEventListener("click", () => selectAutocompleteRow(slot, row));
    return option;
  }

  function renderAutocomplete(slot) {
    if (!slot.input || !slot.listbox) return;

    const matches = getAutocompleteMatches(slot);
    slot.suggestions = matches.visible;

    if (slot.activeIndex >= slot.suggestions.length) {
      slot.activeIndex = -1;
    }

    slot.input.setAttribute("aria-expanded", String(slot.isOpen));
    slot.listbox.hidden = !slot.isOpen;

    if (!slot.isOpen) {
      slot.listbox.replaceChildren();
      slot.input.setAttribute("aria-activedescendant", "");
      return;
    }

    const content = document.createDocumentFragment();

    if (slot.suggestions.length === 0) {
      const empty = document.createElement("p");
      empty.className = "autocomplete-empty";
      empty.textContent = "找不到符合的屬性，請嘗試其他關鍵字。";
      content.append(empty);
    } else {
      slot.suggestions.forEach((suggestion, index) => {
        content.append(createAutocompleteOption(slot, suggestion, index));
      });
    }

    if (matches.total > matches.visible.length) {
      const footer = document.createElement("p");
      footer.className = "autocomplete-footer";
      footer.textContent = `顯示前 ${matches.visible.length} 筆，共 ${matches.total} 筆；請輸入更多關鍵字縮小範圍。`;
      content.append(footer);
    }

    slot.listbox.replaceChildren(content);
    const activeOptionId = slot.activeIndex >= 0
      ? `${slot.idPrefix}-option-${slot.id}-${slot.activeIndex}`
      : "";
    slot.input.setAttribute("aria-activedescendant", activeOptionId);
    if (slot.activeIndex >= 0) {
      slot.listbox.children[slot.activeIndex]?.scrollIntoView?.({ block: "nearest" });
    }
  }

  function moveAutocompleteSelection(slot, direction) {
    if (!slot.isOpen) slot.isOpen = true;

    const matches = getAutocompleteMatches(slot);
    slot.suggestions = matches.visible;
    const enabledIndexes = slot.suggestions.map((suggestion, index) => index);

    if (enabledIndexes.length === 0) {
      slot.activeIndex = -1;
      renderAutocomplete(slot);
      return;
    }

    const currentPosition = enabledIndexes.indexOf(slot.activeIndex);
    const nextPosition = currentPosition === -1
      ? (direction > 0 ? 0 : enabledIndexes.length - 1)
      : (currentPosition + direction + enabledIndexes.length) % enabledIndexes.length;
    slot.activeIndex = enabledIndexes[nextPosition];
    renderAutocomplete(slot);
  }

  function handleAutocompleteKeydown(event, slot) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveAutocompleteSelection(slot, event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Enter" && slot.isOpen && slot.activeIndex >= 0) {
      event.preventDefault();
      const activeSuggestion = slot.suggestions[slot.activeIndex];
      if (activeSuggestion) selectAutocompleteRow(slot, activeSuggestion.row);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeAutocomplete(slot);
      return;
    }

    if (event.key === "Tab") closeAutocomplete(slot);
  }

  // ---- 釘選策略評估 ----
  // 模型：1 紫（群組19指定內容）＋1 藍（任意中級能力）＋1～3 白（任意低級能力）。
  // 任選兩個已設定欄位視為已釘住，精確計算其餘三個實際欄位的聯合機率。
  const STRATEGY_FIELDS = [
    {
      id: "purple",
      label: "1. 紫字目標能力（只限群組19）",
      placeholder: "輸入紫字內容，從群組19的 9 個高級能力選擇",
    },
    {
      id: "blue",
      label: "2. 藍字能力",
      placeholder: "輸入藍字內容（完整列表，★ 為推薦能力）",
    },
    {
      id: "whiteA",
      label: "3. 白字能力 1",
      placeholder: "輸入白字內容（完整列表，★ 為推薦能力）",
    },
    {
      id: "whiteB",
      label: "4. 白字能力 2（選填）",
      placeholder: "可留空；輸入後會一併納入計算",
    },
    {
      id: "whiteC",
      label: "5. 白字能力 3（選填）",
      placeholder: "可留空；輸入後會一併納入計算",
    },
  ];
  const STRATEGY_FIELD_LABELS = new Map([
    ["purple", "紫字"],
    ["blue", "藍字"],
    ["whiteA", "白字1"],
    ["whiteB", "白字2"],
    ["whiteC", "白字3"],
  ]);
  const formatRolls = (value) => Math.round(value).toLocaleString("en-US");
  const formatPoints = (value) => `${Math.round(value).toLocaleString("en-US")} 點`;
  const formatProbability = (rate) => {
    const percent = rate * 100;
    return `${percent.toFixed(percent < 0.01 ? 6 : 4)}%`;
  };

  function getRowsForGrade(groupId, grade) {
    return (rowsByGroup.get(groupId) ?? []).filter((row) => row.grade === grade);
  }

  function getItemRateInGrade(row) {
    const gradeRows = getRowsForGrade(row.groupId, row.grade);
    const total = gradeRows.reduce((sum, row) => sum + row.itemRate, 0);
    return total > 0 ? row.itemRate / total : 0;
  }

  function getConditionalGroupRate(groupId, grade, excludedGroups) {
    const available = groups.filter((currentGroup) =>
      !excludedGroups.has(currentGroup.id)
      && getRowsForGrade(currentGroup.id, grade).length > 0);
    const total = available.reduce((sum, currentGroup) => sum + currentGroup.rate, 0);
    const target = available.find((currentGroup) => currentGroup.id === groupId);
    return target && total > 0 ? target.rate / total : 0;
  }

  // 白字欄位沒有位置差異：指定能力可出現在任一未釘白字格。
  // 只設定兩個白字時，剩下的白字格視為不限能力，但它抽到的群組仍會排除後續群組。
  function getWhiteTargetSetRate(targetRows, usedGroups, slotsLeft) {
    if (targetRows.length === 0) return 1;
    if (slotsLeft < targetRows.length || slotsLeft <= 0) return 0;

    const availableGroups = groups.filter((currentGroup) =>
      !usedGroups.has(currentGroup.id)
      && getRowsForGrade(currentGroup.id, GRADE_LOW).length > 0);
    const totalGroupRate = availableGroups.reduce((sum, currentGroup) => sum + currentGroup.rate, 0);
    if (totalGroupRate <= 0) return 0;

    let result = 0;
    availableGroups.forEach((currentGroup) => {
      const groupRate = currentGroup.rate / totalGroupRate;
      const targetIndex = targetRows.findIndex((row) => row.groupId === currentGroup.id);
      const nextUsed = new Set(usedGroups);
      nextUsed.add(currentGroup.id);

      if (targetIndex >= 0) {
        // 抽到目標群組但沒有命中指定內容時，該群組已被占用，之後不可能補回目標。
        const target = targetRows[targetIndex];
        const nextTargets = targetRows.filter((_, index) => index !== targetIndex);
        result += groupRate
          * getItemRateInGrade(target)
          * getWhiteTargetSetRate(nextTargets, nextUsed, slotsLeft - 1);
        return;
      }

      // 非目標群組中的任何低級能力都可接受，項目機率合計為 100%。
      result += groupRate * getWhiteTargetSetRate(targetRows, nextUsed, slotsLeft - 1);
    });
    return result;
  }

  function updateTargetFeedback(slot) {
    const feedback = slot.feedback;
    if (!feedback) return;

    const value = slot.value.trim();
    const matched = resolveProperty(value);
    feedback.className = "property-slot__feedback";

    if (!value) {
      feedback.textContent = slot.grade === GRADE_HIGH
        ? "請輸入紫字內容，並從群組19的建議清單選取。"
        : slot.grade === GRADE_INTERMEDIATE
          ? "請從全部藍字能力中選擇；★ 只代表推薦標記。"
          : slot.id !== "whiteA"
            ? "選填：可從全部白字能力中選擇，★ 代表推薦能力。"
            : "請從全部白字能力中選擇；★ 只代表推薦標記。";
      return;
    }
    if (!matched) {
      feedback.textContent = "尚未找到完整屬性，請繼續輸入或從清單選取。";
      feedback.classList.add("is-invalid");
      return;
    }
    const isValidHigh = slot.grade === GRADE_HIGH
      && matched.groupId === HIGH_GRADE_GROUP_ID
      && matched.grade === GRADE_HIGH;
    const isValidBlue = slot.grade === GRADE_INTERMEDIATE
      && matched.grade === GRADE_INTERMEDIATE;
    const isValidWhite = slot.grade === GRADE_LOW && matched.grade === GRADE_LOW;
    if (!isValidHigh && !isValidBlue && !isValidWhite) {
      feedback.textContent = slot.grade === GRADE_HIGH
        ? "紫字目標只允許群組19的高級能力。"
        : slot.grade === GRADE_INTERMEDIATE
          ? "藍字目標只允許中級能力；推薦與非推薦能力皆可選。"
          : "白字目標只允許低級能力；推薦與非推薦能力皆可選。";
      feedback.classList.add("is-invalid");
      return;
    }

    const groupOwner = strategyTargetStates.find((current) => {
      if (current.id === slot.id) return false;
      return resolveProperty(current.value)?.groupId === matched.groupId;
    });
    if (groupOwner) {
      feedback.textContent = `群組${matched.groupId}已被「${STRATEGY_FIELD_LABELS.get(groupOwner.id)}」占用，請選擇其他群組的能力。`;
      feedback.classList.add("is-invalid");
      return;
    }

    const itemRate = getItemRateInGrade(matched);
    // 總命中率＝先抽中該群組再抽中該能力，群組機率為百分比需先轉回小數。
    const totalRate = (matched.groupRate / 100) * itemRate;
    feedback.textContent = matched.grade === GRADE_HIGH
      ? `群組19｜指定能力命中率 ${formatProbability(itemRate)}｜高級・301階以上必定出現`
      : `群組${matched.groupId}｜群組機率 ${formatRate(matched.groupRate)}`
        + `｜群組內指定能力命中率 ${formatProbability(itemRate)}`
        + `｜總命中率 ${formatProbability(totalRate)}`;
    // 群組3的截圖資料不完整（項目合計僅62.12%），重新正規化後的命中率可能偏高。
    if (matched.groupId === INCOMPLETE_GROUP_ID) {
      feedback.textContent += `｜注意：群組${INCOMPLETE_GROUP_ID}截圖資料不完整，命中率以可見項目計算，可能偏高`;
    }
    feedback.classList.add("is-valid");
  }

  function getStrategyTargets() {
    const purple = resolveProperty(strategyTargetStates[0].value);
    const blue = resolveProperty(strategyTargetStates[1].value);
    const whiteSlots = strategyTargetStates.slice(2).map((slot) => ({
      fieldId: slot.id,
      hasValue: slot.value.trim() !== "",
      row: resolveProperty(slot.value),
    }));
    const whites = whiteSlots.filter((entry) => entry.row);

    if (!purple || purple.groupId !== HIGH_GRADE_GROUP_ID || purple.grade !== GRADE_HIGH) return null;
    if (!blue || blue.grade !== GRADE_INTERMEDIATE) return null;
    // 有輸入但未匹配完整能力時不能忽略，避免以錯誤的四格資料進行試算。
    if (whiteSlots.some((entry) => entry.hasValue && !entry.row)) return null;
    if (whites.length < 1 || whites.some((entry) => entry.row.grade !== GRADE_LOW)) return null;

    const configured = [
      { fieldId: "purple", row: purple },
      { fieldId: "blue", row: blue },
      ...whites,
    ];
    if (new Set(configured.map((entry) => entry.row.groupId)).size !== configured.length) return null;
    if (strategyPinnedIds.size !== 2) return null;
    if ([...strategyPinnedIds].some((fieldId) =>
      !configured.some((entry) => entry.fieldId === fieldId))) return null;

    return { purple, blue, whites };
  }

  function getConfiguredStrategyCount() {
    return strategyTargetStates.filter((slot) => {
      const row = resolveProperty(slot.value);
      if (!row) return false;
      if (slot.grade === GRADE_HIGH) {
        return row.groupId === HIGH_GRADE_GROUP_ID && row.grade === GRADE_HIGH;
      }
      if (slot.grade === GRADE_INTERMEDIATE) {
        return row.grade === GRADE_INTERMEDIATE;
      }
      return row.grade === GRADE_LOW;
    }).length;
  }

  function hasStrategyGroupClash() {
    const selected = strategyTargetStates
      .map((slot) => resolveProperty(slot.value)?.groupId)
      .filter(Boolean);
    return new Set(selected).size !== selected.length;
  }

  function createStrategyEmptyState(chosenCount, hasGroupClash) {
    const title = document.createElement("p");
    title.className = "empty-state__title";
    const detail = document.createElement("p");

    if (hasGroupClash) {
      title.textContent = "藍字與白字出現重複群組";
      detail.textContent = "同一顆召喚石的群組不可重複，請更換衝突的群組。";
    } else if (strategyPinnedIds.size !== 2) {
      title.textContent = `請設定 2 個釘選欄位（目前 ${strategyPinnedIds.size} 個）`;
      detail.textContent = "先按欄位右側的「設為釘選」，再計算其餘 3 格同時達成的機率。";
    } else {
      title.textContent = `至少需要 3 格目標（已設定 ${chosenCount} 格）`;
      detail.textContent = "請選擇群組19紫字、1 個藍字，以及至少 1 個白字能力；另外 2 個白字可以留空。";
    }

    const fragment = document.createDocumentFragment();
    fragment.append(title, detail);
    return fragment;
  }

  function calculatePinnedStrategy(configuration) {
    const { purple, blue, whites } = configuration;
    const usedGroups = new Set();

    if (strategyPinnedIds.has("blue")) usedGroups.add(blue.groupId);
    whites.forEach(({ fieldId, row }) => {
      if (strategyPinnedIds.has(fieldId)) usedGroups.add(row.groupId);
    });

    let purpleRate = 1;
    if (!strategyPinnedIds.has("purple")) {
      purpleRate = getItemRateInGrade(purple);
    }

    let blueRate = 1;
    if (!strategyPinnedIds.has("blue")) {
      blueRate = getConditionalGroupRate(blue.groupId, GRADE_INTERMEDIATE, usedGroups)
        * getItemRateInGrade(blue);
      // 藍字先抽；成功抽到後，其群組會排除後續白字。
      usedGroups.add(blue.groupId);
    }

    const rollingWhites = whites.filter(({ fieldId }) => !strategyPinnedIds.has(fieldId));
    const pinnedWhiteCount = whites.filter(({ fieldId }) => strategyPinnedIds.has(fieldId)).length;
    const rollingWhiteSlotCount = 3 - pinnedWhiteCount;
    const whiteRate = getWhiteTargetSetRate(
      rollingWhites.map(({ row }) => row),
      usedGroups,
      rollingWhiteSlotCount,
    );
    const perRoll = purpleRate * blueRate * whiteRate;

    return {
      purpleRate,
      blueRate,
      whiteRate,
      perRoll,
      expectedRolls: perRoll > 0 ? 1 / perRoll : Number.POSITIVE_INFINITY,
      expectedCost: perRoll > 0 ? 5000 / perRoll : Number.POSITIVE_INFINITY,
      rollingWhites,
      rollingWhiteSlotCount,
    };
  }

  function createStrategyPinButton(fieldId) {
    const isPinned = strategyPinnedIds.has(fieldId);
    const targetState = strategyTargetStates.find((slot) => slot.id === fieldId);
    const hasConfiguredTarget = Boolean(targetState && resolveProperty(targetState.value));
    const button = document.createElement("button");
    button.type = "button";
    button.className = `strategy-pin-toggle${isPinned ? " is-pinned" : ""}`;
    button.textContent = isPinned ? "已釘選" : "設為釘選";
    button.setAttribute("aria-pressed", String(isPinned));
    button.disabled = !isPinned && (strategyPinnedIds.size >= 2 || !hasConfiguredTarget);
    button.addEventListener("click", () => {
      if (isPinned) strategyPinnedIds.delete(fieldId);
      else if (strategyPinnedIds.size < 2) strategyPinnedIds.add(fieldId);
      renderStrategyTargets();
      renderStrategy();
    });
    return button;
  }

  function createStrategyTable(caption, headings, bodyRows) {
    const frame = document.createElement("div");
    frame.className = "analysis-table-frame";

    const table = document.createElement("table");
    const captionElement = document.createElement("caption");
    captionElement.textContent = caption;

    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    headings.forEach((heading) => {
      const cell = document.createElement("th");
      cell.setAttribute("scope", "col");
      cell.textContent = heading;
      headRow.append(cell);
    });
    head.append(headRow);

    const body = document.createElement("tbody");
    bodyRows.forEach((row) => body.append(row));

    table.append(captionElement, head, body);
    frame.append(table);
    return frame;
  }

  function createStrategyCalculationRow(label, condition, rate, isTotal = false) {
    const row = document.createElement("tr");
    if (isTotal) row.className = "is-best";
    const labelCell = createCell("計算項目");
    labelCell.textContent = label;
    const conditionCell = createCell("目標條件");
    conditionCell.textContent = condition;
    const rateCell = createCell("條件機率", "rate");
    rateCell.textContent = formatProbability(rate);
    row.append(labelCell, conditionCell, rateCell);
    return row;
  }

  function createStrategyConfigurationRow(label, target, fieldId) {
    const row = document.createElement("tr");
    const fieldCell = createCell("欄位");
    fieldCell.textContent = label;
    const targetCell = createCell("目標");
    targetCell.textContent = target;
    const stateCell = createCell("狀態");
    stateCell.textContent = strategyPinnedIds.has(fieldId) ? "已釘選・視為100%" : "本輪重骰";
    row.append(fieldCell, targetCell, stateCell);
    return row;
  }

  function renderStrategyTargets() {
    const fragment = document.createDocumentFragment();
    strategyTargetStates.forEach((slot, index) => {
      const definition = STRATEGY_FIELDS[index];
      const container = document.createElement("div");
      const gradeClass = slot.grade === GRADE_HIGH
        ? "purple"
        : slot.grade === GRADE_INTERMEDIATE ? "blue" : "white";
      container.className = `property-slot strategy-slot strategy-slot--${gradeClass}`
        + (strategyPinnedIds.has(slot.id) ? " is-pinned" : "");

      const number = document.createElement("span");
      number.className = "property-slot__number";
      number.textContent = String(index + 1);

      const field = document.createElement("div");
      field.className = "property-slot__field";
      const inputId = `target-input-${slot.id}`;
      const feedbackId = `target-feedback-${slot.id}`;
      const label = document.createElement("label");
      label.htmlFor = inputId;
      label.textContent = definition.label;

      const input = document.createElement("input");
      input.id = inputId;
      input.className = "property-input";
      input.type = "text";
      input.value = slot.value;
      input.placeholder = definition.placeholder;
      input.autocomplete = "off";
      input.setAttribute("aria-describedby", feedbackId);
      input.setAttribute("role", "combobox");
      input.setAttribute("aria-autocomplete", "list");
      input.setAttribute("aria-haspopup", "listbox");
      input.setAttribute("aria-expanded", "false");

      const combobox = document.createElement("div");
      combobox.className = "property-combobox";
      const listbox = document.createElement("div");
      listbox.id = `target-listbox-${slot.id}`;
      listbox.className = "autocomplete-menu";
      listbox.setAttribute("role", "listbox");
      listbox.setAttribute("aria-label", `${definition.label}搜尋結果`);
      listbox.hidden = true;
      input.setAttribute("aria-controls", listbox.id);

      const feedback = document.createElement("p");
      feedback.id = feedbackId;
      slot.input = input;
      slot.listbox = listbox;
      slot.feedback = feedback;
      slot.combobox = combobox;
      updateTargetFeedback(slot);

      input.addEventListener("input", () => {
        slot.value = input.value;
        slot.isOpen = true;
        slot.activeIndex = -1;
        strategyTargetStates.forEach((current) => updateTargetFeedback(current));
        renderAutocomplete(slot);
        renderStrategy();
      });
      input.addEventListener("focus", () => {
        closeAllAutocompletes(slot.id);
        slot.isOpen = true;
        slot.activeIndex = -1;
        renderAutocomplete(slot);
      });
      input.addEventListener("keydown", (event) => handleAutocompleteKeydown(event, slot));

      combobox.append(input, listbox);
      field.append(label, combobox, feedback);
      container.append(number, field, createStrategyPinButton(slot.id));
      fragment.append(container);
    });

    elements.strategyTargets.replaceChildren(fragment);
  }

  function renderStrategy() {
    const chosenCount = getConfiguredStrategyCount();
    elements.strategyCount.textContent = `已設定 ${chosenCount} / 5 格（至少 3 格）｜已釘選 ${strategyPinnedIds.size} / 2 格`;

    const targets = getStrategyTargets();
    if (!targets) {
      elements.strategyEmpty.replaceChildren(createStrategyEmptyState(chosenCount, hasStrategyGroupClash()));
      elements.strategyEmpty.hidden = false;
      elements.strategyResult.hidden = true;
      elements.strategyResult.replaceChildren();
      return;
    }

    const result = calculatePinnedStrategy(targets);
    const pinnedLabels = [...strategyPinnedIds].map((id) => STRATEGY_FIELD_LABELS.get(id)).join("＋");
    const verdict = document.createElement("div");
    verdict.className = "strategy-verdict";
    const badge = document.createElement("p");
    badge.className = "strategy-verdict__badge";
    badge.textContent = `目前釘選：${pinnedLabels}`;
    const headline = document.createElement("p");
    headline.className = "strategy-verdict__headline";
    headline.textContent = `單次達成率 ${formatProbability(result.perRoll)}`
      + `｜期望 ${formatRolls(result.expectedRolls)} 次｜${formatPoints(result.expectedCost)}`;
    const policy = document.createElement("p");
    policy.className = "strategy-verdict__policy";
    const hasPurpleAndBluePinned = strategyPinnedIds.has("purple")
      && strategyPinnedIds.has("blue");
    const hasBlueAndWhitePinned = strategyPinnedIds.has("blue")
      && targets.whites.some(({ fieldId }) => strategyPinnedIds.has(fieldId));
    if (hasPurpleAndBluePinned) {
      policy.textContent = "過渡狀態：尚未取得指定白字時可先保留紫＋藍；任一指定白字出現後，通常應改釘藍＋白，避免要求多個指定白字同一次出現。";
    } else if (hasBlueAndWhitePinned) {
      policy.textContent = "落袋狀態：已取得指定白字後保留藍＋白，再重洗較容易回來的紫字與其餘目標；白字難度不同時，通常優先釘較難抽者。";
    } else {
      policy.textContent = "自訂釘法：此處只計算目前兩格已釘後的終局成本，不代表從零開始的完整路線；請連同取得釘選內容的前置成本一起判斷。";
    }
    verdict.append(badge, headline, policy);

    const unrestrictedWhiteCount = result.rollingWhiteSlotCount - result.rollingWhites.length;
    const whiteCondition = result.rollingWhites.length > 0
      ? result.rollingWhites.map(({ row }) => `${row.item}（群組${row.groupId}）`).join("、")
        + (unrestrictedWhiteCount > 0 ? `；另 ${unrestrictedWhiteCount} 格不限` : "")
      : unrestrictedWhiteCount > 0
        ? `已設定白字皆固定；另 ${unrestrictedWhiteCount} 格不限`
        : "白字皆已固定";
    const calculationTable = createStrategyTable(
      "其餘 3 格的條件機率（依藍字先抽、白字群組不重複精確計算）",
      ["計算項目", "目標條件", "條件機率"],
      [
        createStrategyCalculationRow(
          "紫字",
          strategyPinnedIds.has("purple") ? "已釘選" : targets.purple.item,
          result.purpleRate,
        ),
        createStrategyCalculationRow(
          "藍字",
          strategyPinnedIds.has("blue") ? "已釘選" : `${targets.blue.item}（群組${targets.blue.groupId}）`,
          result.blueRate,
        ),
        createStrategyCalculationRow(
          "未釘白字聯合",
          whiteCondition,
          result.whiteRate,
        ),
        createStrategyCalculationRow("整體", "其餘3格同一次完成所有未釘目標", result.perRoll, true),
      ],
    );

    const configurationTable = createStrategyTable(
      `${targets.whites.length + 2} 格目標與釘選狀態`,
      ["欄位", "目標", "狀態"],
      [
        createStrategyConfigurationRow("紫字", targets.purple.item, "purple"),
        createStrategyConfigurationRow("藍字", `${targets.blue.item}・群組 ${targets.blue.groupId}`, "blue"),
        ...targets.whites.map(({ fieldId, row }) => createStrategyConfigurationRow(
          STRATEGY_FIELD_LABELS.get(fieldId),
          `${row.item}・群組 ${row.groupId}`,
          fieldId,
        )),
      ],
    );

    const note = document.createElement("p");
    note.className = "strategy-note";
    note.textContent = "期望花費只計算目前兩格已釘後的終局階段：每次 5,000 點 ÷ 單次達成率；"
      + "不包含取得目前釘選內容及中途換釘的前置成本，不同釘法不一定具有相同起跑點。每格都以指定能力的群組內機率計算，"
      + "多個未釘白字可用任意排列命中所選能力；未設定的白字格不限能力，"
      + "但仍會依群組不可重複規則納入機率。";

    const disclaimer = document.createElement("p");
    disclaimer.className = "strategy-disclaimer";
    disclaimer.textContent = "※ 計算結果僅供參考";

    elements.strategyResult.replaceChildren(
      verdict,
      calculationTable,
      configurationTable,
      note,
      disclaimer,
    );
    elements.strategyResult.hidden = false;
    elements.strategyEmpty.hidden = true;
  }

  elements.form.addEventListener("submit", (event) => event.preventDefault());
  elements.search.addEventListener("input", applyFilters);
  elements.group.addEventListener("change", applyFilters);
  elements.recommended.addEventListener("change", applyFilters);
  elements.clear.addEventListener("click", clearFilters);
  TAB_VIEWS.forEach(([name, getTab], index) => {
    const tab = getTab();
    tab.addEventListener("click", () => activateTab(name));
    tab.addEventListener("keydown", (event) => {
      const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (step === 0) return;
      event.preventDefault();
      const next = (index + step + TAB_VIEWS.length) % TAB_VIEWS.length;
      activateTab(TAB_VIEWS[next][0], true);
    });
  });
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement
      || target instanceof HTMLTextAreaElement
      || target instanceof HTMLSelectElement;

    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      activateTab("lookup");
      elements.search.focus();
    }

    if (event.key === "Escape" && document.activeElement === elements.search) {
      clearFilters();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    const clickedInsideAutocomplete = slotCollections.some((getSlots) =>
      getSlots().some((slot) => slot.combobox && slot.combobox.contains(event.target)));
    if (!clickedInsideAutocomplete) closeAllAutocompletes();
  });

  activateTab("strategy");
  populateGroupFilter();
  renderStrategyTargets();
  renderStrategy();
  applyFilters();

  // 推薦清單以「名稱＋等級」比對，任何一筆對不上就代表資料與文字檔已經不同步。
  const expectedRecommendedCount = [...RECOMMENDED_ITEMS_BY_GRADE.values()]
    .reduce((total, items) => total + items.size, 0);
  const recommendedCount = rows.filter((row) => row.recommended).length;

  if (
    groups.length !== 19
    || rows.length !== 187
    || recommendedCount !== expectedRecommendedCount
  ) {
    console.warn(
      `資料筆數與預期不符：${groups.length} 個群組、${rows.length} 筆項目、`
      + `${recommendedCount} 筆推薦能力（應為 ${expectedRecommendedCount} 筆）。`,
    );
  }
})();
