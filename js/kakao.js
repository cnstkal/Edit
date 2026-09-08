// ===== 카카오톡 =====
const KK_STORAGE_KEY = "virtual_kakao_draft_v1";
const KK_PROFILE_KEY = "kk_saved_profiles_v1";
const KK_PROFILE_TTL = 24 * 60 * 60 * 1000;
let kkMsgSeq = 1;
let kkPersonSeq = 1;
const KK_DEFAULT = {
  view: "mobile",
  name: "윤둥이",
  unread: "",
  people: [{ id: 1, name: "윤둥이", avatar: null }],
  messages: [
    { id: 1, personId: 1, text: "이번일로 뭐라하는 놈 있으면 나한테 데려와", time: "오후 3:12", unread: "1", image: null, date: "" },
    { id: 2, personId: 1, text: "내가 처리할게", time: "오후 3:12", unread: "", image: null, date: "" },
    { id: 3, personId: 0, text: "배고팡", time: "오후 3:14", unread: "1", image: null, date: "" },
    { id: 4, personId: 1, text: "무뼈국물닭발에 치즈 주먹밥 계란찜 추가 맞지?", time: "오후 3:15", unread: "", image: null, date: "" },
    { id: 5, personId: 0, text: "빨리와", time: "오후 3:16", unread: "1", image: null, date: "" },
  ]
};
function kkCloneDefault() { return JSON.parse(JSON.stringify(KK_DEFAULT)); }
function kkLoad() {
  try {
    const raw = sessionStorage.getItem(KK_STORAGE_KEY);
    if (raw) {
      const parsed = Object.assign(kkCloneDefault(), JSON.parse(raw));
      if (!Array.isArray(parsed.messages) || !parsed.messages.length) parsed.messages = kkCloneDefault().messages;
      if (!Array.isArray(parsed.people) || !parsed.people.length) parsed.people = kkCloneDefault().people;
      parsed.messages.forEach(m => { if (m.unread == null) m.unread = ""; if (m.image == null) m.image = null; if (m.date == null) m.date = ""; });
      return parsed;
    }
  } catch (e) {}
  return kkCloneDefault();
}
let kkState = kkLoad();
kkMsgSeq = kkState.messages.reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;
kkPersonSeq = kkState.people.reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;
function kkSave() { try { sessionStorage.setItem(KK_STORAGE_KEY, JSON.stringify(kkState)); } catch (e) {} }
function kkEsc(s) { return (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

// ---- 저장된 프로필(임시 재사용) ----
function kkLoadSavedProfiles() {
  try {
    const raw = localStorage.getItem(KK_PROFILE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    const now = Date.now();
    const fresh = list.filter((p) => now - (p.savedAt || 0) < KK_PROFILE_TTL);
    if (fresh.length !== list.length) localStorage.setItem(KK_PROFILE_KEY, JSON.stringify(fresh));
    return fresh;
  } catch (e) { return []; }
}
function kkSaveProfile(name, avatar) {
  try {
    const list = kkLoadSavedProfiles().filter((p) => p.name !== name);
    list.push({ name, avatar, savedAt: Date.now() });
    localStorage.setItem(KK_PROFILE_KEY, JSON.stringify(list));
  } catch (e) {}
}
function kkRenderSavedProfileSelect() {
  const sel = document.getElementById("kkSavedProfileSelect");
  const profiles = kkLoadSavedProfiles();
  sel.innerHTML = '<option value="">+ 저장된 프로필에서 추가</option>' +
    profiles.map((p, i) => `<option value="${i}">${kkEsc(p.name)}</option>`).join("");
  sel.dataset.profiles = JSON.stringify(profiles);
}
document.getElementById("kkSavedProfileSelect").addEventListener("change", (e) => {
  const idx = e.target.value;
  if (idx === "") return;
  const profiles = JSON.parse(e.target.dataset.profiles || "[]");
  const p = profiles[idx];
  if (!p) return;
  kkState.people.push({ id: kkPersonSeq++, name: p.name, avatar: p.avatar });
  kkSave();
  kkRenderPanel();
  kkRenderPreview();
  e.target.value = "";
});

function kkWrapText(text) {
  return String(text || "").split("\n").map(line => {
    if (!line) return "";
    const parts = [];
    for (let i = 0; i < line.length; i += 22) parts.push(line.slice(i, i + 22));
    return parts.join("\n");
  }).join("\n");
}

function kkRenderPreview() {
  document.getElementById("kkOutNameM").textContent = kkState.name;
  document.getElementById("kkOutNamePc").textContent = kkState.name;

  const peopleById = {};
  kkState.people.forEach((p) => { peopleById[p.id] = p; });

  const bodyM = document.getElementById("kkOutBodyM");
  const bodyPc = document.getElementById("kkOutBodyPc");
  bodyM.innerHTML = ""; bodyPc.innerHTML = "";

  let prevKey = null;
  kkState.messages.forEach((m) => {
    if (m.isDate) {
      const dM = document.createElement("div");
      dM.className = "kk-date-divider";
      dM.textContent = m.date || "날짜";
      bodyM.appendChild(dM);

      const dP = document.createElement("div");
      dP.className = "kk-date-divider";
      dP.textContent = m.date || "날짜";
      bodyPc.appendChild(dP);
      prevKey = null;
      return;
    }

    const isMe = m.personId === 0 || m.personId == null;
    const person = isMe ? null : peopleById[m.personId];
    const key = `${m.personId}|${m.time || ""}`;
    const grouped = key === prevKey;
    prevKey = key;
    const avatarSrc = person ? (person.avatar || PLACEHOLDER_AVATAR) : "";
    const nameLabel = person ? kkEsc(person.name) : "";
    const unread = m.unread ? kkEsc(String(m.unread)) : "";
    const content = m.image
      ? `<div class="kk-bubble kk-image-bubble"><img class="kk-chat-image" src="${m.image}" /></div>`
      : `<div class="kk-bubble">${kkEsc(kkWrapText(m.text))}</div>`;
    const pcContent = m.image
      ? `<div class="kk-pc-bubble kk-image-bubble"><img class="kk-chat-image" src="${m.image}" /></div>`
      : `<div class="kk-pc-bubble">${kkEsc(kkWrapText(m.text))}</div>`;

    const rowM = document.createElement("div");
    rowM.className = "kk-row " + (isMe ? "me" : "") + (grouped ? " grouped" : "");
    rowM.innerHTML = `
      ${!isMe ? `<img class="kk-avatar" src="${avatarSrc}" />` : ""}
      <div class="kk-col">
        ${(!grouped && !isMe) ? `<div class="kk-nick">${nameLabel}</div>` : ""}
        <div class="kk-bubble-line">${isMe ? `<div class="kk-meta"><div class="kk-unread">${unread}</div><div class="kk-time">${kkEsc(m.time)}</div></div>${content}` : `${content}<div class="kk-meta"><div class="kk-unread">${unread}</div><div class="kk-time">${kkEsc(m.time)}</div></div>`}</div>
      </div>`;
    bodyM.appendChild(rowM);

    const rowP = document.createElement("div");
    rowP.className = "kk-pc-row " + (isMe ? "me" : "") + (grouped ? " grouped" : "");
    rowP.innerHTML = `
      ${!isMe ? `<img class="kk-avatar" src="${avatarSrc}" />` : ""}
      <div class="kk-pc-col">
        ${(!grouped && !isMe) ? `<div class="kk-pc-nick">${nameLabel}</div>` : ""}
        <div class="kk-pc-bubble-line">${isMe ? `<div class="kk-pc-meta"><div class="kk-unread">${unread}</div><div class="kk-pc-time">${kkEsc(m.time)}</div></div>${pcContent}` : `${pcContent}<div class="kk-pc-meta"><div class="kk-unread">${unread}</div><div class="kk-pc-time">${kkEsc(m.time)}</div></div>`}</div>
      </div>`;
    bodyPc.appendChild(rowP);
  });
  kkSave();
}

function kkPersonOptionsHtml(selectedId) {
  let html = `<option value="0"${selectedId === 0 ? " selected" : ""}>나</option>`;
  kkState.people.forEach((p) => {
    html += `<option value="${p.id}"${selectedId === p.id ? " selected" : ""}>${kkEsc(p.name)}</option>`;
  });
  return html;
}

function kkRenderPeopleList() {
  const wrap = document.getElementById("kkPeopleList");
  wrap.innerHTML = "";
  kkState.people.forEach((p) => {
    const card = document.createElement("div");
    card.className = "kk-person-card";
    card.innerHTML = `<img src="${p.avatar || PLACEHOLDER_AVATAR}" /><span>${kkEsc(p.name)}</span><button type="button" class="comment-edit-remove" style="width:auto; margin:0; padding:6px 10px;">삭제</button>`;
    card.querySelector("button").addEventListener("click", () => {
      if (kkState.people.length <= 1) { alert("참여자는 최소 1명 이상이어야 해요."); return; }
      kkState.people = kkState.people.filter((x) => x.id !== p.id);
      kkState.messages.forEach((m) => { if (m.personId === p.id) m.personId = kkState.people[0].id; });
      kkSave();
      kkRenderPanel();
      kkRenderPreview();
    });
    wrap.appendChild(card);
  });
}

function kkRenderPanel() {
  document.getElementById("kkName").value = kkState.name;
  document.getElementById("kkUnread").value = kkState.unread || "";
  kkRenderPeopleList();
  kkRenderSavedProfileSelect();

  const list = document.getElementById("kkMsgList");
  list.innerHTML = "";
  kkState.messages.forEach((m, idx) => {
    const card = document.createElement("div");

    if (m.isDate) {
      card.className = "kk-date-card";
      card.innerHTML = `
        <div class="field"><label>날짜 ${idx + 1}</label>
          <input type="text" data-kk-date value="${kkEsc(m.date || "")}" placeholder="예: 2026년 3월 25일 수요일" />
        </div>
        <button type="button" class="comment-edit-remove" data-kk-remove-date="1">이 날짜 삭제</button>
      `;
      card.querySelector("[data-kk-date]").addEventListener("input", (e) => {
        m.date = e.target.value;
        kkRenderPreview();
      });
      card.querySelector("[data-kk-remove-date]").addEventListener("click", () => {
        kkState.messages = kkState.messages.filter((x) => x.id !== m.id);
        kkRenderPanel();
        kkRenderPreview();
      });
      list.appendChild(card);
      return;
    }

    card.className = "kk-msg-card";
    card.innerHTML = `
      <div class="field"><label>메시지 ${idx + 1} · 보낸사람</label>
        <select data-kk-k="personId">${kkPersonOptionsHtml(m.personId)}</select>
      </div>
      <div class="field"><label>내용</label><textarea rows="2" data-kk-k="text">${kkEsc(m.text || "")}</textarea></div>
      <div class="field"><label>이미지 (선택)</label><input type="file" accept="image/*" data-kk-image="1" /></div>
      <div class="field"><label>시간</label><input type="text" data-kk-k="time" placeholder="예: 오후 3:12" /></div>
      <div class="field"><label>이 메시지 앞에 날짜 표시 (선택)</label><input type="text" data-kk-k="date" value="${kkEsc(m.date || "")}" placeholder="예: 2026년 3월 25일 수요일" /></div>
      <div class="field"><label>부재중 (비우면 표시 안 됨)</label><input type="number" min="1" max="999" data-kk-k="unread" placeholder="예: 1 또는 3" /></div>
      ${m.image ? '<button type="button" class="btn btn-ghost" data-kk-image-remove="1" style="width:100%;margin-bottom:8px;">이미지 삭제</button>' : ''}
      <button type="button" class="comment-edit-remove" data-kk-remove="1">이 메시지 삭제</button>
    `;
    card.querySelector('[data-kk-k="time"]').value = m.time;
    card.querySelector('[data-kk-k="unread"]').value = m.unread || "";
    card.querySelectorAll("[data-kk-k]").forEach((input) => {
      const key = input.dataset.kkK;
      const handler = (e) => {
        let v = e.target.value;
        if (key === "personId") v = parseInt(v, 10);
        m[key] = v;
        kkRenderPreview();
      };
      input.addEventListener("input", handler);
      input.addEventListener("change", handler);
    });
    const imageInput = card.querySelector("[data-kk-image]");
    imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { m.image = ev.target.result; m.text = ""; kkRenderPanel(); kkRenderPreview(); };
      reader.readAsDataURL(file);
    });
    const imageRemove = card.querySelector("[data-kk-image-remove]");
    if (imageRemove) imageRemove.addEventListener("click", () => {
      m.image = null; kkRenderPanel(); kkRenderPreview();
    });
    card.querySelector("[data-kk-remove]").addEventListener("click", () => {
      kkState.messages = kkState.messages.filter((x) => x.id !== m.id);
      kkRenderPanel();
      kkRenderPreview();
    });
    list.appendChild(card);
  });
}

document.getElementById("kkName").addEventListener("input", (e) => { kkState.name = e.target.value; kkRenderPreview(); });
document.getElementById("kkUnread").addEventListener("input", (e) => {
  kkState.unread = e.target.value;
  kkRenderPreview();
});

let kkPendingAvatar = null;
document.getElementById("kkNewPersonAvatarInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => { kkPendingAvatar = ev.target.result; };
  reader.readAsDataURL(file);
});
document.getElementById("kkAddPersonBtn").addEventListener("click", () => {
  const nameInput = document.getElementById("kkNewPersonName");
  const name = nameInput.value.trim();
  if (!name) { alert("참여자 이름을 입력해주세요."); return; }
  const avatar = kkPendingAvatar;
  kkState.people.push({ id: kkPersonSeq++, name, avatar });
  kkSaveProfile(name, avatar);
  kkSave();
  nameInput.value = "";
  kkPendingAvatar = null;
  document.getElementById("kkNewPersonAvatarInput").value = "";
  kkRenderPanel();
  kkRenderPreview();
});

