===== 인스타그램 스토리 =====
const ST_STORAGE_KEY = "virtual_story_draft_v2";
const ST_FONTS = { pretendard: "tl-pretendard", instagram: "tl-instagram", tinkerbell: "tl-tinkerbell", blackhan: "tl-blackhan", dohyeon: "tl-dohyeon", pen: "tl-pen", songmyung: "tl-songmyung", jua: "tl-jua", stylish: "tl-stylish" };
let stLayerSeq = 1;
const ST_DEFAULT = {
  layout: "card",
  avatar: null,
  username: "xnn****",
  time: "1분 전",
  img: null,
  imgRotate: 0,
  imgBorder: 0,
  imgBorderColor: "#ffffff",
  imgShadow: "none",
  handle: "@계정아이디",
  segments: 3,
  commentEnabled: false,
  commentText: "김치 가져가라",
  commentAvatar: null,
  textLayers: [
    { id: 1, text: "여기에 텍스트를 입력하세요.", font: "pretendard", size: 16, weight: "800", color: "#ffffff", opacity: 100, bgType: "none", bgColor: "#000000", bgOpacity: 100, align: "left", x: 50, y: 18, rotate: 0, letterSpacing: -0.5, lineHeight: 1.35, textStrokeWidth: 0, textStrokeColor: "#000000", shadow: "none" }
  ],
  photoLayers: [],
  stickerLayers: []
};
function stCloneDefault() { return JSON.parse(JSON.stringify(ST_DEFAULT)); }
function stLoad() {
  try {
    const raw = sessionStorage.getItem(ST_STORAGE_KEY);
    if (raw) {
      const parsed = Object.assign(stCloneDefault(), JSON.parse(raw));
      if (!Array.isArray(parsed.textLayers) || !parsed.textLayers.length) parsed.textLayers = stCloneDefault().textLayers;
      if (!Array.isArray(parsed.photoLayers)) parsed.photoLayers = [];
      if (!Array.isArray(parsed.stickerLayers)) parsed.stickerLayers = [];
      parsed.textLayers = parsed.textLayers.map((l) => Object.assign(
        { font: "pretendard", size: 16, weight: "800", color: "#ffffff", opacity: 100, bgType: "none", bgColor: "#000000", bgOpacity: 55, align: "left", x: 50, y: 50, rotate: 0, letterSpacing: -0.5, lineHeight: 1.35, textStrokeWidth: 0, textStrokeColor: "#000000", shadow: "none" },
        l,
        { bgType: l.bgType || (l.bg && l.bg !== "none" ? "solid" : "none") }
      ));
      return parsed;
    }
  } catch (e) {}
  return stCloneDefault();
}
let stState = stLoad();
stLayerSeq = stState.textLayers.reduce((m, l) => Math.max(m, l.id || 0), 0) + 1;
function stSave() { try { sessionStorage.setItem(ST_STORAGE_KEY, JSON.stringify(stState)); } catch (e) {} }

function stRenderSegments() {
  const wrap = document.getElementById("stOutProgress");
  const n = Math.max(1, Math.min(20, parseInt(stState.segments, 10) || 1));
  wrap.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const d = document.createElement("div");
    if (i === 0) d.className = "active";
    wrap.appendChild(d);
  }
}

function stHexToRgba(hex, opacityPct) {
  const h = (hex || "#000000").replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) || 0;
  const g = parseInt(h.substring(2, 4), 16) || 0;
  const b = parseInt(h.substring(4, 6), 16) || 0;
  const a = Math.max(0, Math.min(100, opacityPct == null ? 100 : opacityPct)) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function stMakeLayerDraggable(el, layer) {
  const container = document.getElementById("previewStory");
  let dragging = false;
  el.addEventListener("pointerdown", (e) => {
    dragging = true;
    el.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const rect = container.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    layer.x = Math.round(x * 10) / 10;
    layer.y = Math.round(y * 10) / 10;
    el.style.left = layer.x + "%";
    el.style.top = layer.y + "%";
  });
  const stop = () => { if (dragging) { dragging = false; stSave(); } };
  el.addEventListener("pointerup", stop);
  el.addEventListener("pointercancel", stop);
}

