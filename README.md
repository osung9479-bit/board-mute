# Board Mute

Board Mute는 지원하는 한국 커뮤니티 게시판 목록과 사람인 채용 목록에서 원치 않는 row를 로컬 규칙으로 숨기는 Chrome 확장 프로그램입니다.

현재는 Chrome Web Store 배포 전의 unpacked 확장 기준입니다. 모든 사이트를 자동으로 지원하는 도구가 아니라, 아래 지원 범위에서만 동작하도록 좁게 만들었습니다.

## 지원 사이트

| 사이트 | 지원 범위 | 작성자/숨김 기준 |
| --- | --- | --- |
| 디시인사이드 | 게시판 목록, 글 보기 하단 리스트 | 아이디, IP, 닉네임 |
| 에펨코리아 | 일반 게시판 목록, 글 보기 하단 일반 목록 | `member_숫자` class |
| 루리웹 | PC BBS 게시판 목록 | `member_srl` |
| 엠팍 | PC 목록 | `data-usite:data-uid` |
| 클리앙 | PC 게시판 목록 | `data-author-id` |
| 오늘의유머 | PC 홈, 게시판 목록, 글 보기 본문과 하단 목록 | `mn` 회원번호 |
| 퀘이사존 | PC BBS 게시판 목록 | `data-id` |
| SLR클럽 | PC `zboard.php` 게시판 목록 | `data-xuid` |
| 사람인 | PC 검색 결과, 직무별 목록 | 회사 ID `csn:<token>`, 회사명, 공고 ID `rec:<rec_idx>` |

확장 프로그램은 아래 도메인에만 content script를 주입합니다.

```text
https://gall.dcinside.com/*
https://www.fmkorea.com/*
https://bbs.ruliweb.com/*
https://mlbpark.donga.com/*
https://www.clien.net/service/board/*
https://www.todayhumor.co.kr/
https://www.todayhumor.co.kr/board/list.php*
https://www.todayhumor.co.kr/board/view.php*
https://quasarzone.com/bbs/*
https://www.slrclub.com/bbs/zboard.php*
https://www.saramin.co.kr/zf_user/search*
https://www.saramin.co.kr/zf_user/jobs/list/job-category*
```

## 지원하지 않는 범위

- 모든 한국 커뮤니티 자동 지원
- 댓글 작성자 차단
- 모바일 웹
- 오늘의유머 글 보기 본문 작성자를 제외한 글 본문 작성자 차단
- 현재 탭 URL 기반 popup 자동 사이트 선택
- 전역 작성자, 아이디, IP 차단
- 지원 row 구조가 없는 페이지의 별도 고정 관리 버튼

사이트별 제외 범위는 아래와 같습니다.

- 디시인사이드: 광고, 설문, 일반 안내 row
- 에펨코리아: `/best` 포텐 목록 작성자 차단, 댓글 차단
- 루리웹: `/best` 집계 목록, 글 보기 댓글, 글 보기 본문 작성자, 모바일 웹, 사이드바와 상단 BEST 위젯
- 엠팍: 글 보기 본문 작성자, 댓글 작성자, 우측/하단 BEST 위젯, 광고/외부 추천 목록, 모바일 웹
- 클리앙: 글 보기 본문 작성자, 댓글 작성자, 검색 결과, 모바일 웹, 로그인 후 전용 페이지
- 오늘의유머: 댓글 작성자, 모바일 웹, 로그인 후 전용 페이지
- 퀘이사존: 글 보기 본문 작성자, 댓글 작성자, 모바일 웹, 로그인 후 전용 페이지, 게시글 목록이 아닌 BBS 부가 위젯
- SLR클럽: 글 보기 본문 작성자, 댓글 작성자, 모바일 웹, `zboard.php` 목록이 아닌 페이지
- 사람인: 지역별 목록, 테마 채용관, 신입·인턴 홈, 상세 페이지, 모바일 웹, 로그인 후 개인화 영역

## 설치 방법

1. Chrome에서 `chrome://extensions`를 엽니다.
2. 오른쪽 위의 개발자 모드를 켭니다.
3. `압축해제된 확장 프로그램을 로드합니다`를 누릅니다.
4. 이 저장소 루트 폴더를 선택합니다. `manifest.json`이 바로 보이는 폴더여야 합니다.
5. 설치 후 지원 사이트 게시판 페이지를 새로고침합니다.

코드를 수정한 뒤에는 `chrome://extensions`에서 Board Mute 카드의 새로고침 버튼을 누르고, 열려 있던 게시판 페이지도 다시 새로고침합니다.

## 사용 방법

### Popup에서 규칙 관리

Chrome 툴바의 Board Mute 아이콘을 눌러 popup을 엽니다.

