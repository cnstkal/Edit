
(function(){
  const canvas=document.getElementById('naverCanvas'); if(!canvas)return;
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function activate(el, value){if(!el)return; const d=el.dataset.default; const changed=String(value??'')!==String(d??''); el.classList.toggle('nv-edited',changed);}
  ['nvSearch','nvBadge','nvAccountName','nvEmail','nvPoint1','nvPoint2','nvFeatureTitleInput','nvFeatureMetaInput','nvRightText','nvLongText'].forEach(id=>{
    const a=document.getElementById(id), b=document.getElementById(id.replace('Input','').replace('nvFeatureMetaInput','nvFeatureMeta')+'Out');
  });
  const map={nvSearch:'nvSearchOut',nvAccountName:'nvAccountNameOut',nvEmail:'nvEmailOut',nvFeatureTitleInput:'nvFeatureTitle',nvFeatureMetaInput:'nvFeatureMeta',nvRightText:'nvRightTextOut',nvLongText:'nvLongTextOut'};
  Object.entries(map).forEach(([aId,bId])=>{const a=document.getElementById(aId),b=document.getElementById(bId);if(!a||!b)return;const fn=()=>{b.textContent=a.value;activate(b,a.value)};fn();a.addEventListener('input',fn);});
  const oldImg=document.getElementById('nvFeatureImage'), up=document.getElementById('nvFeatureImageOverlay');
  oldImg?.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{up.src=ev.target.result;up.style.display='block';up.style.objectFit='cover';up.style.objectPosition='center';};r.readAsDataURL(f);});
  const logoInput=document.getElementById('nvPressLogoImage'), logoUp=document.getElementById('nvPressLogoImageOverlay');
  logoInput?.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{logoUp.src=ev.target.result;logoUp.style.display='block';logoUp.style.objectFit='cover';logoUp.style.objectPosition='center';};r.readAsDataURL(f);});
  // Make headline editor write into the exact screenshot location only when content is changed.
  const renderHeadlinesOriginal=window.renderHeadlines;
  const headlineBox=document.getElementById('nvHeadlinesOut');
  const inputs=document.querySelectorAll('#nvHeadlineList input[data-nvh]');
  function syncHeadlines(){if(!headlineBox)return; const vals=[...document.querySelectorAll('#nvHeadlineList input[data-nvh]')].map(x=>x.value); headlineBox.innerHTML=vals.map(esc).join('<br>'); const defaults=["a","b","c","d","e","f"]; const changed=vals.join('|')!==defaults.slice(0,vals.length).join('|'); headlineBox.classList.toggle('nv-edited',changed);}
  document.querySelectorAll('#nvHeadlineList input[data-nvh]').forEach(x=>x.addEventListener('input',syncHeadlines));
  syncHeadlines();
  const save=document.getElementById('naverSavePng');
  if(save){save.addEventListener('click',()=>{const old=save.textContent;save.textContent='이미지 생성 중...';save.disabled=true;html2canvas(canvas,{scale:1,backgroundColor:'#fff',useCORS:true,allowTaint:true,logging:false}).then(c=>c.toBlob(blob=>{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='naver_main.png';a.click();setTimeout(()=>URL.revokeObjectURL(u),1500);save.textContent=old;save.disabled=false},'image/png')).catch(()=>{alert('PNG 저장에 실패했습니다.');save.textContent=old;save.disabled=false;});});}
})();
