(function () {
  'use strict';

  const rulesStore = globalThis.BoardMuteRulesStore;
  const FALLBACK_RULES = {
    titleKeywords: ['막글', '나는내향적', '로또'],
    writerValues: ['야갤', '손발이시립디다', 'stool3653']
  };
  const HIDDEN_REASON_ATTRIBUTE = 'data-board-mute-hidden-reason';
  const TEMPORARILY_SHOWN_ATTRIBUTE = 'data-board-mute-temporarily-shown';
  const OPTIMISTIC_WRITER_ATTRIBUTE = 'data-board-mute-optimistic-writer';
  const SAVED_INLINE_DISPLAY_PRESENT_ATTRIBUTE =
    'data-board-mute-saved-inline-display-present';
  const SAVED_INLINE_DISPLAY_VALUE_ATTRIBUTE = 'data-board-mute-saved-inline-display-value';
  const SAVED_INLINE_DISPLAY_PRIORITY_ATTRIBUTE =
    'data-board-mute-saved-inline-display-priority';
  const WRITER_ACTION_ATTACHED_ATTRIBUTE = 'data-board-mute-writer-action-attached';
  const WRITER_ACTION_CONTAINER_ATTRIBUTE = 'data-board-mute-writer-action-container';
  const WRITER_ACTION_STYLE_ID = 'board-mute-writer-action-style';
  const WRITER_ACTION_BUTTON_CLASS = 'board-mute-writer-action';
  const WRITER_ACTION_MENU_CLASS = 'board-mute-writer-menu';
  const WRITER_ACTION_TOAST_CLASS = 'board-mute-toast';
  const WRITER_ACTION_TOAST_TEXT_CLASS = 'board-mute-toast-text';
  const WRITER_ACTION_TOAST_ACTION_CLASS = 'board-mute-toast-action';
  const REVEAL_CONTROL_STYLE_ID = 'board-mute-reveal-control-style';
  const REVEAL_CONTROL_CLASS = 'board-mute-reveal-control';
  const REVEAL_CONTROL_TEXT_CLASS = 'board-mute-reveal-control-text';
  const REVEAL_CONTROL_BUTTON_CLASS = 'board-mute-reveal-control-button';
  const REVEAL_CONTROL_RECENT_BUTTON_CLASS = 'board-mute-reveal-control-recent-button';
  const RECENT_WRITER_PANEL_CLASS = 'board-mute-recent-writer-panel';
  const RECENT_WRITER_PANEL_HEADER_CLASS = 'board-mute-recent-writer-panel-header';
  const RECENT_WRITER_PANEL_LIST_CLASS = 'board-mute-recent-writer-list';
  const RECENT_WRITER_PANEL_ENTRY_CLASS = 'board-mute-recent-writer-entry';
  const RECENT_WRITER_PANEL_TYPE_CLASS = 'board-mute-recent-writer-type';
  const RECENT_WRITER_PANEL_VALUE_CLASS = 'board-mute-recent-writer-value';
  const RECENT_WRITER_PANEL_EMPTY_CLASS = 'board-mute-recent-writer-empty';
  const HIDDEN_REASONS = ['title-keyword', 'writer'];
  const APPLY_DEBOUNCE_MS = 120;
  const RECENT_WRITER_ENTRY_LIMIT = 5;
  const DCINSIDE_POST_ROW_SELECTOR = 'tr.ub-content';
  const DCINSIDE_TITLE_CELL_SELECTOR = '.gall_tit.ub-word';
  const DCINSIDE_WRITER_CELL_SELECTOR = '.gall_writer.ub-writer';
  const DCINSIDE_EXCLUDED_ROW_NUMBER_TEXTS = new Set(['공지', '설문']);
  const DCINSIDE_WRITER_CANDIDATES = [
    { type: 'uid', label: '아이디', attribute: 'data-uid' },
    { type: 'ip', label: 'IP', attribute: 'data-ip' },
    { type: 'nick', label: '닉네임', attribute: 'data-nick' }
  ];
  const FMKOREA_POST_ROW_SELECTOR = 'tr';
  const FMKOREA_TITLE_CELL_SELECTOR = 'td.title';
  const FMKOREA_TITLE_LINK_SELECTOR = 'td.title a[href]';
  const FMKOREA_WRITER_CELL_SELECTOR = 'td.author';
  const FMKOREA_MEMBER_CLASS_PATTERN = /^member_\d+$/;
  const RULIWEB_POST_ROW_SELECTOR = 'tr.table_body.blocktarget';
  const RULIWEB_TITLE_CELL_SELECTOR = 'td.subject';
  const RULIWEB_TITLE_LINK_SELECTOR = 'td.subject a.subject_link';
  const RULIWEB_WRITER_CELL_SELECTOR = 'td.writer';
  const RULIWEB_MEMBER_SRL_SELECTOR = 'input.member_srl[value]';
  const MLBPARK_POST_ROW_SELECTOR = 'tr';
  const MLBPARK_TITLE_CELL_SELECTOR = 'td[id^="list_"]';
  const MLBPARK_TITLE_LINK_SELECTOR = 'td[id^="list_"] a.txt[href]';
  const MLBPARK_WRITER_LINK_SELECTOR = 'a[data-uid][data-unick]';
  const MLBPARK_USER_ID_SEPARATOR = ':';
  const MLBPARK_POST_NUMBER_PATTERN = /^\d+$/;
  const CLIEN_POST_ROW_SELECTOR =
    'div.list_item.symph_row[data-role="list-row"][data-author-id][data-board-sn]';
  const CLIEN_TITLE_CELL_SELECTOR = 'div.list_title[data-role="list-title"]';
  const CLIEN_TITLE_LINK_SELECTOR = 'a.list_subject[href]';
  const CLIEN_WRITER_CELL_SELECTOR = 'div.list_author[data-role="list-author"]';
  const TODAYHUMOR_LIST_ROW_SELECTOR = 'tr.view[class*="list_tr_"]';
  const TODAYHUMOR_VIEW_POST_SELECTOR = '#containerInner';
  const TODAYHUMOR_POST_ROW_SELECTOR = `${TODAYHUMOR_LIST_ROW_SELECTOR}, ${TODAYHUMOR_VIEW_POST_SELECTOR}`;
  const TODAYHUMOR_TITLE_CELL_SELECTOR = 'td.subject';
  const TODAYHUMOR_TITLE_LINK_SELECTOR = 'td.subject a[href*="/board/view.php"]';
  const TODAYHUMOR_WRITER_CELL_SELECTOR = 'td.name';
  const TODAYHUMOR_WRITER_LINK_SELECTOR = 'a.list_name_member[href*="mn="]';
  const TODAYHUMOR_VIEW_TITLE_SELECTOR = '.viewSubjectDiv';
  const TODAYHUMOR_VIEW_WRITER_SELECTOR = '#viewPageWriterNameSpan[mn]';
  const WRITER_TYPE_LABELS = {
    uid: '아이디',
    ip: 'IP',
    nick: '닉네임',
    unknown: '미분류'
  };
  let activeWriterMenu = null;
  let activeRecentWriterPanel = null;
  let toastTimer = null;
  let activeRules = null;
  let applyTimer = null;
  let postRowObserver = null;
  let storageChangeListenerAttached = false;

  const dcinsideAdapter = {
    siteId: 'dcinside',
    displayName: '디시',
    postRowSelector: DCINSIDE_POST_ROW_SELECTOR,
    writerCellSelector: DCINSIDE_WRITER_CELL_SELECTOR,

    matchesUrl(url) {
      try {
        return new URL(url).hostname === 'gall.dcinside.com';
      } catch (error) {
        return false;
      }
    },

    isExcludedPostRow(row) {
      const numberCell = row.querySelector('.gall_num');
      const numberText = numberCell ? numberCell.textContent.trim() : '';

      return DCINSIDE_EXCLUDED_ROW_NUMBER_TEXTS.has(numberText);
    },

    isSupportedPostRow(row) {
      if (this.isExcludedPostRow(row)) {
        return false;
      }

      if (row.classList.contains('us-post')) {
        return true;
      }

      const writerCell = row.querySelector(this.writerCellSelector);

      return writerCell && writerCell.getAttribute('data-loc') === 'view_list';
    },

    getPostRows(root) {
      return Array.from(root.querySelectorAll(this.postRowSelector)).filter((row) =>
        this.isSupportedPostRow(row)
      );
    },

    containsPostRows(node) {
      if (!node || node.nodeType !== 1) {
        return false;
      }

      return (
        node.matches(this.postRowSelector) ||
        Boolean(node.querySelector(this.postRowSelector))
      );
    },

    getTitleText(row) {
      const titleCell = row.querySelector(DCINSIDE_TITLE_CELL_SELECTOR);

      return titleCell ? titleCell.textContent : '';
    },

    getWriterCell(row) {
      return row.querySelector(this.writerCellSelector);
    },

    getWriterValues(row) {
      const writerCell = this.getWriterCell(row);

      if (!writerCell) {
        return [];
      }

      return [
        writerCell.getAttribute('data-nick'),
        writerCell.getAttribute('data-uid'),
        writerCell.getAttribute('data-ip')
      ].filter(Boolean);
    },

    getWriterCandidates(writerCell) {
      return DCINSIDE_WRITER_CANDIDATES
        .map((candidate) => ({
          ...candidate,
          value: (writerCell.getAttribute(candidate.attribute) || '').trim()
        }))
        .filter((candidate) => candidate.value);
    }
  };

  function getFmkoreaMemberClass(writerCell) {
    const memberElement = writerCell.querySelector('[class*="member_"]');

    if (!memberElement) {
      return '';
    }

    return (
      Array.from(memberElement.classList).find((className) =>
        FMKOREA_MEMBER_CLASS_PATTERN.test(className)
      ) || ''
    );
  }

  function getFmkoreaWriterDisplayName(writerCell) {
    const writerElement =
      writerCell.querySelector('[class*="member_"]') ||
      writerCell.querySelector('a[href]') ||
      writerCell;

    return (writerElement.textContent || '').trim();
  }

  function getUniqueTrimmedValues(values) {
    return Array.from(
      new Set(
        values
          .map((value) => (typeof value === 'string' ? value.trim() : ''))
          .filter(Boolean)
      )
    );
  }

  const fmkoreaAdapter = {
    siteId: 'fmkorea',
    displayName: '에펨코리아',
    postRowSelector: FMKOREA_POST_ROW_SELECTOR,
    writerCellSelector: FMKOREA_WRITER_CELL_SELECTOR,

    matchesUrl(url) {
      try {
        return new URL(url).hostname === 'www.fmkorea.com';
      } catch (error) {
        return false;
      }
    },

    isSupportedPostRow(row) {
      if (!row.matches(this.postRowSelector) || row.classList.contains('notice')) {
        return false;
      }

      return Boolean(
        row.querySelector(FMKOREA_TITLE_CELL_SELECTOR) &&
        row.querySelector(this.writerCellSelector)
      );
    },

    getPostRows(root) {
      return Array.from(root.querySelectorAll(this.postRowSelector)).filter((row) =>
        this.isSupportedPostRow(row)
      );
    },

    containsPostRows(node) {
      if (!node || node.nodeType !== 1) {
        return false;
      }

      if (node.matches(this.postRowSelector) && this.isSupportedPostRow(node)) {
        return true;
      }

      return Array.from(node.querySelectorAll(this.postRowSelector)).some((row) =>
        this.isSupportedPostRow(row)
      );
    },

    getTitleText(row) {
      const titleLink = row.querySelector(FMKOREA_TITLE_LINK_SELECTOR);
      const titleCell = row.querySelector(FMKOREA_TITLE_CELL_SELECTOR);

      return titleLink ? titleLink.textContent : titleCell ? titleCell.textContent : '';
    },

    getWriterCell(row) {
      return row.querySelector(this.writerCellSelector);
    },

    getWriterValues(row) {
      const writerCell = this.getWriterCell(row);

      if (!writerCell) {
        return [];
      }

      return getUniqueTrimmedValues([
        getFmkoreaMemberClass(writerCell),
        getFmkoreaWriterDisplayName(writerCell)
      ]);
    },

    getWriterCandidates(writerCell) {
      const memberClass = getFmkoreaMemberClass(writerCell);
      const displayName = getFmkoreaWriterDisplayName(writerCell);
      const candidates = [];

      if (memberClass) {
        candidates.push({
          type: 'uid',
          label: '회원ID',
          value: memberClass
        });
      }

      if (displayName) {
        candidates.push({
          type: 'nick',
          label: '닉네임(주의)',
          value: displayName
        });
      }

      return candidates;
    }
  };

  function getRuliwebMemberSrl(writerCell) {
    const memberInput = writerCell.querySelector(RULIWEB_MEMBER_SRL_SELECTOR);

    return memberInput ? memberInput.value.trim() : '';
  }

  function getRuliwebWriterDisplayName(writerCell) {
    const writerElement = writerCell.querySelector('a') || writerCell;

    return (writerElement.textContent || '').trim();
  }

  const ruliwebAdapter = {
    siteId: 'ruliweb',
    displayName: '루리웹',
    postRowSelector: RULIWEB_POST_ROW_SELECTOR,
    writerCellSelector: RULIWEB_WRITER_CELL_SELECTOR,

    matchesUrl(url) {
      try {
        return new URL(url).hostname === 'bbs.ruliweb.com';
      } catch (error) {
        return false;
      }
    },

    isSupportedPostRow(row) {
      if (!row.matches(this.postRowSelector)) {
        return false;
      }

      const titleLink = row.querySelector(RULIWEB_TITLE_LINK_SELECTOR);
      const writerCell = row.querySelector(this.writerCellSelector);

      return Boolean(
        titleLink &&
        writerCell &&
        writerCell.querySelector(RULIWEB_MEMBER_SRL_SELECTOR)
      );
    },

    getPostRows(root) {
      return Array.from(root.querySelectorAll(this.postRowSelector)).filter((row) =>
        this.isSupportedPostRow(row)
      );
    },

    containsPostRows(node) {
      if (!node || node.nodeType !== 1) {
        return false;
      }

      if (node.matches(this.postRowSelector) && this.isSupportedPostRow(node)) {
        return true;
      }

      return Array.from(node.querySelectorAll(this.postRowSelector)).some((row) =>
        this.isSupportedPostRow(row)
      );
    },

    getTitleText(row) {
      const titleLink = row.querySelector(RULIWEB_TITLE_LINK_SELECTOR);
      const titleCell = row.querySelector(RULIWEB_TITLE_CELL_SELECTOR);

      return titleLink ? titleLink.textContent : titleCell ? titleCell.textContent : '';
    },

    getWriterCell(row) {
      return row.querySelector(this.writerCellSelector);
    },

    getWriterValues(row) {
      const writerCell = this.getWriterCell(row);

      if (!writerCell) {
        return [];
      }

      return getUniqueTrimmedValues([
        getRuliwebMemberSrl(writerCell),
        getRuliwebWriterDisplayName(writerCell)
      ]);
    },

    getWriterCandidates(writerCell) {
      const memberSrl = getRuliwebMemberSrl(writerCell);
      const displayName = getRuliwebWriterDisplayName(writerCell);
      const candidates = [];

      if (memberSrl) {
        candidates.push({
          type: 'uid',
          label: '회원번호',
          value: memberSrl
        });
      }

      if (displayName) {
        candidates.push({
          type: 'nick',
          label: '닉네임(주의)',
          value: displayName
        });
      }

      return candidates;
    }
  };

  function decodeMlbparkNick(value) {
    if (typeof value !== 'string' || !value.trim()) {
      return '';
    }

    try {
      return decodeURIComponent(value).trim();
    } catch (error) {
      return value.trim();
    }
  }

  function getMlbparkWriterLink(writerCell) {
    return writerCell.querySelector(MLBPARK_WRITER_LINK_SELECTOR);
  }

  function getMlbparkWriterId(writerCell) {
    const writerLink = getMlbparkWriterLink(writerCell);

    if (!writerLink) {
      return '';
    }

    const userId = (writerLink.getAttribute('data-uid') || '').trim();
    const userSite = (writerLink.getAttribute('data-usite') || '').trim();

    if (!userId) {
      return '';
    }

    return userSite ? `${userSite}${MLBPARK_USER_ID_SEPARATOR}${userId}` : userId;
  }

  function getMlbparkWriterDisplayName(writerCell) {
    const writerLink = getMlbparkWriterLink(writerCell);
    const encodedNick = writerLink ? writerLink.getAttribute('data-unick') || '' : '';
    const decodedNick = decodeMlbparkNick(encodedNick);

    return decodedNick || (writerCell.textContent || '').trim();
  }

  const mlbparkAdapter = {
    siteId: 'mlbpark',
    displayName: '엠팍',
    postRowSelector: MLBPARK_POST_ROW_SELECTOR,
    writerCellSelector: 'td.t_left',

    matchesUrl(url) {
      try {
        return new URL(url).hostname === 'mlbpark.donga.com';
      } catch (error) {
        return false;
      }
    },

    isSupportedPostRow(row) {
      if (!row.matches(this.postRowSelector)) {
        return false;
      }

      const firstCellText = (row.querySelector('td')?.textContent || '').trim();

      return Boolean(
        MLBPARK_POST_NUMBER_PATTERN.test(firstCellText) &&
        row.querySelector(MLBPARK_TITLE_LINK_SELECTOR) &&
        row.querySelector(MLBPARK_WRITER_LINK_SELECTOR)
      );
    },

    getPostRows(root) {
      return Array.from(root.querySelectorAll(this.postRowSelector)).filter((row) =>
        this.isSupportedPostRow(row)
      );
    },

    containsPostRows(node) {
      if (!node || node.nodeType !== 1) {
        return false;
      }

      if (node.matches(this.postRowSelector) && this.isSupportedPostRow(node)) {
        return true;
      }

      return Array.from(node.querySelectorAll(this.postRowSelector)).some((row) =>
        this.isSupportedPostRow(row)
      );
    },

    getTitleText(row) {
      const titleLink = row.querySelector(MLBPARK_TITLE_LINK_SELECTOR);
      const titleCell = row.querySelector(MLBPARK_TITLE_CELL_SELECTOR);

      return titleLink ? titleLink.textContent : titleCell ? titleCell.textContent : '';
    },

    getWriterCell(row) {
      const writerLink = row.querySelector(MLBPARK_WRITER_LINK_SELECTOR);

      return writerLink ? writerLink.closest('td') : null;
    },

    getWriterValues(row) {
      const writerCell = this.getWriterCell(row);

      if (!writerCell) {
        return [];
      }

      return getUniqueTrimmedValues([
        getMlbparkWriterId(writerCell),
        getMlbparkWriterDisplayName(writerCell)
      ]);
    },

    getWriterCandidates(writerCell) {
      const writerId = getMlbparkWriterId(writerCell);
      const displayName = getMlbparkWriterDisplayName(writerCell);
      const candidates = [];

      if (writerId) {
        candidates.push({
          type: 'uid',
          label: '회원ID',
          value: writerId
        });
      }

      if (displayName) {
        candidates.push({
          type: 'nick',
          label: '닉네임(주의)',
          value: displayName
        });
      }

      return candidates;
    }
  };

  function getClienWriterIdFromRow(row) {
    return (row.getAttribute('data-author-id') || '').trim();
  }

  function getClienWriterIdFromCell(writerCell) {
    const row = writerCell.closest(CLIEN_POST_ROW_SELECTOR);

    return row ? getClienWriterIdFromRow(row) : '';
  }

  function getClienWriterDisplayName(writerCell) {
    const clonedWriterCell = writerCell.cloneNode(true);

    clonedWriterCell
      .querySelectorAll(`.${WRITER_ACTION_BUTTON_CLASS}`)
      .forEach((element) => element.remove());

    return (clonedWriterCell.textContent || '').trim();
  }

  const clienAdapter = {
    siteId: 'clien',
    displayName: '클리앙',
    postRowSelector: CLIEN_POST_ROW_SELECTOR,
    writerCellSelector: CLIEN_WRITER_CELL_SELECTOR,

    matchesUrl(url) {
      try {
        const parsedUrl = new URL(url);

        return (
          parsedUrl.hostname === 'www.clien.net' &&
          parsedUrl.pathname.startsWith('/service/board/')
        );
      } catch (error) {
        return false;
      }
    },

    isSupportedPostRow(row) {
      if (!row.matches(this.postRowSelector) || row.classList.contains('notice')) {
        return false;
      }

      return Boolean(
        row.querySelector(CLIEN_TITLE_LINK_SELECTOR) &&
        row.querySelector(this.writerCellSelector) &&
        getClienWriterIdFromRow(row)
      );
    },

    getPostRows(root) {
      return Array.from(root.querySelectorAll(this.postRowSelector)).filter((row) =>
        this.isSupportedPostRow(row)
      );
    },

    containsPostRows(node) {
      if (!node || node.nodeType !== 1) {
        return false;
      }

      if (node.matches(this.postRowSelector) && this.isSupportedPostRow(node)) {
        return true;
      }

      return Array.from(node.querySelectorAll(this.postRowSelector)).some((row) =>
        this.isSupportedPostRow(row)
      );
    },

    getTitleText(row) {
      const titleLink = row.querySelector(CLIEN_TITLE_LINK_SELECTOR);
      const titleCell = row.querySelector(CLIEN_TITLE_CELL_SELECTOR);

      return titleLink ? titleLink.textContent : titleCell ? titleCell.textContent : '';
    },

    getWriterCell(row) {
      return row.querySelector(this.writerCellSelector);
    },

    getWriterValues(row) {
      const writerCell = this.getWriterCell(row);

      if (!writerCell) {
        return [];
      }

      return getUniqueTrimmedValues([
        getClienWriterIdFromRow(row),
        getClienWriterDisplayName(writerCell)
      ]);
    },

    getWriterCandidates(writerCell) {
      const writerId = getClienWriterIdFromCell(writerCell);
      const displayName = getClienWriterDisplayName(writerCell);
      const candidates = [];

      if (writerId) {
        candidates.push({
          type: 'uid',
          label: '회원ID',
          value: writerId
        });
      }

      if (displayName) {
        candidates.push({
          type: 'nick',
          label: '닉네임(주의)',
          value: displayName
        });
      }

      return candidates;
    }
  };

  function getTodayhumorWriterIdFromRow(row) {
    if (row.matches(TODAYHUMOR_VIEW_POST_SELECTOR)) {
      const writerElement = row.querySelector(TODAYHUMOR_VIEW_WRITER_SELECTOR);

      return writerElement ? (writerElement.getAttribute('mn') || '').trim() : '';
    }

    return (row.getAttribute('mn') || '').trim();
  }

  function getTodayhumorWriterIdFromCell(writerCell) {
    if (writerCell.matches(TODAYHUMOR_VIEW_WRITER_SELECTOR)) {
      return (writerCell.getAttribute('mn') || '').trim();
    }

    const row = writerCell.closest(TODAYHUMOR_POST_ROW_SELECTOR);

    return row ? getTodayhumorWriterIdFromRow(row) : '';
  }

  function getTodayhumorWriterDisplayName(writerCell) {
    const writerLink = writerCell.querySelector(TODAYHUMOR_WRITER_LINK_SELECTOR);
    const clonedWriterCell = (writerLink || writerCell).cloneNode(true);

    clonedWriterCell
      .querySelectorAll(`.${WRITER_ACTION_BUTTON_CLASS}`)
      .forEach((element) => element.remove());

    return (clonedWriterCell.textContent || '').trim();
  }

  const todayhumorAdapter = {
    siteId: 'todayhumor',
    displayName: '오늘의유머',
    postRowSelector: TODAYHUMOR_POST_ROW_SELECTOR,
    writerCellSelector: TODAYHUMOR_WRITER_CELL_SELECTOR,

    matchesUrl(url) {
      try {
        const parsedUrl = new URL(url);

        return (
          parsedUrl.hostname === 'www.todayhumor.co.kr' &&
          (parsedUrl.pathname === '/' ||
            parsedUrl.pathname.startsWith('/board/list.php') ||
            parsedUrl.pathname.startsWith('/board/view.php'))
        );
      } catch (error) {
        return false;
      }
    },

    isSupportedPostRow(row) {
      if (!row.matches(this.postRowSelector)) {
        return false;
      }

      if (row.matches(TODAYHUMOR_VIEW_POST_SELECTOR)) {
        return Boolean(
          row.querySelector(TODAYHUMOR_VIEW_TITLE_SELECTOR) &&
          getTodayhumorWriterIdFromRow(row) &&
          this.getWriterCell(row)
        );
      }

      return Boolean(
        row.querySelector(TODAYHUMOR_TITLE_LINK_SELECTOR) &&
        row.querySelector(this.writerCellSelector) &&
        row.querySelector(TODAYHUMOR_WRITER_LINK_SELECTOR) &&
        getTodayhumorWriterIdFromRow(row)
      );
    },

    getPostRows(root) {
      return Array.from(root.querySelectorAll(this.postRowSelector)).filter((row) =>
        this.isSupportedPostRow(row)
      );
    },

    containsPostRows(node) {
      if (!node || node.nodeType !== 1) {
        return false;
      }

      if (node.matches(this.postRowSelector) && this.isSupportedPostRow(node)) {
        return true;
      }

      return Array.from(node.querySelectorAll(this.postRowSelector)).some((row) =>
        this.isSupportedPostRow(row)
      );
    },

    getTitleText(row) {
      if (row.matches(TODAYHUMOR_VIEW_POST_SELECTOR)) {
        const titleElement = row.querySelector(TODAYHUMOR_VIEW_TITLE_SELECTOR);

        return titleElement ? titleElement.textContent : '';
      }

      const titleLink = row.querySelector(TODAYHUMOR_TITLE_LINK_SELECTOR);
      const titleCell = row.querySelector(TODAYHUMOR_TITLE_CELL_SELECTOR);

      return titleLink ? titleLink.textContent : titleCell ? titleCell.textContent : '';
    },

    getWriterCell(row) {
      if (row.matches(TODAYHUMOR_VIEW_POST_SELECTOR)) {
        return row.querySelector(TODAYHUMOR_VIEW_WRITER_SELECTOR);
      }

      return row.querySelector(this.writerCellSelector);
    },

    getWriterValues(row) {
      const writerCell = this.getWriterCell(row);

      if (!writerCell) {
        return [];
      }

      return getUniqueTrimmedValues([
        getTodayhumorWriterIdFromRow(row),
        getTodayhumorWriterDisplayName(writerCell)
      ]);
    },

    getWriterCandidates(writerCell) {
      const writerId = getTodayhumorWriterIdFromCell(writerCell);
      const displayName = getTodayhumorWriterDisplayName(writerCell);
      const candidates = [];

      if (writerId) {
        candidates.push({
          type: 'uid',
          label: '회원번호',
          value: writerId
        });
      }

      if (displayName) {
        candidates.push({
          type: 'nick',
          label: '닉네임(주의)',
          value: displayName
        });
      }

      return candidates;
    }
  };

  const siteAdapters = [
    dcinsideAdapter,
    fmkoreaAdapter,
    ruliwebAdapter,
    mlbparkAdapter,
    clienAdapter,
    todayhumorAdapter
  ];
  const currentSiteAdapter = getCurrentSiteAdapter();

  function getCurrentUrl() {
    return globalThis.location ? globalThis.location.href : '';
  }

  function getCurrentSiteAdapter() {
    const currentUrl = getCurrentUrl();

    return (
      siteAdapters.find((adapter) => adapter.matchesUrl(currentUrl)) ||
      dcinsideAdapter
    );
  }

  function getCurrentSiteId() {
    return currentSiteAdapter.siteId;
  }

  function getCurrentSiteDisplayName() {
    return currentSiteAdapter.displayName || currentSiteAdapter.siteId;
  }

  function loadRulesForCurrentSite() {
    if (!rulesStore) {
      return Promise.resolve({
        rules: {
          titleKeywords: [...FALLBACK_RULES.titleKeywords],
          writerValues: [...FALLBACK_RULES.writerValues]
        },
        source: 'default-rules-store-unavailable',
        migrated: false,
        defaultSaved: false,
        siteId: currentSiteAdapter.siteId,
        error: 'rules store unavailable'
      });
    }

    return rulesStore.loadRulesForSite(getCurrentSiteId());
  }

  function createMatchCounts(values) {
    return values.reduce((counts, value) => {
      counts[value] = 0;
      return counts;
    }, {});
  }

  function saveRowDisplayStyle(row) {
    if (row.hasAttribute(SAVED_INLINE_DISPLAY_PRESENT_ATTRIBUTE)) {
      return;
    }

    const displayValue = row.style.getPropertyValue('display');
    const displayPriority = row.style.getPropertyPriority('display');

    row.setAttribute(
      SAVED_INLINE_DISPLAY_PRESENT_ATTRIBUTE,
      displayValue ? 'true' : 'false'
    );

    if (displayValue) {
      row.setAttribute(SAVED_INLINE_DISPLAY_VALUE_ATTRIBUTE, displayValue);
    } else {
      row.removeAttribute(SAVED_INLINE_DISPLAY_VALUE_ATTRIBUTE);
    }

    if (displayPriority) {
      row.setAttribute(SAVED_INLINE_DISPLAY_PRIORITY_ATTRIBUTE, displayPriority);
    } else {
      row.removeAttribute(SAVED_INLINE_DISPLAY_PRIORITY_ATTRIBUTE);
    }
  }

  function restoreRowDisplayStyle(row) {
    const hadInlineDisplay =
      row.getAttribute(SAVED_INLINE_DISPLAY_PRESENT_ATTRIBUTE) === 'true';
    const displayValue = row.getAttribute(SAVED_INLINE_DISPLAY_VALUE_ATTRIBUTE) || '';
    const displayPriority =
      row.getAttribute(SAVED_INLINE_DISPLAY_PRIORITY_ATTRIBUTE) || '';

    if (hadInlineDisplay && displayValue) {
      row.style.setProperty('display', displayValue, displayPriority);
    } else {
      row.style.removeProperty('display');
    }

    row.removeAttribute(SAVED_INLINE_DISPLAY_PRESENT_ATTRIBUTE);
    row.removeAttribute(SAVED_INLINE_DISPLAY_VALUE_ATTRIBUTE);
    row.removeAttribute(SAVED_INLINE_DISPLAY_PRIORITY_ATTRIBUTE);
  }

  function hidePostRow(row, reason) {
    saveRowDisplayStyle(row);
    row.hidden = true;
    row.style.setProperty('display', 'none', 'important');
    row.removeAttribute(TEMPORARILY_SHOWN_ATTRIBUTE);
    row.setAttribute(HIDDEN_REASON_ATTRIBUTE, reason);
  }

  function showPostRow(row, options = {}) {
    const { keepReason = false, temporarilyShown = false } = options;

    row.hidden = false;
    restoreRowDisplayStyle(row);

    if (temporarilyShown) {
      row.setAttribute(TEMPORARILY_SHOWN_ATTRIBUTE, 'true');
    } else {
      row.removeAttribute(TEMPORARILY_SHOWN_ATTRIBUTE);
    }

    if (!keepReason) {
      row.removeAttribute(HIDDEN_REASON_ATTRIBUTE);
    }
  }

  function isSupportedPostRow(row) {
    return currentSiteAdapter.isSupportedPostRow(row);
  }

  function getPostRows() {
    return currentSiteAdapter.getPostRows(document);
  }

  function getPageScrollX() {
    return Number(globalThis.scrollX || globalThis.pageXOffset || 0);
  }

  function getPageScrollY() {
    return Number(globalThis.scrollY || globalThis.pageYOffset || 0);
  }

  function getScrollingElement() {
    return document.scrollingElement || document.documentElement || document.body;
  }

  function isBoardMuteOverlayElement(element) {
    return Boolean(
      element &&
        element.closest &&
        element.closest(
          `.${WRITER_ACTION_MENU_CLASS}, .${WRITER_ACTION_TOAST_CLASS}, .${REVEAL_CONTROL_CLASS}, .${RECENT_WRITER_PANEL_CLASS}`
        )
    );
  }

  function isVisibleViewportAnchor(element) {
    if (!element || !element.isConnected || isBoardMuteOverlayElement(element)) {
      return false;
    }

    const rect = element.getBoundingClientRect();

    return rect.width > 0 && rect.height > 0;
  }

  function findViewportAnchorElement() {
    if (typeof document.elementFromPoint !== 'function') {
      return null;
    }

    const viewportWidth = globalThis.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = globalThis.innerHeight || document.documentElement.clientHeight || 0;
    const sampleXs = [
      Math.round(viewportWidth / 2),
      Math.min(80, Math.max(0, viewportWidth - 1)),
      Math.max(0, viewportWidth - 80)
    ];
    const sampleYs = [
      Math.min(96, Math.max(0, viewportHeight - 1)),
      Math.round(viewportHeight / 3),
      Math.round(viewportHeight / 2)
    ];
    const rows = getPostRows();

    for (const y of sampleYs) {
      for (const x of sampleXs) {
        const element = document.elementFromPoint(x, y);

        if (!isVisibleViewportAnchor(element)) {
          continue;
        }

        const row = rows.find(
          (candidate) =>
            candidate.contains(element) &&
            isSupportedPostRow(candidate) &&
            isVisibleViewportAnchor(candidate)
        );

        return row || element;
      }
    }

    return getScrollingElement();
  }

  function captureViewportSnapshot() {
    const anchorElement = findViewportAnchorElement();
    const anchorRect = anchorElement?.getBoundingClientRect?.();

    return {
      anchorElement,
      anchorTop: anchorRect && Number.isFinite(anchorRect.top) ? anchorRect.top : null,
      scrollX: getPageScrollX(),
      scrollY: getPageScrollY()
    };
  }

  function restoreViewportSnapshot(snapshot) {
    if (!snapshot || typeof globalThis.scrollTo !== 'function') {
      return;
    }

    const restore = () => {
      let targetY = snapshot.scrollY;

      if (
        snapshot.anchorElement &&
        snapshot.anchorElement.isConnected &&
        snapshot.anchorTop !== null
      ) {
        const nextRect = snapshot.anchorElement.getBoundingClientRect();

        if (Number.isFinite(nextRect.top)) {
          targetY = getPageScrollY() + nextRect.top - snapshot.anchorTop;
        }
      }

      globalThis.scrollTo(snapshot.scrollX, Math.max(0, targetY));
    };

    restore();

    if (typeof globalThis.requestAnimationFrame === 'function') {
      globalThis.requestAnimationFrame(restore);
    } else {
      setTimeout(restore, 0);
    }
  }

  function findMatchingKeyword(text, keywords) {
    return keywords.find((keyword) => text.includes(keyword));
  }

  function rowMatchesTitleKeywords(row, keywords) {
    const titleText = currentSiteAdapter.getTitleText(row);

    return Boolean(findMatchingKeyword(titleText, keywords));
  }

  function hideRowsByTitleKeywords(keywords) {
    const rows = getPostRows();
    const result = {
      scannedRows: rows.length,
      hiddenRows: 0,
      skippedAlreadyHiddenRows: 0,
      matchedKeywords: createMatchCounts(keywords)
    };

    rows.forEach((row) => {
      if (row.hidden || row.hasAttribute(HIDDEN_REASON_ATTRIBUTE)) {
        result.skippedAlreadyHiddenRows += 1;
        return;
      }

      const titleText = currentSiteAdapter.getTitleText(row);
      const matchingKeyword = findMatchingKeyword(titleText, keywords);

      if (!matchingKeyword) {
        return;
      }

      hidePostRow(row, 'title-keyword');
      result.hiddenRows += 1;
      result.matchedKeywords[matchingKeyword] += 1;
    });

    return result;
  }

  function getWriterValues(row) {
    return currentSiteAdapter.getWriterValues(row);
  }

  function getWriterCandidates(writerCell) {
    return currentSiteAdapter.getWriterCandidates(writerCell);
  }

  function findMatchingWriterValue(writerValues, blockedValues) {
    return blockedValues.find((blockedValue) => writerValues.includes(blockedValue));
  }

  function rowMatchesWriterValues(row, blockedValues) {
    return Boolean(findMatchingWriterValue(getWriterValues(row), blockedValues));
  }

  function hideRowsByWriterValues(blockedValues) {
    const rows = getPostRows();
    const result = {
      scannedRows: rows.length,
      hiddenRows: 0,
      skippedAlreadyHiddenRows: 0,
      matchedWriters: createMatchCounts(blockedValues)
    };

    rows.forEach((row) => {
      if (row.hidden || row.hasAttribute(HIDDEN_REASON_ATTRIBUTE)) {
        result.skippedAlreadyHiddenRows += 1;
        return;
      }

      const writerValues = getWriterValues(row);
      const matchingWriterValue = findMatchingWriterValue(writerValues, blockedValues);

      if (!matchingWriterValue) {
        return;
      }

      hidePostRow(row, 'writer');
      result.hiddenRows += 1;
      result.matchedWriters[matchingWriterValue] += 1;
    });

    return result;
  }

  function hideRowsOptimisticallyByWriterValue(writerValue) {
    const normalizedWriterValue = writerValue.trim();

    if (!normalizedWriterValue) {
      return {
        writerValue: normalizedWriterValue,
        rows: [],
        hiddenRows: 0
      };
    }

    const rows = [];

    getPostRows().forEach((row) => {
      if (row.hidden || row.hasAttribute(HIDDEN_REASON_ATTRIBUTE)) {
        return;
      }

      if (!getWriterValues(row).includes(normalizedWriterValue)) {
        return;
      }

      hidePostRow(row, 'writer');
      row.setAttribute(OPTIMISTIC_WRITER_ATTRIBUTE, normalizedWriterValue);
      rows.push(row);
    });

    if (rows.length > 0) {
      updateRevealControl();
    }

    return {
      writerValue: normalizedWriterValue,
      rows,
      hiddenRows: rows.length
    };
  }

  function clearOptimisticallyHiddenRows(optimisticResult) {
    if (!optimisticResult) {
      return;
    }

    optimisticResult.rows.forEach((row) => {
      if (row.getAttribute(OPTIMISTIC_WRITER_ATTRIBUTE) === optimisticResult.writerValue) {
        row.removeAttribute(OPTIMISTIC_WRITER_ATTRIBUTE);
      }
    });
  }

  function restoreOptimisticallyHiddenRows(optimisticResult) {
    if (!optimisticResult) {
      return;
    }

    const viewportSnapshot = captureViewportSnapshot();

    optimisticResult.rows.forEach((row) => {
      if (row.getAttribute(OPTIMISTIC_WRITER_ATTRIBUTE) !== optimisticResult.writerValue) {
        return;
      }

      showPostRow(row);
      row.removeAttribute(OPTIMISTIC_WRITER_ATTRIBUTE);
    });

    updateRevealControl();
    restoreViewportSnapshot(viewportSnapshot);
  }

  function isBoardMuteHiddenRow(row) {
    const hiddenReason = row.getAttribute(HIDDEN_REASON_ATTRIBUTE);

    return isSupportedPostRow(row) && HIDDEN_REASONS.includes(hiddenReason);
  }

  function getBoardMuteHiddenRows() {
    return getPostRows().filter(isBoardMuteHiddenRow);
  }

  function getTemporarilyShownRows() {
    return getBoardMuteHiddenRows().filter(
      (row) => row.getAttribute(TEMPORARILY_SHOWN_ATTRIBUTE) === 'true'
    );
  }

  function ensureRevealControlStyles() {
    if (document.getElementById(REVEAL_CONTROL_STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = REVEAL_CONTROL_STYLE_ID;
    style.textContent = `
      .${REVEAL_CONTROL_CLASS} {
        position: fixed;
        right: 16px;
        bottom: 72px;
        z-index: 2147483646;
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        box-sizing: border-box;
        max-width: min(360px, calc(100vw - 32px));
        padding: 7px 8px;
        border: 1px solid #9c9c9c;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
        color: #222;
        font-size: 12px;
        line-height: 1.4;
      }

      .${REVEAL_CONTROL_TEXT_CLASS} {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .${REVEAL_CONTROL_BUTTON_CLASS} {
        flex: 0 0 auto;
        padding: 3px 7px;
        border: 1px solid #777;
        border-radius: 3px;
        background: #f7f7f7;
        color: #222;
        font: inherit;
        cursor: pointer;
        white-space: nowrap;
      }

      .${REVEAL_CONTROL_BUTTON_CLASS}:hover,
      .${REVEAL_CONTROL_BUTTON_CLASS}:focus {
        background: #ececec;
        outline: none;
      }

      .${RECENT_WRITER_PANEL_CLASS} {
        position: fixed;
        right: 16px;
        bottom: 122px;
        z-index: 2147483646;
        width: min(320px, calc(100vw - 32px));
        max-height: min(320px, calc(100vh - 144px));
        box-sizing: border-box;
        overflow: auto;
        padding: 8px;
        border: 1px solid #9c9c9c;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        color: #222;
        font-size: 12px;
        line-height: 1.4;
      }

      .${RECENT_WRITER_PANEL_HEADER_CLASS} {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-width: 0;
        margin-bottom: 6px;
        font-weight: 700;
      }

      .${RECENT_WRITER_PANEL_LIST_CLASS} {
        display: grid;
        gap: 4px;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .${RECENT_WRITER_PANEL_ENTRY_CLASS} {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 6px;
      }

      .${RECENT_WRITER_PANEL_TYPE_CLASS} {
        padding: 1px 5px;
        border: 1px solid #d0d0d0;
        border-radius: 3px;
        background: #f5f5f5;
        color: #444;
        white-space: nowrap;
      }

      .${RECENT_WRITER_PANEL_VALUE_CLASS} {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .${RECENT_WRITER_PANEL_EMPTY_CLASS} {
        color: #666;
      }
    `;

    (document.head || document.documentElement || document.body).append(style);
  }

  function getRevealControl() {
    return document.querySelector(`.${REVEAL_CONTROL_CLASS}`);
  }

  function closeRecentWriterPanel() {
    if (!activeRecentWriterPanel) {
      return;
    }

    activeRecentWriterPanel.remove();
    activeRecentWriterPanel = null;
  }

  function removeRevealControl() {
    const control = getRevealControl();

    if (control) {
      control.remove();
    }

    closeRecentWriterPanel();
  }

  function revealTemporarilyHiddenRows() {
    const viewportSnapshot = captureViewportSnapshot();

    getBoardMuteHiddenRows()
      .filter((row) => row.hidden)
      .forEach((row) => {
        showPostRow(row, { keepReason: true, temporarilyShown: true });
      });

    updateRevealControl();
    restoreViewportSnapshot(viewportSnapshot);
  }

  function hideTemporarilyShownRows() {
    const viewportSnapshot = captureViewportSnapshot();

    getTemporarilyShownRows().forEach((row) => {
      hidePostRow(row, row.getAttribute(HIDDEN_REASON_ATTRIBUTE) || 'writer');
    });

    updateRevealControl();
    restoreViewportSnapshot(viewportSnapshot);
  }

  function updateRevealControl() {
    const hiddenRows = getBoardMuteHiddenRows();

    if (hiddenRows.length === 0) {
      removeRevealControl();
      return;
    }

    ensureRevealControlStyles();

    let control = getRevealControl();

    if (!control) {
      control = document.createElement('div');
      control.className = REVEAL_CONTROL_CLASS;
      control.setAttribute('role', 'status');

      const text = document.createElement('span');
      text.className = REVEAL_CONTROL_TEXT_CLASS;
      control.append(text);

      const button = document.createElement('button');
      button.type = 'button';
      button.className = REVEAL_CONTROL_BUTTON_CLASS;
      control.append(button);

      const recentButton = document.createElement('button');
      recentButton.type = 'button';
      recentButton.className = `${REVEAL_CONTROL_BUTTON_CLASS} ${REVEAL_CONTROL_RECENT_BUTTON_CLASS}`;
      recentButton.textContent = '최근 차단';
      recentButton.setAttribute('aria-label', '최근 페이지 차단값 관리');
      recentButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleRecentWriterPanel();
      });
      control.append(recentButton);

      document.body.append(control);
    }

    const text = control.querySelector(`.${REVEAL_CONTROL_TEXT_CLASS}`);
    const button = control.querySelector(`.${REVEAL_CONTROL_BUTTON_CLASS}`);
    const temporarilyShownRows = getTemporarilyShownRows();
    const isRevealed = temporarilyShownRows.length > 0;

    text.textContent = isRevealed ? '숨김 글 표시 중' : `숨김 ${hiddenRows.length}개`;
    button.textContent = isRevealed ? '다시 숨김' : '잠시 보기';
    button.onclick = isRevealed ? hideTemporarilyShownRows : revealTemporarilyHiddenRows;
  }

  function ensureWriterActionStyles() {
    if (document.getElementById(WRITER_ACTION_STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = WRITER_ACTION_STYLE_ID;
    style.textContent = `
      [${WRITER_ACTION_CONTAINER_ATTRIBUTE}="true"] > .${WRITER_ACTION_BUTTON_CLASS} {
        position: absolute;
        top: 50%;
        right: 2px;
        z-index: 2;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 32px;
        min-width: 32px;
        height: 18px;
        transform: translateY(-50%);
        padding: 0 4px;
        border: 1px solid #b8b8b8;
        border-radius: 3px;
        background: #fff;
        color: #333;
        appearance: none;
        font-family: inherit;
        font-size: 11px;
        line-height: 16px;
        white-space: nowrap;
        cursor: pointer;
        opacity: 0;
        transition: opacity 80ms ease;
        contain: layout paint style;
      }

      [${WRITER_ACTION_CONTAINER_ATTRIBUTE}="true"]:hover > .${WRITER_ACTION_BUTTON_CLASS},
      [${WRITER_ACTION_CONTAINER_ATTRIBUTE}="true"]:focus-within > .${WRITER_ACTION_BUTTON_CLASS} {
        opacity: 1;
      }

      .${WRITER_ACTION_BUTTON_CLASS}:focus {
        opacity: 1;
        outline: 1px solid #555;
        outline-offset: 1px;
      }

      .${WRITER_ACTION_BUTTON_CLASS}[data-board-mute-site="clien"] {
        right: 6px;
      }

      .${WRITER_ACTION_MENU_CLASS} {
        position: fixed;
        z-index: 2147483647;
        min-width: 150px;
        max-width: min(320px, calc(100vw - 16px));
        padding: 4px;
        border: 1px solid #9c9c9c;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        color: #222;
        font-size: 12px;
        line-height: 1.4;
      }

      .${WRITER_ACTION_MENU_CLASS} button {
        display: block;
        width: 100%;
        padding: 5px 7px;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        white-space: normal;
        overflow-wrap: anywhere;
        cursor: pointer;
      }

      .${WRITER_ACTION_MENU_CLASS} button:hover,
      .${WRITER_ACTION_MENU_CLASS} button:focus {
        background: #efefef;
        outline: none;
      }

      .${WRITER_ACTION_MENU_CLASS} .board-mute-menu-scope {
        margin: 4px 7px 2px;
        color: #666;
        font-size: 11px;
        white-space: nowrap;
      }

      .${WRITER_ACTION_TOAST_CLASS} {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 2147483647;
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        box-sizing: border-box;
        max-width: min(360px, calc(100vw - 32px));
        padding: 8px 10px;
        border: 1px solid #444;
        border-radius: 4px;
        background: #222;
        color: #fff;
        font-size: 12px;
        line-height: 1.4;
      }

      .${WRITER_ACTION_TOAST_TEXT_CLASS} {
        flex: 1 1 auto;
        min-width: 0;
        overflow-wrap: anywhere;
      }

      .${WRITER_ACTION_TOAST_ACTION_CLASS} {
        flex: 0 0 auto;
        padding: 2px 6px;
        border: 1px solid rgba(255, 255, 255, 0.62);
        border-radius: 3px;
        background: transparent;
        color: #fff;
        font: inherit;
        cursor: pointer;
        white-space: nowrap;
      }

      .${WRITER_ACTION_TOAST_ACTION_CLASS}:hover,
      .${WRITER_ACTION_TOAST_ACTION_CLASS}:focus {
        background: rgba(255, 255, 255, 0.14);
        outline: none;
      }

      .${WRITER_ACTION_TOAST_ACTION_CLASS}:disabled {
        cursor: default;
        opacity: 0.58;
      }
    `;

    (document.head || document.documentElement || document.body).append(style);
  }

  function closeWriterMenu() {
    if (!activeWriterMenu) {
      return;
    }

    activeWriterMenu.remove();
    activeWriterMenu = null;
  }

  function showToast(message, action) {
    const existingToast = document.querySelector(`.${WRITER_ACTION_TOAST_CLASS}`);

    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = WRITER_ACTION_TOAST_CLASS;
    toast.setAttribute('role', 'status');

    const text = document.createElement('span');
    text.className = WRITER_ACTION_TOAST_TEXT_CLASS;
    text.textContent = message;
    toast.append(text);

    if (action && action.label && typeof action.onClick === 'function') {
      const actionButton = document.createElement('button');
      actionButton.type = 'button';
      actionButton.className = WRITER_ACTION_TOAST_ACTION_CLASS;
      actionButton.textContent = action.label;
      actionButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        actionButton.disabled = true;
        action.onClick();
      });
      toast.append(actionButton);
    }

    document.body.append(toast);

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
      toast.remove();
      toastTimer = null;
    }, action ? 5200 : 2200);
  }

  function positionWriterMenu(menu, anchorButton) {
    const rect = anchorButton.getBoundingClientRect();
    const viewportWidth = globalThis.innerWidth || document.documentElement.clientWidth || 0;
    const menuWidth = menu.getBoundingClientRect().width || 180;
    const left = viewportWidth
      ? Math.max(8, Math.min(rect.left, viewportWidth - menuWidth - 8))
      : rect.left;

    menu.style.top = `${Math.round(rect.bottom + 4)}px`;
    menu.style.left = `${Math.round(left)}px`;
  }

  function getSyncedWriterEntries(siteRules) {
    if (rulesStore && rulesStore.syncWriterEntriesWithValues) {
      return rulesStore.syncWriterEntriesWithValues(
        siteRules.writerValues,
        siteRules.writerEntries || [],
        'unknown'
      );
    }

    return siteRules.writerValues.map((writerValue) => ({
      value: writerValue,
      type: 'unknown',
      source: 'unknown'
    }));
  }

  function createWriterEntryForCandidate(candidate, existingEntry) {
    const createdAt =
      existingEntry && existingEntry.createdAt
        ? existingEntry.createdAt
        : new Date().toISOString();

    if (rulesStore && rulesStore.createWriterEntry) {
      return rulesStore.createWriterEntry(candidate.value, candidate.type, 'page', createdAt);
    }

    return {
      value: candidate.value,
      type: candidate.type,
      source: 'page',
      createdAt
    };
  }

  function createSiteRulesWithWriterCandidate(siteRules, candidate) {
    const writerValue = candidate.value.trim();
    const writerValues = siteRules.writerValues.includes(writerValue)
      ? [...siteRules.writerValues]
      : [...siteRules.writerValues, writerValue];
    const currentEntries = getSyncedWriterEntries(siteRules);
    const existingEntry = currentEntries.find((entry) => entry.value === writerValue);
    const nextWriterEntry = createWriterEntryForCandidate(
      { ...candidate, value: writerValue },
      existingEntry
    );
    const metadataEntries = [
      ...currentEntries.filter((entry) => entry.value !== writerValue),
      nextWriterEntry
    ];
    const writerEntries =
      rulesStore && rulesStore.syncWriterEntriesWithValues
        ? rulesStore.syncWriterEntriesWithValues(writerValues, metadataEntries, 'unknown')
        : metadataEntries;

    return {
      enabled: siteRules.enabled !== false,
      titleKeywords: [...siteRules.titleKeywords],
      writerValues,
      writerEntries
    };
  }

  function createSiteRulesWithoutWriterValue(siteRules, writerValue) {
    const nextWriterValues = siteRules.writerValues.filter((value) => value !== writerValue);
    const nextWriterEntries = getSyncedWriterEntries(siteRules).filter(
      (entry) => entry.value !== writerValue
    );
    const writerEntries =
      rulesStore && rulesStore.syncWriterEntriesWithValues
        ? rulesStore.syncWriterEntriesWithValues(nextWriterValues, nextWriterEntries, 'unknown')
        : nextWriterEntries;

    return {
      enabled: siteRules.enabled !== false,
      titleKeywords: [...siteRules.titleKeywords],
      writerValues: nextWriterValues,
      writerEntries
    };
  }

  function hasWriterEntryMetadataChanged(siteRules, nextSiteRules) {
    return (
      JSON.stringify(getSyncedWriterEntries(siteRules)) !==
      JSON.stringify(nextSiteRules.writerEntries)
    );
  }

  function undoWriterCandidate(candidate) {
    const writerValue = candidate.value.trim();
    const viewportSnapshot = captureViewportSnapshot();

    if (!rulesStore || !writerValue) {
      showToast('해제 실패');
      return Promise.resolve({ removed: false, reason: 'rules-store-unavailable' });
    }

    showToast('해제 중...');

    return loadRulesForCurrentSite()
      .then((rulesResult) => {
        const siteId = rulesResult.siteId || getCurrentSiteId();
        const siteRules = rulesResult.siteRules || {
          enabled: true,
          titleKeywords: [],
          writerValues: [],
          writerEntries: []
        };

        if (!siteRules.writerValues.includes(writerValue)) {
          setActiveRules(rulesResult.rules);
          applyActiveRules('writer-undo-noop');
          showToast('이미 해제됨');
          restoreViewportSnapshot(viewportSnapshot);
          return { removed: false, reason: 'not-found' };
        }

        const nextSiteRules = createSiteRulesWithoutWriterValue(siteRules, writerValue);

        return rulesStore
          .saveSiteRules(rulesResult.rulesDocument, siteId, nextSiteRules)
          .then((nextRulesDocument) => {
            const nextRules = rulesStore.combineRulesForSite(nextRulesDocument, siteId);

            setActiveRules(nextRules);
            applyActiveRules('writer-undo');
            showToast('차단 해제됨');
            restoreViewportSnapshot(viewportSnapshot);
            console.info('Board Mute: writer quick add undone', {
              type: candidate.type,
              value: writerValue,
              siteId
            });

            return { removed: true };
          });
      })
      .catch((error) => {
        showToast('해제 실패');
        console.error('Board Mute: writer quick add undo failed', error);
        return { removed: false, reason: 'error', error };
      });
  }

  function showWriterSavedToast(candidate) {
    const writerValue = candidate.value.trim();

    showToast('작성자 차단 추가됨', {
      label: '되돌리기',
      onClick: () =>
        undoWriterCandidate({
          ...candidate,
          value: writerValue
        })
    });
  }

  function getWriterTypeLabel(type) {
    return WRITER_TYPE_LABELS[type] || WRITER_TYPE_LABELS.unknown;
  }

  function getCreatedAtTime(entry) {
    const time = Date.parse(entry.createdAt || '');

    return Number.isNaN(time) ? 0 : time;
  }

  function getRecentPageWriterEntries(siteRules) {
    return getSyncedWriterEntries(siteRules)
      .filter((entry) => entry.source === 'page')
      .sort((leftEntry, rightEntry) =>
        getCreatedAtTime(rightEntry) - getCreatedAtTime(leftEntry)
      )
      .slice(0, RECENT_WRITER_ENTRY_LIMIT);
  }

  function createRecentWriterPanel(entries) {
    const panel = document.createElement('div');
    panel.className = RECENT_WRITER_PANEL_CLASS;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', '최근 페이지 차단값');

    const header = document.createElement('div');
    header.className = RECENT_WRITER_PANEL_HEADER_CLASS;

    const title = document.createElement('span');
    title.textContent = '최근 차단';
    header.append(title);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = REVEAL_CONTROL_BUTTON_CLASS;
    closeButton.textContent = '닫기';
    closeButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeRecentWriterPanel();
    });
    header.append(closeButton);
    panel.append(header);

    const list = document.createElement('ul');
    list.className = RECENT_WRITER_PANEL_LIST_CLASS;

    if (entries.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.className = RECENT_WRITER_PANEL_EMPTY_CLASS;
      emptyItem.textContent = '최근 차단 없음';
      list.append(emptyItem);
    }

    entries.forEach((entry) => {
      const item = document.createElement('li');
      item.className = RECENT_WRITER_PANEL_ENTRY_CLASS;

      const typeLabel = document.createElement('span');
      typeLabel.className = RECENT_WRITER_PANEL_TYPE_CLASS;
      typeLabel.textContent = getWriterTypeLabel(entry.type);
      item.append(typeLabel);

      const valueLabel = document.createElement('span');
      valueLabel.className = RECENT_WRITER_PANEL_VALUE_CLASS;
      valueLabel.textContent = entry.value;
      item.append(valueLabel);

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = REVEAL_CONTROL_BUTTON_CLASS;
      removeButton.textContent = '해제';
      removeButton.setAttribute('aria-label', `최근 차단 해제: ${entry.value}`);
      removeButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeRecentWriterPanel();
        undoWriterCandidate(entry);
      });
      item.append(removeButton);

      list.append(item);
    });

    panel.append(list);
    panel.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    return panel;
  }

  function openRecentWriterPanel() {
    closeRecentWriterPanel();

    if (!rulesStore) {
      showToast('불러오기 실패');
      return Promise.resolve({ opened: false, reason: 'rules-store-unavailable' });
    }

    ensureRevealControlStyles();

    return loadRulesForCurrentSite()
      .then((rulesResult) => {
        const entries = getRecentPageWriterEntries(
          rulesResult.siteRules || {
            enabled: true,
            titleKeywords: [],
            writerValues: [],
            writerEntries: []
          }
        );
        const panel = createRecentWriterPanel(entries);

        document.body.append(panel);
        activeRecentWriterPanel = panel;

        return { opened: true, entries };
      })
      .catch((error) => {
        showToast('불러오기 실패');
        console.error('Board Mute: recent writer panel failed', error);
        return { opened: false, reason: 'error', error };
      });
  }

  function toggleRecentWriterPanel() {
    if (activeRecentWriterPanel) {
      closeRecentWriterPanel();
      return;
    }

    openRecentWriterPanel();
  }

  function saveWriterCandidate(candidate, optimisticResult) {
    if (!rulesStore) {
      restoreOptimisticallyHiddenRows(optimisticResult);
      showToast('저장 실패');
      console.error('Board Mute: writer quick add failed', new Error('rules store unavailable'));
      return Promise.resolve({ saved: false, reason: 'rules-store-unavailable' });
    }

    return loadRulesForCurrentSite()
      .then((rulesResult) => {
        const siteId = rulesResult.siteId || getCurrentSiteId();
        const siteRules = rulesResult.siteRules || {
          enabled: true,
          titleKeywords: [],
          writerValues: [],
          writerEntries: []
        };
        const writerValue = candidate.value.trim();

        if (!writerValue) {
          restoreOptimisticallyHiddenRows(optimisticResult);
          showToast('저장 실패');
          return { saved: false, reason: 'empty-value' };
        }

        if (siteRules.enabled === false) {
          setActiveRules(rulesResult.rules);
          restoreOptimisticallyHiddenRows(optimisticResult);
          showToast(`${getCurrentSiteDisplayName()} 차단 꺼짐`);
          return { saved: false, reason: 'site-disabled' };
        }

        if (siteRules.writerValues.includes(writerValue)) {
          const nextSiteRules = createSiteRulesWithWriterCandidate(siteRules, {
            ...candidate,
            value: writerValue
          });
          const writerResult = hideRowsByWriterValues(rulesResult.rules.writerValues);

          if (hasWriterEntryMetadataChanged(siteRules, nextSiteRules)) {
            return rulesStore
              .saveSiteRules(rulesResult.rulesDocument, siteId, nextSiteRules)
              .then((nextRulesDocument) => {
                const nextRules = rulesStore.combineRulesForSite(nextRulesDocument, siteId);

                setActiveRules(nextRules);
                updateRevealControl();
                clearOptimisticallyHiddenRows(optimisticResult);
                showToast('이미 차단됨');
                console.info('Board Mute: writer quick add metadata saved', {
                  type: candidate.type,
                  value: writerValue,
                  siteId,
                  hiddenRows: writerResult.hiddenRows
                });

                return { saved: true, reason: 'metadata-updated', writerResult };
              });
          }

          setActiveRules(rulesResult.rules);
          updateRevealControl();
          clearOptimisticallyHiddenRows(optimisticResult);
          showToast('이미 차단됨');
          console.info('Board Mute: writer quick add skipped', {
            type: candidate.type,
            value: writerValue,
            siteId,
            reason: 'duplicate',
            hiddenRows: writerResult.hiddenRows
          });
          return { saved: false, reason: 'duplicate', writerResult };
        }

        const nextSiteRules = createSiteRulesWithWriterCandidate(siteRules, {
          ...candidate,
          value: writerValue
        });

        return rulesStore
          .saveSiteRules(rulesResult.rulesDocument, siteId, nextSiteRules)
          .then((nextRulesDocument) => {
            const nextRules = rulesStore.combineRulesForSite(nextRulesDocument, siteId);
            const writerResult = hideRowsByWriterValues(nextRules.writerValues);

            setActiveRules(nextRules);
            updateRevealControl();
            clearOptimisticallyHiddenRows(optimisticResult);
            showWriterSavedToast({
              ...candidate,
              value: writerValue
            });
            console.info('Board Mute: writer quick add saved', {
              type: candidate.type,
              value: writerValue,
              siteId,
              hiddenRows: writerResult.hiddenRows
            });

            return { saved: true, writerResult };
          });
      })
      .catch((error) => {
        restoreOptimisticallyHiddenRows(optimisticResult);
        showToast('저장 실패');
        console.error('Board Mute: writer quick add failed', error);
        return { saved: false, reason: 'error', error };
      });
  }

  function openWriterMenu(anchorButton, candidates) {
    closeWriterMenu();

    if (candidates.length === 0) {
      showToast('저장 실패');
      return;
    }

    const menu = document.createElement('div');
    menu.className = WRITER_ACTION_MENU_CLASS;
    menu.setAttribute('role', 'menu');

    candidates.forEach((candidate) => {
      const menuItem = document.createElement('button');
      menuItem.type = 'button';
      menuItem.textContent = `${candidate.label} 차단: ${candidate.value}`;
      menuItem.setAttribute('role', 'menuitem');
      menuItem.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeWriterMenu();
        saveWriterCandidate(
          candidate,
          hideRowsOptimisticallyByWriterValue(candidate.value)
        );
      });
      menu.append(menuItem);
    });

    const recentButton = document.createElement('button');
    recentButton.type = 'button';
    recentButton.textContent = '최근 차단 관리';
    recentButton.setAttribute('role', 'menuitem');
    recentButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeWriterMenu();
      openRecentWriterPanel();
    });
    menu.append(recentButton);

    const scope = document.createElement('div');
    scope.className = 'board-mute-menu-scope';
    scope.textContent = `${getCurrentSiteDisplayName()} 규칙에 저장`;
    menu.append(scope);

    menu.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    document.body.append(menu);
    activeWriterMenu = menu;
    positionWriterMenu(menu, anchorButton);

    const firstMenuItem = menu.querySelector('button');

    if (firstMenuItem) {
      firstMenuItem.focus();
    }
  }

  function getWriterActionContainer(row, writerCell) {
    if (getCurrentSiteId() === 'clien') {
      return row;
    }

    if (getCurrentSiteId() === 'todayhumor' && row.matches(TODAYHUMOR_VIEW_POST_SELECTOR)) {
      return writerCell.parentElement || writerCell;
    }

    return writerCell;
  }

  function ensureWriterActionContainerPosition(container) {
    if (!container || container.style.position) {
      return;
    }

    const computedPosition =
      typeof globalThis.getComputedStyle === 'function'
        ? globalThis.getComputedStyle(container).position
        : '';

    if (!computedPosition || computedPosition === 'static') {
      container.style.position = 'relative';
    }
  }

  function attachWriterQuickAddActions() {
    const rows = getPostRows();

    if (rows.length === 0) {
      return;
    }

    ensureWriterActionStyles();

    rows.forEach((row) => {
      if (row.hidden || row.hasAttribute(HIDDEN_REASON_ATTRIBUTE)) {
        return;
      }

      const writerCell = currentSiteAdapter.getWriterCell(row);

      if (!writerCell || writerCell.getAttribute(WRITER_ACTION_ATTACHED_ATTRIBUTE) === 'true') {
        return;
      }

      const candidates = getWriterCandidates(writerCell);

      if (candidates.length === 0) {
        return;
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = WRITER_ACTION_BUTTON_CLASS;
      button.dataset.boardMuteSite = getCurrentSiteId();
      button.textContent = '차단';
      button.setAttribute('aria-label', '작성자 차단값 선택');
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openWriterMenu(button, getWriterCandidates(writerCell));
      });

      const actionContainer = getWriterActionContainer(row, writerCell);

      ensureWriterActionContainerPosition(actionContainer);
      actionContainer.setAttribute(WRITER_ACTION_CONTAINER_ATTRIBUTE, 'true');

      actionContainer.append(button);
      writerCell.setAttribute(WRITER_ACTION_ATTACHED_ATTRIBUTE, 'true');
    });
  }

  function restoreRowsNoLongerMatchingRules(rules) {
    getPostRows().forEach((row) => {
      const hiddenReason = row.getAttribute(HIDDEN_REASON_ATTRIBUTE);

      if (!HIDDEN_REASONS.includes(hiddenReason) || row.hasAttribute(OPTIMISTIC_WRITER_ATTRIBUTE)) {
        return;
      }

      const stillMatches =
        rowMatchesTitleKeywords(row, rules.titleKeywords) ||
        rowMatchesWriterValues(row, rules.writerValues);

      if (stillMatches) {
        return;
      }

      showPostRow(row);
    });
  }

  function applyActiveRules(reason) {
    if (!activeRules) {
      return null;
    }

    restoreRowsNoLongerMatchingRules(activeRules);

    const titleKeywordResult = hideRowsByTitleKeywords(activeRules.titleKeywords);
    const writerResult = hideRowsByWriterValues(activeRules.writerValues);

    updateRevealControl();
    attachWriterQuickAddActions();

    if (reason !== 'initial') {
      console.info('Board Mute: rules reapplied', {
        reason,
        titleKeywordResult,
        writerResult
      });
    } else {
      console.info('Board Mute: title keyword filter complete', titleKeywordResult);
      console.info('Board Mute: writer filter complete', writerResult);
    }

    return {
      titleKeywordResult,
      writerResult
    };
  }

  function setActiveRules(rules) {
    activeRules = {
      titleKeywords: [...rules.titleKeywords],
      writerValues: [...rules.writerValues]
    };
  }

  function scheduleApplyActiveRules(reason) {
    if (!activeRules) {
      return;
    }

    if (applyTimer) {
      clearTimeout(applyTimer);
    }

    applyTimer = setTimeout(() => {
      applyTimer = null;
      applyActiveRules(reason);
    }, APPLY_DEBOUNCE_MS);
  }

  function nodeContainsPostRows(node) {
    return currentSiteAdapter.containsPostRows(node);
  }

  function mutationsContainPostRows(mutations) {
    return mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some(nodeContainsPostRows)
    );
  }

  function startPostRowObserver() {
    if (postRowObserver || typeof MutationObserver === 'undefined') {
      return;
    }

    const root = document.body || document.documentElement;

    if (!root) {
      return;
    }

    postRowObserver = new MutationObserver((mutations) => {
      if (!mutationsContainPostRows(mutations)) {
        return;
      }

      scheduleApplyActiveRules('dom-change');
    });

    postRowObserver.observe(root, {
      childList: true,
      subtree: true
    });
  }

  function startStorageChangeListener() {
    if (
      storageChangeListenerAttached ||
      !rulesStore ||
      typeof chrome === 'undefined' ||
      !chrome.storage ||
      !chrome.storage.onChanged ||
      !chrome.storage.onChanged.addListener
    ) {
      return;
    }

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local' || !changes[rulesStore.STORAGE_KEY]) {
        return;
      }

      loadAndApplyRules('storage-change');
    });

    storageChangeListenerAttached = true;
  }

  function loadAndApplyRules(reason) {
    return loadRulesForCurrentSite()
      .then((rulesResult) => {
        setActiveRules(rulesResult.rules);
        console.info('Board Mute: rules loaded', {
          reason,
          source: rulesResult.source,
          siteId: rulesResult.siteId,
          migrated: rulesResult.migrated,
          defaultSaved: rulesResult.defaultSaved,
          titleKeywordCount: rulesResult.rules.titleKeywords.length,
          writerValueCount: rulesResult.rules.writerValues.length,
          error: rulesResult.error || null
        });

        applyActiveRules(reason);
        startPostRowObserver();
        startStorageChangeListener();
      });
  }

  console.info('Board Mute: content script loaded');

  loadAndApplyRules('initial')
    .catch((error) => {
      console.error('Board Mute: failed to apply rules', error);
    });

  document.addEventListener('click', () => {
    closeWriterMenu();
    closeRecentWriterPanel();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeWriterMenu();
      closeRecentWriterPanel();
    }
  });
})();