document.getElementById("kkAddMsgBtn").addEventListener("click", () => {
  const defaultPersonId = kkState.people[0] ? kkState.people[0].id : 0;
  kkState.messages.push({ id: kkMsgSeq++, personId: defaultPersonId, text: "새 메시지", time: "", unread: "", image: null, date: "" });
  kkRenderPanel();
  kkRenderPreview();
});
document.getElementById("kkAddDateBtn").addEventListener("click", () => {
  kkState.messages.push({ id: kkMsgSeq++, isDate: true, date: "2026년 3월 25일 수요일" });
  kkRenderPanel();
  kkRenderPreview();
});

function kkSetView(view) {
  kkState.view = view;
  document.getElementById("kkViewMobileBtn").classList.toggle("active", view === "mobile");
  document.getElementById("kkViewPcBtn").classList.toggle("active", view === "pc");
  document.getElementById("previewKkMobile").classList.toggle("hidden", view !== "mobile");
  document.getElementById("previewKkPc").classList.toggle("hidden", view !== "pc");
  kkSave();
}
document.getElementById("kkViewMobileBtn").addEventListener("click", () => kkSetView("mobile"));
document.getElementById("kkViewPcBtn").addEventListener("click", () => kkSetView("pc"));

document.getElementById("kkResetBtn").addEventListener("click", () => {
  if (!confirm("카카오톡 입력 내용을 기본값으로 되돌릴까요?")) return;
  kkState = kkCloneDefault();
  kkMsgSeq = kkState.messages.reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;
  kkPersonSeq = kkState.people.reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;
  try { sessionStorage.removeItem(KK_STORAGE_KEY); } catch (e) {}
  kkSetView("mobile");
  kkRenderPanel();
  kkRenderPreview();
});

document.getElementById("kkSavePngBtn").addEventListener("click", () => {
  const target = kkState.view === "pc" ? document.getElementById("previewKkPc") : document.getElementById("previewKkMobile");
  const btn = document.getElementById("kkSavePngBtn");
  const originalText = btn.textContent;
  if (typeof html2canvas === "undefined") {
    alert("이미지 생성 기능을 불러오지 못했습니다. 인터넷 연결을 확인한 뒤 새로고침해서 다시 시도해주세요.");
    return;
  }
  btn.textContent = "이미지 생성 중...";
  btn.disabled = true;
  const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  ready.then(() => html2canvas(target, {
    backgroundColor: "#ffffff", scale: 3, useCORS: true, allowTaint: true, logging: false, imageTimeout: 15000
  })).then(canvas => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("blob 생성 실패");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = (kkState.view === "pc" ? "kakao_pc" : "kakao_mobile") + ".png";
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


