/* ============================================================
   PlayDay vol.3 — JS
   1) ZOOM 컨트롤 : 입력한 % 값으로 게시물 비율 조정
      - --post-scale CSS 변수 변경
      - 스케일 후에도 레이아웃이 깨지지 않게 wrapper 높이 보정
   2) 영상 placeholder 처리 : <source>에 src가 비어있으면 안내문 표시,
      유효한 src가 들어오면 안내문 자동 숨김
   ============================================================ */

(function () {
  /* -------------------- ZOOM CONTROL -------------------- */
  const zoomInput = document.getElementById('zoomInput');
  const zoomReset = document.getElementById('zoomReset');
  const post = document.getElementById('post');
  const wrapper = document.querySelector('.post-wrapper');

  // 기준 폭(900px)을 CSS에서 가져온다 (--post-base-width)
  function getBaseWidth() {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue('--post-base-width').trim();
    return parseFloat(v) || 900;
  }

  function applyZoom(percent) {
    const scale = Math.max(0.1, Math.min(3, percent / 100));
    document.documentElement.style.setProperty('--post-scale', scale);

    // transform: scale은 시각적 크기만 줄이고 실제 점유 공간은 그대로라서
    // wrapper에 강제로 높이/폭을 맞춰서 빈 공간을 제거한다.
    // (스케일 적용 후 실제 보이는 크기에 맞게 wrapper 사이즈 보정)
    requestAnimationFrame(() => {
      const baseWidth = getBaseWidth();
      const realHeight = post.getBoundingClientRect().height; // 이미 scale 반영된 값
      wrapper.style.height = realHeight + 'px';
      wrapper.style.minHeight = realHeight + 'px';
      // 폭도 보정 (가운데 정렬 유지)
      wrapper.style.maxWidth = (baseWidth * scale) + 'px';
      wrapper.style.margin = '0 auto';
    });
  }

  if (zoomInput) {
    // 초기 적용
    applyZoom(parseFloat(zoomInput.value) || 100);

    zoomInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val > 0) applyZoom(val);
    });

    zoomInput.addEventListener('change', (e) => {
      let val = parseFloat(e.target.value);
      if (isNaN(val) || val <= 0) val = 100;
      e.target.value = val;
      applyZoom(val);
    });
  }

  if (zoomReset) {
    zoomReset.addEventListener('click', () => {
      zoomInput.value = 100;
      applyZoom(100);
    });
  }

  // 윈도우 리사이즈 시에도 wrapper 높이 다시 맞추기
  window.addEventListener('resize', () => {
    applyZoom(parseFloat(zoomInput.value) || 100);
  });

  /* -------------------- VIDEO PLACEHOLDER -------------------- */
  // <source src="..."> 가 비어있으면 안내문이 보이고,
  // 영상 링크가 들어오면 placeholder를 자동으로 숨긴다.
  const video = document.getElementById('sampleVideo');
  const placeholder = document.getElementById('videoPlaceholder');

  function hasValidSource() {
    if (!video) return false;
    const sources = video.querySelectorAll('source');
    for (const s of sources) {
      const src = s.getAttribute('src');
      if (src && src.trim() !== '') return true;
    }
    // <video src="..."> 형태로 직접 지정된 경우도 체크
    const directSrc = video.getAttribute('src');
    if (directSrc && directSrc.trim() !== '') return true;
    return false;
  }

  function updateVideoUI() {
    if (!video || !placeholder) return;
    if (hasValidSource()) {
      placeholder.style.display = 'none';
      video.style.display = 'block';
      // 안전하게 다시 로드
      try { video.load(); } catch (_) {}
    } else {
      placeholder.style.display = 'flex';
      video.style.display = 'none';
    }
  }

  updateVideoUI();

  // 추후 동적으로 src를 바꿔도 자동 반영될 수 있도록 MutationObserver 사용
  if (video) {
    const mo = new MutationObserver(updateVideoUI);
    mo.observe(video, { attributes: true, childList: true, subtree: true });
  }
})();
