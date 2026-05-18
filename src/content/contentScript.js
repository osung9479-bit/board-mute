(function () {
  'use strict';

  const rulesStore = globalThis.BoardMuteRulesStore;
  const FALLBACK_RULES = {
    titleKeywords: ['막글', '나는내향적', '로또'],
    writerValues: ['야갤', '손발이시립디다', 'stool3653']
  };
  const HIDDEN_REASON_ATTRIBUTE = 'data-board-mute-hidden-reason';
  const TEMPORARILY_SHOWN_ATTRIBUTE = 'data-board-mute-temporarily-shown';
  const TEMPORARY_HIDDEN_ATTRIBUTE = 'data-board-mute-temporary-hidden';
  const TEMPORARY_PICK_HIGHLIGHTED_ATTRIBUTE = 'data-board-mute-pick-highlighted';
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
  const REVEAL_CONTROL_STATUS_CLASS = 'board-mute-reveal-control-status';
  const REVEAL_CONTROL_TEXT_CLASS = 'board-mute-reveal-control-text';
  const REVEAL_CONTROL_DETAIL_CLASS = 'board-mute-reveal-control-detail';
  const REVEAL_CONTROL_ACTIONS_CLASS = 'board-mute-reveal-control-actions';
  const REVEAL_CONTROL_BUTTON_CLASS = 'board-mute-reveal-control-button';
  const REVEAL_CONTROL_TOGGLE_BUTTON_CLASS = 'board-mute-reveal-control-toggle-button';
  const REVEAL_CONTROL_RECENT_BUTTON_CLASS = 'board-mute-reveal-control-recent-button';
  const TEMPORARY_HIDE_BUTTON_CLASS = 'board-mute-temporary-hide-button';
  const TEMPORARY_RESTORE_BUTTON_CLASS = 'board-mute-temporary-restore-button';
  const TEMPORARY_PICKING_BODY_CLASS = 'board-mute-temporary-hide-picking';
  const TEMPORARY_PICK_LABEL_CLASS = 'board-mute-temporary-hide-label';
  const RECENT_WRITER_PANEL_CLASS = 'board-mute-recent-writer-panel';
  const RECENT_WRITER_PANEL_HEADER_CLASS = 'board-mute-recent-writer-panel-header';
  const RECENT_WRITER_PANEL_TITLE_CLASS = 'board-mute-recent-writer-panel-title';
  const RECENT_WRITER_PANEL_COUNT_CLASS = 'board-mute-recent-writer-panel-count';
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
  const QUASARZONE_POST_ROW_SELECTOR = 'tr';
  const QUASARZONE_TITLE_CELL_SELECTOR = 'p.tit';
  const QUASARZONE_TITLE_LINK_SELECTOR = 'a.subject-link[href*="/bbs/"][href*="/views/"]';
  const QUASARZONE_WRITER_CELL_SELECTOR = 'div.user-nick-wrap.nick[data-id]';
  const SLRCLUB_POST_ROW_SELECTOR = 'tr';
  const SLRCLUB_TITLE_CELL_SELECTOR = 'td.sbj';
  const SLRCLUB_TITLE_LINK_SELECTOR = 'td.sbj a[href*="/bbs/vx2.php"][href*="id="][href*="no="]';
  const SLRCLUB_WRITER_CELL_SELECTOR = 'td.list_name';
  const SLRCLUB_WRITER_ID_SELECTOR = 'span.lop[data-xuid]';
  const INVEN_POST_ROW_SELECTOR = 'tr.lgtm';
  const INVEN_TITLE_CELL_SELECTOR = 'td.tit';
  const INVEN_TITLE_LINK_SELECTOR = 'td.tit a.subject-link[href*="/board/"]';
  const INVEN_WRITER_CELL_SELECTOR = 'td.user';
  const INVEN_WRITER_NICK_SELECTOR = '.layerNickName';
  const INVEN_POST_ID_PREFIX = 'post:';
  const NATEPANN_POST_ROW_SELECTOR = 'tr';
  const NATEPANN_TITLE_LINK_SELECTOR = 'td.subject a[href*="/talk/"]';
  const NATEPANN_WRITER_CELL_SELECTOR = 'td.writer';
  const NATEPANN_WRITER_LINK_SELECTOR = 'td.writer a[href*="/search/talk"]';
  const NATEPANN_POST_ID_PREFIX = 'post:';
  const SARAMIN_SEARCH_ROW_SELECTOR = '.item_recruit[value]';
  const SARAMIN_CATEGORY_ROW_SELECTOR = '.box_item, .list_item[id^="rec-"]';
  const SARAMIN_POST_ROW_SELECTOR = `${SARAMIN_SEARCH_ROW_SELECTOR}, ${SARAMIN_CATEGORY_ROW_SELECTOR}`;
  const SARAMIN_SEARCH_TITLE_LINK_SELECTOR = '.area_job .job_tit a[href*="rec_idx="]';
  const SARAMIN_CATEGORY_TITLE_LINK_SELECTOR =
    '.notification_info .job_tit a.str_tit[href*="rec_idx="]';
  const SARAMIN_SEARCH_COMPANY_CELL_SELECTOR = '.area_corp';
  const SARAMIN_CATEGORY_COMPANY_CELL_SELECTOR = '.col.company_nm';
  const SARAMIN_SEARCH_COMPANY_LINK_SELECTOR = '.area_corp .corp_name a[href*="csn="]';
  const SARAMIN_CATEGORY_COMPANY_LINK_SELECTOR =
    '.col.company_nm a.str_tit[href*="csn="]';
  const SARAMIN_COMPANY_ID_PREFIX = 'csn:';
  const SARAMIN_RECRUIT_ID_PREFIX = 'rec:';
  const JOBKOREA_POST_ROW_SELECTOR = 'tr.devloopArea';
  const JOBKOREA_TITLE_LINK_SELECTOR = '.tplTit a[href*="/Recruit/GI_Read/"]';
  const JOBKOREA_COMPANY_CELL_SELECTOR = 'td.tplCo';
  const JOBKOREA_COMPANY_LINK_SELECTOR = 'td.tplCo a[href*="/Recruit/Co_Read/C/"]';
  const JOBKOREA_COMPANY_ID_PREFIX = 'company:';
  const JOBKOREA_RECRUIT_ID_PREFIX = 'gno:';
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
  const temporaryHideState = {
    isPicking: false,
    highlightedElement: null,
    hiddenEntries: []
  };

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

  function getQuasarzoneWriterId(writerCell) {
    return (writerCell.getAttribute('data-id') || '').trim();
  }

  function getQuasarzoneWriterDisplayName(writerCell) {
    const dataNick = (writerCell.getAttribute('data-nick') || '').trim();

    if (dataNick) {
      return dataNick;
    }

    const clonedWriterCell = writerCell.cloneNode(true);

    clonedWriterCell
      .querySelectorAll(`.${WRITER_ACTION_BUTTON_CLASS}`)
      .forEach((element) => element.remove());

    return (clonedWriterCell.textContent || '').trim();
  }

  const quasarzoneAdapter = {
    siteId: 'quasarzone',
    displayName: '퀘이사존',
    postRowSelector: QUASARZONE_POST_ROW_SELECTOR,
    writerCellSelector: QUASARZONE_WRITER_CELL_SELECTOR,

    matchesUrl(url) {
      try {
        const parsedUrl = new URL(url);

        return (
          parsedUrl.hostname === 'quasarzone.com' &&
          parsedUrl.pathname.startsWith('/bbs/')
        );
      } catch (error) {
        return false;
      }
    },

    isSupportedPostRow(row) {
      if (!row.matches(this.postRowSelector)) {
        return false;
      }

      const titleLink = row.querySelector(QUASARZONE_TITLE_LINK_SELECTOR);
      const writerCell = row.querySelector(this.writerCellSelector);

      return Boolean(titleLink && writerCell && getQuasarzoneWriterId(writerCell));
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
      const titleLink = row.querySelector(QUASARZONE_TITLE_LINK_SELECTOR);
      const titleCell = row.querySelector(QUASARZONE_TITLE_CELL_SELECTOR);

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
        getQuasarzoneWriterId(writerCell),
        getQuasarzoneWriterDisplayName(writerCell)
      ]);
    },

    getWriterCandidates(writerCell) {
      const writerId = getQuasarzoneWriterId(writerCell);
      const displayName = getQuasarzoneWriterDisplayName(writerCell);
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

  function getSlrclubWriterId(writerCell) {
    const writerElement = writerCell.querySelector(SLRCLUB_WRITER_ID_SELECTOR);

    return writerElement ? (writerElement.getAttribute('data-xuid') || '').trim() : '';
  }

  function getSlrclubWriterDisplayName(writerCell) {
    const writerElement = writerCell.querySelector(SLRCLUB_WRITER_ID_SELECTOR);
    const sourceElement = writerElement || writerCell;
    const clonedWriterCell = sourceElement.cloneNode(true);

    clonedWriterCell
      .querySelectorAll(`.${WRITER_ACTION_BUTTON_CLASS}`)
      .forEach((element) => element.remove());

    return (clonedWriterCell.textContent || '').trim();
  }

  const slrclubAdapter = {
    siteId: 'slrclub',
    displayName: 'SLR클럽',
    postRowSelector: SLRCLUB_POST_ROW_SELECTOR,
    writerCellSelector: SLRCLUB_WRITER_CELL_SELECTOR,

    matchesUrl(url) {
      try {
        const parsedUrl = new URL(url);

        return (
          parsedUrl.hostname === 'www.slrclub.com' &&
          parsedUrl.pathname === '/bbs/zboard.php'
        );
      } catch (error) {
        return false;
      }
    },

    isSupportedPostRow(row) {
      if (!row.matches(this.postRowSelector)) {
        return false;
      }

      const titleLink = row.querySelector(SLRCLUB_TITLE_LINK_SELECTOR);
      const writerCell = row.querySelector(this.writerCellSelector);

      return Boolean(titleLink && writerCell && getSlrclubWriterId(writerCell));
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
      const titleLink = row.querySelector(SLRCLUB_TITLE_LINK_SELECTOR);
      const titleCell = row.querySelector(SLRCLUB_TITLE_CELL_SELECTOR);

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
        getSlrclubWriterId(writerCell),
        getSlrclubWriterDisplayName(writerCell)
      ]);
    },

    getWriterCandidates(writerCell) {
      const writerId = getSlrclubWriterId(writerCell);
      const displayName = getSlrclubWriterDisplayName(writerCell);
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

  function getInvenTitleLink(row) {
    return (
      row.querySelector(INVEN_TITLE_LINK_SELECTOR) ||
      row.querySelector('a.subject-link[href*="/board/"]')
    );
  }

  function getInvenPathPartsFromElement(element) {
    const href = element ? element.getAttribute('href') || '' : '';

    if (!href) {
      return null;
    }

    try {
      const parts = new URL(href, getCurrentUrl()).pathname
        .split('/')
        .filter(Boolean);

      if (parts.length < 4 || parts[0] !== 'board') {
        return null;
      }

      return {
        boardId: parts[2] || '',
        postId: parts[3] || ''
      };
    } catch (error) {
      return null;
    }
  }

  function getInvenWriterCell(row) {
    return row.querySelector(INVEN_WRITER_CELL_SELECTOR);
  }

  function getInvenWriterDisplayName(writerCell) {
    const writerElement = writerCell
      ? writerCell.querySelector(INVEN_WRITER_NICK_SELECTOR)
      : null;

    if (writerElement) {
      return (writerElement.textContent || '').trim();
    }

    if (!writerCell) {
      return '';
    }

    const clonedElement = writerCell.cloneNode(true);

    clonedElement
      .querySelectorAll(`.${WRITER_ACTION_BUTTON_CLASS}, img`)
      .forEach((element) => element.remove());

    return (clonedElement.textContent || '').trim();
  }

  function getInvenBoardId(row) {
    const commentElement = row.querySelector('[data-opinion-bbs-comeidx]');
    const commentBoardId = commentElement
      ? (commentElement.getAttribute('data-opinion-bbs-comeidx') || '').trim()
      : '';

    if (commentBoardId) {
      return commentBoardId;
    }

    const linkParts = getInvenPathPartsFromElement(getInvenTitleLink(row));

    return linkParts ? linkParts.boardId.trim() : '';
  }

  function getInvenPostId(row) {
    const commentElement = row.querySelector('[data-opinion-bbs-uid]');
    const commentPostId = commentElement
      ? (commentElement.getAttribute('data-opinion-bbs-uid') || '').trim()
      : '';

    if (commentPostId) {
      return commentPostId;
    }

    const linkParts = getInvenPathPartsFromElement(getInvenTitleLink(row));

    return linkParts ? linkParts.postId.trim() : '';
  }

  function getInvenPostValue(row) {
    const boardId = getInvenBoardId(row);
    const postId = getInvenPostId(row);

    return boardId && postId ? `${INVEN_POST_ID_PREFIX}${boardId}/${postId}` : '';
  }

  const invenAdapter = {
    siteId: 'inven',
    displayName: '인벤',
    postRowSelector: INVEN_POST_ROW_SELECTOR,
    writerCellSelector: INVEN_WRITER_CELL_SELECTOR,

    matchesUrl(url) {
      try {
        const parsedUrl = new URL(url);

        return (
          parsedUrl.hostname === 'www.inven.co.kr' &&
          parsedUrl.pathname.startsWith('/board/')
        );
      } catch (error) {
        return false;
      }
    },

    isSupportedPostRow(row) {
      if (!row.matches(this.postRowSelector)) {
        return false;
      }

      const writerCell = getInvenWriterCell(row);

      return Boolean(
        getInvenTitleLink(row) &&
        writerCell &&
        getInvenWriterDisplayName(writerCell) &&
        getInvenPostValue(row)
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

      return this.getPostRows(node).length > 0;
    },

    getTitleText(row) {
      const titleLink = getInvenTitleLink(row);

      return titleLink ? (titleLink.textContent || '').trim() : '';
    },

    getWriterCell(row) {
      return getInvenWriterCell(row);
    },

    getWriterValues(row) {
      const writerCell = getInvenWriterCell(row);

      return getUniqueTrimmedValues([
        getInvenWriterDisplayName(writerCell),
        getInvenPostValue(row)
      ]);
    },

    getWriterCandidates(writerCell) {
      const row = writerCell.closest(INVEN_POST_ROW_SELECTOR);

      if (!row) {
        return [];
      }

      const displayName = getInvenWriterDisplayName(writerCell);
      const postValue = getInvenPostValue(row);
      const candidates = [];

      if (displayName) {
        candidates.push({
          type: 'nick',
          label: '닉네임(주의)',
          value: displayName
        });
      }

      if (postValue) {
        candidates.push({
          type: 'unknown',
          label: '글',
          value: postValue
        });
      }

      return candidates;
    }
  };

  function getNatepannTitleLink(row) {
    return row.querySelector(NATEPANN_TITLE_LINK_SELECTOR);
  }

  function getNatepannWriterCell(row) {
    return row.querySelector(NATEPANN_WRITER_CELL_SELECTOR);
  }

  function getNatepannWriterLink(rowOrCell) {
    if (!rowOrCell) {
      return null;
    }

    if (rowOrCell.matches(NATEPANN_WRITER_CELL_SELECTOR)) {
      return rowOrCell.querySelector('a[href*="/search/talk"]');
    }

    return rowOrCell.querySelector(NATEPANN_WRITER_LINK_SELECTOR);
  }

  function getNatepannUrlFromElement(element) {
    const href = element ? element.getAttribute('href') || '' : '';

    if (!href) {
      return null;
    }

    try {
      return new URL(href, getCurrentUrl());
    } catch (error) {
      return null;
    }
  }

  function getNatepannWriterSearchValue(rowOrCell) {
    const writerUrl = getNatepannUrlFromElement(getNatepannWriterLink(rowOrCell));
    const searchValue = writerUrl ? writerUrl.searchParams.get('q') || '' : '';

    return searchValue.trim();
  }

  function getNatepannWriterDisplayName(writerCell) {
    if (!writerCell) {
      return '';
    }

    const clonedElement = writerCell.cloneNode(true);

    clonedElement
      .querySelectorAll(`.${WRITER_ACTION_BUTTON_CLASS}, img`)
      .forEach((element) => element.remove());

    return (clonedElement.textContent || '').trim();
  }

  function getNatepannPostId(row) {
    const titleUrl = getNatepannUrlFromElement(getNatepannTitleLink(row));

    if (!titleUrl) {
      return '';
    }

    const pathParts = titleUrl.pathname.split('/').filter(Boolean);
    const postId = pathParts[0] === 'talk' ? pathParts[1] || '' : '';

    return /^\d+$/.test(postId) ? postId : '';
  }

  function getNatepannPostValue(row) {
    const postId = getNatepannPostId(row);

    return postId ? `${NATEPANN_POST_ID_PREFIX}${postId}` : '';
  }

  const natepannAdapter = {
    siteId: 'natepann',
    displayName: '네이트판',
    postRowSelector: NATEPANN_POST_ROW_SELECTOR,
    writerCellSelector: NATEPANN_WRITER_CELL_SELECTOR,

    matchesUrl(url) {
      try {
        const parsedUrl = new URL(url);

        return (
          parsedUrl.hostname === 'pann.nate.com' &&
          parsedUrl.pathname.startsWith('/talk/')
        );
      } catch (error) {
        return false;
      }
    },

    isSupportedPostRow(row) {
      if (!row.matches(this.postRowSelector)) {
        return false;
      }

      const writerCell = getNatepannWriterCell(row);

      return Boolean(
        getNatepannTitleLink(row) &&
        writerCell &&
        getNatepannPostValue(row) &&
        (getNatepannWriterSearchValue(writerCell) ||
          getNatepannWriterDisplayName(writerCell))
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

      return this.getPostRows(node).length > 0;
    },

    getTitleText(row) {
      const titleLink = getNatepannTitleLink(row);

      return titleLink ? (titleLink.textContent || '').trim() : '';
    },

    getWriterCell(row) {
      return getNatepannWriterCell(row);
    },

    getWriterValues(row) {
      const writerCell = getNatepannWriterCell(row);

      return getUniqueTrimmedValues([
        getNatepannWriterSearchValue(writerCell),
        getNatepannWriterDisplayName(writerCell),
        getNatepannPostValue(row)
      ]);
    },

    getWriterCandidates(writerCell) {
      const row = writerCell.closest(NATEPANN_POST_ROW_SELECTOR);

      if (!row) {
        return [];
      }

      const writerSearchValue = getNatepannWriterSearchValue(writerCell);
      const writerDisplayName = getNatepannWriterDisplayName(writerCell);
      const postValue = getNatepannPostValue(row);
      const candidates = [];

      if (writerSearchValue || writerDisplayName) {
        candidates.push({
          type: 'nick',
          label: '닉네임(검색값)',
          value: writerSearchValue || writerDisplayName
        });
      }

      if (postValue) {
        candidates.push({
          type: 'unknown',
          label: '글',
          value: postValue
        });
      }

      return candidates;
    }
  };

  function getSaraminUrlParamFromElement(element, paramName) {
    const href = element ? element.getAttribute('href') || '' : '';

    if (!href) {
      return '';
    }

    try {
      return new URL(href, getCurrentUrl()).searchParams.get(paramName) || '';
    } catch (error) {
      return '';
    }
  }

  function getSaraminTitleLink(row) {
    return (
      row.querySelector(SARAMIN_SEARCH_TITLE_LINK_SELECTOR) ||
      row.querySelector(SARAMIN_CATEGORY_TITLE_LINK_SELECTOR) ||
      row.querySelector('a[href*="rec_idx="]')
    );
  }

  function getSaraminCompanyCell(row) {
    return (
      row.querySelector(SARAMIN_SEARCH_COMPANY_CELL_SELECTOR) ||
      row.querySelector(SARAMIN_CATEGORY_COMPANY_CELL_SELECTOR)
    );
  }

  function getSaraminCompanyLink(row) {
    return (
      row.querySelector(SARAMIN_SEARCH_COMPANY_LINK_SELECTOR) ||
      row.querySelector(SARAMIN_CATEGORY_COMPANY_LINK_SELECTOR) ||
      row.querySelector('a[href*="csn="]')
    );
  }

  function getSaraminRecruitId(row) {
    const rowValue = row.matches(SARAMIN_SEARCH_ROW_SELECTOR)
      ? (row.getAttribute('value') || '').trim()
      : '';

    if (rowValue) {
      return rowValue;
    }

    const rowId = row.matches('.list_item[id^="rec-"]')
      ? (row.getAttribute('id') || '').trim()
      : '';
    const idMatch = /^rec-(.+)$/.exec(rowId);

    if (idMatch && idMatch[1]) {
      return idMatch[1].trim();
    }

    return getSaraminUrlParamFromElement(getSaraminTitleLink(row), 'rec_idx').trim();
  }

  function getSaraminCompanyId(row) {
    const companyLink = getSaraminCompanyLink(row);
    const linkCsn = getSaraminUrlParamFromElement(companyLink, 'csn').trim();

    if (linkCsn) {
      return `${SARAMIN_COMPANY_ID_PREFIX}${linkCsn}`;
    }

    const companyCell = getSaraminCompanyCell(row);
    const csnElement =
      row.querySelector('[csn]') ||
      row.querySelector('[data-csn]') ||
      (companyCell ? companyCell.querySelector('[value]') : null);
    const rawCsn = csnElement
      ? (
          csnElement.getAttribute('csn') ||
          csnElement.getAttribute('data-csn') ||
          csnElement.getAttribute('value') ||
          ''
        ).trim()
      : '';

    return rawCsn ? `${SARAMIN_COMPANY_ID_PREFIX}${rawCsn}` : '';
  }

  function getSaraminRecruitValue(row) {
    const recruitId = getSaraminRecruitId(row);

    return recruitId ? `${SARAMIN_RECRUIT_ID_PREFIX}${recruitId}` : '';
  }

  function getSaraminCompanyDisplayName(row) {
    const companyCell = getSaraminCompanyCell(row);
    const companyLink = getSaraminCompanyLink(row);
    const sourceElement = companyLink || companyCell;

    if (!sourceElement) {
      return '';
    }

    const clonedElement = sourceElement.cloneNode(true);

    clonedElement
      .querySelectorAll(`.${WRITER_ACTION_BUTTON_CLASS}`)
      .forEach((element) => element.remove());

    return (clonedElement.textContent || '').trim();
  }

  function getSaraminRowText(row, selectors) {
    return getUniqueTrimmedValues(
      selectors.map((selector) => row.querySelector(selector)?.textContent || '')
    ).join(' ');
  }

  function getTopLevelSaraminRows(rows) {
    return rows.filter(
      (row) => !rows.some((candidate) => candidate !== row && candidate.contains(row))
    );
  }

  function getJobkoreaPathValueFromElement(element, pattern) {
    const href = element ? element.getAttribute('href') || '' : '';

    if (!href) {
      return '';
    }

    try {
      const match = new URL(href, window.location.href).pathname.match(pattern);

      return match && match[1] ? match[1].trim() : '';
    } catch (error) {
      return '';
    }
  }

  function getJobkoreaDataInfoParts(row) {
    return (row.getAttribute('data-info') || '')
      .split('|')
      .map((part) => part.trim());
  }

  function getJobkoreaTitleLink(row) {
    return (
      row.querySelector(JOBKOREA_TITLE_LINK_SELECTOR) ||
      row.querySelector('a[href*="/Recruit/GI_Read/"]')
    );
  }

  function getJobkoreaCompanyCell(row) {
    return row.querySelector(JOBKOREA_COMPANY_CELL_SELECTOR);
  }

  function getJobkoreaCompanyLink(row) {
    return row.querySelector(JOBKOREA_COMPANY_LINK_SELECTOR);
  }

  function getJobkoreaRecruitId(row) {
    const rowGno = (row.getAttribute('data-gno') || '').trim();

    if (rowGno) {
      return rowGno;
    }

    return getJobkoreaPathValueFromElement(
      getJobkoreaTitleLink(row),
      /\/Recruit\/GI_Read\/([^/]+)/i
    );
  }

  function getJobkoreaCompanyRawId(row) {
    const linkCompanyId = getJobkoreaPathValueFromElement(
      getJobkoreaCompanyLink(row),
      /\/Recruit\/Co_Read\/C\/([^/]+)/i
    );

    if (linkCompanyId) {
      return linkCompanyId;
    }

    const dataInfoParts = getJobkoreaDataInfoParts(row);
    const dataInfoCompanyId = dataInfoParts.length >= 7 ? dataInfoParts[6] : '';

    return dataInfoCompanyId || '';
  }

  function getJobkoreaCompanyId(row) {
    const rawCompanyId = getJobkoreaCompanyRawId(row);

    return rawCompanyId ? `${JOBKOREA_COMPANY_ID_PREFIX}${rawCompanyId}` : '';
  }

  function getJobkoreaRecruitValue(row) {
    const recruitId = getJobkoreaRecruitId(row);

    return recruitId ? `${JOBKOREA_RECRUIT_ID_PREFIX}${recruitId}` : '';
  }

  function getJobkoreaCompanyDisplayName(row) {
    const companyCell = getJobkoreaCompanyCell(row);
    const companyLink = getJobkoreaCompanyLink(row) || companyCell?.querySelector('a[href]');
    const sourceElement = companyLink || companyCell;

    if (!sourceElement) {
      return '';
    }

    const clonedElement = sourceElement.cloneNode(true);

    clonedElement
      .querySelectorAll(`.${WRITER_ACTION_BUTTON_CLASS}`)
      .forEach((element) => element.remove());

    return (clonedElement.textContent || '').trim();
  }

  function getJobkoreaRowText(row, selectors) {
    return getUniqueTrimmedValues(
      selectors.map((selector) => row.querySelector(selector)?.textContent || '')
    ).join(' ');
  }

  const jobkoreaAdapter = {
    siteId: 'jobkorea',
    displayName: '잡코리아',
    postRowSelector: JOBKOREA_POST_ROW_SELECTOR,
    writerCellSelector: JOBKOREA_COMPANY_CELL_SELECTOR,

    matchesUrl(url) {
      try {
        const parsedUrl = new URL(url);

        return (
          parsedUrl.hostname === 'www.jobkorea.co.kr' &&
          parsedUrl.pathname === '/recruit/joblist'
        );
      } catch (error) {
        return false;
      }
    },

    isSupportedPostRow(row) {
      if (!row.matches(this.postRowSelector)) {
        return false;
      }

      return Boolean(
        getJobkoreaTitleLink(row) &&
        getJobkoreaCompanyCell(row) &&
        getJobkoreaRecruitId(row) &&
        (getJobkoreaCompanyId(row) || getJobkoreaCompanyDisplayName(row))
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

      return this.getPostRows(node).length > 0;
    },

    getTitleText(row) {
      const titleLink = getJobkoreaTitleLink(row);
      const titleText = titleLink ? titleLink.textContent : '';
      const detailText = getJobkoreaRowText(row, [
        '.tplTit .etc',
        '.tplTit .dsc'
      ]);

      return getUniqueTrimmedValues([titleText, detailText]).join(' ');
    },

    getWriterCell(row) {
      return getJobkoreaCompanyCell(row);
    },

    getWriterValues(row) {
      return getUniqueTrimmedValues([
        getJobkoreaCompanyId(row),
        getJobkoreaCompanyDisplayName(row),
        getJobkoreaRecruitValue(row)
      ]);
    },

    getWriterCandidates(writerCell) {
      const row = writerCell.closest(JOBKOREA_POST_ROW_SELECTOR);

      if (!row) {
        return [];
      }

      const companyId = getJobkoreaCompanyId(row);
      const companyName = getJobkoreaCompanyDisplayName(row);
      const recruitValue = getJobkoreaRecruitValue(row);
      const candidates = [];

      if (companyId) {
        candidates.push({
          type: 'uid',
          label: '회사ID',
          value: companyId
        });
      }

      if (companyName) {
        candidates.push({
          type: 'nick',
          label: '회사명',
          value: companyName
        });
      }

      if (recruitValue) {
        candidates.push({
          type: 'unknown',
          label: '공고',
          value: recruitValue
        });
      }

      return candidates;
    }
  };

  const saraminAdapter = {
    siteId: 'saramin',
    displayName: '사람인',
    postRowSelector: SARAMIN_POST_ROW_SELECTOR,
    writerCellSelector: `${SARAMIN_SEARCH_COMPANY_CELL_SELECTOR}, ${SARAMIN_CATEGORY_COMPANY_CELL_SELECTOR}`,

    matchesUrl(url) {
      try {
        const parsedUrl = new URL(url);

        return (
          parsedUrl.hostname === 'www.saramin.co.kr' &&
          (parsedUrl.pathname === '/zf_user/search' ||
            parsedUrl.pathname === '/zf_user/jobs/list/job-category')
        );
      } catch (error) {
        return false;
      }
    },

    isSupportedPostRow(row) {
      if (!row.matches(this.postRowSelector)) {
        return false;
      }

      return Boolean(
        getSaraminTitleLink(row) &&
        getSaraminCompanyCell(row) &&
        getSaraminRecruitId(row) &&
        (getSaraminCompanyId(row) || getSaraminCompanyDisplayName(row))
      );
    },

    getPostRows(root) {
      const rows = Array.from(root.querySelectorAll(this.postRowSelector)).filter((row) =>
        this.isSupportedPostRow(row)
      );

      return getTopLevelSaraminRows(rows);
    },

    containsPostRows(node) {
      if (!node || node.nodeType !== 1) {
        return false;
      }

      if (node.matches(this.postRowSelector) && this.isSupportedPostRow(node)) {
        return true;
      }

      return this.getPostRows(node).length > 0;
    },

    getTitleText(row) {
      const titleLink = getSaraminTitleLink(row);
      const titleText = titleLink ? titleLink.textContent : '';
      const detailText = getSaraminRowText(row, [
        '.area_job .job_condition',
        '.area_job .job_sector',
        '.notification_info .job_meta',
        '.job_meta',
        '.recruit_info',
        '.col.recruit_info',
        '.support_info'
      ]);

      return getUniqueTrimmedValues([titleText, detailText]).join(' ');
    },

    getWriterCell(row) {
      return getSaraminCompanyCell(row);
    },

    getWriterValues(row) {
      return getUniqueTrimmedValues([
        getSaraminCompanyId(row),
        getSaraminCompanyDisplayName(row),
        getSaraminRecruitValue(row)
      ]);
    },

    getWriterCandidates(writerCell) {
      const row = writerCell.closest(SARAMIN_POST_ROW_SELECTOR);

      if (!row) {
        return [];
      }

      const companyId = getSaraminCompanyId(row);
      const companyName = getSaraminCompanyDisplayName(row);
      const recruitValue = getSaraminRecruitValue(row);
      const candidates = [];

      if (companyId) {
        candidates.push({
          type: 'uid',
          label: '회사ID',
          value: companyId
        });
      }

      if (companyName) {
        candidates.push({
          type: 'nick',
          label: '회사명',
          value: companyName
        });
      }

      if (recruitValue) {
        candidates.push({
          type: 'unknown',
          label: '공고',
          value: recruitValue
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
    todayhumorAdapter,
    quasarzoneAdapter,
    slrclubAdapter,
    invenAdapter,
    natepannAdapter,
    jobkoreaAdapter,
    saraminAdapter
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

  function getCurrentSiteCopy() {
    if (getCurrentSiteId() === 'saramin' || getCurrentSiteId() === 'jobkorea') {
      return {
        hiddenWriterLabel: '회사/공고',
        hiddenTitleLabel: '공고/조건',
        activeStatus: '숨김중',
        quickActionText: '숨김',
        quickActionAriaLabel: '회사/공고 숨김값 선택',
        menuActionVerb: '숨김',
        savedToast: '숨김 추가됨',
        removedToast: '숨김 해제됨',
        duplicateToast: '이미 숨김됨',
        disabledSuffix: '숨김 꺼짐',
        recentButtonAriaLabel: '최근 페이지 숨김값 관리',
        recentPanelAriaLabel: '최근 페이지 숨김값',
        recentPanelTitle: '최근 숨김',
        recentPanelEmptyText: '최근 페이지 숨김 없음',
        recentRemoveAriaLabel: '최근 숨김 해제',
        recentManageText: '최근 숨김 관리'
      };
    }

    return {
      hiddenWriterLabel: '작성자',
      hiddenTitleLabel: '제목',
      activeStatus: '차단중',
      quickActionText: '차단',
      quickActionAriaLabel: '작성자 차단값 선택',
      menuActionVerb: '차단',
      savedToast: '작성자 차단 추가됨',
      removedToast: '차단 해제됨',
      duplicateToast: '이미 차단됨',
      disabledSuffix: '차단 꺼짐',
      recentButtonAriaLabel: '최근 페이지 차단값 관리',
      recentPanelAriaLabel: '최근 페이지 차단값',
      recentPanelTitle: '최근 차단',
      recentPanelEmptyText: '최근 페이지 차단 없음',
      recentRemoveAriaLabel: '최근 차단 해제',
      recentManageText: '최근 차단 관리'
    };
  }

  function getCurrentSiteDisabledText() {
    return `${getCurrentSiteDisplayName()} ${getCurrentSiteCopy().disabledSuffix}`;
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
          `.${WRITER_ACTION_MENU_CLASS}, .${WRITER_ACTION_TOAST_CLASS}, .${REVEAL_CONTROL_CLASS}, .${RECENT_WRITER_PANEL_CLASS}, .${TEMPORARY_PICK_LABEL_CLASS}`
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

  function getHiddenRowsSummary(hiddenRows) {
    return hiddenRows.reduce(
      (summary, row) => {
        const reason = row.getAttribute(HIDDEN_REASON_ATTRIBUTE);

        if (reason === 'title-keyword') {
          summary.titleRows += 1;
        } else if (reason === 'writer') {
          summary.writerRows += 1;
        }

        return summary;
      },
      {
        titleRows: 0,
        writerRows: 0
      }
    );
  }

  function formatHiddenRowsDetail(summary) {
    const parts = [];
    const siteCopy = getCurrentSiteCopy();

    if (summary.writerRows > 0) {
      parts.push(`${siteCopy.hiddenWriterLabel} ${summary.writerRows}`);
    }

    if (summary.titleRows > 0) {
      parts.push(`${siteCopy.hiddenTitleLabel} ${summary.titleRows}`);
    }

    return parts.length > 0 ? parts.join(' / ') : '숨긴 항목 없음';
  }

  function getConnectedTemporaryHiddenEntries() {
    temporaryHideState.hiddenEntries = temporaryHideState.hiddenEntries.filter(
      (entry) =>
        entry &&
        entry.element &&
        entry.element.isConnected &&
        entry.element.getAttribute(TEMPORARY_HIDDEN_ATTRIBUTE) === 'true'
    );

    return temporaryHideState.hiddenEntries;
  }

  function getTemporaryHiddenCount() {
    return getConnectedTemporaryHiddenEntries().length;
  }

  function getTemporaryPickLabel() {
    return document.querySelector(`.${TEMPORARY_PICK_LABEL_CLASS}`);
  }

  function removeTemporaryPickLabel() {
    const label = getTemporaryPickLabel();

    if (label) {
      label.remove();
    }
  }

  function clearTemporaryHighlight() {
    if (!temporaryHideState.highlightedElement) {
      removeTemporaryPickLabel();
      return;
    }

    temporaryHideState.highlightedElement.removeAttribute(
      TEMPORARY_PICK_HIGHLIGHTED_ATTRIBUTE
    );
    temporaryHideState.highlightedElement = null;
    removeTemporaryPickLabel();
  }

  function positionTemporaryPickLabel(target) {
    if (!target || !target.isConnected) {
      removeTemporaryPickLabel();
      return;
    }

    let label = getTemporaryPickLabel();

    if (!label) {
      label = document.createElement('div');
      label.className = TEMPORARY_PICK_LABEL_CLASS;
      label.textContent = '클릭해 숨김';
      document.body.append(label);
    }

    const rect = target.getBoundingClientRect();
    const viewportWidth = globalThis.innerWidth || document.documentElement.clientWidth || 0;
    const left = Math.max(8, Math.min(rect.left + 8, viewportWidth - 96));
    const top = Math.max(8, rect.top + 8);

    label.style.left = `${Math.round(left)}px`;
    label.style.top = `${Math.round(top)}px`;
  }

  function setTemporaryHighlight(target) {
    if (temporaryHideState.highlightedElement === target) {
      positionTemporaryPickLabel(target);
      return;
    }

    clearTemporaryHighlight();

    if (!target) {
      return;
    }

    temporaryHideState.highlightedElement = target;
    target.setAttribute(TEMPORARY_PICK_HIGHLIGHTED_ATTRIBUTE, 'true');
    positionTemporaryPickLabel(target);
  }

  function isForbiddenTemporaryHideTarget(element) {
    if (!element || element.nodeType !== 1 || !element.isConnected) {
      return true;
    }

    if (isBoardMuteOverlayElement(element)) {
      return true;
    }

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';

    return [
      'html',
      'body',
      'head',
      'script',
      'style',
      'link',
      'meta',
      'iframe',
      'object',
      'embed'
    ].includes(tagName);
  }

  function isOversizedTemporaryHideTarget(element) {
    const rect = element.getBoundingClientRect();
    const viewportWidth = globalThis.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = globalThis.innerHeight || document.documentElement.clientHeight || 0;

    if (rect.width <= 0 || rect.height <= 0) {
      return true;
    }

    return (
      rect.width >= viewportWidth * 0.94 &&
      rect.height >= viewportHeight * 0.72
    );
  }

  function getBlockLikeTemporaryHideCandidate(element) {
    let candidate = element;

    while (
      candidate &&
      candidate.parentElement &&
      !isForbiddenTemporaryHideTarget(candidate)
    ) {
      const rect = candidate.getBoundingClientRect();
      const computedDisplay =
        typeof globalThis.getComputedStyle === 'function'
          ? globalThis.getComputedStyle(candidate).display
          : '';
      const isSmallInline =
        computedDisplay === 'inline' || rect.width < 24 || rect.height < 16;

      if (!isSmallInline) {
        return candidate;
      }

      candidate = candidate.parentElement;
    }

    return element;
  }

  function getTemporaryHideTarget(rawTarget) {
    if (!rawTarget || rawTarget.nodeType !== 1) {
      return null;
    }

    if (isForbiddenTemporaryHideTarget(rawTarget)) {
      return null;
    }

    const supportedRow = rawTarget.closest(currentSiteAdapter.postRowSelector);

    if (
      supportedRow &&
      isSupportedPostRow(supportedRow) &&
      !supportedRow.hidden &&
      supportedRow.getAttribute(TEMPORARY_HIDDEN_ATTRIBUTE) !== 'true'
    ) {
      return supportedRow;
    }

    const candidate = getBlockLikeTemporaryHideCandidate(rawTarget);

    if (
      isForbiddenTemporaryHideTarget(candidate) ||
      candidate.hidden ||
      candidate.getAttribute(TEMPORARY_HIDDEN_ATTRIBUTE) === 'true' ||
      isOversizedTemporaryHideTarget(candidate)
    ) {
      return null;
    }

    return candidate;
  }

  function restoreTemporaryHiddenEntry(entry) {
    if (!entry || !entry.element || !entry.element.isConnected) {
      return;
    }

    entry.element.hidden = Boolean(entry.previousHidden);
    restoreRowDisplayStyle(entry.element);
    entry.element.removeAttribute(TEMPORARY_HIDDEN_ATTRIBUTE);
  }

  function restoreLastTemporaryHiddenElement(entry) {
    restoreTemporaryHiddenEntry(entry);
    temporaryHideState.hiddenEntries = temporaryHideState.hiddenEntries.filter(
      (hiddenEntry) => hiddenEntry !== entry
    );
    updateRevealControl();
  }

  function restoreAllTemporaryHiddenElements() {
    const viewportSnapshot = captureViewportSnapshot();

    getConnectedTemporaryHiddenEntries().forEach(restoreTemporaryHiddenEntry);
    temporaryHideState.hiddenEntries = [];
    updateRevealControl();
    restoreViewportSnapshot(viewportSnapshot);
    showToast('임시 숨김 해제됨');
  }

  function hideElementTemporarily(element) {
    if (!element || element.getAttribute(TEMPORARY_HIDDEN_ATTRIBUTE) === 'true') {
      return null;
    }

    const entry = {
      element,
      previousHidden: Boolean(element.hidden)
    };

    saveRowDisplayStyle(element);
    element.hidden = true;
    element.style.setProperty('display', 'none', 'important');
    element.setAttribute(TEMPORARY_HIDDEN_ATTRIBUTE, 'true');
    temporaryHideState.hiddenEntries.push(entry);
    updateRevealControl();
    showToast('임시 숨김됨', {
      label: '되돌리기',
      onAction: () => {
        restoreLastTemporaryHiddenElement(entry);
      }
    });

    return entry;
  }

  function stopTemporaryHidePicking(options = {}) {
    const { showCancelledToast = false } = options;

    if (!temporaryHideState.isPicking) {
      return;
    }

    temporaryHideState.isPicking = false;
    clearTemporaryHighlight();
    document.body.classList.remove(TEMPORARY_PICKING_BODY_CLASS);
    document.removeEventListener('pointermove', handleTemporaryPickPointerMove, true);
    document.removeEventListener('click', handleTemporaryPickClick, true);
    updateRevealControl();

    if (showCancelledToast) {
      showToast('선택 취소됨');
    }
  }

  function startTemporaryHidePicking() {
    if (temporaryHideState.isPicking) {
      stopTemporaryHidePicking({ showCancelledToast: true });
      return;
    }

    closeWriterMenu();
    closeRecentWriterPanel();
    ensureRevealControlStyles();
    temporaryHideState.isPicking = true;
    document.body.classList.add(TEMPORARY_PICKING_BODY_CLASS);
    document.addEventListener('pointermove', handleTemporaryPickPointerMove, true);
    document.addEventListener('click', handleTemporaryPickClick, true);
    updateRevealControl();
    showToast('숨길 요소 선택 중');
  }

  function handleTemporaryPickPointerMove(event) {
    if (!temporaryHideState.isPicking) {
      return;
    }

    setTemporaryHighlight(getTemporaryHideTarget(event.target));
  }

  function handleTemporaryPickClick(event) {
    if (!temporaryHideState.isPicking) {
      return;
    }

    const target = getTemporaryHideTarget(event.target);

    if (!target) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (typeof event.stopImmediatePropagation === 'function') {
      event.stopImmediatePropagation();
    }

    stopTemporaryHidePicking();
    hideElementTemporarily(target);
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
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        box-sizing: border-box;
        width: min(360px, calc(100vw - 32px));
        padding: 10px;
        border: 1px solid #cfe1da;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: 0 8px 24px rgba(20, 36, 31, 0.18);
        color: #16231f;
        font-size: 12px;
        line-height: 1.4;
        font-family: Arial, "Noto Sans KR", sans-serif;
      }

      .${REVEAL_CONTROL_CLASS}.is-revealed {
        border-color: #ccd8f2;
      }

      .${REVEAL_CONTROL_CLASS}.is-picking {
        border-color: #b9ddce;
        box-shadow: 0 8px 24px rgba(15, 111, 85, 0.2);
      }

      .${REVEAL_CONTROL_STATUS_CLASS} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 52px;
        height: 24px;
        padding: 0 8px;
        border-radius: 999px;
        background: #ddf4ec;
        color: #0f6f55;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
      }

      .${REVEAL_CONTROL_CLASS}.is-revealed .${REVEAL_CONTROL_STATUS_CLASS} {
        background: #e7efff;
        color: #2858a4;
      }

      .${REVEAL_CONTROL_CLASS}.is-picking .${REVEAL_CONTROL_STATUS_CLASS} {
        background: #fff3cf;
        color: #8a5a00;
      }

      .board-mute-reveal-control-copy {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .${REVEAL_CONTROL_TEXT_CLASS} {
        display: block;
        min-width: 0;
        overflow: hidden;
        color: #16231f;
        font-size: 13px;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .${REVEAL_CONTROL_DETAIL_CLASS} {
        display: block;
        min-width: 0;
        overflow: hidden;
        color: #6d7975;
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .${REVEAL_CONTROL_ACTIONS_CLASS} {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
        min-width: 0;
        flex-wrap: wrap;
      }

      .${REVEAL_CONTROL_BUTTON_CLASS} {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        min-width: 60px;
        min-height: 28px;
        padding: 4px 9px;
        border: 1px solid #b8c8c2;
        border-radius: 6px;
        background: #f7faf9;
        color: #1f3430;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
      }

      .${REVEAL_CONTROL_BUTTON_CLASS}:disabled {
        cursor: default;
        opacity: 0.65;
      }

      .${REVEAL_CONTROL_BUTTON_CLASS}[hidden] {
        display: none;
      }

      .${REVEAL_CONTROL_BUTTON_CLASS}:hover,
      .${REVEAL_CONTROL_BUTTON_CLASS}:focus {
        border-color: #0f7a5f;
        background: #edf8f4;
        color: #0f6f55;
        outline: none;
      }

      body.${TEMPORARY_PICKING_BODY_CLASS},
      body.${TEMPORARY_PICKING_BODY_CLASS} * {
        cursor: crosshair !important;
      }

      [${TEMPORARY_PICK_HIGHLIGHTED_ATTRIBUTE}="true"] {
        outline: 2px solid #0f7a5f !important;
        outline-offset: 2px !important;
        background-color: rgba(15, 122, 95, 0.08) !important;
      }

      .${TEMPORARY_PICK_LABEL_CLASS} {
        position: fixed;
        z-index: 2147483647;
        box-sizing: border-box;
        max-width: min(180px, calc(100vw - 16px));
        padding: 5px 8px;
        border: 1px solid #b9ddce;
        border-radius: 999px;
        background: #ffffff;
        box-shadow: 0 6px 18px rgba(20, 36, 31, 0.18);
        color: #0f6f55;
        font-size: 11px;
        font-weight: 700;
        line-height: 1.2;
        font-family: Arial, "Noto Sans KR", sans-serif;
        pointer-events: none;
        white-space: nowrap;
      }

      .${RECENT_WRITER_PANEL_CLASS} {
        position: fixed;
        right: 16px;
        bottom: 132px;
        z-index: 2147483646;
        width: min(340px, calc(100vw - 32px));
        max-height: min(340px, calc(100vh - 154px));
        box-sizing: border-box;
        overflow: auto;
        padding: 10px;
        border: 1px solid #cfe1da;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 10px 28px rgba(20, 36, 31, 0.2);
        color: #16231f;
        font-size: 12px;
        line-height: 1.4;
        font-family: Arial, "Noto Sans KR", sans-serif;
      }

      .${RECENT_WRITER_PANEL_HEADER_CLASS} {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-width: 0;
        margin-bottom: 8px;
      }

      .${RECENT_WRITER_PANEL_TITLE_CLASS} {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .${RECENT_WRITER_PANEL_TITLE_CLASS} strong {
        color: #16231f;
        font-size: 13px;
        font-weight: 700;
      }

      .${RECENT_WRITER_PANEL_COUNT_CLASS} {
        color: #6d7975;
        font-size: 11px;
      }

      .${RECENT_WRITER_PANEL_LIST_CLASS} {
        display: grid;
        gap: 6px;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .${RECENT_WRITER_PANEL_ENTRY_CLASS} {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        min-width: 0;
        min-height: 34px;
        padding: 6px;
        border: 1px solid #e0e8e4;
        border-radius: 6px;
        background: #fbfdfc;
      }

      .${RECENT_WRITER_PANEL_TYPE_CLASS} {
        padding: 2px 6px;
        border: 1px solid #cde1d9;
        border-radius: 999px;
        background: #edf8f4;
        color: #0f6f55;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
      }

      .${RECENT_WRITER_PANEL_VALUE_CLASS} {
        overflow: hidden;
        color: #243530;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .${RECENT_WRITER_PANEL_EMPTY_CLASS} {
        padding: 8px 6px;
        color: #6d7975;
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
    const temporaryHiddenCount = getTemporaryHiddenCount();

    ensureRevealControlStyles();

    let control = getRevealControl();

    if (!control) {
      control = document.createElement('div');
      control.className = REVEAL_CONTROL_CLASS;
      control.setAttribute('role', 'status');

      const status = document.createElement('span');
      status.className = REVEAL_CONTROL_STATUS_CLASS;
      control.append(status);

      const copy = document.createElement('span');
      copy.className = 'board-mute-reveal-control-copy';

      const text = document.createElement('span');
      text.className = REVEAL_CONTROL_TEXT_CLASS;
      copy.append(text);

      const detail = document.createElement('span');
      detail.className = REVEAL_CONTROL_DETAIL_CLASS;
      copy.append(detail);

      control.append(copy);

      const actions = document.createElement('span');
      actions.className = REVEAL_CONTROL_ACTIONS_CLASS;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = `${REVEAL_CONTROL_BUTTON_CLASS} ${REVEAL_CONTROL_TOGGLE_BUTTON_CLASS}`;
      actions.append(button);

      const recentButton = document.createElement('button');
      recentButton.type = 'button';
      recentButton.className = `${REVEAL_CONTROL_BUTTON_CLASS} ${REVEAL_CONTROL_RECENT_BUTTON_CLASS}`;
      recentButton.setAttribute('aria-label', getCurrentSiteCopy().recentButtonAriaLabel);
      recentButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleRecentWriterPanel();
      });
      actions.append(recentButton);

      const temporaryHideButton = document.createElement('button');
      temporaryHideButton.type = 'button';
      temporaryHideButton.className = `${REVEAL_CONTROL_BUTTON_CLASS} ${TEMPORARY_HIDE_BUTTON_CLASS}`;
      temporaryHideButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        startTemporaryHidePicking();
      });
      actions.append(temporaryHideButton);

      const temporaryRestoreButton = document.createElement('button');
      temporaryRestoreButton.type = 'button';
      temporaryRestoreButton.className = `${REVEAL_CONTROL_BUTTON_CLASS} ${TEMPORARY_RESTORE_BUTTON_CLASS}`;
      temporaryRestoreButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        restoreAllTemporaryHiddenElements();
      });
      actions.append(temporaryRestoreButton);

      control.append(actions);

      document.body.append(control);
    }

    const status = control.querySelector(`.${REVEAL_CONTROL_STATUS_CLASS}`);
    const text = control.querySelector(`.${REVEAL_CONTROL_TEXT_CLASS}`);
    const detail = control.querySelector(`.${REVEAL_CONTROL_DETAIL_CLASS}`);
    const button = control.querySelector(`.${REVEAL_CONTROL_TOGGLE_BUTTON_CLASS}`);
    const recentButton = control.querySelector(`.${REVEAL_CONTROL_RECENT_BUTTON_CLASS}`);
    const temporaryHideButton = control.querySelector(`.${TEMPORARY_HIDE_BUTTON_CLASS}`);
    const temporaryRestoreButton = control.querySelector(`.${TEMPORARY_RESTORE_BUTTON_CLASS}`);
    const temporarilyShownRows = getTemporarilyShownRows();
    const summary = getHiddenRowsSummary(hiddenRows);
    const isRevealed = temporarilyShownRows.length > 0;
    const isPicking = temporaryHideState.isPicking;

    control.classList.toggle('is-revealed', isRevealed);
    control.classList.toggle('is-picking', isPicking);

    if (isPicking) {
      status.textContent = '선택중';
      text.textContent = '클릭해 숨김';
      detail.textContent =
        temporaryHiddenCount > 0
          ? `임시 숨김 ${temporaryHiddenCount}개`
          : '이번 페이지에서만 적용';
    } else if (hiddenRows.length > 0) {
      status.textContent = isRevealed ? '보기중' : getCurrentSiteCopy().activeStatus;
      text.textContent = isRevealed
        ? `${temporarilyShownRows.length}개 임시 표시`
        : `숨김 ${hiddenRows.length}개`;
      detail.textContent =
        temporaryHiddenCount > 0
          ? `${formatHiddenRowsDetail(summary)} / 임시 ${temporaryHiddenCount}`
          : formatHiddenRowsDetail(summary);
    } else if (temporaryHiddenCount > 0) {
      status.textContent = '임시';
      text.textContent = `임시 숨김 ${temporaryHiddenCount}개`;
      detail.textContent = '새로고침하면 해제';
    } else {
      status.textContent = '대기중';
      text.textContent = '직접 숨김';
      detail.textContent = '이번 페이지에서만 숨김';
    }

    if (button) {
      button.hidden = hiddenRows.length === 0;
      button.textContent = isRevealed ? '다시 숨김' : '잠시 보기';
      button.onclick = isRevealed ? hideTemporarilyShownRows : revealTemporarilyHiddenRows;
    }

    if (recentButton) {
      recentButton.hidden = hiddenRows.length === 0;
      recentButton.textContent = '관리';

      if (hiddenRows.length === 0) {
        closeRecentWriterPanel();
      }
    }

    if (temporaryHideButton) {
      temporaryHideButton.textContent = isPicking ? '취소' : '선택 숨김';
      temporaryHideButton.setAttribute(
        'aria-label',
        isPicking ? '선택 숨김 취소' : '숨길 요소 선택'
      );
    }

    if (temporaryRestoreButton) {
      temporaryRestoreButton.hidden = temporaryHiddenCount === 0;
      temporaryRestoreButton.textContent = '되돌리기';
      temporaryRestoreButton.setAttribute('aria-label', '임시 숨김 모두 되돌리기');
    }
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
        right: 4px;
        z-index: 2;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: auto;
        min-width: 38px;
        height: 22px;
        transform: translateY(-50%);
        padding: 0 8px;
        border: 1px solid #b8d7ce;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 2px 8px rgba(18, 40, 34, 0.14);
        color: #0f6f55;
        appearance: none;
        font-family: inherit;
        font-size: 11px;
        font-weight: 700;
        line-height: 20px;
        white-space: nowrap;
        cursor: pointer;
        opacity: 0;
        transition: opacity 90ms ease, border-color 90ms ease, background 90ms ease;
        contain: layout paint style;
      }

      [${WRITER_ACTION_CONTAINER_ATTRIBUTE}="true"]:hover > .${WRITER_ACTION_BUTTON_CLASS},
      [${WRITER_ACTION_CONTAINER_ATTRIBUTE}="true"]:focus-within > .${WRITER_ACTION_BUTTON_CLASS} {
        opacity: 1;
      }

      .${WRITER_ACTION_BUTTON_CLASS}:focus {
        opacity: 1;
        border-color: #0f7a5f;
        background: #edf8f4;
        outline: 2px solid rgba(15, 122, 95, 0.22);
        outline-offset: 1px;
      }

      .${WRITER_ACTION_BUTTON_CLASS}[data-board-mute-site="clien"] {
        right: 8px;
      }

      .${WRITER_ACTION_MENU_CLASS} {
        position: fixed;
        z-index: 2147483647;
        min-width: 176px;
        max-width: min(340px, calc(100vw - 16px));
        padding: 6px;
        border: 1px solid #cfe1da;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 10px 28px rgba(20, 36, 31, 0.2);
        color: #16231f;
        font-size: 12px;
        line-height: 1.4;
        font-family: Arial, "Noto Sans KR", sans-serif;
      }

      .${WRITER_ACTION_MENU_CLASS} button {
        display: block;
        width: 100%;
        min-height: 30px;
        padding: 6px 8px;
        border: 0;
        border-radius: 6px;
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
        background: #edf8f4;
        color: #0f6f55;
        outline: none;
      }

      .${WRITER_ACTION_MENU_CLASS} .board-mute-menu-scope {
        margin: 6px 8px 2px;
        color: #6d7975;
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
        padding: 9px 11px;
        border: 1px solid #17312b;
        border-radius: 8px;
        background: #17231f;
        color: #fff;
        font-size: 12px;
        line-height: 1.4;
        box-shadow: 0 8px 24px rgba(20, 36, 31, 0.22);
        font-family: Arial, "Noto Sans KR", sans-serif;
      }

      .${WRITER_ACTION_TOAST_TEXT_CLASS} {
        flex: 1 1 auto;
        min-width: 0;
        overflow-wrap: anywhere;
      }

      .${WRITER_ACTION_TOAST_ACTION_CLASS} {
        flex: 0 0 auto;
        min-height: 26px;
        padding: 3px 8px;
        border: 1px solid rgba(255, 255, 255, 0.62);
        border-radius: 6px;
        background: transparent;
        color: #fff;
        font: inherit;
        font-weight: 700;
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
    const viewportHeight = globalThis.innerHeight || document.documentElement.clientHeight || 0;
    const menuWidth = menu.getBoundingClientRect().width || 180;
    const menuHeight = menu.getBoundingClientRect().height || 160;
    const left = viewportWidth
      ? Math.max(8, Math.min(rect.left, viewportWidth - menuWidth - 8))
      : rect.left;
    const topCandidate = rect.bottom + 6;
    const top = viewportHeight
      ? Math.max(8, Math.min(topCandidate, viewportHeight - menuHeight - 8))
      : topCandidate;

    menu.style.top = `${Math.round(top)}px`;
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
            showToast(getCurrentSiteCopy().removedToast);
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

    showToast(getCurrentSiteCopy().savedToast, {
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
    const siteCopy = getCurrentSiteCopy();
    const panel = document.createElement('div');
    panel.className = RECENT_WRITER_PANEL_CLASS;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', siteCopy.recentPanelAriaLabel);

    const header = document.createElement('div');
    header.className = RECENT_WRITER_PANEL_HEADER_CLASS;

    const title = document.createElement('span');
    title.className = RECENT_WRITER_PANEL_TITLE_CLASS;

    const titleText = document.createElement('strong');
    titleText.textContent = siteCopy.recentPanelTitle;
    title.append(titleText);

    const countText = document.createElement('span');
    countText.className = RECENT_WRITER_PANEL_COUNT_CLASS;
    countText.textContent = entries.length > 0 ? `${entries.length}개 저장됨` : '페이지에서 추가한 값 없음';
    title.append(countText);

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
      emptyItem.textContent = siteCopy.recentPanelEmptyText;
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
      removeButton.setAttribute('aria-label', `${siteCopy.recentRemoveAriaLabel}: ${entry.value}`);
      removeButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        removeButton.disabled = true;
        removeButton.textContent = '해제 중';

        undoWriterCandidate(entry).then((result) => {
          if (result.removed || result.reason === 'not-found') {
            closeRecentWriterPanel();
            return;
          }

          removeButton.disabled = false;
          removeButton.textContent = '해제';
        });
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
          showToast(getCurrentSiteDisabledText());
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
                showToast(getCurrentSiteCopy().duplicateToast);
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
          showToast(getCurrentSiteCopy().duplicateToast);
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

    const siteCopy = getCurrentSiteCopy();
    const menu = document.createElement('div');
    menu.className = WRITER_ACTION_MENU_CLASS;
    menu.setAttribute('role', 'menu');

    candidates.forEach((candidate) => {
      const menuItem = document.createElement('button');
      menuItem.type = 'button';
      menuItem.textContent = `${candidate.label} ${siteCopy.menuActionVerb}: ${candidate.value}`;
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
    recentButton.textContent = siteCopy.recentManageText;
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
      button.textContent = getCurrentSiteCopy().quickActionText;
      button.setAttribute('aria-label', getCurrentSiteCopy().quickActionAriaLabel);
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
      stopTemporaryHidePicking({ showCancelledToast: temporaryHideState.isPicking });
      closeWriterMenu();
      closeRecentWriterPanel();
    }
  });
})();
