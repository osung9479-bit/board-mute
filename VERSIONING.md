# Versioning

Board Mute는 Chrome extension manifest의 숫자형 `version` 값을 기준으로 릴리스를 구분합니다.

현재 소스 버전은 `0.5.0`입니다.

마지막으로 패키징까지 검증한 제출 후보는 `0.5.0`입니다.

- ZIP: `dist/board-mute-0.5.0.zip`
- SHA-256: `61B2E552AFF44B949FBEA43ABE3CD5C33A50E05EE3EDD702803276FB7C443106`
- 파일 크기: `42,184` bytes

`0.5.0`은 사람인 포함 `0.4.0` 이후 잡코리아 PC 채용 목록, 인벤 PC 게시판 목록, 네이트판 PC 톡톡 목록 지원과 각 content script match를 포함한 12개 사이트 기준 제출 후보 package입니다.

기존 `dist/board-mute-0.4.0.zip`은 사람인까지 포함한 마지막 제출 후보였으므로 잡코리아, 인벤, 네이트판 포함 제출 후보로 사용하지 않습니다.

`0.5.0` public repository export/precheck, 커밋, push, Chrome Web Store 제출은 아직 진행하지 않았습니다.

## 기본 원칙

- Chrome Web Store에 업로드하는 ZIP의 내용이 바뀌면 `manifest.json`의 `version`을 올립니다.
- README, PRIVACY, CHANGELOG, SUPPORT, issue template처럼 release ZIP에 들어가지 않는 공개 문서만 바뀌면 extension version은 올리지 않습니다.
- `CHANGELOG.md`에는 사용자가 체감하는 변경과 지원 범위 변경을 기록합니다.
- release ZIP은 항상 `scripts/build-release-package.ps1`로 다시 생성하고 entry를 확인합니다.

## 버전 증가 기준

Patch version:

- 지원 중인 사이트의 DOM 변경 대응
- 기존 기능의 버그 수정
- popup 또는 페이지 UI의 작은 안정성 개선
- 검증 스크립트 보강
- 현재 권한과 지원 사이트 범위를 넓히지 않는 변경

Minor version:

- 공식 지원 사이트 추가
- 기존 사이트의 지원 범위 확대
- 새 사용자 기능 추가
- popup 관리 기능의 의미 있는 확장
- content script match pattern 추가

Major version:

- 저장 구조가 호환되지 않게 바뀌는 변경
- 기존 규칙 동작의 의미가 크게 바뀌는 변경
- 권한이 넓어지는 변경
- 외부 서버, sync, account, telemetry처럼 privacy policy와 store disclosure를 다시 검토해야 하는 변경

첫 공개 전에는 `0.0.x` 범위에서 작게 올리고, 실제 사용자가 충분히 검증한 뒤 안정 버전을 `1.0.0`으로 정합니다.

## 릴리스 전 확인

릴리스 직전에는 아래를 확인합니다.

1. `manifest.json`의 `version`이 새 업로드 버전인지 확인합니다.
2. `CHANGELOG.md`에 같은 버전 항목이 있는지 확인합니다.
3. `README.md`, `PRIVACY.md`, `SUPPORT.md`의 지원 범위와 privacy 설명이 실제 코드와 맞는지 확인합니다.
4. 사이트별 check suite를 순차 실행합니다.
5. `scripts/build-release-package.ps1`로 ZIP을 다시 생성합니다.
6. ZIP entry에 runtime 파일만 들어갔는지 확인합니다.
7. public repository URL이 확정된 경우 Web Store URL 값이 실제 repo와 맞는지 확인합니다.

## 권한 변경 규칙

권한 변경은 별도 릴리스 단위로 분리합니다.

권한이 바뀌면 함께 확인합니다.

- `manifest.json`
- `README.md`
- `PRIVACY.md`
- `CHANGELOG.md`
- Chrome Web Store listing description
- Chrome Web Store privacy practices

`<all_urls>`, `tabs`, `activeTab`, `scripting`, remote network 기능은 첫 공개 범위에 넣지 않습니다.