function stRenderLayersCanvas() {
  const wrap = document.getElementById("stOutLayers");
  wrap.innerHTML = "";
  stState.textLayers.forEach((layer) => {
    const el = document.createElement("div");
    el.className = "story-layer " + (ST_FONTS[layer.font] || "tl-pretendard");
    el.textContent = layer.text || "";
    el.style.left = layer.x + "%";
    el.style.top = layer.y + "%";
    el.style.fontSize = (layer.size || 16) + "px";
    el.style.fontWeight = layer.weight || "800";
    el.style.color = layer.color || "#ffffff";
    el.style.opacity = Math.max(0, Math.min(100, layer.opacity ?? 100)) / 100;
    el.style.textAlign = layer.align || "left";
    el.style.letterSpacing = `${layer.letterSpacing ?? -0.5}px`;
    el.style.lineHeight = layer.lineHeight || 1.35;
    el.style.webkitTextStroke = `${layer.textStrokeWidth || 0}px ${layer.textStrokeColor || "#000000"}`;
    el.style.textShadow = layer.shadow === "soft" ? "0 2px 6px rgba(0,0,0,.35)" : layer.shadow === "strong" ? "0 3px 10px rgba(0,0,0,.65)" : "none";
    el.style.background = layer.bgType === "none" ? "transparent" : stHexToRgba(layer.bgColor, layer.bgType === "translucent" ? Math.min(layer.bgOpacity ?? 55, 85) : 100);
    el.style.padding = layer.bgType && layer.bgType !== "none" ? "6px 10px" : "0";
    el.style.borderRadius = layer.bgType && layer.bgType !== "none" ? "6px" : "0";
    el.style.transform = `translate(-50%, -50%) rotate(${layer.rotate || 0}deg)`;
    stMakeLayerDraggable(el, layer);
    wrap.appendChild(el);
  });
}

