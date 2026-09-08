
window.showScreen = window.showScreen || function(name) {
  const ids = {menu:"homeScreen", news:"newsApp", dispatch:"dispatchApp", dcinside:"dcApp", story:"storyApp", kakao:"kakaoApp", notification:"notificationApp", everytime:"everytimeApp", gpt:"gptApp", google:"googleApp", googleResults:"googleResultsApp", instagram:"instagramApp", instagramDm:"instagramDmApp", twitter:"twitterApp", naver:"naverApp", naverBlog:"naverBlogApp", naverSearch:"naverSearchApp", youtube:"youtubeApp", netflix:"netflixApp", tinder:"tinderApp", discord:"discordApp"};
  Object.keys(ids).forEach(k => {
    const el = document.getElementById(ids[k]);
    if (el) el.classList.toggle("hidden", k !== name);
  });
  try { sessionStorage.setItem("virtual_source_screen", name); } catch(e) {}
};


function toggleHomeCategory(btn){
  const category=btn.closest('.home-category');
  if(!category) return;
  const open=!category.classList.contains('open');
  document.querySelectorAll('.home-category.open').forEach(el=>{el.classList.remove('open'); const b=el.querySelector('.home-category-main'); if(b){b.setAttribute('aria-expanded','false'); const a=b.querySelector('.home-category-arrow'); if(a)a.textContent='＋';}});
  if(open){category.classList.add('open');btn.setAttribute('aria-expanded','true');const a=btn.querySelector('.home-category-arrow');if(a)a.textContent='－';}
}


const REACTION_SPRITE = "이미지/img-ba868ac486f5.webp";
const PLACEHOLDER_IMG = "data:image/svg+xml;utf8," +
  encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='100%' height='100%' fill='%23e2e2e2'/></svg>");
const PLACEHOLDER_AVATAR = "data:image/svg+xml;utf8," +
  encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%' height='100%' fill='%23ddd'/></svg>");

const CATEGORIES = ["정치","경제","사회","엔터","생활/문화","IT/과학","세계"];
const STORAGE_KEY = "virtual_news_draft_v1";

