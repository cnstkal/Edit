// ===== 에브리타임 생성기 =====
const ET_STORAGE_KEY = "virtual_everytime_draft_v1";
const ET_DEFAULT_AVATAR = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="10" fill="#d5dddf"/><circle cx="40" cy="30" r="12" fill="#fff"/><path d="M19 67c1-15 10-23 21-23s20 8 21 23" fill="#fff"/></svg>`);
const ET_DEFAULT = { board:"자유게시판", univ:"숭문대", nick:"익명", avatar:null, date:"09/02 14:59", likes:"0", commentCount:"3", title:"마스 작년에 축제온 사람 아님?", body:"래퍼인데 되게 잘생겼다고 생각했음\n배우랑 만나는구나 ㅋㅋ", comments:[
  {nick:"익명1", body:"그 사람이 그 사람임?", date:"09/02 14:59", avatar:null, replies:[]},
  {nick:"익명(글쓴이)", body:"ㅇㅇ 근데 뭔가충격이다... 마스는 인정했네\n그럼 찐이겠지", date:"09/02 13:03", avatar:null, replies:[]},
  {nick:"익명1", body:"방금까진 찐이었는데 지금은 아닌듯\nhttps://atzen.co.kr/ent/26090301", date:"09/02 13:08", avatar:null, replies:[]}
]};
function etCloneDefault(){return JSON.parse(JSON.stringify(ET_DEFAULT));}
let etState=etCloneDefault();
try{const saved=sessionStorage.getItem(ET_STORAGE_KEY);if(saved)etState={...etCloneDefault(),...JSON.parse(saved)};}catch(e){}
function etSave(){try{sessionStorage.setItem(ET_STORAGE_KEY,JSON.stringify(etState));}catch(e){}}
function etEsc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function etAvatar(src, cls="et-comment-avatar"){return `<img class="${cls}" src="${src||ET_DEFAULT_AVATAR}" />`;}
function etLikeIcon(){return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10v10H4V10h3Zm3 10h6.7a2 2 0 0 0 1.95-1.55l1.2-5A2 2 0 0 0 18.9 11H15l.6-3.1A2.4 2.4 0 0 0 13.25 5L10 10v10Z"/></svg>`;}
function etDotsIcon(){return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>`;}
function etRenderComments(){
  const list=document.getElementById("etOutComments");
  list.innerHTML='<div style="font-size:15px;font-weight:700;margin-bottom:18px;">댓글</div>' + (etState.comments||[]).map(c=>{
    const cWriter=/글쓴이/.test(c.nick||"");
    const replies=(c.replies||[]).map(r=>{
      const rWriter=/글쓴이/.test(r.nick||"");
      return `<div class="et-comment reply"><div class="et-comment-head">${etAvatar(r.avatar)}<span class="et-comment-nick${rWriter?' writer':''}">${etEsc(r.nick||"익명")}</span><span class="et-comment-tools">${etDotsIcon()}</span></div><div class="et-comment-body">${etEsc(r.body||"")}</div><div class="et-comment-date">${etEsc(r.date||"")}</div></div>`;
    }).join("");
    return `<div class="et-comment"><div class="et-comment-head">${etAvatar(c.avatar)}<span class="et-comment-nick${cWriter?' writer':''}">${etEsc(c.nick||"익명")}</span><span class="et-comment-tools">${etDotsIcon()}</span></div><div class="et-comment-body">${etEsc(c.body||"")}</div><div class="et-comment-date">${etEsc(c.date||"")}</div>${replies?`<div class="et-reply-list">${replies}</div>`:""}</div>`;
  }).join("");
}
function etRender(){
  document.getElementById("etOutBoard").textContent=etState.board||""; document.getElementById("etOutUniv").textContent=etState.univ||"";
  document.getElementById("etOutNick").textContent=etState.nick||"익명"; document.getElementById("etOutDate").textContent=etState.date||"";
  document.getElementById("etOutTitle").textContent=etState.title||""; document.getElementById("etOutBody").textContent=etState.body||"";
  document.getElementById("etOutLikes").textContent=(String(etState.likes||"").trim() && String(etState.likes).trim()!=="0") ? String(etState.likes).trim() : ""; document.getElementById("etOutCommentCount").textContent=(String(etState.commentCount||"").trim() && String(etState.commentCount).trim()!=="0") ? String(etState.commentCount).trim() : "";
  document.getElementById("etOutAvatar").src=etState.avatar||ET_DEFAULT_AVATAR; etRenderComments();
}
function etFillForm(){
  ["board","univ","nick","date","likes","commentCount","title","body"].forEach(k=>{const el=document.getElementById("et"+k.charAt(0).toUpperCase()+k.slice(1));if(el)el.value=etState[k]??"";}); etRenderCommentEditor();
}
function etRenderCommentEditor(){
  const box=document.getElementById("etCommentsEditor");box.innerHTML="";
  (etState.comments||[]).forEach((c,i)=>{
    const card=document.createElement("div");card.className="et-editor-comment";card.innerHTML=`<div class="field"><label>댓글 ${i+1}</label><input type="text" data-k="nick" value="${etEsc(c.nick||"")}"></div><div class="field"><input type="text" data-k="date" value="${etEsc(c.date||"")}" placeholder="날짜"></div><div class="field"><textarea rows="3" data-k="body">${etEsc(c.body||"")}</textarea></div><div class="row2"><button type="button" class="btn btn-secondary" data-reply>+ 대댓글</button><button type="button" class="btn btn-ghost" data-remove>삭제</button></div><div class="et-replies-editor"></div>`;
    card.querySelectorAll("[data-k]").forEach(el=>el.addEventListener("input",()=>{c[el.dataset.k]=el.value;etSave();etRender();}));
    card.querySelector("[data-remove]").addEventListener("click",()=>{etState.comments.splice(i,1);etSave();etRenderCommentEditor();etRender();});
    card.querySelector("[data-reply]").addEventListener("click",()=>{c.replies=c.replies||[];c.replies.push({nick:"익명1",body:"대댓글 내용을 입력하세요.",date:etState.date,avatar:null});etSave();etRenderCommentEditor();etRender();});
    const replies=card.querySelector(".et-replies-editor");(c.replies||[]).forEach((r,j)=>{const rc=document.createElement("div");rc.style.cssText="margin-top:10px;padding:10px;border:1px solid #eee;border-radius:5px;background:#fafafa";rc.innerHTML=`<div class="field"><label>대댓글 ${j+1}</label><input type="text" data-k="nick" value="${etEsc(r.nick||"")}"></div><div class="field"><textarea rows="2" data-k="body">${etEsc(r.body||"")}</textarea></div><button type="button" class="btn btn-ghost" data-del>대댓글 삭제</button>`;rc.querySelectorAll("[data-k]").forEach(el=>el.addEventListener("input",()=>{r[el.dataset.k]=el.value;etSave();etRender();}));rc.querySelector("[data-del]").addEventListener("click",()=>{c.replies.splice(j,1);etSave();etRenderCommentEditor();etRender();});replies.appendChild(rc);});
    box.appendChild(card);
  });
}
[["etBoard","board"],["etUniv","univ"],["etNick","nick"],["etDate","date"],["etLikes","likes"],["etCommentCount","commentCount"],["etTitle","title"],["etBody","body"]].forEach(([id,key])=>{const el=document.getElementById(id);el.addEventListener("input",e=>{etState[key]=e.target.value;etSave();etRender();});});
document.getElementById("etAvatarInput").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{etState.avatar=ev.target.result;etSave();etRender();};r.readAsDataURL(f);});
document.getElementById("etRemoveAvatarBtn").addEventListener("click",()=>{etState.avatar=null;document.getElementById("etAvatarInput").value="";etSave();etRender();});
document.getElementById("etAddCommentBtn").addEventListener("click",()=>{etState.comments.push({nick:"익명",body:"댓글 내용을 입력하세요.",date:etState.date,avatar:null,replies:[]});etState.commentCount=String(Math.max(0,Number(etState.commentCount||0)+1));etSave();etRenderCommentEditor();etRender();});
document.getElementById("etResetBtn").addEventListener("click",()=>{if(!confirm("에브리타임 입력 내용을 기본값으로 되돌릴까요?"))return;etState=etCloneDefault();try{sessionStorage.removeItem(ET_STORAGE_KEY);}catch(e){}document.getElementById("etAvatarInput").value="";etFillForm();etRender();});
document.getElementById("etSavePngBtn").addEventListener("click",()=>{const target=document.getElementById("everytimePreview"),btn=document.getElementById("etSavePngBtn"),old=btn.textContent;if(typeof html2canvas==="undefined"){alert("이미지 생성 기능을 불러오지 못했습니다.");return;}btn.textContent="이미지 생성 중...";btn.disabled=true;Promise.resolve(document.fonts&&document.fonts.ready).then(()=>html2canvas(target,{backgroundColor:"#fff",scale:3,useCORS:true,allowTaint:true,logging:false,imageTimeout:15000})).then(canvas=>canvas.toBlob(blob=>{const url=URL.createObjectURL(blob),a=document.createElement("a");a.download="everytime_mobile.png";a.href=url;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);btn.textContent=old;btn.disabled=false;} ,"image/png")).catch(()=>{alert("PNG 저장에 실패했습니다.");btn.textContent=old;btn.disabled=false;});});
etFillForm();etRender();

