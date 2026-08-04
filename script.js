(() => {
  "use strict";

  const GROUP_RATES = [
    4.57, 4.57, 9.15, 4.57, 14.13, 13.72, 4.57, 4.57, 4.57, 9.15,
    0.14, 0.14, 2.22, 4.57, 4.57, 14.14, 0.28, 0.09, 0.25,
  ];
  const HIGH_GRADE_GROUP_ID = 19;
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
    ownedTab: document.querySelector("#owned-tab"),
    strategyTab: document.querySelector("#strategy-tab"),
    lookupPanel: document.querySelector("#lookup-panel"),
    ownedPanel: document.querySelector("#owned-panel"),
    strategyPanel: document.querySelector("#strategy-panel"),
    form: document.querySelector("#filter-form"),
    search: document.querySelector("#search-input"),
    group: document.querySelector("#group-filter"),
    recommended: document.querySelector("#recommended-filter"),
    clear: document.querySelector("#clear-button"),
    body: document.querySelector("#parameter-body"),
    empty: document.querySelector("#empty-state"),
    resultCount: document.querySelector("#result-count"),
    propertySlots: document.querySelector("#property-slots"),
    addProperty: document.querySelector("#add-property-button"),
    clearAnalysis: document.querySelector("#clear-analysis-button"),
    selectionCount: document.querySelector("#selection-count"),
    ruleWarning: document.querySelector("#rule-warning"),
    analysisEmpty: document.querySelector("#analysis-empty"),
    analysisTableFrame: document.querySelector("#analysis-table-frame"),
    selectedProbabilities: document.querySelector("#selected-probabilities"),
    blockedCount: document.querySelector("#blocked-count"),
    blockedEmpty: document.querySelector("#blocked-empty"),
    blockedGroups: document.querySelector("#blocked-groups"),
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
  const formatOverallRate = (row) => `${(row.groupRate * row.itemRate / 100).toFixed(4)}%`;
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

  // 兩組欄位共用同一套自動完成，差別只在候選項目的過濾規則與選定後要重畫誰。
  const createPropertySlot = (id) => ({
    ...baseSlot(id),
    idPrefix: "property",
    getCandidates: getOwnedCandidates,
    renderFeedback: (slot) => updateSlotFeedback(slot, slot.feedback),
    onSelect: () => renderAnalysis(),
  });

  const createTargetSlot = (id) => ({
    ...baseSlot(id),
    idPrefix: "target",
    getCandidates: getTargetCandidates,
    renderFeedback: (slot) => updateTargetFeedback(slot),
    onSelect: () => {
      // 兩個欄位互相牽制（同群組不可並存），選定後兩邊的提示都要重算。
      strategyTargetStates.forEach((current) => updateTargetFeedback(current));
      renderStrategy();
    },
  });

  let nextPropertySlotId = 1;
  let propertySlotStates = [createPropertySlot(nextPropertySlotId)];
  const strategyTargetStates = [createTargetSlot("a"), createTargetSlot("b")];
  const slotCollections = [() => propertySlotStates, () => strategyTargetStates];

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
    ["lookup", () => elements.lookupTab, () => elements.lookupPanel],
    ["owned", () => elements.ownedTab, () => elements.ownedPanel],
    ["strategy", () => elements.strategyTab, () => elements.strategyPanel],
  ];

  function activateTab(tabName, shouldFocus = false) {
    const activeName = TAB_VIEWS.some(([name]) => name === tabName) ? tabName : "lookup";
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

  function getSelectionValidation() {
    const accepted = [];
    const acceptedBySlot = new Map();
    const rejectedBySlot = new Map();
    const groupOwners = new Map();
    let intermediateOwner = null;
    let highOwner = null;

    propertySlotStates.forEach((slot, index) => {
      const row = resolveProperty(slot.value);
      if (!row) return;

      const owner = groupOwners.get(row.groupId);
      if (owner) {
        rejectedBySlot.set(slot.id, {
          reason: "group",
          row,
          slotIndex: index + 1,
          ownerIndex: owner.index + 1,
        });
        return;
      }

      if (row.grade === GRADE_INTERMEDIATE && intermediateOwner) {
        rejectedBySlot.set(slot.id, {
          reason: "intermediate",
          row,
          slotIndex: index + 1,
          ownerIndex: intermediateOwner.index + 1,
        });
        return;
      }

      if (row.grade === GRADE_HIGH && highOwner) {
        rejectedBySlot.set(slot.id, {
          reason: "high",
          row,
          slotIndex: index + 1,
          ownerIndex: highOwner.index + 1,
        });
        return;
      }

      const record = { slot, row, index };
      groupOwners.set(row.groupId, record);
      if (row.grade === GRADE_INTERMEDIATE) intermediateOwner = record;
      if (row.grade === GRADE_HIGH) highOwner = record;
      accepted.push(record);
      acceptedBySlot.set(slot.id, record);
    });

    return { accepted, acceptedBySlot, rejectedBySlot };
  }

  function getAcceptedRows(excludedSlotId = null) {
    return getSelectionValidation().accepted
      .filter((record) => record.slot.id !== excludedSlotId)
      .map((record) => record.row);
  }

  // 現有屬性分析：排除已占用的群組，以及已被占用的中級／高級名額。
  function getOwnedCandidates(slot) {
    const selectedRows = getAcceptedRows(slot.id);
    const selectedGroups = new Set(selectedRows.map((row) => row.groupId));
    const hasIntermediate = selectedRows.some((row) => row.grade === GRADE_INTERMEDIATE);
    const hasHigh = selectedRows.some((row) => row.grade === GRADE_HIGH);

    return rows.filter((row) => {
      if (selectedGroups.has(row.groupId)) return false;
      if (row.grade === GRADE_INTERMEDIATE && hasIntermediate) return false;
      if (row.grade === GRADE_HIGH && hasHigh) return false;
      return true;
    });
  }

  // 釘選策略：目標只能是低級（白字），且兩個目標不能同群組（群組不可重複抽取）。
  function getTargetCandidates(slot) {
    const takenGroups = new Set(strategyTargetStates
      .filter((current) => current.id !== slot.id)
      .map((current) => resolveProperty(current.value))
      .filter(Boolean)
      .map((row) => row.groupId));

    return rows.filter((row) => row.grade === GRADE_LOW && !takenGroups.has(row.groupId));
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

    return {
      total: matches.length,
      visible: matches.slice(0, MAX_AUTOCOMPLETE_RESULTS),
    };
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

    if (matches.total > MAX_AUTOCOMPLETE_RESULTS) {
      const footer = document.createElement("p");
      footer.className = "autocomplete-footer";
      footer.textContent = `顯示前 ${MAX_AUTOCOMPLETE_RESULTS} 筆，共 ${matches.total} 筆；請輸入更多關鍵字縮小範圍。`;
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

  function updateSlotFeedback(slot, feedback, validation = getSelectionValidation()) {
    const value = slot.value.trim();
    const matchedProperty = resolveProperty(value);
    feedback.className = "property-slot__feedback";

    if (!value) {
      feedback.textContent = "請輸入關鍵字，並從建議清單選擇完整屬性。";
      return;
    }

    if (!matchedProperty) {
      feedback.textContent = "尚未找到完整屬性，請繼續輸入或從清單選取。";
      feedback.classList.add("is-invalid");
      return;
    }

    const rejection = validation.rejectedBySlot.get(slot.id);
    if (rejection) {
      if (rejection.reason === "intermediate") {
        feedback.textContent = `中級能力已由現有屬性 ${rejection.ownerIndex} 占用；每顆召喚石只能有 1 個中級能力，此輸入不會加入分析。`;
      } else if (rejection.reason === "high") {
        feedback.textContent = `高級能力已由現有屬性 ${rejection.ownerIndex} 占用；每顆召喚石只能有 1 個高級能力，此輸入不會加入分析。`;
      } else {
        feedback.textContent = `群組 ${matchedProperty.groupId} 已由現有屬性 ${rejection.ownerIndex} 占用，此輸入不會加入分析。`;
      }
      feedback.classList.add("is-invalid");
      return;
    }

    const gradeLabel = matchedProperty.grade === GRADE_HIGH
      ? "高級能力・301階以上必定出現"
      : matchedProperty.grade === GRADE_INTERMEDIATE
        ? "中級能力・31階以上必定出現"
        : "低級能力";
    const recommendedLabel = matchedProperty.recommended
      ? `｜${getRecommendedLabel(matchedProperty)}`
      : "";
    feedback.textContent = `群組 ${matchedProperty.groupId}｜群組機率 ${formatRate(matchedProperty.groupRate)}｜群組內機率 ${formatRate(matchedProperty.itemRate)}｜${gradeLabel}${recommendedLabel}`;
    feedback.classList.add("is-valid");
  }

  function renderPropertySlots() {
    const fragment = document.createDocumentFragment();
    let lastInput = null;

    propertySlotStates.forEach((slot, index) => {
      const container = document.createElement("div");
      container.className = "property-slot";

      const number = document.createElement("span");
      number.className = "property-slot__number";
      number.textContent = String(index + 1);

      const field = document.createElement("div");
      field.className = "property-slot__field";

      const inputId = `property-input-${slot.id}`;
      const feedbackId = `property-feedback-${slot.id}`;
      const label = document.createElement("label");
      label.htmlFor = inputId;
      label.textContent = `現有屬性 ${index + 1}`;

      const input = document.createElement("input");
      input.id = inputId;
      input.className = "property-input";
      input.type = "text";
      input.value = slot.value;
      input.placeholder = "輸入屬性名稱，例如：暴擊傷害增加80-100%";
      input.autocomplete = "off";
      input.setAttribute("aria-describedby", feedbackId);
      input.setAttribute("role", "combobox");
      input.setAttribute("aria-autocomplete", "list");
      input.setAttribute("aria-haspopup", "listbox");
      input.setAttribute("aria-expanded", "false");

      const combobox = document.createElement("div");
      combobox.className = "property-combobox";
      const listbox = document.createElement("div");
      listbox.id = `property-listbox-${slot.id}`;
      listbox.className = "autocomplete-menu";
      listbox.setAttribute("role", "listbox");
      listbox.setAttribute("aria-label", `現有屬性 ${index + 1} 搜尋結果`);
      listbox.hidden = true;
      input.setAttribute("aria-controls", listbox.id);

      const feedback = document.createElement("p");
      feedback.id = feedbackId;
      updateSlotFeedback(slot, feedback);

      slot.input = input;
      slot.listbox = listbox;
      slot.feedback = feedback;
      slot.combobox = combobox;

      input.addEventListener("input", () => {
        slot.value = input.value;
        slot.isOpen = true;
        slot.activeIndex = -1;
        updateSlotFeedback(slot, feedback);
        renderAutocomplete(slot);
        renderAnalysis();
      });

      input.addEventListener("focus", () => {
        closeAllAutocompletes(slot.id);
        slot.isOpen = true;
        slot.activeIndex = -1;
        renderAutocomplete(slot);
      });

      input.addEventListener("keydown", (event) => handleAutocompleteKeydown(event, slot));

      const removeButton = document.createElement("button");
      removeButton.className = "property-remove";
      removeButton.type = "button";
      removeButton.textContent = "移除";
      removeButton.disabled = propertySlotStates.length === 1;
      removeButton.setAttribute("aria-label", `移除現有屬性 ${index + 1}`);
      removeButton.addEventListener("click", () => {
        propertySlotStates = propertySlotStates.filter((currentSlot) => currentSlot.id !== slot.id);
        renderPropertySlots();
        renderAnalysis();
      });

      combobox.append(input, listbox);
      field.append(label, combobox, feedback);
      container.append(number, field, removeButton);
      fragment.append(container);
      lastInput = input;
    });

    elements.propertySlots.replaceChildren(fragment);
    elements.addProperty.disabled = propertySlotStates.length >= 5;
    elements.clearAnalysis.disabled = propertySlotStates.length === 1
      && propertySlotStates[0].value.trim() === "";
    return lastInput;
  }

  function createProbabilityRow(row) {
    const tableRow = document.createElement("tr");
    const itemCell = createCell("現有屬性");
    applyAbilityGrade(itemCell, row);
    itemCell.append(createAbilityContent(row));

    const groupCell = createCell("群組");
    groupCell.append(createGroupIdentity(row.groupId));

    const groupRateCell = createCell("群組機率", "rate");
    groupRateCell.textContent = formatRate(row.groupRate);

    const itemRateCell = createCell("群組內機率", "rate");
    itemRateCell.textContent = formatRate(row.itemRate);

    const overallRateCell = createCell("綜合機率", "overall-rate");
    overallRateCell.textContent = formatOverallRate(row);

    tableRow.append(itemCell, groupCell, groupRateCell, itemRateCell, overallRateCell);
    return tableRow;
  }

  function createBlockedGroupCard(groupId, selectedKeys) {
    const groupRows = rowsByGroup.get(groupId) ?? [];
    const card = document.createElement("article");
    card.className = "blocked-group-card";

    const header = document.createElement("header");
    header.className = "blocked-group-card__header";
    const title = document.createElement("h3");
    title.textContent = groupId === HIGH_GRADE_GROUP_ID
      ? `附加能力群組 ${groupId}・高級屬性`
      : `附加能力群組 ${groupId}`;
    const summary = document.createElement("p");
    const guaranteeLabel = groupId === HIGH_GRADE_GROUP_ID
      ? "301階以上必定出現｜"
      : "";
    summary.textContent = `${guaranteeLabel}群組機率 ${formatRate(GROUP_RATES[groupId - 1])}｜${groupRows.length} 個項目`;
    header.append(title, summary);

    const list = document.createElement("ul");
    list.className = "blocked-list";

    groupRows.forEach((row) => {
      const isOwned = selectedKeys.has(row.key);
      const item = document.createElement("li");
      item.className = "blocked-item";

      const name = document.createElement("span");
      name.className = "blocked-item__name";
      name.textContent = row.item;
      applyAbilityGrade(name, row);
      appendAbilityBadges(name, row);

      const meta = document.createElement("span");
      meta.className = "blocked-item__meta";
      const rate = document.createElement("span");
      rate.className = "rate";
      rate.textContent = formatRate(row.itemRate);
      const status = document.createElement("span");
      status.className = `status-badge ${isOwned ? "status-badge--owned" : "status-badge--blocked"}`;
      status.textContent = isOwned ? "現有屬性" : "不可再刷到";
      meta.append(rate, status);

      item.append(name, meta);
      list.append(item);
    });

    card.append(header, list);
    return card;
  }

  function createBlockedIntermediateCard(selectedIntermediate) {
    const blockedRows = rows.filter((row) =>
      row.grade === GRADE_INTERMEDIATE
      && row.groupId !== selectedIntermediate.groupId);
    const card = document.createElement("article");
    card.className = "blocked-group-card blocked-group-card--intermediate";

    const header = document.createElement("header");
    header.className = "blocked-group-card__header";
    const title = document.createElement("h3");
    title.textContent = "跨群組中級能力・不可再刷到";
    const blockedRecommended = blockedRows.filter((row) => row.recommended).length;
    const summary = document.createElement("p");
    summary.textContent = `已選 1 個中級能力｜另外排除 ${blockedRows.length} 個中級項目`
      + (blockedRecommended === 0 ? "" : `（含 ${blockedRecommended} 個 ★ 推薦藍字）`);
    header.append(title, summary);

    const list = document.createElement("ul");
    list.className = "blocked-list";

    blockedRows.forEach((row) => {
      const item = document.createElement("li");
      item.className = "blocked-item";

      const name = document.createElement("span");
      name.className = "blocked-item__name";
      name.textContent = row.item;
      applyAbilityGrade(name, row);
      appendAbilityBadges(name, row);

      const meta = document.createElement("span");
      meta.className = "blocked-item__meta";
      const groupLabel = document.createElement("span");
      groupLabel.className = "blocked-item__group";
      groupLabel.textContent = `群組 ${row.groupId}`;
      const rate = document.createElement("span");
      rate.className = "rate";
      rate.textContent = formatRate(row.itemRate);
      const status = document.createElement("span");
      status.className = "status-badge status-badge--blocked";
      status.textContent = "中級已占用";
      meta.append(groupLabel, rate, status);

      item.append(name, meta);
      list.append(item);
    });

    card.append(header, list);
    return card;
  }

  function renderAnalysis() {
    const validation = getSelectionValidation();
    const selectedRows = validation.accepted.map((record) => record.row);
    const selectedKeysByGroup = new Map();

    propertySlotStates.forEach((slot) => {
      if (slot.feedback) updateSlotFeedback(slot, slot.feedback, validation);
    });

    selectedRows.forEach((row) => {
      if (!selectedKeysByGroup.has(row.groupId)) {
        selectedKeysByGroup.set(row.groupId, new Set());
      }
      selectedKeysByGroup.get(row.groupId).add(row.key);
    });

    elements.selectionCount.textContent = `已選擇 ${selectedRows.length} / 5 個`;
    elements.analysisEmpty.hidden = selectedRows.length !== 0;
    elements.analysisTableFrame.hidden = selectedRows.length === 0;

    const probabilityRows = document.createDocumentFragment();
    selectedRows.forEach((row) => probabilityRows.append(createProbabilityRow(row)));
    elements.selectedProbabilities.replaceChildren(probabilityRows);

    const warnings = [...validation.rejectedBySlot.values()].map((rejection) => {
      if (rejection.reason === "intermediate") {
        return `現有屬性 ${rejection.slotIndex} 是中級能力，但中級能力已由現有屬性 ${rejection.ownerIndex} 占用，因此未加入分析。`;
      }
      if (rejection.reason === "high") {
        return `現有屬性 ${rejection.slotIndex} 是高級能力，但高級能力已由現有屬性 ${rejection.ownerIndex} 占用，因此未加入分析。`;
      }
      return `現有屬性 ${rejection.slotIndex} 的群組 ${rejection.row.groupId} 已由現有屬性 ${rejection.ownerIndex} 占用，因此未加入分析。`;
    });

    elements.ruleWarning.hidden = warnings.length === 0;
    elements.ruleWarning.textContent = warnings.join(" ");

    const blockedCards = document.createDocumentFragment();
    const selectedIntermediate = selectedRows.find((row) => row.grade === GRADE_INTERMEDIATE);
    if (selectedIntermediate) {
      blockedCards.append(createBlockedIntermediateCard(selectedIntermediate));
    }
    [...selectedKeysByGroup.entries()]
      .sort(([groupA], [groupB]) => groupA - groupB)
      .forEach(([groupId, selectedKeys]) => {
        blockedCards.append(createBlockedGroupCard(groupId, selectedKeys));
      });

    elements.blockedGroups.replaceChildren(blockedCards);
    const blockedCategoryCount = selectedKeysByGroup.size + (selectedIntermediate ? 1 : 0);
    elements.blockedEmpty.hidden = blockedCategoryCount !== 0;
    elements.blockedCount.textContent = `${blockedCategoryCount} 個分類`;
    renderPropertySlotsState();
  }

  function renderPropertySlotsState() {
    elements.addProperty.disabled = propertySlotStates.length >= 5;
    elements.clearAnalysis.disabled = propertySlotStates.length === 1
      && propertySlotStates[0].value.trim() === "";
  }

  function addPropertySlot() {
    if (propertySlotStates.length >= 5) return;
    closeAllAutocompletes();
    nextPropertySlotId += 1;
    propertySlotStates.push(createPropertySlot(nextPropertySlotId));
    const lastInput = renderPropertySlots();
    renderAnalysis();
    if (lastInput) lastInput.focus();
  }

  function clearAnalysis() {
    closeAllAutocompletes();
    nextPropertySlotId += 1;
    propertySlotStates = [createPropertySlot(nextPropertySlotId)];
    const firstInput = renderPropertySlots();
    renderAnalysis();
    if (firstInput) firstInput.focus();
  }

  // ---- 釘選策略評估 ----
  // 模型：紫字固定來自群組19（命中想要的為 1/9），藍字在兩方案都全程釘住（共同項，可消去），
  // 3 格白字近似為獨立抽取。完整推導與交叉點見 釘選策略分析.md。
  const TARGET_LABELS = ["目標白字 1", "目標白字 2"];
  const slotHitRate = (row) => row.groupRate * row.itemRate / 10000;
  const missAll = (rate, slots) => Math.pow(1 - rate, slots);
  // 階段2 單轉成功 ＝ 紫字中想要的(1/9) 且 2 格白字至少命中剩下那個目標
  const stage2Rate = (rate) => (1 / 9) * (1 - missAll(rate, 2));
  const formatRolls = (value) => Math.round(value).toLocaleString("en-US");

  function evaluatePinStrategies(rateA, rateB) {
    const hard = Math.min(rateA, rateB);
    const easy = Math.max(rateA, rateB);

    // 方案a：釘藍+紫，重骰 3 白，單轉要同時湊到兩個目標（排容原理）
    const bothPerRoll = 1 - missAll(rateA, 3) - missAll(rateB, 3) + missAll(rateA + rateB, 3);
    const hardOnly = 1 - missAll(hard, 3) - bothPerRoll;
    const easyOnly = 1 - missAll(easy, 3) - bothPerRoll;
    const noneHit = 1 - bothPerRoll - hardOnly - easyOnly;

    // 階段2 的成本由「還沒到手的那個目標」決定
    const costWhenHardBanked = 1 / stage2Rate(easy);
    const costWhenEasyBanked = 1 / stage2Rate(hard);

    const planA = 1 / bothPerRoll;
    const bankFirst =
      (1 + hardOnly * costWhenHardBanked + easyOnly * costWhenEasyBanked) / (1 - noneHit);
    const bankHard = (1 + hardOnly * costWhenHardBanked) / (1 - easyOnly - noneHit);
    const preferBankHard = bankHard < bankFirst;
    const planB = preferBankHard ? bankHard : bankFirst;

    return {
      bothPerRoll,
      planA,
      bankFirst,
      bankHard,
      planB,
      preferBankHard,
      recommended: planA < planB ? "a" : "b",
    };
  }

  function updateTargetFeedback(slot) {
    const feedback = slot.feedback;
    if (!feedback) return;

    const value = slot.value.trim();
    const matched = resolveProperty(value);
    feedback.className = "property-slot__feedback";

    if (!value) {
      feedback.textContent = "請輸入關鍵字，並從建議清單選擇白字目標。";
      return;
    }

    if (!matched) {
      feedback.textContent = "尚未找到完整屬性，請繼續輸入或從清單選取。";
      feedback.classList.add("is-invalid");
      return;
    }

    if (matched.grade !== GRADE_LOW) {
      feedback.textContent =
        `「${getGradeLabel(matched)}」能力不能當作白字目標；此情境的紫字與藍字已經固定。`;
      feedback.classList.add("is-invalid");
      return;
    }

    const otherSlot = strategyTargetStates.find((current) => current.id !== slot.id);
    const otherRow = otherSlot ? resolveProperty(otherSlot.value) : null;
    if (otherRow && otherRow.groupId === matched.groupId) {
      feedback.textContent =
        `群組 ${matched.groupId} 已被另一個目標占用；群組不可重複抽取，兩個目標不可能同時存在。`;
      feedback.classList.add("is-invalid");
      return;
    }

    feedback.textContent = `群組 ${matched.groupId}｜群組機率 ${formatRate(matched.groupRate)}`
      + `｜群組內機率 ${formatRate(matched.itemRate)}｜每格命中率 ${formatOverallRate(matched)}`
      + (matched.recommended ? `｜${getRecommendedLabel(matched)}` : "");
    feedback.classList.add("is-valid");
  }

  function getStrategyTargets() {
    const picked = strategyTargetStates.map((slot) => resolveProperty(slot.value));
    if (picked.some((row) => !row || row.grade !== GRADE_LOW)) return null;
    if (picked[0].groupId === picked[1].groupId) return null;
    return picked;
  }

  function createStrategyEmptyState(chosenCount, hasGroupClash) {
    const title = document.createElement("p");
    title.className = "empty-state__title";
    const detail = document.createElement("p");

    if (hasGroupClash) {
      title.textContent = "兩個目標在同一個群組";
      detail.textContent = "群組不可重複抽取，這兩個能力不可能同時出現在一顆召喚石上，請換掉其中一個。";
    } else {
      title.textContent = `尚未選滿 2 個目標（已選 ${chosenCount} 個）`;
      detail.textContent = "兩個白字目標都選好後，這裡會列出兩種釘法的單轉成功率與期望轉數。";
    }

    const fragment = document.createDocumentFragment();
    fragment.append(title, detail);
    return fragment;
  }

  function createStrategyVerdict(result, harder, easier) {
    const verdict = document.createElement("div");
    verdict.className = "strategy-verdict";

    const best = result.recommended === "a" ? result.planA : result.planB;
    const worst = result.recommended === "a" ? result.planB : result.planA;

    const badge = document.createElement("p");
    badge.className = "strategy-verdict__badge";
    badge.textContent = result.recommended === "a"
      ? "建議：方案 a — 釘住藍字 + 紫字"
      : "建議：方案 b — 釘住藍字 + 已到手的白字，放掉紫字";

    const headline = document.createElement("p");
    headline.className = "strategy-verdict__headline";
    headline.textContent = `期望 ${formatRolls(best)} 轉完成，`
      + `比另一個方案的 ${formatRolls(worst)} 轉快 ${(worst / best).toFixed(1)} 倍`;

    verdict.append(badge, headline);

    if (result.recommended === "b") {
      const policy = document.createElement("p");
      policy.className = "strategy-verdict__policy";
      policy.textContent = result.preferBankHard
        ? `落袋政策：只釘難抽的那個 — 階段 1 專心等「${harder.item}」再釘住，`
          + `把比較好抽的「${easier.item}」留到階段 2。`
        : "落袋政策：先到先釘 — 兩個目標命中率接近，中哪個就釘哪個，硬等特定的那個只是浪費轉數。";
      verdict.append(policy);
    }

    return verdict;
  }

  function createStrategyRow(label, perRoll, rolls, isBest) {
    const tableRow = document.createElement("tr");
    if (isBest) tableRow.className = "is-best";

    const planCell = createCell("方案");
    planCell.textContent = label;

    const perRollCell = createCell("單轉成功率", "rate");
    perRollCell.textContent = perRoll;

    const rollsCell = createCell("期望轉數", "rate");
    rollsCell.textContent = `${formatRolls(rolls)} 轉`;

    tableRow.append(planCell, perRollCell, rollsCell);
    return tableRow;
  }

  function createStrategyTargetRow(row) {
    const tableRow = document.createElement("tr");

    const itemCell = createCell("目標");
    applyAbilityGrade(itemCell, row);
    itemCell.append(createAbilityContent(row));

    const groupCell = createCell("群組");
    groupCell.textContent = `群組 ${row.groupId}`;

    const groupRateCell = createCell("群組機率", "rate");
    groupRateCell.textContent = formatRate(row.groupRate);

    const itemRateCell = createCell("群組內機率", "rate");
    itemRateCell.textContent = formatRate(row.itemRate);

    const hitCell = createCell("每格命中率", "rate");
    hitCell.textContent = formatOverallRate(row);

    tableRow.append(itemCell, groupCell, groupRateCell, itemRateCell, hitCell);
    return tableRow;
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

  function renderStrategyTargets() {
    const fragment = document.createDocumentFragment();

    strategyTargetStates.forEach((slot, index) => {
      const container = document.createElement("div");
      container.className = "property-slot";

      const number = document.createElement("span");
      number.className = "property-slot__number";
      number.textContent = String(index + 1);

      const field = document.createElement("div");
      field.className = "property-slot__field";

      const inputId = `target-input-${slot.id}`;
      const feedbackId = `target-feedback-${slot.id}`;
      const label = document.createElement("label");
      label.htmlFor = inputId;
      label.textContent = TARGET_LABELS[index];

      const input = document.createElement("input");
      input.id = inputId;
      input.className = "property-input";
      input.type = "text";
      input.value = slot.value;
      input.placeholder = "輸入白字屬性，或打「推薦白字」看 23 個推薦目標";
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
      listbox.setAttribute("aria-label", `${TARGET_LABELS[index]} 搜尋結果`);
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
      container.append(number, field);
      fragment.append(container);
    });

    elements.strategyTargets.replaceChildren(fragment);
  }

  function renderStrategy() {
    const picked = strategyTargetStates.map((slot) => resolveProperty(slot.value));
    const chosenCount = picked.filter((row) => row && row.grade === GRADE_LOW).length;
    elements.strategyCount.textContent = `已選擇 ${chosenCount} / 2 個`;

    const targets = getStrategyTargets();
    if (!targets) {
      const hasGroupClash = chosenCount === 2 && picked[0].groupId === picked[1].groupId;
      elements.strategyEmpty.replaceChildren(createStrategyEmptyState(chosenCount, hasGroupClash));
      elements.strategyEmpty.hidden = false;
      elements.strategyResult.hidden = true;
      elements.strategyResult.replaceChildren();
      return;
    }

    const [first, second] = targets;
    const rateFirst = slotHitRate(first);
    const rateSecond = slotHitRate(second);
    const result = evaluatePinStrategies(rateFirst, rateSecond);
    const harder = rateFirst <= rateSecond ? first : second;
    const easier = rateFirst <= rateSecond ? second : first;

    const comparison = createStrategyTable(
      "兩種釘法的單轉成功率與期望轉數",
      ["方案", "單轉成功率", "期望轉數"],
      [
        createStrategyRow(
          "方案 a：釘藍字＋紫字，重骰 3 個白字",
          `${(result.bothPerRoll * 100).toFixed(4)}%`,
          result.planA,
          result.recommended === "a",
        ),
        createStrategyRow(
          "方案 b：先到先釘（中哪個目標就釘哪個）",
          "分兩階段，見說明",
          result.bankFirst,
          result.recommended === "b" && !result.preferBankHard,
        ),
        createStrategyRow(
          "方案 b：只釘難抽的那個",
          "分兩階段，見說明",
          result.bankHard,
          result.recommended === "b" && result.preferBankHard,
        ),
      ],
    );

    const targetTable = createStrategyTable(
      "兩個目標的群組機率、群組內機率與每格命中率",
      ["目標", "群組", "群組機率", "群組內機率", "每格命中率"],
      targets.map((row) => createStrategyTargetRow(row)),
    );

    const note = document.createElement("p");
    note.className = "strategy-note";
    note.textContent = "方案 b 的階段 1 與方案 a 是同一個動作（釘藍字＋紫字、重骰 3 個白字），"
      + "只是中 1 個目標就落袋、改打階段 2；因此方案 b 是方案 a 的超集，期望轉數不可能更差。"
      + "階段 1 若一轉同時中 2 個目標，直接收工。";

    elements.strategyResult.replaceChildren(
      createStrategyVerdict(result, harder, easier),
      comparison,
      targetTable,
      note,
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
  elements.addProperty.addEventListener("click", addPropertySlot);
  elements.clearAnalysis.addEventListener("click", clearAnalysis);

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

  activateTab("lookup");
  populateGroupFilter();
  renderPropertySlots();
  renderAnalysis();
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
