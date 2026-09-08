// ===== Google 검색창 생성기 =====
const GOOGLE_DEFAULTS = {
  querySize: 12,
  historySize: 12,
  queryX: 20.6,
  queryY: 35.1,
  historyX: 24.7,
  historyY: 42.9,
  letterSpacing: -30,
  queryWeight: 300,
  historyWeight: 300,
  historyLineGap: 12.4,
  defaultState: "closed"
};
const GOOGLE_DEFAULT_HISTORY = `스타워즈 시리즈
마포구 맛집
성인남자 하루평균 섭취 칼로리
유튜브
네이버
성균대학교 공식 홈페이지
뭐 검색하려고했더라
초간단 집밥`;
const gh0=document.getElementById('googleHistory'); if(gh0 && !gh0.value) gh0.value=GOOGLE_DEFAULT_HISTORY;
function googleEsc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function googleHistoryIcon(){return `<svg class="google-history-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.34-5.66L4 8.7M4 4v4.7h4.7M12 7v5l3 2"/></svg>`;}
function googleRenderDropdown(){
  const box=document.getElementById('googleHistoryOverlay');
  const src=document.getElementById('googleHistory');
  if(!box || !src) return;
  const rows=src.value.split(/\r?\n/).map(v=>v.trim()).filter(Boolean).slice(0,8);
  box.innerHTML=rows.map(v=>`<div class=\"google-history-row\"><span>${googleEsc(v)}</span></div>`).join('');
  googleApplyTypography();
}
function googleApplyTypography(){
  const canvas=document.getElementById('googleCanvas');
  if(!canvas) return;
  const qs=Number(document.getElementById('googleQuerySize')?.value)||16;
  const hs=Number(document.getElementById('googleHistorySize')?.value)||14;
  const qx=Number(document.getElementById('googleQueryX')?.value);
  const qy=Number(document.getElementById('googleQueryY')?.value);
  const hx=Number(document.getElementById('googleHistoryX')?.value);
  const hy=Number(document.getElementById('googleHistoryY')?.value);
  const ls=Number(document.getElementById('googleLetterSpacing')?.value)||-30;
  const qw=Number(document.getElementById('googleQueryWeight')?.value)||400;
  const hw=Number(document.getElementById('googleHistoryWeight')?.value)||400;
  const gap=Math.max(0,Number(document.getElementById('googleHistoryLineGap')?.value)||0);
  const q=document.getElementById('googleSearchInput');
  const h=document.getElementById('googleHistoryOverlay');
  if(q){ q.style.fontSize=qs+'px'; q.style.fontWeight=qw; q.style.left=qx+'%'; q.style.top=qy+'%'; q.style.letterSpacing=(ls/1000)+'em'; }
  if(h){ h.style.left=hx+'%'; h.style.top=hy+'%'; h.querySelectorAll('.google-history-row').forEach(r=>{r.style.fontSize=hs+'px';r.style.fontWeight=hw;r.style.height=(hs+gap)+'px';r.style.letterSpacing=(ls/1000)+'em';}); }
}
function googleSetOpen(open){
  const canvas=document.getElementById('googleCanvas');
  const img=document.getElementById('googlePreviewImage');
  if(!canvas || !img) return;
  canvas.classList.toggle('open',!!open);
  img.src=!!open ? "이미지/img-8f436381ecb6.webp" : "이미지/img-ba7e95ee024a.webp";
}
function googleSync(){
  const q=document.getElementById('googleQuery');
  const hit=document.getElementById('googleSearchInput');
  if(hit && q && hit.value!==q.value) hit.value=q.value;
  googleApplyTypography();
}
Object.entries({
  googleQuerySize:GOOGLE_DEFAULTS.querySize, googleHistorySize:GOOGLE_DEFAULTS.historySize,
  googleQueryX:GOOGLE_DEFAULTS.queryX, googleQueryY:GOOGLE_DEFAULTS.queryY,
  googleHistoryX:GOOGLE_DEFAULTS.historyX, googleHistoryY:GOOGLE_DEFAULTS.historyY,
  googleLetterSpacing:GOOGLE_DEFAULTS.letterSpacing, googleQueryWeight:GOOGLE_DEFAULTS.queryWeight,
  googleHistoryWeight:GOOGLE_DEFAULTS.historyWeight, googleHistoryLineGap:GOOGLE_DEFAULTS.historyLineGap,
  googleDefaultState:GOOGLE_DEFAULTS.defaultState
}).forEach(([id,value])=>{const el=document.getElementById(id); if(el) el.value=String(value);});

const gq=document.getElementById('googleQuery');
const ghi=document.getElementById('googleHistory');
const gsi=document.getElementById('googleSearchInput');
if(gq){gq.addEventListener('input',googleSync);}
if(ghi){ghi.addEventListener('input',()=>{googleRenderDropdown(); googleSetOpen(true);});}
['googleQuerySize','googleHistorySize','googleQueryX','googleQueryY','googleHistoryX','googleHistoryY','googleLetterSpacing','googleQueryWeight','googleHistoryWeight','googleHistoryLineGap'].forEach(id=>{
  const el=document.getElementById(id); if(el) el.addEventListener('input',googleApplyTypography);
});
googleRenderDropdown();
googleSync();
if(gsi){
  gsi.addEventListener('focus',()=>googleSetOpen(true));
  gsi.addEventListener('input',e=>{if(gq){gq.value=e.target.value;googleSync();} else googleApplyTypography();});
}
document.getElementById('googleOpenBtn')?.addEventListener('click',()=>googleSetOpen(true));
document.getElementById('googleResultsOpenBtn')?.addEventListener('click',()=>showScreen('googleResults'));
document.getElementById('googleCloseBtn')?.addEventListener('click',()=>googleSetOpen(false));
document.getElementById('googleDefaultState')?.addEventListener('change',e=>googleSetOpen(e.target.value==='open'));
document.getElementById('googleSaveBtn')?.addEventListener('click',()=>{
  const el=document.getElementById('googleCanvas');
  if(!window.html2canvas){alert('PNG 저장 기능을 불러오는 중입니다.');return;}
  html2canvas(el,{scale:2,useCORS:true,backgroundColor:'#fff'}).then(c=>{
    const a=document.createElement('a'); a.download='google_search.png'; a.href=c.toDataURL('image/png'); a.click();
  }).catch(()=>alert('이미지 저장에 실패했습니다.'));
});
googleSync();
if(document.getElementById('googleDefaultState')?.value==='open') googleSetOpen(true);