let stPhotoSeq = (stState.photoLayers || []).reduce((m, l) => Math.max(m, l.id || 0), 0) + 1;
function stMakePhotoDraggable(el, layer) {
  const container = document.getElementById("previewStory");
  let dragging = false, resizing = false, startX = 0, startY = 0, startW = 0;
  const handle = el.querySelector(".photo-resize-handle");
  el.addEventListener("pointerdown", (e) => {
    if (e.target === handle) return;
    dragging = true;
    el.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const rect = container.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    layer.x = Math.round(x * 10) / 10;
    layer.y = Math.round(y * 10) / 10;
    el.style.left = layer.x + "%";
    el.style.top = layer.y + "%";
  });
  const stop = () => { if (dragging || resizing) { dragging = false; resizing = false; stSave(); } };
  el.addEventListener("pointerup", stop);
  el.addEventListener("pointercancel", stop);
  if (handle) {
    handle.addEventListener("pointerdown", (e) => {
      resizing = true; startX = e.clientX; startY = e.clientY; startW = layer.width || 150;
      handle.setPointerCapture(e.pointerId);
      e.preventDefault(); e.stopPropagation();
    });
    handle.addEventListener("pointermove", (e) => {
      if (!resizing) return;
      const delta = e.clientX - startX;
      layer.width = Math.max(40, Math.min(900, startW + delta));
      el.style.width = layer.width + "px";
    });
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  }
}
function stRenderPhotoLayersCanvas() {
  const wrap = document.getElementById("stOutPhotoLayers");
  wrap.innerHTML = "";
  (stState.photoLayers || []).forEach((layer) => {
    const el = document.createElement("div");
    el.className = "story-photo-layer";
    el.style.left = layer.x + "%";
    el.style.top = layer.y + "%";
    el.style.width = (layer.width || 150) + "px";
    el.style.transform = `translate(-50%, -50%) rotate(${layer.rotate || 0}deg)`;
    const shadow = layer.shadow === "soft" ? "0 3px 10px rgba(0,0,0,.3)" : layer.shadow === "strong" ? "0 5px 18px rgba(0,0,0,.55)" : "none";
    el.innerHTML = `<img src="${layer.src}" style="width:100%; display:block; border-radius:10px; border:${layer.borderWidth || 0}px solid ${layer.borderColor || "#ffffff"}; border-radius:0; box-shadow:${shadow};" /><div class="photo-resize-handle" style="position:absolute; right:-6px; bottom:-6px; width:16px; height:16px; background:#fff; border:2px solid #a23b2e; border-radius:50%; cursor:nwse-resize;"></div>`;
    stMakePhotoDraggable(el, layer);
    wrap.appendChild(el);
  });
}
function stRenderPhotoLayersPanel() {
  const list = document.getElementById("stPhotoLayersList");
  list.innerHTML = "";
  (stState.photoLayers || []).forEach((layer) => {
    const card = document.createElement("div");
    card.className = "layer-card";
    card.style.display = "flex"; card.style.alignItems = "center"; card.style.gap = "10px";
    card.innerHTML = `<img src="${layer.src}" style="width:44px; height:44px; object-fit:cover; border-radius:6px;" /><div style="flex:1"><div style="font-size:12.5px;color:#555;margin-bottom:6px">자유배치 사진</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><input type="number" min="-180" max="180" data-p="rotate" value="${layer.rotate || 0}" placeholder="회전°"><input type="number" min="0" max="20" data-p="borderWidth" value="${layer.borderWidth || 0}" placeholder="테두리"><select data-p="shadow"><option value="none">그림자 없음</option><option value="soft">약한 그림자</option><option value="strong">강한 그림자</option></select><input type="color" data-p="borderColor" value="${layer.borderColor || "#ffffff"}"></div></div><button type="button" class="layer-remove" style="width:auto; margin:0; padding:6px 10px;">삭제</button>`;
    card.querySelectorAll("[data-p]").forEach(input => input.addEventListener("input", e => { const k=e.target.dataset.p; layer[k]=k==="shadow"?e.target.value:(k==="borderColor"?e.target.value:parseInt(e.target.value,10)||0); stSave(); stRenderPhotoLayersCanvas(); }));
    card.querySelector("button").addEventListener("click", () => {
      stState.photoLayers = stState.photoLayers.filter((l) => l.id !== layer.id);
      stSave();
      stRenderPhotoLayersPanel();
      stRenderPhotoLayersCanvas();
    });
    list.appendChild(card);
  });
}
document.getElementById("stAddPhotoBtn").addEventListener("click", () => {
  document.getElementById("stAddPhotoInput").click();
});
document.getElementById("stAddPhotoInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    stState.photoLayers.push({ id: stPhotoSeq++, src: ev.target.result, x: 50, y: 50, width: 150, rotate: 0, borderWidth: 0, borderColor: "#ffffff", shadow: "none" });
    stSave();
    stRenderPhotoLayersPanel();
    stRenderPhotoLayersCanvas();
  };
  reader.readAsDataURL(file);
  e.target.value = "";
});

