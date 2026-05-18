(function (globalScope) {
  'use strict';

  const LEGACY_STORAGE_KEY = 'boardMuteRulesV1';
  const STORAGE_KEY = 'boardMuteRulesV2';
  const DEFAULT_SITE_ID = 'dcinside';
  const FMKOREA_SITE_ID = 'fmkorea';
  const RULIWEB_SITE_ID = 'ruliweb';
  const MLBPARK_SITE_ID = 'mlbpark';
  const CLIEN_SITE_ID = 'clien';
  const TODAYHUMOR_SITE_ID = 'todayhumor';
  const QUASARZONE_SITE_ID = 'quasarzone';
  const SLRCLUB_SITE_ID = 'slrclub';
  const SARAMIN_SITE_ID = 'saramin';
  const DEFAULT_RULES = {
    titleKeywords: ['막글', '나는내향적', '로또'],
    writerValues: ['야갤', '손발이시립디다', 'stool3653']
  };
  const WRITER_ENTRY_TYPES = ['uid', 'ip', 'nick', 'unknown'];
  const WRITER_ENTRY_SOURCES = ['page', 'popup', 'legacy', 'default', 'unknown'];

  function canUseLocalStorage() {
    return (
      typeof chrome !== 'undefined' &&
      chrome.storage &&
      chrome.storage.local
    );
  }

  function normalizeStringArray(value) {
    if (!Array.isArray(value)) {
      return null;
    }

    if (!value.every((item) => typeof item === 'string')) {
      return null;
    }

    return value
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function normalizeWriterEntryType(type) {
    return WRITER_ENTRY_TYPES.includes(type) ? type : 'unknown';
  }

  function normalizeWriterEntrySource(source) {
    return WRITER_ENTRY_SOURCES.includes(source) ? source : 'unknown';
  }

  function createWriterEntry(value, type = 'unknown', source = 'unknown', createdAt = '') {
    if (typeof value !== 'string') {
      return null;
    }

    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return null;
    }

    const entry = {
      value: normalizedValue,
      type: normalizeWriterEntryType(type),
      source: normalizeWriterEntrySource(source)
    };

    if (typeof createdAt === 'string' && createdAt.trim()) {
      entry.createdAt = createdAt.trim();
    }

    return entry;
  }

  function normalizeWriterEntry(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return createWriterEntry(
      value.value,
      value.type,
      value.source,
      value.createdAt
    );
  }

  function normalizeWriterEntries(value) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map(normalizeWriterEntry)
      .filter(Boolean);
  }

  function syncWriterEntriesWithValues(writerValues, writerEntries, fallbackSource = 'unknown') {
    const normalizedEntries = normalizeWriterEntries(writerEntries);
    const entryByValue = {};

    normalizedEntries.forEach((entry) => {
      if (!entryByValue[entry.value]) {
        entryByValue[entry.value] = entry;
      }
    });

    return writerValues
      .map((writerValue) =>
        entryByValue[writerValue] ||
        createWriterEntry(writerValue, 'unknown', fallbackSource)
      )
      .filter(Boolean);
  }

  function normalizeRuleGroup(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    const titleKeywords = normalizeStringArray(value.titleKeywords);
    const writerValues = normalizeStringArray(value.writerValues);

    if (!titleKeywords || !writerValues) {
      return null;
    }

    return {
      titleKeywords,
      writerValues
    };
  }

  function normalizeSiteRules(value) {
    const ruleGroup = normalizeRuleGroup(value);

    if (!ruleGroup) {
      return null;
    }

    return {
      enabled: value.enabled !== false,
      titleKeywords: ruleGroup.titleKeywords,
      writerValues: ruleGroup.writerValues,
      writerEntries: syncWriterEntriesWithValues(
        ruleGroup.writerValues,
        value.writerEntries,
        'unknown'
      )
    };
  }

  function normalizeLegacyRules(value) {
    return normalizeRuleGroup(value);
  }

  function normalizeRulesDocument(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    if (value.version !== 2) {
      return null;
    }

    const globalRules = normalizeRuleGroup(value.global);

    if (!globalRules || !value.sites || typeof value.sites !== 'object' || Array.isArray(value.sites)) {
      return null;
    }

    const sites = {};

    Object.keys(value.sites).forEach((siteId) => {
      const siteRules = normalizeSiteRules(value.sites[siteId]);

      if (siteRules) {
        sites[siteId] = siteRules;
      }
    });

    return {
      version: 2,
      global: globalRules,
      sites
    };
  }

  function getDefaultSiteRules() {
    return {
      enabled: true,
      titleKeywords: [...DEFAULT_RULES.titleKeywords],
      writerValues: [...DEFAULT_RULES.writerValues],
      writerEntries: syncWriterEntriesWithValues(
        DEFAULT_RULES.writerValues,
        [],
        'default'
      )
    };
  }

  function getDefaultRulesDocument() {
    return {
      version: 2,
      global: {
        titleKeywords: [],
        writerValues: []
      },
      sites: {
        [DEFAULT_SITE_ID]: getDefaultSiteRules()
      }
    };
  }

  function createRulesDocumentFromLegacyRules(legacyRules) {
    return {
      version: 2,
      global: {
        titleKeywords: [],
        writerValues: []
      },
      sites: {
        [DEFAULT_SITE_ID]: {
          enabled: true,
          titleKeywords: [...legacyRules.titleKeywords],
          writerValues: [...legacyRules.writerValues],
          writerEntries: syncWriterEntriesWithValues(
            legacyRules.writerValues,
            [],
            'legacy'
          )
        }
      }
    };
  }

  function getSiteRules(rulesDocument, siteId) {
    const siteRules = rulesDocument.sites[siteId];

    if (!siteRules) {
      return {
        enabled: true,
        titleKeywords: [],
        writerValues: [],
        writerEntries: []
      };
    }

    return {
      enabled: siteRules.enabled !== false,
      titleKeywords: [...siteRules.titleKeywords],
      writerValues: [...siteRules.writerValues],
      writerEntries: syncWriterEntriesWithValues(
        siteRules.writerValues,
        siteRules.writerEntries,
        'unknown'
      )
    };
  }

  function uniqueValues(values) {
    return Array.from(new Set(values));
  }

  function combineRulesForSite(rulesDocument, siteId) {
    const siteRules = getSiteRules(rulesDocument, siteId);

    if (!siteRules.enabled) {
      return {
        titleKeywords: [],
        writerValues: []
      };
    }

    return {
      titleKeywords: uniqueValues([
        ...rulesDocument.global.titleKeywords,
        ...siteRules.titleKeywords
      ]),
      writerValues: uniqueValues(siteRules.writerValues)
    };
  }

  function setSiteRules(rulesDocument, siteId, nextSiteRules) {
    const currentSiteRules = getSiteRules(rulesDocument, siteId);
    const normalizedSiteRules = normalizeSiteRules({
      enabled: nextSiteRules.enabled !== false,
      titleKeywords: nextSiteRules.titleKeywords,
      writerValues: nextSiteRules.writerValues,
      writerEntries: Array.isArray(nextSiteRules.writerEntries)
        ? nextSiteRules.writerEntries
        : currentSiteRules.writerEntries
    });

    if (!normalizedSiteRules) {
      return null;
    }

    return {
      version: 2,
      global: {
        titleKeywords: [...rulesDocument.global.titleKeywords],
        writerValues: [...rulesDocument.global.writerValues]
      },
      sites: {
        ...rulesDocument.sites,
        [siteId]: normalizedSiteRules
      }
    };
  }

  function setGlobalRules(rulesDocument, nextGlobalRules) {
    const normalizedGlobalRules = normalizeRuleGroup(nextGlobalRules);

    if (!normalizedGlobalRules) {
      return null;
    }

    return {
      version: 2,
      global: normalizedGlobalRules,
      sites: {
        ...rulesDocument.sites
      }
    };
  }

  function getSiteIdFromUrl(url) {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname === 'gall.dcinside.com') {
        return DEFAULT_SITE_ID;
      }

      if (parsedUrl.hostname === 'www.fmkorea.com') {
        return FMKOREA_SITE_ID;
      }

      if (parsedUrl.hostname === 'bbs.ruliweb.com') {
        return RULIWEB_SITE_ID;
      }

      if (parsedUrl.hostname === 'mlbpark.donga.com') {
        return MLBPARK_SITE_ID;
      }

      if (
        parsedUrl.hostname === 'www.clien.net' &&
        parsedUrl.pathname.startsWith('/service/board/')
      ) {
        return CLIEN_SITE_ID;
      }

      if (
        parsedUrl.hostname === 'www.todayhumor.co.kr' &&
        (
          parsedUrl.pathname === '/' ||
          parsedUrl.pathname === '/board/list.php' ||
          parsedUrl.pathname === '/board/view.php'
        )
      ) {
        return TODAYHUMOR_SITE_ID;
      }

      if (
        parsedUrl.hostname === 'quasarzone.com' &&
        parsedUrl.pathname.startsWith('/bbs/')
      ) {
        return QUASARZONE_SITE_ID;
      }

      if (
        parsedUrl.hostname === 'www.slrclub.com' &&
        parsedUrl.pathname === '/bbs/zboard.php'
      ) {
        return SLRCLUB_SITE_ID;
      }

      if (
        parsedUrl.hostname === 'www.saramin.co.kr' &&
        (
          parsedUrl.pathname === '/zf_user/search' ||
          parsedUrl.pathname === '/zf_user/jobs/list/job-category'
        )
      ) {
        return SARAMIN_SITE_ID;
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  function buildRulesResult(rulesDocument, siteId, details) {
    return {
      rulesDocument,
      siteId,
      siteRules: getSiteRules(rulesDocument, siteId),
      rules: combineRulesForSite(rulesDocument, siteId),
      source: details.source,
      migrated: Boolean(details.migrated),
      defaultSaved: Boolean(details.defaultSaved),
      error: details.error || null
    };
  }

  function saveRulesDocument(rulesDocument) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [STORAGE_KEY]: rulesDocument }, () => {
        const writeError = chrome.runtime.lastError;

        if (writeError) {
          reject(new Error(writeError.message));
          return;
        }

        resolve(rulesDocument);
      });
    });
  }

  function loadRulesForSite(siteId = DEFAULT_SITE_ID) {
    if (!canUseLocalStorage()) {
      const defaultRulesDocument = getDefaultRulesDocument();

      return Promise.resolve(buildRulesResult(defaultRulesDocument, siteId, {
        source: 'default-storage-unavailable'
      }));
    }

    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEY, LEGACY_STORAGE_KEY], (items) => {
        const readError = chrome.runtime.lastError;

        if (readError) {
          const defaultRulesDocument = getDefaultRulesDocument();

          resolve(buildRulesResult(defaultRulesDocument, siteId, {
            source: 'default-storage-read-error',
            error: readError.message
          }));
          return;
        }

        const hasV2 = Object.prototype.hasOwnProperty.call(items, STORAGE_KEY);
        const hasV1 = Object.prototype.hasOwnProperty.call(items, LEGACY_STORAGE_KEY);
        const normalizedV2 = normalizeRulesDocument(items[STORAGE_KEY]);

        if (normalizedV2) {
          resolve(buildRulesResult(normalizedV2, siteId, {
            source: 'storage-v2'
          }));
          return;
        }

        const normalizedV1 = normalizeLegacyRules(items[LEGACY_STORAGE_KEY]);

        if (normalizedV1) {
          const migratedRulesDocument = createRulesDocumentFromLegacyRules(normalizedV1);

          chrome.storage.local.set({ [STORAGE_KEY]: migratedRulesDocument }, () => {
            const writeError = chrome.runtime.lastError;

            resolve(buildRulesResult(migratedRulesDocument, siteId, {
              source: hasV2 ? 'migrated-v1-to-v2-after-invalid-v2' : 'migrated-v1-to-v2',
              migrated: !writeError,
              error: writeError ? writeError.message : null
            }));
          });
          return;
        }

        const defaultRulesDocument = getDefaultRulesDocument();

        chrome.storage.local.set({ [STORAGE_KEY]: defaultRulesDocument }, () => {
          const writeError = chrome.runtime.lastError;

          resolve(buildRulesResult(defaultRulesDocument, siteId, {
            source: hasV2 || hasV1 ? 'default-invalid-storage' : 'default-missing-storage',
            defaultSaved: !writeError,
            error: writeError ? writeError.message : null
          }));
        });
      });
    });
  }

  function saveSiteRules(rulesDocument, siteId, nextSiteRules) {
    if (!canUseLocalStorage()) {
      return Promise.reject(new Error('storage unavailable'));
    }

    const normalizedRulesDocument = normalizeRulesDocument(rulesDocument) || getDefaultRulesDocument();
    const nextRulesDocument = setSiteRules(normalizedRulesDocument, siteId, nextSiteRules);

    if (!nextRulesDocument) {
      return Promise.reject(new Error('invalid site rules'));
    }

    return saveRulesDocument(nextRulesDocument);
  }

  function saveGlobalRules(rulesDocument, nextGlobalRules) {
    if (!canUseLocalStorage()) {
      return Promise.reject(new Error('storage unavailable'));
    }

    const normalizedRulesDocument = normalizeRulesDocument(rulesDocument) || getDefaultRulesDocument();
    const nextRulesDocument = setGlobalRules(normalizedRulesDocument, nextGlobalRules);

    if (!nextRulesDocument) {
      return Promise.reject(new Error('invalid global rules'));
    }

    return saveRulesDocument(nextRulesDocument);
  }

  globalScope.BoardMuteRulesStore = {
    LEGACY_STORAGE_KEY,
    STORAGE_KEY,
    DEFAULT_SITE_ID,
    FMKOREA_SITE_ID,
    RULIWEB_SITE_ID,
    MLBPARK_SITE_ID,
    CLIEN_SITE_ID,
    TODAYHUMOR_SITE_ID,
    QUASARZONE_SITE_ID,
    SLRCLUB_SITE_ID,
    SARAMIN_SITE_ID,
    getDefaultRulesDocument,
    getSiteIdFromUrl,
    getSiteRules,
    combineRulesForSite,
    createWriterEntry,
    syncWriterEntriesWithValues,
    loadRulesForSite,
    saveSiteRules,
    saveGlobalRules
  };
})(globalThis);
