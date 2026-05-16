(function () {
  'use strict';

  const rulesStore = globalThis.BoardMuteRulesStore;
  const DEFAULT_SITE_ID = rulesStore ? rulesStore.DEFAULT_SITE_ID : 'dcinside';
  const SITE_CONFIGS = {
    dcinside: {
      siteId: 'dcinside',
      displayName: '디시',
      optionLabel: '디시인사이드',
      hostLabel: 'gall.dcinside.com',
      titleSummaryLabel: '디시 제목',
      toggleHeading: '디시 차단',
      toggleAriaLabel: '디시 차단 켜기'
    },
    fmkorea: {
      siteId: 'fmkorea',
      displayName: '에펨코리아',
      optionLabel: '에펨코리아',
      hostLabel: 'www.fmkorea.com',
      titleSummaryLabel: '펨코 제목',
      toggleHeading: '에펨코리아 차단',
      toggleAriaLabel: '에펨코리아 차단 켜기'
    },
    ruliweb: {
      siteId: 'ruliweb',
      displayName: '루리웹',
      optionLabel: '루리웹',
      hostLabel: 'bbs.ruliweb.com',
      titleSummaryLabel: '루리웹 제목',
      toggleHeading: '루리웹 차단',
      toggleAriaLabel: '루리웹 차단 켜기'
    },
    mlbpark: {
      siteId: 'mlbpark',
      displayName: '엠팍',
      optionLabel: '엠팍',
      hostLabel: 'mlbpark.donga.com',
      titleSummaryLabel: '엠팍 제목',
      toggleHeading: '엠팍 차단',
      toggleAriaLabel: '엠팍 차단 켜기'
    },
    clien: {
      siteId: 'clien',
      displayName: '클리앙',
      optionLabel: '클리앙',
      hostLabel: 'www.clien.net/service/board',
      titleSummaryLabel: '클리앙 제목',
      toggleHeading: '클리앙 차단',
      toggleAriaLabel: '클리앙 차단 켜기'
    },
    todayhumor: {
      siteId: 'todayhumor',
      displayName: '오늘의유머',
      optionLabel: '오늘의유머',
      hostLabel: 'www.todayhumor.co.kr',
      titleSummaryLabel: '오유 제목',
      toggleHeading: '오늘의유머 차단',
      toggleAriaLabel: '오늘의유머 차단 켜기'
    }
  };
  const DEFAULT_RULES = {
    titleKeywords: ['막글', '나는내향적', '로또'],
    writerValues: ['야갤', '손발이시립디다', 'stool3653']
  };

  const statusText = document.getElementById('statusText');
  const statusDot = document.querySelector('.status-dot');
  const siteSelect = document.getElementById('siteSelect');
  const siteTitleSummaryLabel = document.getElementById('siteTitleSummaryLabel');
  const titleKeywordCount = document.getElementById('titleKeywordCount');
  const writerValueCount = document.getElementById('writerValueCount');
  const siteToggleHeading = document.getElementById('siteToggleHeading');
  const siteEnabledText = document.getElementById('siteEnabledText');
  const siteEnabledToggle = document.getElementById('siteEnabledToggle');
  const siteRulesHeading = document.getElementById('siteRulesHeading');
  const siteRulesHost = document.getElementById('siteRulesHost');
  const titleKeywordList = document.getElementById('titleKeywordList');
  const writerValueList = document.getElementById('writerValueList');
  const titleKeywordForm = document.getElementById('titleKeywordForm');
  const titleKeywordInput = document.getElementById('titleKeywordInput');
  const titleKeywordAddButton = document.getElementById('titleKeywordAddButton');
  const titleKeywordFeedback = document.getElementById('titleKeywordFeedback');
  const globalTitleKeywordCount = document.getElementById('globalTitleKeywordCount');
  const globalTitleKeywordList = document.getElementById('globalTitleKeywordList');
  const globalTitleKeywordForm = document.getElementById('globalTitleKeywordForm');
  const globalTitleKeywordInput = document.getElementById('globalTitleKeywordInput');
  const globalTitleKeywordAddButton = document.getElementById('globalTitleKeywordAddButton');
  const globalTitleKeywordFeedback = document.getElementById('globalTitleKeywordFeedback');
  const writerValueForm = document.getElementById('writerValueForm');
  const writerValueInput = document.getElementById('writerValueInput');
  const writerValueTypeSelect = document.getElementById('writerValueTypeSelect');
  const writerValueAddButton = document.getElementById('writerValueAddButton');
  const writerValueFeedback = document.getElementById('writerValueFeedback');
  const writerSourceFilterSelect = document.getElementById('writerSourceFilterSelect');
  const writerSearchInput = document.getElementById('writerSearchInput');
  const writerFilterButtons = Array.from(document.querySelectorAll('[data-writer-filter]'));
  const WRITER_TYPE_LABELS = {
    uid: '아이디',
    ip: 'IP',
    nick: '닉네임',
    unknown: '미분류'
  };
  const WRITER_SOURCE_LABELS = {
    page: '페이지에서 추가',
    popup: '직접 추가',
    legacy: '이전됨',
    default: '기본값',
    unknown: '출처 미확인'
  };
  let currentSiteId = DEFAULT_SITE_ID;
  let currentRules = getDefaultRules();
  let currentGlobalRules = getDefaultRulesDocument().global;
  let currentRulesDocument = getDefaultRulesDocument();
  let currentWriterFilter = 'all';
  let currentWriterSourceFilter = 'all';
  let currentWriterSearchQuery = '';
  let isSaving = false;

  function createFallbackWriterEntries(writerValues, source = 'unknown') {
    return writerValues.map((writerValue) => ({
      value: writerValue,
      type: 'unknown',
      source
    }));
  }

  function syncWriterEntriesWithValues(writerValues, writerEntries, source = 'unknown') {
    if (rulesStore && rulesStore.syncWriterEntriesWithValues) {
      return rulesStore.syncWriterEntriesWithValues(writerValues, writerEntries || [], source);
    }

    const entryByValue = {};

    (writerEntries || []).forEach((entry) => {
      if (entry && typeof entry.value === 'string' && !entryByValue[entry.value]) {
        entryByValue[entry.value] = entry;
      }
    });

    return writerValues.map((writerValue) =>
      entryByValue[writerValue] || {
        value: writerValue,
        type: 'unknown',
        source
      }
    );
  }

  function createWriterEntry(
    value,
    type = 'unknown',
    source = 'popup',
    createdAt = new Date().toISOString()
  ) {
    if (rulesStore && rulesStore.createWriterEntry) {
      return rulesStore.createWriterEntry(value, type, source, createdAt);
    }

    return {
      value,
      type,
      source,
      createdAt
    };
  }

  function getCurrentSiteConfig() {
    return SITE_CONFIGS[currentSiteId] || SITE_CONFIGS[DEFAULT_SITE_ID];
  }

  function getSiteDisabledText() {
    return `${getCurrentSiteConfig().displayName} 차단 꺼짐`;
  }

  function updateSiteLabels() {
    const siteConfig = getCurrentSiteConfig();

    if (siteSelect) {
      siteSelect.value = siteConfig.siteId;
    }

    siteTitleSummaryLabel.textContent = siteConfig.titleSummaryLabel;
    siteToggleHeading.textContent = siteConfig.toggleHeading;
    siteEnabledToggle.setAttribute('aria-label', siteConfig.toggleAriaLabel);
    siteRulesHeading.textContent = `${siteConfig.displayName} 규칙`;
    siteRulesHost.textContent = siteConfig.hostLabel;
  }

  function getDefaultRulesDocument() {
    if (rulesStore) {
      return rulesStore.getDefaultRulesDocument();
    }

    return {
      version: 2,
      global: {
        titleKeywords: [],
        writerValues: []
      },
      sites: {
        [currentSiteId]: {
          enabled: true,
          titleKeywords: [...DEFAULT_RULES.titleKeywords],
          writerValues: [...DEFAULT_RULES.writerValues],
          writerEntries: createFallbackWriterEntries(DEFAULT_RULES.writerValues, 'default')
        }
      }
    };
  }

  function getDefaultRules() {
    if (rulesStore) {
      return rulesStore.getSiteRules(getDefaultRulesDocument(), currentSiteId);
    }

    return {
      enabled: true,
      titleKeywords: [...DEFAULT_RULES.titleKeywords],
      writerValues: [...DEFAULT_RULES.writerValues],
      writerEntries: createFallbackWriterEntries(DEFAULT_RULES.writerValues, 'default')
    };
  }

  function readRules() {
    if (!rulesStore) {
      return Promise.resolve({
        rules: getDefaultRules(),
        rulesDocument: getDefaultRulesDocument(),
        siteRules: getDefaultRules(),
        source: 'default-rules-store-unavailable'
      });
    }

    return rulesStore.loadRulesForSite(currentSiteId);
  }

  function saveRules(rules) {
    if (!rulesStore) {
      return Promise.reject(new Error('storage unavailable'));
    }

    return rulesStore.saveSiteRules(currentRulesDocument, currentSiteId, {
      enabled: rules.enabled !== false,
      titleKeywords: rules.titleKeywords,
      writerValues: rules.writerValues,
      writerEntries: rules.writerEntries || currentRules.writerEntries
    });
  }

  function saveGlobalRules(globalRules) {
    if (!rulesStore) {
      return Promise.reject(new Error('storage unavailable'));
    }

    return rulesStore.saveGlobalRules(currentRulesDocument, {
      titleKeywords: globalRules.titleKeywords,
      writerValues: globalRules.writerValues
    });
  }

  function renderList(listElement, values, options = {}) {
    listElement.replaceChildren();

    if (values.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'empty-message';
      emptyItem.textContent = '없음';
      listElement.append(emptyItem);
      return;
    }

    values.forEach((value) => {
      const item = document.createElement('li');
      item.className = 'chip';

      const label = document.createElement('span');
      label.className = 'chip-label';
      label.textContent = value;
      item.append(label);

      if (options.onRemove) {
        item.className = 'chip chip-with-action';

        const removeButton = document.createElement('button');
        const removeLabel = options.removeLabel || '삭제';
        removeButton.className = 'chip-remove-button';
        removeButton.type = 'button';
        removeButton.textContent = 'x';
        removeButton.disabled = isSaving;
        removeButton.setAttribute('aria-label', `${removeLabel}: ${value}`);
        removeButton.addEventListener('click', () => {
          options.onRemove(value);
        });
        item.append(removeButton);
      }

      listElement.append(item);
    });
  }

  function getWriterTypeLabel(type) {
    return WRITER_TYPE_LABELS[type] || WRITER_TYPE_LABELS.unknown;
  }

  function getWriterSourceLabel(source) {
    return WRITER_SOURCE_LABELS[source] || WRITER_SOURCE_LABELS.unknown;
  }

  function formatWriterEntryDate(createdAt) {
    if (typeof createdAt !== 'string' || !createdAt.trim()) {
      return '';
    }

    const time = Date.parse(createdAt);

    if (Number.isNaN(time)) {
      return '';
    }

    return new Date(time).toISOString().slice(0, 10);
  }

  function getWriterEntryMetaText(entry) {
    const sourceLabel = getWriterSourceLabel(entry.source);
    const createdDate = formatWriterEntryDate(entry.createdAt);

    return createdDate ? `${sourceLabel} · ${createdDate}` : sourceLabel;
  }

  function getWriterEntryCreatedTime(entry) {
    if (!entry || typeof entry.createdAt !== 'string' || !entry.createdAt.trim()) {
      return null;
    }

    const time = Date.parse(entry.createdAt);

    return Number.isNaN(time) ? null : time;
  }

  function sortWriterEntriesForDisplay(entries) {
    return entries
      .map((entry, index) => ({
        entry,
        index,
        createdTime: getWriterEntryCreatedTime(entry)
      }))
      .sort((left, right) => {
        const leftHasDate = typeof left.createdTime === 'number';
        const rightHasDate = typeof right.createdTime === 'number';

        if (leftHasDate && rightHasDate && left.createdTime !== right.createdTime) {
          return right.createdTime - left.createdTime;
        }

        if (leftHasDate !== rightHasDate) {
          return leftHasDate ? -1 : 1;
        }

        return left.index - right.index;
      })
      .map((item) => item.entry);
  }

  function normalizeSearchQuery(value) {
    return typeof value === 'string' ? value.trim().toLocaleLowerCase() : '';
  }

  function renderWriterFilterButtons() {
    writerFilterButtons.forEach((button) => {
      const isActive = button.dataset.writerFilter === currentWriterFilter;

      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function renderWriterEntryList(entries) {
    writerValueList.replaceChildren();
    renderWriterFilterButtons();
    writerSourceFilterSelect.value = currentWriterSourceFilter;
    writerSearchInput.value = currentWriterSearchQuery;

    const displayEntries = sortWriterEntriesForDisplay(entries);
    const normalizedWriterSearchQuery = normalizeSearchQuery(currentWriterSearchQuery);
    const filteredEntries = displayEntries.filter((entry) => {
      const matchesType = currentWriterFilter === 'all' || entry.type === currentWriterFilter;
      const matchesSource =
        currentWriterSourceFilter === 'all' || entry.source === currentWriterSourceFilter;
      const matchesSearch =
        !normalizedWriterSearchQuery ||
        entry.value.toLocaleLowerCase().includes(normalizedWriterSearchQuery);

      return matchesType && matchesSource && matchesSearch;
    });

    if (filteredEntries.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'empty-message';
      emptyItem.textContent = '없음';
      writerValueList.append(emptyItem);
      return;
    }

    filteredEntries.forEach((entry) => {
      const item = document.createElement('li');
      item.className = 'writer-entry';

      const typeLabel = document.createElement('span');
      typeLabel.className = `writer-entry-type ${entry.type}`;
      typeLabel.textContent = getWriterTypeLabel(entry.type);
      item.append(typeLabel);

      const main = document.createElement('span');
      main.className = 'writer-entry-main';

      const valueLabel = document.createElement('span');
      valueLabel.className = 'writer-entry-value';
      valueLabel.textContent = entry.value;
      main.append(valueLabel);

      const metaLabel = document.createElement('span');
      metaLabel.className = 'writer-entry-meta';
      metaLabel.textContent = getWriterEntryMetaText(entry);
      main.append(metaLabel);

      item.append(main);

      const removeButton = document.createElement('button');
      removeButton.className = 'writer-entry-remove-button';
      removeButton.type = 'button';
      removeButton.textContent = 'x';
      removeButton.disabled = isSaving;
      removeButton.setAttribute('aria-label', `작성자/아이디/IP 값 삭제: ${entry.value}`);
      removeButton.addEventListener('click', () => {
        deleteWriterValue(entry.value);
      });
      item.append(removeButton);

      writerValueList.append(item);
    });
  }

  function setStatus(result, isSiteEnabled) {
    const source = result.source || '';
    const isDefaultRules = source.startsWith('default') || Boolean(result.error);

    statusDot.classList.toggle('is-warning', isDefaultRules || !isSiteEnabled);

    if (!isSiteEnabled) {
      statusText.textContent = getSiteDisabledText();
      return;
    }

    if (source.startsWith('migrated')) {
      statusText.textContent = '이전된 규칙';
      return;
    }

    statusText.textContent = isDefaultRules ? '기본 규칙' : '저장된 규칙';
  }

  function renderRules(result) {
    updateSiteLabels();

    const displayRules = result.siteRules || result.rules;
    const { titleKeywords, writerValues } = displayRules;
    const isSiteEnabled = displayRules.enabled !== false;
    const writerEntries = syncWriterEntriesWithValues(
      writerValues,
      displayRules.writerEntries || [],
      'unknown'
    );

    currentRulesDocument = result.rulesDocument || currentRulesDocument;
    currentGlobalRules = {
      titleKeywords: [...currentRulesDocument.global.titleKeywords],
      writerValues: [...currentRulesDocument.global.writerValues]
    };
    currentRules = {
      enabled: isSiteEnabled,
      titleKeywords: [...titleKeywords],
      writerValues: [...writerValues],
      writerEntries
    };
    siteEnabledToggle.checked = isSiteEnabled;
    siteEnabledText.textContent = isSiteEnabled ? '현재 페이지에 규칙 적용 중' : '규칙 보존, 숨김 중지';
    titleKeywordCount.textContent = String(titleKeywords.length);
    globalTitleKeywordCount.textContent = String(currentGlobalRules.titleKeywords.length);
    writerValueCount.textContent = String(writerValues.length);
    renderList(titleKeywordList, titleKeywords, {
      onRemove: deleteTitleKeyword,
      removeLabel: '제목 키워드 삭제'
    });
    renderList(globalTitleKeywordList, currentGlobalRules.titleKeywords, {
      onRemove: deleteGlobalTitleKeyword,
      removeLabel: '전역 제목 키워드 삭제'
    });
    renderWriterEntryList(writerEntries);
    setStatus(result, isSiteEnabled);
  }

  function setFeedback(feedbackElement, message) {
    feedbackElement.textContent = message;
  }

  function clearFormFeedback() {
    setFeedback(titleKeywordFeedback, '');
    setFeedback(globalTitleKeywordFeedback, '');
    setFeedback(writerValueFeedback, '');
  }

  function loadCurrentSiteRules() {
    statusText.textContent = '규칙 읽는 중';
    siteEnabledText.textContent = '상태 확인 중';
    updateSiteLabels();

    return readRules()
      .then(renderRules)
      .catch(() => {
        renderRules({
          rules: getDefaultRules(),
          rulesDocument: getDefaultRulesDocument(),
          siteRules: getDefaultRules(),
          source: 'default-popup-error'
        });
      });
  }

  function setSaving(nextIsSaving) {
    isSaving = nextIsSaving;
    [titleKeywordList, globalTitleKeywordList, writerValueList]
      .flatMap((listElement) =>
        Array.from(listElement.querySelectorAll('.chip-remove-button, .writer-entry-remove-button'))
      )
      .forEach((button) => {
        button.disabled = nextIsSaving;
      });
    titleKeywordAddButton.disabled = nextIsSaving;
    titleKeywordInput.disabled = nextIsSaving;
    globalTitleKeywordAddButton.disabled = nextIsSaving;
    globalTitleKeywordInput.disabled = nextIsSaving;
    writerValueAddButton.disabled = nextIsSaving;
    writerValueInput.disabled = nextIsSaving;
    writerValueTypeSelect.disabled = nextIsSaving;
    writerSourceFilterSelect.disabled = nextIsSaving;
    writerSearchInput.disabled = nextIsSaving;
    siteEnabledToggle.disabled = nextIsSaving;
    siteSelect.disabled = nextIsSaving;
  }

  function renderSavedRulesDocument(nextRulesDocument) {
    const siteRules = rulesStore
      ? rulesStore.getSiteRules(nextRulesDocument, currentSiteId)
      : currentRules;

    renderRules({
      rulesDocument: nextRulesDocument,
      siteRules,
      rules: siteRules,
      source: 'storage-v2'
    });
  }

  function createRulesWithTitleKeyword(keyword) {
    return {
      enabled: currentRules.enabled !== false,
      titleKeywords: [...currentRules.titleKeywords, keyword],
      writerValues: [...currentRules.writerValues],
      writerEntries: [...currentRules.writerEntries]
    };
  }

  function createGlobalRulesWithTitleKeyword(keyword) {
    return {
      titleKeywords: [...currentGlobalRules.titleKeywords, keyword],
      writerValues: [...currentGlobalRules.writerValues]
    };
  }

  function createRulesWithWriterValue(writerValue, writerType) {
    const writerValues = [...currentRules.writerValues, writerValue];
    const writerEntry = createWriterEntry(writerValue, writerType, 'popup');
    const writerEntries = syncWriterEntriesWithValues(
      writerValues,
      [...currentRules.writerEntries, writerEntry],
      'unknown'
    );

    return {
      enabled: currentRules.enabled !== false,
      titleKeywords: [...currentRules.titleKeywords],
      writerValues,
      writerEntries
    };
  }

  function createRulesWithUpdatedWriterEntry(writerValue, writerType) {
    const writerEntries = syncWriterEntriesWithValues(
      currentRules.writerValues,
      currentRules.writerEntries.map((entry) =>
        entry.value === writerValue
          ? createWriterEntry(
              writerValue,
              writerType,
              'popup',
              entry.createdAt || new Date().toISOString()
            )
          : entry
      ),
      'unknown'
    );

    return {
      enabled: currentRules.enabled !== false,
      titleKeywords: [...currentRules.titleKeywords],
      writerValues: [...currentRules.writerValues],
      writerEntries
    };
  }

  function createRulesWithoutTitleKeyword(keyword) {
    return {
      enabled: currentRules.enabled !== false,
      titleKeywords: currentRules.titleKeywords.filter((value) => value !== keyword),
      writerValues: [...currentRules.writerValues],
      writerEntries: [...currentRules.writerEntries]
    };
  }

  function createGlobalRulesWithoutTitleKeyword(keyword) {
    return {
      titleKeywords: currentGlobalRules.titleKeywords.filter((value) => value !== keyword),
      writerValues: [...currentGlobalRules.writerValues]
    };
  }

  function createRulesWithoutWriterValue(writerValue) {
    const writerValues = currentRules.writerValues.filter((value) => value !== writerValue);

    return {
      enabled: currentRules.enabled !== false,
      titleKeywords: [...currentRules.titleKeywords],
      writerValues,
      writerEntries: syncWriterEntriesWithValues(
        writerValues,
        currentRules.writerEntries.filter((entry) => entry.value !== writerValue),
        'unknown'
      )
    };
  }

  function createRulesWithEnabled(isEnabled) {
    return {
      enabled: isEnabled,
      titleKeywords: [...currentRules.titleKeywords],
      writerValues: [...currentRules.writerValues],
      writerEntries: [...currentRules.writerEntries]
    };
  }

  function updateSiteEnabled(isEnabled) {
    if (isSaving || currentRules.enabled === isEnabled) {
      siteEnabledToggle.checked = currentRules.enabled !== false;
      return;
    }

    const nextRules = createRulesWithEnabled(isEnabled);

    setSaving(true);
    saveRules(nextRules)
      .then((nextRulesDocument) => {
        renderSavedRulesDocument(nextRulesDocument);
        setFeedback(
          writerValueFeedback,
          isEnabled
            ? `${getCurrentSiteConfig().displayName} 차단 켜짐`
            : getSiteDisabledText()
        );
      })
      .catch(() => {
        siteEnabledToggle.checked = currentRules.enabled !== false;
        setFeedback(writerValueFeedback, '저장 실패');
      })
      .finally(() => {
        setSaving(false);
      });
  }

  function deleteTitleKeyword(keyword) {
    if (isSaving) {
      return;
    }

    const nextRules = createRulesWithoutTitleKeyword(keyword);

    if (nextRules.titleKeywords.length === currentRules.titleKeywords.length) {
      return;
    }

    setSaving(true);
    saveRules(nextRules)
      .then((nextRulesDocument) => {
        renderSavedRulesDocument(nextRulesDocument);
        setFeedback(titleKeywordFeedback, '삭제됨');
      })
      .catch(() => {
        setFeedback(titleKeywordFeedback, '삭제 실패');
      })
      .finally(() => {
        setSaving(false);
      });
  }

  function deleteGlobalTitleKeyword(keyword) {
    if (isSaving) {
      return;
    }

    const nextGlobalRules = createGlobalRulesWithoutTitleKeyword(keyword);

    if (nextGlobalRules.titleKeywords.length === currentGlobalRules.titleKeywords.length) {
      return;
    }

    setSaving(true);
    saveGlobalRules(nextGlobalRules)
      .then((nextRulesDocument) => {
        renderSavedRulesDocument(nextRulesDocument);
        setFeedback(globalTitleKeywordFeedback, '삭제됨');
      })
      .catch(() => {
        setFeedback(globalTitleKeywordFeedback, '삭제 실패');
      })
      .finally(() => {
        setSaving(false);
      });
  }

  function deleteWriterValue(writerValue) {
    if (isSaving) {
      return;
    }

    const nextRules = createRulesWithoutWriterValue(writerValue);

    if (nextRules.writerValues.length === currentRules.writerValues.length) {
      return;
    }

    setSaving(true);
    saveRules(nextRules)
      .then((nextRulesDocument) => {
        renderSavedRulesDocument(nextRulesDocument);
        setFeedback(writerValueFeedback, '삭제됨');
      })
      .catch(() => {
        setFeedback(writerValueFeedback, '삭제 실패');
      })
      .finally(() => {
        setSaving(false);
      });
  }

  titleKeywordForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const keyword = titleKeywordInput.value.trim();

    if (!keyword) {
      setFeedback(titleKeywordFeedback, '입력값 없음');
      return;
    }

    if (currentRules.titleKeywords.includes(keyword)) {
      setFeedback(titleKeywordFeedback, '이미 있음');
      titleKeywordInput.select();
      return;
    }

    const nextRules = createRulesWithTitleKeyword(keyword);

    setSaving(true);
    saveRules(nextRules)
      .then((nextRulesDocument) => {
        titleKeywordInput.value = '';
        renderSavedRulesDocument(nextRulesDocument);
        setFeedback(titleKeywordFeedback, '추가됨');
      })
      .catch(() => {
        setFeedback(titleKeywordFeedback, '저장 실패');
      })
      .finally(() => {
        setSaving(false);
      });
  });

  globalTitleKeywordForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const keyword = globalTitleKeywordInput.value.trim();

    if (!keyword) {
      setFeedback(globalTitleKeywordFeedback, '입력값 없음');
      return;
    }

    if (currentGlobalRules.titleKeywords.includes(keyword)) {
      setFeedback(globalTitleKeywordFeedback, '이미 있음');
      globalTitleKeywordInput.select();
      return;
    }

    const nextGlobalRules = createGlobalRulesWithTitleKeyword(keyword);

    setSaving(true);
    saveGlobalRules(nextGlobalRules)
      .then((nextRulesDocument) => {
        globalTitleKeywordInput.value = '';
        renderSavedRulesDocument(nextRulesDocument);
        setFeedback(globalTitleKeywordFeedback, '추가됨');
      })
      .catch(() => {
        setFeedback(globalTitleKeywordFeedback, '저장 실패');
      })
      .finally(() => {
        setSaving(false);
      });
  });

  writerValueForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const writerValue = writerValueInput.value.trim();
    const writerType = writerValueTypeSelect.value || 'unknown';

    if (!writerValue) {
      setFeedback(writerValueFeedback, '입력값 없음');
      return;
    }

    if (currentRules.writerValues.includes(writerValue)) {
      const existingEntry = currentRules.writerEntries.find((entry) => entry.value === writerValue);

      if (writerType !== 'unknown' && existingEntry && existingEntry.type !== writerType) {
        const nextRules = createRulesWithUpdatedWriterEntry(writerValue, writerType);

        setSaving(true);
        saveRules(nextRules)
          .then((nextRulesDocument) => {
            renderSavedRulesDocument(nextRulesDocument);
            setFeedback(writerValueFeedback, '분류 변경됨');
          })
          .catch(() => {
            setFeedback(writerValueFeedback, '저장 실패');
          })
          .finally(() => {
            setSaving(false);
          });
        return;
      }

      setFeedback(writerValueFeedback, '이미 있음');
      writerValueInput.select();
      return;
    }

    const nextRules = createRulesWithWriterValue(writerValue, writerType);

    setSaving(true);
    saveRules(nextRules)
      .then((nextRulesDocument) => {
        writerValueInput.value = '';
        writerValueTypeSelect.value = 'unknown';
        renderSavedRulesDocument(nextRulesDocument);
        setFeedback(writerValueFeedback, '추가됨');
      })
      .catch(() => {
        setFeedback(writerValueFeedback, '저장 실패');
      })
      .finally(() => {
        setSaving(false);
      });
  });

  writerFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentWriterFilter = button.dataset.writerFilter || 'all';
      renderWriterEntryList(currentRules.writerEntries);
    });
  });

  writerSourceFilterSelect.addEventListener('change', () => {
    currentWriterSourceFilter = writerSourceFilterSelect.value || 'all';
    renderWriterEntryList(currentRules.writerEntries);
  });

  writerSearchInput.addEventListener('input', () => {
    currentWriterSearchQuery = writerSearchInput.value;
    renderWriterEntryList(currentRules.writerEntries);
  });

  siteEnabledToggle.addEventListener('change', () => {
    updateSiteEnabled(siteEnabledToggle.checked);
  });

  siteSelect.addEventListener('change', () => {
    if (isSaving) {
      siteSelect.value = currentSiteId;
      return;
    }

    currentSiteId = SITE_CONFIGS[siteSelect.value] ? siteSelect.value : DEFAULT_SITE_ID;
    currentWriterFilter = 'all';
    currentWriterSourceFilter = 'all';
    currentWriterSearchQuery = '';
    clearFormFeedback();
    loadCurrentSiteRules();
  });

  loadCurrentSiteRules();
})();