function stRenderLayersPanel() {
  const list = document.getElementById("stLayersList");
  list.innerHTML = "";
  stState.textLayers.forEach((layer, idx) => {
    const card = document.createElement("div");
    card.className = "layer-card";
    card.innerHTML = `
      <div class="field"><label>텍스트 ${idx + 1}</label><textarea rows="2" data-k="text">${layer.text.replace(/</g,"&lt;")}</textarea></div>
      <div class="row2">
        <div class="field"><label>폰트</label>
          <select data-k="font">
            <option value="pretendard">Pretendard</option>
            <option value="instagram">Instagram Sans풍</option>
            <option value="tinkerbell">손글씨(팅커벨풍)</option>
            <option value="blackhan">블랙한산스</option>
            <option value="dohyeon">도현체</option>
            <option value="pen">나눔손글씨(펜)</option>
            <option value="songmyung">송명체</option>
            <option value="jua">주아체</option>
            <option value="stylish">스타일리시</option>
          </select>
        </div>
        <div class="field"><label>정렬</label>
          <select data-k="align"><option value="left">왼쪽</option><option value="center">가운데</option><option value="right">오른쪽</option></select>
        </div>
      </div>
      <div class="row2">
        <div class="field"><label>크기(px)</label><input type="number" min="10" max="72" data-k="size" /></div>
        <div class="field"><label>굵기</label>
          <select data-k="weight"><option value="400">보통</option><option value="700">굵게</option><option value="800">아주 굵게</option></select>
        </div>
      </div>
      <div class="row2">
        <div class="field"><label>글자색</label><input type="color" data-k="color" /></div>
        <div class="field"><label>배경 종류</label>
          <select data-k="bgType"><option value="none">없음</option><option value="solid">단색</option><option value="translucent">반투명</option></select>
        </div>
      </div>
      <div class="row2 bg-color-row">
        <div class="field"><label>배경색</label><input type="color" data-k="bgColor" /></div>
        <div class="field"><label>배경 투명도 (${layer.bgOpacity ?? 55}%)</label><input type="range" min="10" max="100" data-k="bgOpacity" /></div>
      </div>
      <div class="row2">
        <div class="field"><label>텍스트 투명도 (${layer.opacity ?? 100}%)</label><input type="range" min="0" max="100" data-k="opacity" /></div>
        <div class="field"><label>그림자</label><select data-k="shadow"><option value="none">없음</option><option value="soft">약하게</option><option value="strong">강하게</option></select></div>
      </div>
      <div class="row2">
        <div class="field"><label>글자 테두리 (px)</label><input type="number" min="0" max="8" step="1" data-k="textStrokeWidth" /></div>
        <div class="field"><label>테두리색</label><input type="color" data-k="textStrokeColor" /></div>
      </div>
      <div class="row2">
        <div class="field"><label>자간 (px)</label><input type="range" min="-10" max="20" step="0.5" data-k="letterSpacing" /></div>
        <div class="field"><label>줄간격</label><input type="range" min="0.8" max="2.5" step="0.05" data-k="lineHeight" /></div>
      </div>
      <div class="field"><label>텍스트 회전 (${layer.rotate || 0}°)</label><input type="range" min="-180" max="180" data-k="rotate" /></div>
      <button type="button" class="layer-remove">이 텍스트 삭제</button>
    `;
    card.querySelector('[data-k="text"]').value = layer.text;
    card.querySelector('[data-k="font"]').value = layer.font;
    card.querySelector('[data-k="align"]').value = layer.align;
    card.querySelector('[data-k="size"]').value = layer.size;
    card.querySelector('[data-k="weight"]').value = layer.weight;
    card.querySelector('[data-k="color"]').value = layer.color;
    card.querySelector('[data-k="opacity"]').value = layer.opacity ?? 100;
    card.querySelector('[data-k="shadow"]').value = layer.shadow || "none";
    card.querySelector('[data-k="textStrokeWidth"]').value = layer.textStrokeWidth || 0;
    card.querySelector('[data-k="textStrokeColor"]').value = layer.textStrokeColor || "#000000";
    card.querySelector('[data-k="letterSpacing"]').value = layer.letterSpacing ?? -0.5;
    card.querySelector('[data-k="lineHeight"]').value = layer.lineHeight || 1.35;
    card.querySelector('[data-k="bgType"]').value = layer.bgType || "none";
    card.querySelector('[data-k="bgColor"]').value = layer.bgColor || "#000000";
    card.querySelector('[data-k="bgOpacity"]').value = layer.bgOpacity ?? 55;
    card.querySelector('[data-k="rotate"]').value = layer.rotate || 0;

    card.querySelectorAll("[data-k]").forEach((input) => {
      const key = input.dataset.k;
      const handler = (e) => {
        let v = e.target.value;
        if (key === "size") v = parseInt(v, 10) || 16;
        if (key === "bgOpacity") {
          v = parseInt(v, 10) || 0;
          const opLabel = card.querySelector('[data-k="bgOpacity"]').previousElementSibling;
          if (opLabel) opLabel.textContent = `배경 투명도 (${v}%)`;
        }
        if (key === "rotate") {
          v = parseInt(v, 10) || 0;
          const rotLabel = card.querySelectorAll(".field label")[9];
          if (rotLabel) rotLabel.textContent = `회전 (${v}°)`;
        }
        layer[key] = v;
        stSave();
        stRenderLayersCanvas();
      };
      input.addEventListener("input", handler);
      input.addEventListener("change", handler);
    });
    card.querySelector(".layer-remove").addEventListener("click", () => {
      stState.textLayers = stState.textLayers.filter((l) => l.id !== layer.id);
      stSave();
      stRenderLayersPanel();
      stRenderLayersCanvas();
    });
    list.appendChild(card);
  });
}