- `사이트` 선택으로 디시인사이드, 에펨코리아, 루리웹, 엠팍, 클리앙, 오늘의유머, 퀘이사존, SLR클럽, 사람인 규칙을 전환합니다.
- 사이트별 `차단` 토글을 끄면 저장된 규칙은 보존하고 해당 사이트 숨김만 멈춥니다.
- `제목 키워드`는 선택한 사이트에만 적용됩니다.
- `전역 제목 키워드`는 지원 사이트 전체에 적용됩니다.
- `작성자/아이디/IP`에는 직접 차단할 작성자 값을 추가하거나 삭제할 수 있습니다. 사람인에서는 같은 저장 영역을 `회사/공고 숨김값`으로 표시합니다.
- 작성자 목록은 타입, 출처, 검색으로 좁혀 볼 수 있습니다.

### 게시판 페이지에서 빠른 차단

지원되는 게시글 또는 채용 row의 작성자/회사 영역에는 작은 `차단` 또는 `숨김` 버튼이 붙습니다.

1. `차단` 또는 `숨김` 버튼을 누릅니다.
2. 메뉴에서 차단하거나 숨길 값을 선택합니다.
3. 같은 작성자, 회사, 공고 값으로 판단되는 row가 즉시 숨겨지고 규칙이 저장됩니다.
4. 토스트의 `되돌리기`를 누르면 방금 추가한 차단/숨김값이 제거됩니다.

숨겨진 row가 있을 때는 페이지에 `잠시 보기` / `다시 숨김` 컨트롤이 표시됩니다. 최근 페이지에서 추가한 값은 `최근 차단 관리` 또는 사람인의 `최근 숨김 관리`에서 해제할 수 있습니다.

### 게시판 페이지에서 임시 숨김

페이지 오른쪽 아래 컨트롤의 `선택 숨김`을 누르면 이번 페이지에서만 숨길 요소를 직접 고를 수 있습니다.

- 마우스를 올린 요소가 강조됩니다.
- 클릭한 요소는 즉시 숨겨집니다.
- `되돌리기`로 이번 페이지에서 임시 숨김한 요소를 복구할 수 있습니다.
- 새로고침하면 임시 숨김은 사라집니다.
- 이 기능은 규칙을 저장하지 않으며 popup 목록에도 추가하지 않습니다.

## 데이터와 권한

Board Mute는 규칙을 브라우저 로컬 저장소인 `chrome.storage.local`에 저장합니다.

저장하는 데이터:

- 사이트별 차단 켜기/끄기 상태
- 사이트별 제목 키워드
- 전역 제목 키워드
- 사용자가 추가한 작성자, 회사, 공고 값
- 작성자, 회사, 공고 값의 출처와 생성 시각 metadata

현재 코드 기준:

- 외부 서버 전송 없음
- 원격 분석 없음
- 광고 SDK 없음
- Chrome 권한은 `storage`만 사용
- content script match는 지원 사이트 9개 범위로 제한

## 개인정보와 지원

개인정보 처리 기준은 [PRIVACY.md](PRIVACY.md)에 정리합니다.

문제 제보와 지원 범위는 [SUPPORT.md](SUPPORT.md)에 정리합니다.

Chrome Web Store 첫 제출에서는 공개 GitHub 저장소를 공식 공개 위치로 사용합니다.

- Homepage URL: 이 저장소의 README
- Privacy policy URL: 이 저장소의 `PRIVACY.md`
- Support URL: 이 저장소의 Issues

별도 웹사이트와 support email은 첫 제출 범위에 넣지 않습니다.

## 개발 검증

지원 사이트별 자동 검증은 아래 명령으로 실행합니다.

```powershell
node scripts/check-dcinside.js
node scripts/check-fmkorea.js
node scripts/check-ruliweb.js
node scripts/check-mlbpark.js
node scripts/check-clien.js
node scripts/check-todayhumor.js
node scripts/check-quasarzone.js
node scripts/check-slrclub.js
node scripts/check-saramin.js
git diff --check
```

디시인사이드, 에펨코리아, 루리웹, 엠팍, 클리앙, 오늘의유머는 자동 검증과 실제 Chrome 최소 수동 확인을 통과한 상태입니다. 퀘이사존은 사용자 수동 확인 중 발견된 최근 차단 해제 버튼 UI를 보완했고 Chrome/CDP 재확인을 통과했습니다. SLR클럽도 현재 소스 기준 Chrome/CDP 최소 확인을 통과했습니다. 사람인은 검색 결과와 직무별 목록에서 정식 smoke로 공고/조건 키워드, 회사 ID, 회사명 fallback, 특정 공고, disabled site 동작을 확인했습니다. 사이트 DOM이 바뀌면 adapter와 검증 기준을 다시 확인해야 합니다.

릴리스 ZIP은 아래 명령으로 생성합니다.

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-release-package.ps1
```

## 출시 전 남은 작업

Chrome Web Store 제출 전 기준은 아래와 같습니다.

- 현재 소스 버전: `0.4.0`
- 마지막 검증 패키지: `dist/board-mute-0.4.0.zip`
- `0.4.0` SHA-256: `EB4F1149CB3B261EDF1BB1403DE5C2F382455516DC098049C580865C12CF8D6E`
- `0.4.0` ZIP 크기: `40,022` bytes
- 남은 작업: public repository push 재검토, Chrome Web Store dashboard 입력과 실제 제출
