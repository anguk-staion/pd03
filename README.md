# PlayDay vol.3 — 영상편지 캠페인 페이지

## 📁 파일 구조

```
playday-v3/
├── index.html      ← 게시물 구조 (HTML)
├── style.css       ← 디자인/애니메이션 (CSS)
├── script.js       ← Zoom 컨트롤 + 영상 처리 (JS)
└── README.md       ← 이 파일
```

## 🚀 VS Code에서 작업하는 법

### 1. VS Code로 폴더 열기
- VS Code 실행 → `File` → `Open Folder...` → `playday-v3` 폴더 선택
- 또는 터미널에서: `code playday-v3`

### 2. 추천 확장 프로그램 (Extensions)
- **Live Server** (Ritwick Dey 제작) ← **필수 추천**
  - 설치 후 `index.html` 우클릭 → `Open with Live Server`
  - 코드 저장 시 브라우저가 자동 새로고침됩니다.
- **Prettier** — 코드 자동 정렬용 (선택)

### 3. 그냥 열어보고 싶을 때
- `index.html` 파일을 더블클릭해 브라우저로 열어도 동작합니다.

---

## 🔧 추후 수정해야 할 부분

### ① 버튼 하이퍼링크 연결 (index.html)
`index.html`에서 아래 두 곳의 `href="#"` 부분을 실제 링크로 바꿔주세요.

```html
<!-- 참여하러 가기 -->
<a href="여기에_링크_입력" class="btn btn--primary" data-cta="participate">

<!-- 동료 작품 보러 가기 -->
<a href="여기에_링크_입력" class="btn btn--secondary" data-cta="gallery">
```

### ② 샘플 영상 링크 추가 (index.html)
`<video>` 태그 안의 `<source>` 부분에 영상 경로를 넣어주세요.

```html
<video id="sampleVideo" class="video-frame__player" autoplay muted loop playsinline>
  <source src="sample.mp4" type="video/mp4" />
</video>
```

- 영상 파일을 같은 폴더에 넣고 파일명만 적으면 됩니다 (예: `sample.mp4`)
- 외부 영상 임베드(유튜브 등)를 쓰고 싶다면 `<video>` 태그 전체를 `<iframe>`으로 교체하세요.
- 링크가 채워지면 placeholder 안내문은 **자동으로 사라집니다**.

---

## 🔍 Zoom 기능 사용법

- 우측 상단에 `Zoom [100]%` 컨트롤이 떠 있습니다.
- 숫자를 변경하면 게시물 전체 비율이 그대로 조정됩니다 (예: `80` 입력 → 80% 크기).
- `Reset` 버튼을 누르면 100%로 복귀합니다.
- 게시물 기본 폭은 **900px**입니다 (`style.css`의 `--post-base-width` 변수로 관리).

### Zoom 컨트롤을 게시물 발행 전에 숨기고 싶다면?
`style.css` 파일에서 `.zoom-control` 블록을 찾아 `display: none;`을 추가하거나,
`index.html`에서 `<div class="zoom-control">...</div>` 블록을 삭제하면 됩니다.

---

## 🎨 색상/폰트를 바꾸고 싶다면

`style.css`의 최상단 `:root` 영역에 모든 색상/사이즈가 변수로 정리돼 있습니다.

```css
:root {
  --post-base-width: 900px;   /* 기본 폭 */
  --c-accent: #d65f3e;        /* 메인 코랄 색 */
  --c-ink: #1f2433;           /* 본문 글자색 */
  --c-paper: #fbf7f0;         /* 게시물 배경 */
  ...
}
```

여기 값만 바꾸면 디자인 전체가 한 번에 변경됩니다.