document.getElementById("stAddLayerBtn").addEventListener("click", () => {
  stState.textLayers.push({
    id: stLayerSeq++, text: "새 텍스트", font: "pretendard", size: 16, weight: "800",
    color: "#ffffff", opacity: 100, bgType: "none", bgColor: "#000000", bgOpacity: 55, align: "left", x: 50, y: 50, rotate: 0, letterSpacing: -0.5, lineHeight: 1.35, textStrokeWidth: 0, textStrokeColor: "#000000", shadow: "none"
  });
  stSave();
  stRenderLayersPanel();
  stRenderLayersCanvas();
});

let stStickerSeq = (stState.stickerLayers || []).reduce((m, l) => Math.max(m, l.id || 0), 0) + 1;
function stMakeStickerDraggable(el, layer) {
  const container = document.getElementById("previewStory"); let dragging=false;
  el.addEventListener("pointerdown", e => { dragging=true; el.setPointerCapture(e.pointerId); e.preventDefault(); });
  el.addEventListener("pointermove", e => { if(!dragging)return; const r=container.getBoundingClientRect(); layer.x=Math.max(0,Math.min(100,((e.clientX-r.left)/r.width)*100)); layer.y=Math.max(0,Math.min(100,((e.clientY-r.top)/r.height)*100)); el.style.left=layer.x+"%"; el.style.top=layer.y+"%"; });
  const stop=()=>{if(dragging){dragging=false;stSave();}}; el.addEventListener("pointerup",stop); el.addEventListener("pointercancel",stop);
}
function stRenderStickerLayersCanvas(){ const wrap=document.getElementById("stOutStickerLayers"); wrap.innerHTML=""; (stState.stickerLayers||[]).filter(layer=>layer.type!=="emoji").forEach(layer=>{ const el=document.createElement("div"); el.className="story-sticker-layer"; el.style.left=layer.x+"%"; el.style.top=layer.y+"%"; el.style.transform=`translate(-50%,-50%) rotate(${layer.rotate||0}deg)`; el.innerHTML=`<img src="${layer.src}" style="width:${layer.size||120}px;" />`; stMakeStickerDraggable(el,layer); wrap.appendChild(el); }); }
function stRenderStickerLayersPanel(){ const wrap=document.getElementById("stStickerLayersList"); wrap.innerHTML=""; (stState.stickerLayers||[]).filter(layer=>layer.type!=="emoji").forEach((layer,i)=>{ const card=document.createElement("div"); card.className="layer-card"; card.innerHTML=`<div class="row2"><div class="field"><label>스티커 ${i+1}</label><input type="number" min="16" max="300" data-s="size" value="${layer.size||120}" /></div><div class="field"><label>회전 (°)</label><input type="number" min="-180" max="180" data-s="rotate" value="${layer.rotate||0}" /></div></div><button type="button" class="layer-remove">삭제</button>`; card.querySelectorAll("[data-s]").forEach(input=>input.addEventListener("input",e=>{const k=e.target.dataset.s;layer[k]=parseInt(e.target.value,10)||0;stSave();stRenderStickerLayersCanvas();})); card.querySelector("button").addEventListener("click",()=>{stState.stickerLayers=stState.stickerLayers.filter(l=>l.id!==layer.id);stSave();stRenderStickerLayersPanel();stRenderStickerLayersCanvas();}); wrap.appendChild(card);}); }
document.getElementById("stAddStickerBtn").addEventListener("click",()=>document.getElementById("stStickerInput").click());
document.getElementById("stStickerInput").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{stState.stickerLayers.push({id:stStickerSeq++,type:"image",src:ev.target.result,x:50,y:50,size:120,rotate:0});stSave();stRenderStickerLayersPanel();stRenderStickerLayersCanvas();};r.readAsDataURL(f);e.target.value="";});