const DEFAULT_STATE = {
  category: "사회",
  outlet: "가상일보",
  outletAvatar: PLACEHOLDER_AVATAR,
  outletLogo: null,
  title: "제목을 입력하세요",
  date: (() => { const d = new Date(); return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}.`; })(),
  time: "오후 12:22",
  likeCount: "8",
  commentCount: "40",
  img: null,
  body: "여기에 기사 본문을 입력하세요.\n\n굵게 하고 싶은 부분은 드래그한 뒤 위 'B 굵게' 버튼을 누르세요.",
  view: "mobile",
  reactions: { like: "16", cheer: "19", congrats: "406", expect: "5", surprise: "215", sad: "11" },
  commentTotal: "103",
  commentActive: "98",
  commentDeleted: "5",
  commentViolation: "0",
  comments: [
    {
      avatar: null,
      nick: "user****",
      date: "2026.09.07. 11:23",
      body: "댓글 내용을 입력하세요.",
      image: null,
      likes: "0"
    },
    {
      avatar: null,
      nick: "user****",
      date: "2026.09.07. 11:20",
      body: "댓글 내용을 입력하세요.",
      image: null,
      likes: "0"
    }
  ],
  extraOpen: true
};

let state = loadState();

function cloneDefault() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function loadState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return Object.assign(cloneDefault(), JSON.parse(raw));
  } catch (e) {}
  return cloneDefault();
}

function saveState() {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

function escHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function renderBody(raw) {
  const paragraphs = raw.split(/\n{2,}/).filter(p => p.trim().length > 0);
  return paragraphs.map(p => {
    let escaped = escHtml(p).replace(/\n/g, "<br/>");
    escaped = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return "<p>" + escaped + "</p>";
  }).join("\n");
}

function formatDate(dateStr, timeStr) {
  return [dateStr, timeStr].filter(Boolean).join(" ");
}

const REACTION_META = [
  { key: "like", emoji: "😍", label: "좋아요" },
  { key: "cheer", emoji: "😆", label: "응원해요" },
  { key: "congrats", emoji: "🥳", label: "축하해요" },
  { key: "expect", emoji: "😮", label: "기대해요" },
  { key: "surprise", emoji: "😱", label: "놀랐어요" },
  { key: "sad", emoji: "😢", label: "슬퍼요" }
];

function renderReactions() {
  const positions = ["0%", "20%", "40%", "60%", "80%", "100%"];
  const html = `<div class="reaction-grid">` +
    REACTION_META.map((r, i) => `
      <div class="reaction-item">
        <div class="reaction-image"
             style="--reaction-sprite: url('${REACTION_SPRITE}'); background-position-x: ${positions[i]};"
             aria-label="${r.label}"></div>
        <div class="reaction-count">${escHtml(state.reactions[r.key] ?? "0")}</div>
      </div>
    `).join("") +
    `</div>`;
  document.querySelectorAll("[data-reaction-section]").forEach(el => el.innerHTML = html);
}

function renderComments() {
  const comments = state.comments || [];
  const commentHtml = comments.map(c => `
    <div class="comment-item">
      <div class="comment-top">
        <img class="comment-avatar" src="${c.avatar || PLACEHOLDER_AVATAR}" />
        <div>
          <div class="comment-nick">${escHtml(c.nick || "user****")}</div>
          <div class="comment-date">${escHtml(c.date || "")}</div>
        </div>
      </div>
      <div class="comment-body">${escHtml(c.body || "").replace(/\n/g, "<br/>")}</div>
      <span class="comment-reply-btn">답글</span>
    </div>
  `).join("");

  const html = `
    <div class="comment-header">
      <div class="comment-total">${escHtml(state.commentTotal)}개의 댓글</div>
    </div>
    <div class="comment-stats">
      현재 댓글 <b>${escHtml(state.commentActive)}</b> &nbsp;|&nbsp;
      작성자 삭제 <b>${escHtml(state.commentDeleted)}</b> &nbsp;|&nbsp;
      규정 미준수 <b>${escHtml(state.commentViolation)}</b>
    </div>
    <div class="comment-sort">최신순</div>
    ${commentHtml}
  `;
  document.querySelectorAll("[data-comment-section]").forEach(el => el.innerHTML = html);
}

function renderExtraToggle() {
  document.querySelectorAll("[data-extra-panel]").forEach(el => {
    el.classList.toggle("open", !!state.extraOpen);
  });
  document.querySelectorAll("[data-extra-toggle]").forEach(el => {
    el.textContent = state.extraOpen ? "감정표현 · 댓글 접기 ▴" : "감정표현 · 댓글 보기 ▾";
  });
}

function renderTabsInto(el) {
  el.innerHTML = CATEGORIES.map(c =>
    `<div class="tab${c === state.category ? " active" : ""}">${c}</div>`
  ).join("");
}

function renderAll() {
  document.querySelectorAll("[data-tabs]").forEach(renderTabsInto);
  document.querySelectorAll("[data-title]").forEach(el => el.textContent = state.title);
  document.querySelectorAll("[data-date]").forEach(el => el.textContent = "입력 " + formatDate(state.date, state.time));
  document.querySelectorAll("[data-like]").forEach(el => el.textContent = state.likeCount);
  document.querySelectorAll("[data-comment]").forEach(el => el.textContent = state.commentCount);
  document.querySelectorAll("[data-outlet-logo]").forEach(el => {
    if (state.outletLogo) {
      el.src = state.outletLogo;
      el.classList.remove("hidden");
    } else {
      el.src = "";
      el.classList.add("hidden");
    }
  });
  document.querySelectorAll("[data-img]").forEach(el => {
    if (state.img) {
      el.src = state.img;
      el.classList.remove("hidden");
    } else {
      el.src = "";
      el.classList.add("hidden");
    }
  });
  document.querySelectorAll("[data-body]").forEach(el => el.innerHTML = renderBody(state.body));

  renderReactions();
  renderComments();
  renderExtraToggle();

  saveState();
}

function bindInput(id, key, evt) {
  document.getElementById(id).addEventListener(evt || "input", (e) => {
    state[key] = e.target.value;
    renderAll();
  });
}

function fillFormFromState() {
  document.getElementById("outletLogoPreview").src = state.outletLogo || "";
  document.getElementById("title").value = state.title;
  document.getElementById("date").value = state.date;
  document.getElementById("time").value = state.time;
  document.getElementById("likeCount").value = state.likeCount;
  document.getElementById("commentCount").value = state.commentCount;
  document.getElementById("body").value = state.body;
  ["like","cheer","congrats","expect","surprise","sad"].forEach(key => {
    document.getElementById("react_" + key).value = state.reactions[key];
  });
  document.getElementById("commentTotal").value = state.commentTotal;
  document.getElementById("commentActive").value = state.commentActive;
  document.getElementById("commentDeleted").value = state.commentDeleted;
  document.getElementById("commentViolation").value = state.commentViolation;
  renderCommentsEditor();

  setView(state.view || "mobile");
}

bindInput("title", "title");
bindInput("date", "date");
bindInput("time", "time");
bindInput("likeCount", "likeCount");
bindInput("commentCount", "commentCount");
bindInput("body", "body");

// 감정표현 바인딩
["like","cheer","congrats","expect","surprise","sad"].forEach(key => {
  document.getElementById("react_" + key).addEventListener("input", (e) => {
    state.reactions[key] = e.target.value;
    renderAll();
  });
});

// 댓글 관련 바인딩
bindInput("commentTotal", "commentTotal");
bindInput("commentActive", "commentActive");
bindInput("commentDeleted", "commentDeleted");
bindInput("commentViolation", "commentViolation");

// 댓글 개별 카드 에디터 렌더링
function renderCommentsEditor() {
  const wrap = document.getElementById("commentsEditor");
  wrap.innerHTML = state.comments.map((c, i) => `
    <div class="comment-edit-card" data-comment-card="${i}">
      <div class="field">
        <label>작성자 프로필 사진</label>
        <div class="comment-edit-avatar-row">
          <img class="comment-edit-avatar-preview" src="${c.avatar || PLACEHOLDER_AVATAR}" />
          <input type="file" accept="image/*" data-comment-field="avatar" data-comment-index="${i}" />
        </div>
      </div>
      <div class="field">
        <label>작성자 이름</label>
        <input type="text" value="${c.nick.replace(/"/g,'&quot;')}" data-comment-field="nick" data-comment-index="${i}" />
      </div>
      <div class="field">
        <label>댓글 단 시간</label>
        <input type="text" value="${c.date.replace(/"/g,'&quot;')}" placeholder="예: 2026.09.07. 11:23" data-comment-field="date" data-comment-index="${i}" />
      </div>
      <div class="field">
        <label>내용</label>
        <textarea rows="3" data-comment-field="body" data-comment-index="${i}">${c.body}</textarea>
      </div>
      <button type="button" class="comment-edit-remove" data-comment-remove="${i}">이 댓글 삭제</button>
    </div>
  `).join("");
}

document.getElementById("addCommentBtn").addEventListener("click", () => {
  state.comments.push({ avatar: null, nick: "user****", date: "", body: "", image: null, likes: "0" });
  renderCommentsEditor();
  renderAll();
});

document.getElementById("commentsEditor").addEventListener("input", (e) => {
  const field = e.target.getAttribute("data-comment-field");
  const idx = e.target.getAttribute("data-comment-index");
  if (field && idx !== null && field !== "avatar" && field !== "image") {
    state.comments[idx][field] = e.target.value;
    renderAll();
  }
});

document.getElementById("commentsEditor").addEventListener("change", (e) => {
  const field = e.target.getAttribute("data-comment-field");
  const idx = e.target.getAttribute("data-comment-index");
  if ((field === "avatar" || field === "image") && idx !== null) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      state.comments[idx][field] = ev.target.result;
      renderCommentsEditor();
      renderAll();
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("commentsEditor").addEventListener("click", (e) => {
  const removeIdx = e.target.getAttribute("data-comment-remove");
  if (removeIdx !== null) {
    state.comments.splice(removeIdx, 1);
    renderCommentsEditor();
    renderAll();
  }
});

// 감정표현/댓글 토글 버튼 (미리보기 안에 있는 버튼들에 위임 처리)
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-extra-toggle]")) {
    state.extraOpen = !state.extraOpen;
    renderExtraToggle();
    saveState();
  }
});

function bindFileInput(inputId, key, previewId) {
  document.getElementById(inputId).addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      state[key] = ev.target.result;
      if (previewId) document.getElementById(previewId).src = ev.target.result;
      renderAll();
    };
    reader.readAsDataURL(file);
  });
}
bindFileInput("imgInput", "img");
document.getElementById("removeImgBtn").addEventListener("click", () => {
  state.img = null;
  document.getElementById("imgInput").value = "";
  renderAll();
});

bindFileInput("outletLogoInput", "outletLogo", "outletLogoPreview");
document.getElementById("removeOutletLogoBtn").addEventListener("click", () => {
  state.outletLogo = null;
  document.getElementById("outletLogoInput").value = "";
  document.getElementById("outletLogoPreview").src = "";
  renderAll();
});

// 굵게 버튼
document.getElementById("boldBtn").addEventListener("click", () => {
  const ta = document.getElementById("body");
  const start = ta.selectionStart, end = ta.selectionEnd;
  if (start === end) return;
  const before = ta.value.slice(0, start);
  const selected = ta.value.slice(start, end);
  const after = ta.value.slice(end);
  ta.value = before + "**" + selected + "**" + after;
  state.body = ta.value;
  renderAll();
  ta.focus();
});

// 모바일/PC 뷰 전환
function setView(view) {
  state.view = view;
  const mobileEl = document.getElementById("previewMobile");
  const pcEl = document.getElementById("previewPc");
  const mobileBtn = document.getElementById("viewMobileBtn");
  const pcBtn = document.getElementById("viewPcBtn");
  const canvasScroll = document.getElementById("canvasScroll");
  if (view === "pc") {
    mobileEl.classList.add("hidden");
    pcEl.classList.remove("hidden");
    pcBtn.classList.add("active");
    mobileBtn.classList.remove("active");
    canvasScroll.classList.add("pc-mode");
  } else {
    pcEl.classList.add("hidden");
    mobileEl.classList.remove("hidden");
    mobileBtn.classList.add("active");
    pcBtn.classList.remove("active");
    canvasScroll.classList.remove("pc-mode");
  }
  saveState();
}
document.getElementById("viewMobileBtn").addEventListener("click", () => setView("mobile"));
document.getElementById("viewPcBtn").addEventListener("click", () => setView("pc"));

// 기본값으로 복원
document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("모든 입력 내용을 기본값으로 되돌릴까요? 되돌리면 복구할 수 없습니다.")) return;
  state = cloneDefault();
  try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
  document.getElementById("imgInput").value = "";
  document.getElementById("outletLogoInput").value = "";
  fillFormFromState();
  renderAll();
});

// PNG로 저장 (현재 선택된 뷰 기준)
document.getElementById("savePngBtn").addEventListener("click", () => {
  const target = state.view === "pc" ? document.getElementById("previewPc") : document.getElementById("previewMobile");
  const btn = document.getElementById("savePngBtn");
  const originalText = btn.textContent;

  if (typeof html2canvas === "undefined") {
    alert("이미지 생성 기능을 불러오지 못했습니다. 인터넷 연결을 확인한 뒤 새로고침해서 다시 시도해주세요.");
    return;
  }

  btn.textContent = "이미지 생성 중...";
  btn.disabled = true;

  const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();

  ready.then(() => html2canvas(target, {
    backgroundColor: "#ffffff",
    scale: 3,
    useCORS: true,
    allowTaint: true,
    logging: false,
    imageTimeout: 15000
  })).then(canvas => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("blob 생성 실패");
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = (state.view === "pc" ? "article_pc" : "article_mobile") + ".png";
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      btn.textContent = originalText;
      btn.disabled = false;
    }, "image/png");
  }).catch((err) => {
    console.error("PNG 저장 실패:", err);
    alert("이미지 생성에 실패했습니다. 사진 파일 용량을 줄이거나 다른 사진으로 바꿔서 다시 시도해보세요.");
    btn.textContent = originalText;
    btn.disabled = false;
  });
});

fillFormFromState();
renderAll();

// ===== 화면 전환 (홈 / 일반뉴스 / 디스패치) =====
function showScreen(name) {
  document.getElementById("homeScreen").classList.toggle("hidden", name !== "menu");
  document.getElementById("newsApp").classList.toggle("hidden", name !== "news");
  document.getElementById("dispatchApp").classList.toggle("hidden", name !== "dispatch");
  document.getElementById("dcApp").classList.toggle("hidden", name !== "dcinside");
  document.getElementById("storyApp").classList.toggle("hidden", name !== "story");
  document.getElementById("instagramApp").classList.toggle("hidden", name !== "instagram");
  document.getElementById("kakaoApp").classList.toggle("hidden", name !== "kakao");
  document.getElementById("notificationApp").classList.toggle("hidden", name !== "notification");
  document.getElementById("everytimeApp").classList.toggle("hidden", name !== "everytime");
  document.getElementById("gptApp").classList.toggle("hidden", name !== "gpt");
  document.getElementById("googleApp").classList.toggle("hidden", name !== "google");
  document.getElementById("googleResultsApp").classList.toggle("hidden", name !== "googleResults");
  document.getElementById("twitterApp").classList.toggle("hidden", name !== "twitter");
  document.getElementById("windowsApp").classList.toggle("hidden", name !== "windows");
  document.getElementById("tinderApp").classList.toggle("hidden", name !== "tinder");
  document.getElementById("discordApp").classList.toggle("hidden", name !== "discord");
  document.getElementById("instagramDmApp").classList.toggle("hidden", name !== "instagramDm");
  document.getElementById("naverApp").classList.toggle("hidden", name !== "naver");
  document.getElementById("naverBlogApp").classList.toggle("hidden", name !== "naverBlog");
  document.getElementById("naverSearchApp").classList.toggle("hidden", name !== "naverSearch");
  document.getElementById("youtubeApp").classList.toggle("hidden", name !== "youtube");
  document.getElementById("netflixApp").classList.toggle("hidden", name !== "netflix");
  try { sessionStorage.setItem("virtual_source_screen", name); } catch (e) {}
}
document.querySelectorAll("[data-goto]").forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.getAttribute("data-goto")));
});
// Always open the generator on the source-selection home screen.
showScreen("menu");


