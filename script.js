(() => {
  "use strict";

  const GROUP_RATES = [
    4.57, 4.57, 9.15, 4.57, 14.13, 13.72, 4.57, 4.57, 4.57, 9.15,
    0.14, 0.14, 2.22, 4.57, 4.57, 14.14, 0.28, 0.09, 0.25,
  ];
  const HIGH_GRADE_GROUP_ID = 19;
  const MAX_AUTOCOMPLETE_RESULTS = 20;

  const entry = (name, rate) => ({ name, rate });
  const ranged = (prefix, values, rates) =>
    values.map((value, index) => entry(`${prefix}${value}`, rates[index]));
  const group = (id, entries) => ({ id, rate: GROUP_RATES[id - 1], entries });

  const fiveTier = (prefix, values, normalRate, rareRate) =>
    ranged(prefix, values, [normalRate, normalRate, normalRate, normalRate, rareRate]);

  const colorSeries = (prefix, values, rates) =>
    ["黃色", "紅色", "藍色"].flatMap((color) => ranged(`${color}${prefix}`, values, rates));

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
      entry("餅乾體力增加41-50%", 1.52),
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
      entry("出現更多技能能量果凍", 0.20),
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
      entry("視野極為狹窄", 3.03),
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
      ),
      ...ranged(
        "體力恢復量減少",
        ["1-3%", "4-6%", "7-9%", "10-11%", "12-14%"],
        [12.12, 12.12, 12.12, 12.12, 1.52],
      ),
    ]),
    group(11, [entry("套用強度150的磁力", 100.00)]),
    group(12, [entry("跳躍次數增加3次", 100.00)]),
    group(13, [
      entry("每隔一段時間獲得熊熊果凍派對道具", 6.25),
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
        )),
      ...ranged(
        "2個盾牌守護者以上時餅乾傷害量增加",
        ["10%", "20%", "30%", "40%", "50%"],
        [3.92, 3.92, 3.92, 3.92, 0.98],
      ),
      ...ranged(
        "2個果凍魔法師以上時餅乾傷害量增加",
        ["10%", "20%", "30%", "40%"],
        [3.92, 3.92, 3.92, 3.92],
      ),
      ...ranged(
        "2個閃避大師以上時餅乾傷害量增加",
        ["40%", "50%"],
        [3.92, 0.98],
      ),
    ]),
    group(17, [
      entry("每隔一段時間弱化怪物防禦力（維持7秒）", 50.00),
      entry("每隔一段時間強化怪物防禦力（維持35秒）", 50.00),
    ]),
    group(18, [
      entry("討伐時100%獲得鑽石砂糖結晶", 1.52),
      entry("討伐時100%獲得金砂糖結晶", 7.58),
      entry("討伐時100%獲得隨機技能寶石(S)", 15.15),
      entry("討伐時100%獲得隨機技能寶石(A)", 30.30),
      entry("討伐時100%獲得隨機技能寶石(B)", 45.45),
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
      isGroupStart: index === 0,
    })),
  );

  const elements = {
    lookupTab: document.querySelector("#lookup-tab"),
    ownedTab: document.querySelector("#owned-tab"),
    lookupPanel: document.querySelector("#lookup-panel"),
    ownedPanel: document.querySelector("#owned-panel"),
    form: document.querySelector("#filter-form"),
    search: document.querySelector("#search-input"),
    group: document.querySelector("#group-filter"),
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

  let nextPropertySlotId = 1;
  let propertySlotStates = [{
    id: nextPropertySlotId,
    value: "",
    isOpen: false,
    activeIndex: -1,
    suggestions: [],
  }];

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
    if (row.isGroupStart) tableRow.classList.add("group-start");

    const groupCell = createCell("群組");
    groupCell.append(createGroupIdentity(row.groupId));

    const groupRateCell = createCell("群組機率", "rate");
    groupRateCell.textContent = formatRate(row.groupRate);

    const itemCell = createCell("附加能力");
    addHighlightedText(itemCell, row.item, highlightTokens);

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

    const filteredRows = rows.filter((row) => {
      const matchesGroup = selectedGroup === "all" || String(row.groupId) === selectedGroup;
      if (!matchesGroup) return false;

      const searchable = normalize([
        `群組 ${row.groupId}`,
        `附加能力群組${row.groupId}`,
        formatRate(row.groupRate),
        row.item,
        formatRate(row.itemRate),
        row.groupId === HIGH_GRADE_GROUP_ID ? "高級屬性 301階以上必定出現" : "",
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
    elements.clear.disabled = rawQuery === "" && selectedGroup === "all";
  }

  function clearFilters() {
    elements.search.value = "";
    elements.group.value = "all";
    applyFilters();
    elements.search.focus();
  }

  function activateTab(tabName, shouldFocus = false) {
    const showLookup = tabName === "lookup";
    if (showLookup) closeAllAutocompletes();
    const tabStates = [
      [elements.lookupTab, elements.lookupPanel, showLookup],
      [elements.ownedTab, elements.ownedPanel, !showLookup],
    ];

    tabStates.forEach(([tab, panel, isActive]) => {
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      panel.hidden = !isActive;
    });

    if (shouldFocus) {
      (showLookup ? elements.lookupTab : elements.ownedTab).focus();
    }
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

    propertySlotStates.forEach((slot, index) => {
      const row = resolveProperty(slot.value);
      if (!row) return;

      const owner = groupOwners.get(row.groupId);
      if (owner) {
        rejectedBySlot.set(slot.id, {
          row,
          slotIndex: index + 1,
          ownerIndex: owner.index + 1,
        });
        return;
      }

      const record = { slot, row, index };
      groupOwners.set(row.groupId, record);
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

  function getAutocompleteMatches(slot) {
    const query = normalize(slot.value);
    const tokens = query.split(" ").filter(Boolean);
    const selectedRows = getAcceptedRows(slot.id);
    const selectedGroups = new Set(selectedRows.map((row) => row.groupId));

    const matches = rows
      .map((row) => {
        if (selectedGroups.has(row.groupId)) return null;

        const normalizedItem = normalize(row.item);
        const searchable = normalize([
          row.item,
          `群組 ${row.groupId}`,
          `群組${row.groupId}`,
          formatRate(row.groupRate),
          formatRate(row.itemRate),
          row.groupId === HIGH_GRADE_GROUP_ID ? "高級屬性 301階以上必定出現" : "",
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
    propertySlotStates.forEach((slot) => {
      if (slot.id !== excludedSlotId) closeAutocomplete(slot);
    });
  }

  function selectAutocompleteRow(slot, row) {
    const groupAlreadyUsed = getAcceptedRows(slot.id)
      .some((selectedRow) => selectedRow.groupId === row.groupId);
    if (groupAlreadyUsed) return;

    slot.value = row.item;
    if (slot.input) slot.input.value = row.item;
    if (slot.feedback) updateSlotFeedback(slot, slot.feedback);
    closeAutocomplete(slot);
    renderAnalysis();
  }

  function createAutocompleteOption(slot, suggestion, index) {
    const { row } = suggestion;
    const option = document.createElement("button");
    option.id = `property-option-${slot.id}-${index}`;
    option.className = "autocomplete-option";
    option.type = "button";
    option.tabIndex = -1;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(index === slot.activeIndex));

    if (index === slot.activeIndex) option.classList.add("is-active");

    const name = document.createElement("span");
    name.className = "autocomplete-option__name";
    name.textContent = row.item;

    const meta = document.createElement("span");
    meta.className = "autocomplete-option__meta";
    meta.textContent = `群組 ${row.groupId}｜群組機率 ${formatRate(row.groupRate)}｜群組內機率 ${formatRate(row.itemRate)}`;

    const badges = document.createElement("span");
    badges.className = "autocomplete-option__badges";

    if (row.groupId === HIGH_GRADE_GROUP_ID) {
      const highGrade = document.createElement("span");
      highGrade.className = "autocomplete-tag autocomplete-tag--high";
      highGrade.textContent = "高級・301階以上必定出現";
      badges.append(highGrade);
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
      ? `property-option-${slot.id}-${slot.activeIndex}`
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
      feedback.textContent = `群組 ${matchedProperty.groupId} 已由現有屬性 ${rejection.ownerIndex} 占用，此輸入不會加入分析。`;
      feedback.classList.add("is-invalid");
      return;
    }

    const highGradeLabel = matchedProperty.groupId === HIGH_GRADE_GROUP_ID
      ? "｜高級屬性・301階以上必定出現"
      : "";
    feedback.textContent = `群組 ${matchedProperty.groupId}｜群組機率 ${formatRate(matchedProperty.groupRate)}｜群組內機率 ${formatRate(matchedProperty.itemRate)}${highGradeLabel}`;
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
    itemCell.textContent = row.item;

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

    const warnings = [...validation.rejectedBySlot.values()].map((rejection) =>
      `現有屬性 ${rejection.slotIndex} 的群組 ${rejection.row.groupId} 已由現有屬性 ${rejection.ownerIndex} 占用，因此未加入分析。`);

    elements.ruleWarning.hidden = warnings.length === 0;
    elements.ruleWarning.textContent = warnings.join(" ");

    const blockedCards = document.createDocumentFragment();
    [...selectedKeysByGroup.entries()]
      .sort(([groupA], [groupB]) => groupA - groupB)
      .forEach(([groupId, selectedKeys]) => {
        blockedCards.append(createBlockedGroupCard(groupId, selectedKeys));
      });

    elements.blockedGroups.replaceChildren(blockedCards);
    elements.blockedEmpty.hidden = selectedKeysByGroup.size !== 0;
    elements.blockedCount.textContent = `${selectedKeysByGroup.size} 個群組`;
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
    propertySlotStates.push({
      id: nextPropertySlotId,
      value: "",
      isOpen: false,
      activeIndex: -1,
      suggestions: [],
    });
    const lastInput = renderPropertySlots();
    renderAnalysis();
    if (lastInput) lastInput.focus();
  }

  function clearAnalysis() {
    closeAllAutocompletes();
    nextPropertySlotId += 1;
    propertySlotStates = [{
      id: nextPropertySlotId,
      value: "",
      isOpen: false,
      activeIndex: -1,
      suggestions: [],
    }];
    const firstInput = renderPropertySlots();
    renderAnalysis();
    if (firstInput) firstInput.focus();
  }

  elements.form.addEventListener("submit", (event) => event.preventDefault());
  elements.search.addEventListener("input", applyFilters);
  elements.group.addEventListener("change", applyFilters);
  elements.clear.addEventListener("click", clearFilters);
  elements.lookupTab.addEventListener("click", () => activateTab("lookup"));
  elements.ownedTab.addEventListener("click", () => activateTab("owned"));
  elements.lookupTab.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      activateTab("owned", true);
    }
  });
  elements.ownedTab.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      activateTab("lookup", true);
    }
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
    const clickedInsideAutocomplete = propertySlotStates.some((slot) =>
      slot.combobox && slot.combobox.contains(event.target));
    if (!clickedInsideAutocomplete) closeAllAutocompletes();
  });

  activateTab("lookup");
  populateGroupFilter();
  renderPropertySlots();
  renderAnalysis();
  applyFilters();

  if (groups.length !== 19 || rows.length !== 183) {
    console.warn(`資料筆數與預期不符：${groups.length} 個群組、${rows.length} 筆項目。`);
  }
})();