function stRenderAll() {
  const avatarEl = document.getElementById("stOutAvatar");
  avatarEl.src = stState.avatar || "";
  avatarEl.style.background = stState.avatar ? "transparent" : "#333";
  document.getElementById("stOutUsername").textContent = stState.username;
  document.getElementById("stOutTime").textContent = stState.time;

  const isCard = stState.layout === "card";
  document.getElementById("stOutCardWrap").classList.toggle("hidden", !isCard);
  document.getElementById("stOutHandle").classList.toggle("hidden", !isCard || !stState.handle);
  document.getElementById("stOutFullWrap").classList.toggle("hidden", isCard);

  const freePhoto = (stState.photoLayers || []).filter(l => l && l.src).slice(-1)[0];
  const bgSrc = freePhoto ? freePhoto.src : (stState.img || "");
  document.getElementById("stOutBg").src = bgSrc;
  document.getElementById("stOutBg").style.display = bgSrc ? "block" : "none";
  const cardImg = document.getElementById("stOutCardImg");
  cardImg.src = stState.img || "";
  cardImg.style.display = stState.img ? "block" : "none";
  cardImg.style.transformOrigin = "center center";
  cardImg.style.transform = `rotate(${Number(stState.imgRotate) || 0}deg)`;
  cardImg.style.border = `${stState.imgBorder || 0}px solid ${stState.imgBorderColor || "#ffffff"}`;
  cardImg.style.boxShadow = stState.imgShadow === "soft" ? "0 3px 10px rgba(0,0,0,.3)" : stState.imgShadow === "strong" ? "0 5px 18px rgba(0,0,0,.55)" : "none";
  const fullImg = document.getElementById("stOutFullImg");
  fullImg.src = stState.img || "";
  fullImg.style.display = stState.img ? "block" : "none";
  fullImg.style.transformOrigin = "center center";
  fullImg.style.transform = `rotate(${Number(stState.imgRotate) || 0}deg)`;
  fullImg.style.border = `${stState.imgBorder || 0}px solid ${stState.imgBorderColor || "#ffffff"}`;
  fullImg.style.boxShadow = stState.imgShadow === "soft" ? "0 3px 10px rgba(0,0,0,.3)" : stState.imgShadow === "strong" ? "0 5px 18px rgba(0,0,0,.55)" : "none";
  document.getElementById("stOutHandle").textContent = stState.handle || "";
  const commentWrap = document.getElementById("stOutComment");
  const commentText = document.getElementById("stOutCommentText");
  const commentAvatar = document.getElementById("stOutCommentAvatar");
  const showComment = !!stState.commentEnabled && !!String(stState.commentText || "").trim();
  if (commentWrap) commentWrap.classList.toggle("hidden", !showComment);
  if (commentText) commentText.textContent = stState.commentText || "";
  if (commentAvatar) {
    commentAvatar.src = stState.commentAvatar || "";
    commentAvatar.style.display = stState.commentAvatar ? "block" : "none";
  }

  stRenderSegments();
  stRenderLayersCanvas();
  stRenderPhotoLayersCanvas();
  stRenderStickerLayersCanvas();
  stRenderStickerLayersPanel();
  stSave();
}

function stFillForm() {
  document.getElementById("stLayout").value = stState.layout;
  document.getElementById("stUsername").value = stState.username;
  document.getElementById("stTime").value = stState.time;
  document.getElementById("stHandle").value = stState.handle;
  document.getElementById("stSegments").value = stState.segments;
  document.getElementById("stCommentEnabled").value = stState.commentEnabled ? "true" : "false";
  document.getElementById("stCommentText").value = stState.commentText || "";
  document.getElementById("stImgRotate").value = stState.imgRotate || 0;
  document.getElementById("stImgRotateLabel").textContent = `(${stState.imgRotate || 0}°)`;
  document.getElementById("stImgBorder").value = stState.imgBorder || 0;
  document.getElementById("stImgBorderColor").value = stState.imgBorderColor || "#ffffff";
  document.getElementById("stImgShadow").value = stState.imgShadow || "none";
  stRenderLayersPanel();
  stRenderPhotoLayersPanel();
  stRenderStickerLayersPanel();
}

