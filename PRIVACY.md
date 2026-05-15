# Board Mute Privacy Policy

Effective date: 2026-05-15

Board Mute hides unwanted rows on supported Korean community board list pages using rules stored in your browser. The extension is designed as a local-first Chrome extension and does not operate a developer server.

## Data Stored By The Extension

Board Mute stores only the rules needed to provide its row hiding features.

Stored data may include:

- Site-specific enabled or disabled state
- Site-specific title keywords
- Global title keywords for supported sites
- Writer, user ID, nickname, IP, or site member identifier values that you add
- Metadata for writer values, such as source (`page`, `popup`, `legacy`, `default`, or `unknown`) and creation time

Some writer values may be public identifiers copied from supported board pages, such as a public nickname, public user ID, public member number, or public IP text shown by the site.

## Where Data Is Stored

Board Mute stores its rules in Chrome local extension storage:

```text
chrome.storage.local
```

The extension does not use `chrome.storage.sync`.

## How Data Is Used

Board Mute uses stored rules to:

- Hide supported board list rows whose titles match your title keywords
- Hide supported board list rows whose writer values match your writer rules
- Show and manage your rules in the popup
- Let you add, undo, or remove writer rules from supported pages
- Preserve site-specific enabled or disabled state

The extension reads supported page DOM content in your browser only to identify supported rows, titles, and writer candidates for these user-facing features.

## Data Sharing And Transfer

Board Mute does not:

- Send stored rules to an external server
- Sell user data
- Share user data with third parties
- Use data for advertising
- Use analytics SDKs
- Use remote logging
- Use remotely hosted executable code

The extension's use of user data is limited to providing its single purpose: local row hiding on supported community board list pages.

## Permissions

Board Mute currently requests one Chrome permission:

| Permission | Reason |
| --- | --- |
| `storage` | Save and load your local mute rules in `chrome.storage.local`. |

Board Mute also declares content script matches for supported sites:

```text
https://gall.dcinside.com/*
https://www.fmkorea.com/*
https://bbs.ruliweb.com/*
https://mlbpark.donga.com/*
https://www.clien.net/service/board/*
```

These matches allow the extension to add hiding and quick-block controls to supported board list rows on those sites.

## Data Retention And Deletion

Rules remain in local Chrome extension storage until you remove them in the popup, undo a quick block, remove the extension, or clear the extension's local data through Chrome.

Removing Board Mute from Chrome removes the extension's local storage according to Chrome's extension storage behavior.

## What Board Mute Does Not Collect

Board Mute does not intentionally collect:

- Names, email addresses, phone numbers, or account credentials
- Payment information
- Precise location
- Health or financial information
- Full browsing history
- Message contents outside supported board list row data needed for the feature

## Chrome Web Store Disclosure Notes

Chrome Web Store privacy disclosures should stay consistent with this policy and the extension's actual behavior.

Current disclosure basis:

- No external transmission by the extension
- No third-party data sharing by the extension
- No advertising or analytics use
- Minimum permission scope: `storage` plus five supported content script match patterns
- Local storage of user-created rules and rule metadata

If future versions add sync, accounts, telemetry, remote rules, new permissions, or new data transfers, this policy and the Chrome Web Store privacy practices must be updated before release.

## Contact

Use the Support URL shown on the Chrome Web Store listing for Board Mute.

For the first public release, the intended support channel is the Issues tab in the public GitHub repository that hosts this privacy policy.
