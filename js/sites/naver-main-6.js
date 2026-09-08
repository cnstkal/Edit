
(function(){
const KEY="virtual_instagram_dm_v1";
const DEF={headerName:"박성화",username:"_starhwa_",activity:"1분 전",profileName:"박성화",date:"4월 8일 오후 11:21",avatar:null,messages:[{text:"오랜만이네",side:"left"},{text:"잘지내?",side:"left"}]};
let state=JSON.parse(JSON.stringify(DEF));
try{const raw=sessionStorage.getItem(KEY);if(raw){const x=JSON.parse(raw);state=Object.assign({},DEF,x);state.messages=Array.isArray(x.messages)?x.messages:DEF.messages;}}catch(e){}
function save(){try{sessionStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>")}
function avatar(el){if(!el)return;el.classList.toggle("has-image",!!state.avatar);el.style.backgroundImage=state.avatar?`url("${state.avatar}")`:"none";}
function render(){
  const vals={igDmHeaderNameOut:state.headerName,igDmActivityOut:state.activity,igDmProfileNameOut:state.profileName,igDmUsernameOut:state.username,igDmDateOut:state.date};
  Object.entries(vals).forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.textContent=v||"";});
  avatar(document.getElementById("igDmHeaderAvatar"));avatar(document.getElementById("igDmProfileAvatar"));
  const out=document.getElementById("igDmMessagesOut"); if(!out)return;
  out.innerHTML=(state.messages||[]).map(m=>`<div class="igdm-message-row ${m.side==='right'?'right':'left'}">${m.side==='right'?'':'<div class="igdm-message-avatar"></div>'}<div class="igdm-bubble">${esc(m.text)}</div></div>`).join("");
  out.querySelectorAll('.igdm-message-avatar').forEach(e=>{e.classList.toggle('has-image',!!state.avatar);e.style.backgroundImage=state.avatar?`url("${state.avatar}")`:"none";});
}
function editors(){const box=document.getElementById("igDmMessages");if(!box)return;box.innerHTML="";(state.messages||[]).forEach((m,i)=>{const c=document.createElement("div");c.className="instagram-dm-message-editor";c.innerHTML=`<div class="field"><label>메시지 ${i+1}</label><textarea rows="3" data-text>${String(m.text||"")}</textarea></div><div class="row2"><div class="field"><label>방향</label><select data-side><option value="left">상대방 (왼쪽)</option><option value="right">내 메시지 (오른쪽)</option></select></div><button type="button" class="btn btn-ghost" data-remove>삭제</button></div>`;c.querySelector('[data-side]').value=m.side||'left';c.querySelector('[data-text]').addEventListener('input',e=>{m.text=e.target.value;save();render()});c.querySelector('[data-side]').addEventListener('change',e=>{m.side=e.target.value;save();render()});c.querySelector('[data-remove]').addEventListener('click',()=>{state.messages.splice(i,1);save();editors();render()});box.appendChild(c);})}
const fields={igDmHeaderName:'headerName',igDmUsername:'username',igDmActivity:'activity',igDmProfileName:'profileName',igDmDate:'date'};
Object.entries(fields).forEach(([id,k])=>{const e=document.getElementById(id);if(!e)return;e.value=state[k]||'';e.addEventListener('input',()=>{state[k]=e.value;save();render()})});
document.getElementById('igDmAvatarInput')?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=x=>{state.avatar=x.target.result;save();render()};r.readAsDataURL(f)});
document.getElementById('igDmRemoveAvatar')?.addEventListener('click',()=>{state.avatar=null;document.getElementById('igDmAvatarInput').value='';save();render()});
document.getElementById('igDmAddMessage')?.addEventListener('click',()=>{state.messages.push({text:'새 메시지',side:'left'});save();editors();render()});
document.getElementById('igDmReset')?.addEventListener('click',()=>{if(!confirm('인스타그램 DM 입력 내용을 기본값으로 되돌릴까요?'))return;state=JSON.parse(JSON.stringify(DEF));document.getElementById('igDmAvatarInput').value='';save();editors();render()});
document.getElementById('igDmSavePng')?.addEventListener('click',()=>{const t=document.getElementById('instagramDmPreview'),b=document.getElementById('igDmSavePng');if(!t||typeof html2canvas==='undefined'){alert('이미지 생성 기능을 불러오지 못했습니다.');return}const old=b.textContent;b.textContent='이미지 생성 중...';b.disabled=true;Promise.resolve(document.fonts?.ready).then(()=>html2canvas(t,{backgroundColor:'#fff',scale:3,useCORS:true,allowTaint:true,logging:false})).then(c=>c.toBlob(blob=>{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='instagram_dm.png';a.click();setTimeout(()=>URL.revokeObjectURL(u),2000);b.textContent=old;b.disabled=false},'image/png')).catch(()=>{alert('PNG 저장에 실패했습니다.');b.textContent=old;b.disabled=false})});
editors();render();
})();
