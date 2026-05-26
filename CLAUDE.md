# 신화테크놀러지 홈페이지 — 개발 규칙

## 코드 길이 제한
- **함수**: 50줄 이하. 초과 시 단일 책임 원칙에 따라 분리.
- **파일**: 200줄 이하. 초과 시 역할별로 별도 파일로 분리.

## 보안
- API 키, 비밀번호, 토큰 등 민감한 값은 코드에 하드코딩 금지.
- 환경변수(`.env`) 또는 Netlify 환경변수 설정에서 주입.
- `.env` 파일은 절대 커밋하지 않음 (`.gitignore`에 포함).

## 파일 구조
```
app.js          — 진입점(entry point)만. 각 모듈 import 후 init 호출.
js/
  animations.js — IntersectionObserver, 카운터, 네브바 스크롤 효과
  tabs.js       — 페이지 탭 전환, 제품 카테고리 탭
  nav.js        — 해시 라우팅, 모바일 메뉴
  slider.js     — 히어로 슬라이더
  lightbox.js   — 인증서 이미지 라이트박스
  form.js       — 문의 폼 AJAX 제출 (Netlify Forms)
style.css       — 모든 스타일. 인라인 스타일 사용 금지.
index.html      — 마크업만. 스크립트 로직 포함 금지.
```

## JS 규칙
- ES Modules(`import`/`export`) 사용. 전역 함수(`window.xxx`) 금지.
- `type="module"` 스크립트는 DOM이 준비된 후 실행되므로 `DOMContentLoaded` 래퍼 불필요.
- 이벤트 핸들러는 HTML `onclick`/`onsubmit` 속성 금지 → JS에서 `addEventListener`로 연결.

## CSS 규칙
- 인라인 스타일(`style="..."`) 금지. CSS 클래스로 대체.
- 디자인 토큰은 `:root` CSS 변수로 관리 (`--clr-*`, `--radius-*` 등).
- 중복 미디어 쿼리는 하나의 블록으로 병합.

## 네이밍
- JS 함수: camelCase (`initSlider`, `switchTabInContext`)
- CSS 클래스: kebab-case (`rf-block`, `contact-label`)
- 파일명: kebab-case (`animations.js`, `style.css`)

## Netlify
- 폼 제출: `data-netlify="true"` + AJAX POST. 페이지 이동 없이 처리.
- 리다이렉트: `netlify.toml`의 `[[redirects]]` 블록으로 관리.
- 환경변수: Netlify 대시보드 → Site settings → Environment variables.
