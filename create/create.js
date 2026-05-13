// =========================
//  설정
// =========================
const MAX_CHARS = 25;           // 메시지 칸당 최대 글자 수
const DEFAULT_COUNT = 4;        // 기본 메시지 칸 개수
const PLACEHOLDERS = [
  "예) 늘 곁에서 응원해줘서",
  "예) 정말 큰 힘이 됐어요",
  "예) 말로는 못 했지만",
  "예) 진심으로 고마워요",
  "예) 앞으로도 잘 부탁해요",
  "예) 우리 오래오래 함께해요"
];

// =========================
//  상태
// =========================
const messageList = document.getElementById("messageList");
const addBtn = document.getElementById("addBtn");
const promptBox = document.getElementById("promptBox");
const copyBtn = document.getElementById("copyBtn");
const copyBtnText = document.getElementById("copyBtnText");
const toast = document.getElementById("toast");

// =========================
//  메시지 칸 생성
// =========================
function createMessageItem(index) {
  const wrap = document.createElement("div");
  wrap.className = "message-item";
  wrap.dataset.index = index;

  const placeholder = PLACEHOLDERS[index % PLACEHOLDERS.length];

  wrap.innerHTML = `
    <div class="message-item__head">
      <span class="message-item__label">장면 ${index + 1}</span>
      <span class="message-item__counter"><span class="cur">0</span> / ${MAX_CHARS}</span>
    </div>
    <textarea
      rows="2"
      maxlength="${MAX_CHARS}"
      placeholder="${placeholder}"
      aria-label="장면 ${index + 1} 메시지"
    ></textarea>
    <button type="button" class="message-item__remove" aria-label="이 칸 삭제">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

  const textarea = wrap.querySelector("textarea");
  const counter = wrap.querySelector(".message-item__counter");
  const counterCur = counter.querySelector(".cur");
  const removeBtn = wrap.querySelector(".message-item__remove");

  textarea.addEventListener("input", () => {
    const len = textarea.value.length;
    counterCur.textContent = len;
    if (len >= MAX_CHARS - 3) counter.classList.add("is-warn");
    else counter.classList.remove("is-warn");
    updatePrompt();
  });

  removeBtn.addEventListener("click", () => {
    wrap.remove();
    relabel();
    updatePrompt();
    updateRemoveVisibility();
  });

  return wrap;
}

// 장면 번호 다시 매기기
function relabel() {
  const items = messageList.querySelectorAll(".message-item");
  items.forEach((item, i) => {
    item.dataset.index = i;
    const label = item.querySelector(".message-item__label");
    if (label) label.textContent = `장면 ${i + 1}`;
    const ta = item.querySelector("textarea");
    if (ta) ta.setAttribute("aria-label", `장면 ${i + 1} 메시지`);
  });
}

// 삭제 버튼 표시 여부 (2개 이상일 때만 보임)
function updateRemoveVisibility() {
  const count = messageList.querySelectorAll(".message-item").length;
  if (count > 1) messageList.classList.add("is-removable");
  else messageList.classList.remove("is-removable");
}

// =========================
//  프롬프트 생성 (핵심)
// =========================
function buildPrompt() {
  const items = messageList.querySelectorAll(".message-item textarea");
  const messages = Array.from(items)
    .map(t => t.value.trim())
    .filter(t => t.length > 0);

  const sceneCount = messages.length || items.length; // 비어있어도 칸 수 기준
  const totalDuration = sceneCount * 3; // 장면당 3초 가정

  // 자막 리스트 (비어있으면 안내문)
  let scenesBlock;
  if (messages.length === 0) {
    scenesBlock = "  (위의 메시지 칸에 자막을 입력하면 이곳에 자동으로 들어갑니다)";
  } else {
    scenesBlock = messages
      .map((m, i) => `  Scene ${i + 1} (자막): "${m}"`)
      .join("\n");
  }

  // 프롬프트 본문
  const prompt =
`[ 영상 생성 프롬프트 — 고마운 사람에게 보내는 AI 영상편지 ]

■ 목적
사내 동료/가족/친구에게 전하는 따뜻한 감사 인사를 짧은 영상편지로 만든다.
한 장면(Scene)당 하나의 자막이 화면에 차분히 표시되며, 자막과 어울리는 분위기의 배경 이미지가 함께 나타난다.

■ 전체 분위기 (Mood & Tone)
- 톤: 따뜻하고 잔잔한, 살짝 노스탤직(nostalgic)한 감성
- 색감: 부드러운 파스텔, 따뜻한 베이지/크림/연한 노을빛, 채도는 살짝 낮게
- 조명: 햇살이 스며드는 듯한 부드러운 자연광, 골든아워(golden hour) 느낌 권장
- 감정 키워드: 고마움, 진심, 위로, 응원, 잔잔한 미소

■ 비주얼 스타일 (매우 중요)
- 실사 사진처럼 너무 사실적/구체적으로 묘사하지 말 것.
- 따뜻한 손그림 일러스트 화풍 (Soft hand-drawn illustration / gentle watercolor illustration / cozy storybook style).
- 인물이 등장하더라도 얼굴은 구체적으로 묘사하지 않고 실루엣, 뒷모습, 또는 부드럽게 흐릿한 인상으로 표현.
  → 영상 시청자(메시지를 받는 사람)가 이질감을 느끼지 않도록, 누구나 자기 이야기처럼 받아들일 수 있는 보편적이고 은유적인 장면을 그릴 것.
- 배경 위주, 분위기 위주. 정물·풍경·일상의 작은 순간(따뜻한 차 한 잔, 창가의 햇살, 함께 걷는 뒷모습, 책상 위 메모, 꽃, 노을 등)을 활용.
- 절대 피할 것: 지나치게 사실적인 얼굴, 특정 실존 인물, 로고, 워터마크, 텍스트(자막은 별도 처리), 과도한 디테일·과장된 표정, 어두침침하거나 음울한 색감.

■ 자막 처리
- 각 장면 하단 중앙에 자막을 1줄 또는 2줄로 깔끔하게 표시한다.
- 폰트: 가독성 좋은 산세리프 (또는 부드러운 손글씨 느낌도 가능). 글자 색은 흰색 또는 크림색, 살짝의 그림자/반투명 배경으로 가독성 확보.
- 자막은 페이드인(0.4초) → 머무름 → 페이드아웃(0.4초) 흐름으로 부드럽게 등장하고 사라진다.
- 자막 내용은 절대 변경하지 말고, 아래 명시된 문장을 그대로 사용한다.

■ 장면 구성 (Scenes)
총 ${sceneCount}개 장면, 각 장면당 약 3초.
${scenesBlock}

■ 장면 전환 (Transition) — 가장 중요
- 장면과 장면 사이는 반드시 "부드러운 슬라이드(slide) 전환" 또는 "크로스 디졸브(cross dissolve)"를 사용한다.
- 컷 전환(hard cut), 점프컷, 글리치, 빠른 줌, 강한 카메라 이동은 사용하지 않는다.
- 전환 시간은 0.6~1.0초로 충분히 길게, 앞 장면과 뒷 장면의 색감·구도가 자연스럽게 이어지도록 한다.
- 전체적으로 장면들이 하나의 일기/편지처럼 연결되도록, 색감과 분위기를 일관성 있게 유지한다.

■ 사운드 (선택)
- 잔잔한 피아노, 어쿠스틱 기타, 또는 따뜻한 앰비언트. 가사 없는 BGM 권장.
- 볼륨은 작게, 자막을 방해하지 않게.

■ 영상 사양
- 비율: 9:16(세로) 또는 16:9(가로). 모바일 시청을 고려하면 9:16 권장.
- 길이: 약 ${totalDuration}초 (장면당 3초 × ${sceneCount}장면)
- 해상도: 1080p 이상

■ 한 줄 요약 (AI에게)
"따뜻한 손그림 일러스트 화풍의 짧은 영상편지를 만들어줘. 위의 ${sceneCount}개 자막을 순서대로 각 장면 하단에 표시하고, 자막 내용과 어울리는 잔잔한 배경 이미지를 보여줘. 인물은 실루엣이나 뒷모습 정도로 은유적으로만 표현하고, 장면 사이는 부드러운 슬라이드/크로스디졸브 전환으로 자연스럽게 이어줘. 전체적으로 따뜻한 파스텔 톤과 골든아워 느낌으로."`;

  return prompt;
}

function updatePrompt() {
  promptBox.textContent = buildPrompt();
}

// =========================
//  복사 기능
// =========================
async function copyPrompt() {
  const text = buildPrompt();
  try {
    await navigator.clipboard.writeText(text);
    onCopySuccess();
  } catch (err) {
    // 폴백: textarea 방식
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      onCopySuccess();
    } catch (e) {
      alert("복사에 실패했어요. 직접 선택해서 복사해주세요.");
    }
    document.body.removeChild(ta);
  }
}

function onCopySuccess() {
  copyBtn.classList.add("is-copied");
  copyBtnText.textContent = "복사 완료!";
  showToast();
  setTimeout(() => {
    copyBtn.classList.remove("is-copied");
    copyBtnText.textContent = "프롬프트 복사하기";
  }, 2000);
}

function showToast() {
  toast.classList.add("is-show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.classList.remove("is-show");
  }, 2200);
}

// =========================
//  초기화
// =========================
function init() {
  for (let i = 0; i < DEFAULT_COUNT; i++) {
    messageList.appendChild(createMessageItem(i));
  }
  updateRemoveVisibility();
  updatePrompt();

  addBtn.addEventListener("click", () => {
    const idx = messageList.querySelectorAll(".message-item").length;
    const item = createMessageItem(idx);
    messageList.appendChild(item);
    updateRemoveVisibility();
    updatePrompt();
    // 새로 추가한 칸으로 포커스
    const ta = item.querySelector("textarea");
    if (ta) ta.focus();
  });

  copyBtn.addEventListener("click", copyPrompt);
}

document.addEventListener("DOMContentLoaded", init);