function stBindInput(id, key) {
  const el = document.getElementById(id);
  const handler = (e) => {
    stState[key] = id === "stCommentEnabled" ? e.target.value === "true" : ((id === "stImgRotate" || id === "stImgBorder") ? (parseInt(e.target.value, 10) || 0) : e.target.value);
    if (id === "stImgRotate") {
      const label = document.getElementById("stImgRotateLabel");
      if (label) label.textContent = `(${stState[key]}°)`;
    }
    stRenderAll();
  };
  el.addEventListener("input", handler);
  el.addEventListener("change", handler);
}
[["stLayout","layout"],["stUsername","username"],["stTime","time"],["stHandle","handle"],["stSegments","segments"],["stCommentEnabled","commentEnabled"],["stCommentText","commentText"]].forEach(([id,key]) => stBindInput(id, key));
[["stImgRotate","imgRotate"],["stImgBorder","imgBorder"],["stImgBorderColor","imgBorderColor"],["stImgShadow","imgShadow"]].forEach(([id,key]) => stBindInput(id, key));

document.getElementById("stRotateLeftBtn").addEventListener("click", () => {
  stState.imgRotate = ((Number(stState.imgRotate) || 0) - 90 + 540) % 360 - 180;
  stFillForm();
  stRenderAll();
});
document.getElementById("stRotateRightBtn").addEventListener("click", () => {
  stState.imgRotate = ((Number(stState.imgRotate) || 0) + 90 + 540) % 360 - 180;
  stFillForm();
  stRenderAll();
});

document.getElementById("stAvatarInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => { stState.avatar = ev.target.result; stRenderAll(); };
  reader.readAsDataURL(file);
});
document.getElementById("stRemoveAvatarBtn").addEventListener("click", () => {
  stState.avatar = null;
  document.getElementById("stAvatarInput").value = "";
  stRenderAll();
});
document.getElementById("stCommentAvatarInput").addEventListener("change", (e) => {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader(); reader.onload = (ev) => { stState.commentAvatar = ev.target.result; stRenderAll(); }; reader.readAsDataURL(file);
});
document.getElementById("stImgInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => { stState.img = ev.target.result; stRenderAll(); };
  reader.readAsDataURL(file);
});
document.getElementById("stRemoveImgBtn").addEventListener("click", () => {
  stState.img = null;
  document.getElementById("stImgInput").value = "";
  stRenderAll();
});

document.getElementById("stResetBtn").addEventListener("click", () => {
  if (!confirm("인스타그램 스토리 입력 내용을 기본값으로 되돌릴까요?")) return;
  stState = stCloneDefault();
  stLayerSeq = stState.textLayers.reduce((m, l) => Math.max(m, l.id || 0), 0) + 1;
  stPhotoSeq = 1;
  stStickerSeq = 1;
  try { sessionStorage.removeItem(ST_STORAGE_KEY); } catch (e) {}
  document.getElementById("stAvatarInput").value = "";
  document.getElementById("stImgInput").value = "";
  stFillForm();
  stRenderAll();
});

document.getElementById("stSavePngBtn").addEventListener("click", () => {
  const target = document.getElementById("previewStory");
  const btn = document.getElementById("stSavePngBtn");
  const originalText = btn.textContent;
  if (typeof html2canvas === "undefined") {
    alert("이미지 생성 기능을 불러오지 못했습니다. 인터넷 연결을 확인한 뒤 새로고침해서 다시 시도해주세요.");
    return;
  }
  btn.textContent = "이미지 생성 중...";
  btn.disabled = true;
  const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  ready.then(() => html2canvas(target, {
    backgroundColor: "#000000", scale: 3, useCORS: true, allowTaint: true, logging: false, imageTimeout: 15000
  })).then(canvas => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("blob 생성 실패");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "instagram_story.png";
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

stFillForm();
stRenderAll();

// 