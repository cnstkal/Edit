const DC_STORAGE_KEY = "virtual_dcinside_draft_v1";
const DC_DEFAULT = {
  gallery: "갤러리 이름",
  title: "게시글 제목을 입력하세요",
  nick: "ㅇㅇ",
  nickIp: "",
  date: "2026.09.03 15:21",
  views: "2432",
  likes: "168",
  comments: "3",
  img: null,
  body: "여기에 게시글 본문을 입력하세요.\n줄바꿈으로 문단을 나눌 수 있습니다.\n왼쪽 '본문' 항목에서 텍스트를 드래그하고 굵게/색 적용 버튼을 누르면 일부분만 서식을 줄 수 있습니다.",
  comments_list: [
    { nick: "ㅇㅇ", ip: "123.45", date: "08.28 17:42", text: "댓글 내용 예시입니다" },
    { nick: "댓글러", ip: "", date: "08.30 21:56", text: "댓글 내용 예시입니다" },
    { nick: "닉네임", ip: "", date: "09.04 11:01", text: "댓글 내용 예시입니다" }
  ],
  font: "pretendard",
  fontSize: "15",
};
function dcCloneDefault() { return JSON.parse(JSON.stringify(DC_DEFAULT)); }
function dcLoad() { try { const raw=sessionStorage.getItem(DC_STORAGE_KEY); if(raw)return Object.assign(dcCloneDefault(),JSON.parse(raw)); } catch(e){} return dcCloneDefault(); }
let dcState=dcLoad();
function dcSave(){try{sessionStorage.setItem(DC_STORAGE_KEY,JSON.stringify(dcState));}catch(e){}}
function dcEscHtml(s){return(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function dcFormatBody(raw){let s=dcEscHtml(raw||"");s=s.replace(/\{\{color:(#[0-9a-fA-F]{6})\}\}([\s\S]+?)\{\{\/color\}\}/g,'<span style="color:$1">$2</span>');s=s.replace(/\*\*([\s\S]+?)\*\*/g,"<strong>$1</strong>");return s;}
function dcRenderAll(){
 document.getElementById("dcOutGalleryText").textContent=dcState.gallery;document.getElementById("dcOutTitle").textContent=dcState.title;document.getElementById("dcOutNick").textContent=dcState.nick;document.getElementById("dcOutNickIp").textContent=dcState.nickIp?`(${dcState.nickIp})`:"";document.getElementById("dcOutDate").textContent=dcState.date;document.getElementById("dcOutViews").textContent=dcState.views;document.getElementById("dcOutLikes").textContent=dcState.likes;document.getElementById("dcOutLikes2").textContent=dcState.likes;document.getElementById("dcOutComments").textContent=dcState.comments;
 const imgEl=document.getElementById("dcOutImg");if(dcState.img){imgEl.src=dcState.img;imgEl.classList.remove("hidden");}else{imgEl.src="";imgEl.classList.add("hidden");}
 const bodyEl=document.getElementById("dcOutBody");bodyEl.className="dc-body "+("font-"+(dcState.font||"pretendard"));bodyEl.style.fontSize=(dcState.fontSize||"15")+"px";bodyEl.style.color="#1a1a1a";bodyEl.innerHTML=(dcState.body||"").split(/\n\s*\n/).map(p=>`<p>${dcFormatBody(p).replace(/\n/g,"<br/>")}</p>`).join("");
 const list=dcState.comments_list||[];document.getElementById("dcOutCommentCount").textContent=`[${list.length}]`;document.getElementById("dcOutCommentList").innerHTML=list.map(c=>`<div class="dc-comment-item"><span class="dc-comment-nick">${dcEscHtml(c.nick)}</span>${c.ip?` <span class="dc-ip">(${dcEscHtml(c.ip)})</span>`:""}<div class="dc-comment-text">${dcEscHtml(c.text)}</div><div class="dc-comment-date">${dcEscHtml(c.date)}</div></div>`).join("");
 dcRenderCommentEditor();dcSave();
}
function dcRenderCommentEditor(){const wrap=document.getElementById("dcCommentEditList"),list=dcState.comments_list||[];wrap.innerHTML=list.map((c,i)=>`<div class="comment-edit-card" data-dc-comment-card="${i}"><div class="row"><div class="field"><label>닉네임</label><input type="text" data-dc-c="${i}" data-dc-k="nick" value="${dcEscHtml(c.nick)}" /></div><div class="field"><label>아이피 (선택)</label><input type="text" data-dc-c="${i}" data-dc-k="ip" value="${dcEscHtml(c.ip)}" /></div></div><div class="field"><label>날짜/시간</label><input type="text" data-dc-c="${i}" data-dc-k="date" value="${dcEscHtml(c.date)}" /></div><div class="field"><label>내용</label><textarea rows="2" data-dc-c="${i}" data-dc-k="text">${dcEscHtml(c.text)}</textarea></div><button type="button" class="comment-edit-remove" data-dc-remove="${i}">이 댓글 삭제</button></div>`).join("");wrap.querySelectorAll("[data-dc-c]").forEach(el=>{const handler=e=>{const i=+el.dataset.dcC,k=el.dataset.dcK;dcState.comments_list[i][k]=e.target.value;document.getElementById("dcOutCommentCount").textContent=`[${dcState.comments_list.length}]`;document.getElementById("dcOutCommentList").innerHTML=dcState.comments_list.map(c=>`<div class="dc-comment-item"><span class="dc-comment-nick">${dcEscHtml(c.nick)}</span>${c.ip?` <span class="dc-ip">(${dcEscHtml(c.ip)})</span>`:""}<div class="dc-comment-text">${dcEscHtml(c.text)}</div><div class="dc-comment-date">${dcEscHtml(c.date)}</div></div>`).join("");dcSave();};el.addEventListener("input",handler);el.addEventListener("change",handler);});wrap.querySelectorAll("[data-dc-remove]").forEach(el=>el.addEventListener("click",()=>{dcState.comments_list.splice(+el.dataset.dcRemove,1);dcRenderAll();}));}
document.getElementById("dcCommentAddBtn").addEventListener("click",()=>{dcState.comments_list.push({nick:"ㅇㅇ",ip:"",date:"",text:""});dcRenderAll();});
document.getElementById("dcBoldBtn").addEventListener("click",()=>{const ta=document.getElementById("dcBody"),start=ta.selectionStart,end=ta.selectionEnd;if(start===end)return;ta.value=ta.value.slice(0,start)+"**"+ta.value.slice(start,end)+"**"+ta.value.slice(end);dcState.body=ta.value;dcRenderAll();ta.focus();});
document.getElementById("dcColorBtn").addEventListener("click",()=>{const ta=document.getElementById("dcBody"),start=ta.selectionStart,end=ta.selectionEnd;if(start===end)return;const color=document.getElementById("dcSelColor").value,open=`{{color:${color}}}`,close="{{/color}}";ta.value=ta.value.slice(0,start)+open+ta.value.slice(start,end)+close+ta.value.slice(end);dcState.body=ta.value;dcRenderAll();ta.focus();});
function dcFillForm(){document.getElementById("dcGallery").value=dcState.gallery;document.getElementById("dcTitle").value=dcState.title;document.getElementById("dcNick").value=dcState.nick;document.getElementById("dcNickIp").value=dcState.nickIp;document.getElementById("dcDate").value=dcState.date;document.getElementById("dcViews").value=dcState.views;document.getElementById("dcLikes").value=dcState.likes;document.getElementById("dcComments").value=dcState.comments;document.getElementById("dcBody").value=dcState.body;document.getElementById("dcFont").value=dcState.font;document.getElementById("dcFontSize").value=dcState.fontSize;}
function dcBindInput(id,key){const el=document.getElementById(id);const handler=e=>{dcState[key]=e.target.value;dcRenderAll();};el.addEventListener("input",handler);el.addEventListener("change",handler);}
["gallery","title","nick","nickIp","date","views","likes","comments","body","font","fontSize"].forEach(key=>{const idMap={gallery:"dcGallery",title:"dcTitle",nick:"dcNick",nickIp:"dcNickIp",date:"dcDate",views:"dcViews",likes:"dcLikes",comments:"dcComments",body:"dcBody",font:"dcFont",fontSize:"dcFontSize"};dcBindInput(idMap[key],key);});
document.getElementById("dcImgInput").addEventListener("change",e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{dcState.img=ev.target.result;dcRenderAll();};reader.readAsDataURL(file);});
document.getElementById("dcRemoveImgBtn").addEventListener("click",()=>{dcState.img=null;document.getElementById("dcImgInput").value="";dcRenderAll();});
document.getElementById("dcResetBtn").addEventListener("click",()=>{if(!confirm("디시인사이드 입력 내용을 기본값으로 되돌릴까요?"))return;dcState=dcCloneDefault();try{sessionStorage.removeItem(DC_STORAGE_KEY);}catch(e){}document.getElementById("dcImgInput").value="";dcFillForm();dcRenderAll();});
document.getElementById("dcSavePngBtn").addEventListener("click",()=>{const target=document.getElementById("previewDc"),btn=document.getElementById("dcSavePngBtn"),originalText=btn.textContent;if(typeof html2canvas==="undefined"){alert("이미지 생성 기능을 불러오지 못했습니다. 인터넷 연결을 확인한 뒤 새로고침해서 다시 시도해주세요.");return}btn.textContent="이미지 생성 중...";btn.disabled=true;const ready=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve();ready.then(()=>html2canvas(target,{backgroundColor:"#ffffff",scale:3,useCORS:true,allowTaint:true,logging:false,imageTimeout:15000})).then(canvas=>{canvas.toBlob(blob=>{if(!blob)throw new Error("blob 생성 실패");const url=URL.createObjectURL(blob),link=document.createElement("a");link.download="dcinside_post.png";link.href=url;document.body.appendChild(link);link.click();document.body.removeChild(link);setTimeout(()=>URL.revokeObjectURL(url),2000);btn.textContent=originalText;btn.disabled=false;},"image/png");}).catch(err=>{console.error("PNG 저장 실패:",err);alert("이미지 생성에 실패했습니다. 사진 파일 용량을 줄이거나 다른 사진으로 바꿔서 다시 시도해보세요.");btn.textContent=originalText;btn.disabled=false;});});
dcFillForm();dcRenderAll();