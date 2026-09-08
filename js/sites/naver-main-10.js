
(function(){
 const headlines=[
  "에드워드 김, 화려한 이면 뒤 숨겨진 마약 스캔들…경찰 추적 중",
  "OTC, 컴백과 동시에 음원 차트 상위권…'커리어 하이' 예고",
  "계약 조건 갈등 끝 폭행 사태…OTC 기획, 소속사 사장 폭행 혐의",
  "신예에서 중심으로…김소설 작가, 주요 문학상 휩쓸다",
  "유명 야구 선수 정모씨 살인 혐의로 입건…구단 '사실 확인 중'",
  "에이티즈 우호, 비주얼·피지컬·실력 삼박자…완성형 아이돌 입증"
 ];
 const bind=(id,out,prop='textContent')=>{const a=document.getElementById(id),b=document.getElementById(out);if(!a||!b)return;const fn=()=>b[prop]=a.value;fn();a.addEventListener('input',fn);};
 [
 ['nvSearch','nvSearchOut'],['nvAccountName','nvAccountNameOut'],['nvEmail','nvEmailOut'],
 ['nvFeatureTitleInput','nvFeatureTitle'],['nvFeatureMetaInput','nvFeatureMeta'],['nvRightText','nvRightTextOut'],['nvLongText','nvLongTextOut'],['nvNewsSectionInput','nvNewsSection'],['nvCat1Input','nvCat1'],['nvCat2Input','nvCat2'],['nvCat3Input','nvCat3'],['nvCat5Input','nvCat5'],
 ['nvNewsbarLeftInput','nvNewsbarLeft'],['nvNewsbarMiddleInput','nvNewsbarMiddle'],['nvNewsbarRightInput','nvNewsbarRight'],['nvPress4Input','nvPress4'],['nvLogoutInput','nvLogoutText'],['nvNaverIdInput','nvNaverId'],['nvPressSubInput','nvPressSub'],['nvFooterBlueInput','nvFooterBlue'],['nvFooterMoreInput','nvFooterMore'],
 ['nvShop1Input','nvShop1'],['nvShop2Input','nvShop2'],['nvShop3Input','nvShop3'],['nvShop4Input','nvShop4'],['nvShop5Input','nvShop5'],['nvShop6Input','nvShop6'],['nvShopPageInput','nvShopPage']
 ].forEach(x=>bind(x[0],x[1]));
 ['nvServicesInput','nvMenuInput','nvPressesInput'].forEach(id=>document.getElementById(id)?.addEventListener('input',()=>renderSimpleLists()));
 function renderSimpleLists(){
   const sv=(document.getElementById('nvServicesInput')?.value||'').split('|'); for(let i=1;i<=11;i++){const e=document.getElementById('nvService'+i);if(e)e.textContent=sv[i-1]||'';}
   const mn=(document.getElementById('nvMenuInput')?.value||'').split('|'); for(let i=1;i<=4;i++){const e=document.getElementById('nvMenu'+i);if(e)e.textContent=mn[i-1]||'';}
   const pr=(document.getElementById('nvPressesInput')?.value||'').split('|'); for(let i=1;i<=3;i++){const e=document.getElementById('nvPress'+i);if(e)e.textContent=pr[i-1]||'';}
 }
 function renderHeadlines(){
   const box=document.getElementById('nvHeadlineList'); if(!box)return;
   box.innerHTML=headlines.map((h,i)=>`<div class="field"><input value="${h.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" data-nvh="${i}"></div>`).join('');
   box.querySelectorAll('[data-nvh]').forEach(e=>e.addEventListener('input',()=>{headlines[+e.dataset.nvh]=e.value;renderPreview();}));
 }
 function renderPreview(){document.getElementById('nvHeadlinesOut').innerHTML=headlines.map(h=>`<div>${escapeHtml(h)}</div>`).join('');}
 function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
 document.getElementById('nvAddHeadline')?.addEventListener('click',()=>{headlines.push('새로운 뉴스 제목을 입력하세요');renderHeadlines();renderPreview();});
 document.getElementById('nvFeatureImage')?.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{const el=document.getElementById('nvFeatureImg');el.style.backgroundImage=`url("${ev.target.result}")`;el.style.backgroundSize='contain';el.style.backgroundPosition='center';el.style.backgroundRepeat='no-repeat';};r.readAsDataURL(f);});
 document.getElementById('nvAvatarImage')?.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{const el=document.getElementById('nvAvatarOut');el.style.backgroundImage=`url("${ev.target.result}")`;el.style.backgroundSize='cover';el.style.backgroundPosition='center';el.textContent='';};r.readAsDataURL(f);});
 document.querySelectorAll('#nvProductInputs input[data-nvp]').forEach(inp=>inp.addEventListener('change',e=>{const idx=+inp.dataset.nvp,f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{const boxes=document.querySelectorAll('#nvProductsOut > div');if(boxes[idx])boxes[idx].style.backgroundImage=`url("${ev.target.result}")`;};r.readAsDataURL(f);}));
 function bindStyle(id, target, prop, suffix=''){const el=document.getElementById(id),out=document.getElementById(target);if(!el||!out)return;const fn=()=>out.style[prop]=el.value+suffix;fn();el.addEventListener('input',fn);}
 ['nvFeatureWeight','nvFeatureWeightVal'],['nvHeadlineWeight','nvHeadlineWeightVal'],['nvRightWeight','nvRightWeightVal'].forEach(([id,out])=>{const a=document.getElementById(id),b=document.getElementById(out);if(a&&b){const sync=()=>b.textContent=a.value;a.addEventListener('input',sync);sync();}});
  bindStyle('nvFeatureSize','nvFeatureTitle','fontSize','px');bindStyle('nvFeatureWeight','nvFeatureTitle','fontWeight');bindStyle('nvFeatureLineHeight','nvFeatureTitle','lineHeight');bindStyle('nvFeatureColor','nvFeatureTitle','color');
 bindStyle('nvHeadlineSize','nvHeadlinesOut','fontSize','px');bindStyle('nvHeadlineWeight','nvHeadlinesOut','fontWeight');bindStyle('nvHeadlineLineHeight','nvHeadlinesOut','lineHeight');bindStyle('nvHeadlineColor','nvHeadlinesOut','color');
 bindStyle('nvRightSize','nvRightTextOut','fontSize','px');bindStyle('nvRightWeight','nvRightTextOut','fontWeight');bindStyle('nvRightLineHeight','nvRightTextOut','lineHeight');bindStyle('nvRightColor','nvRightTextOut','color');
 renderSimpleLists();renderHeadlines();renderPreview();
 document.getElementById('naverSavePng')?.addEventListener('click',()=>{const t=document.getElementById('naverCanvas');const b=document.getElementById('naverSavePng');if(typeof html2canvas==='undefined'){alert('이미지 생성 기능을 불러오지 못했습니다.');return}const old=b.textContent;b.textContent='이미지 생성 중...';b.disabled=true;Promise.resolve(document.fonts?.ready).then(()=>html2canvas(t,{scale:2,backgroundColor:'#fff',useCORS:true,allowTaint:true,logging:false,imageTimeout:15000})).then(c=>c.toBlob(blob=>{if(!blob)throw new Error('blob');const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='naver_main.png';document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),1500);b.textContent=old;b.disabled=false},'image/png')).catch(err=>{console.error(err);alert('PNG 저장에 실패했습니다.');b.textContent=old;b.disabled=false;});});
})();
