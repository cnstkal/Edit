
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


(function(){
  const TARGET_SELECTORS=[
    '[id$="Canvas"]', '[id$="canvas"]',
    '.naver-canvas','.naver-blog-canvas','.naver-search-canvas',
    '.google-canvas','.google-results-canvas','.instagram-canvas',
    '.instagram-story-canvas','.instagram-profile-canvas','.instagram-dm-canvas',
    '.kakao-canvas','.twitter-canvas','.youtube-canvas','.gpt-canvas',
    '.everytime-canvas','.windows-canvas','.tinder-canvas','.discord-canvas',
    '.notification-canvas','.netflix-canvas'
  ];
  function findTarget(panel){
    for(const sel of TARGET_SELECTORS){
      const el=panel.querySelector(sel);
      if(el) return el;
    }
    const candidates=panel.querySelectorAll('[class*="canvas"], [class*="preview"]');
    for(const el of candidates){
      if(el instanceof HTMLElement && el.offsetWidth>150 && el.offsetHeight>100) return el;
    }
    return null;
  }
  function setup(panel){
    if(panel.dataset.zoomReady) return;
    const target=findTarget(panel);
    if(!target) return;
    panel.dataset.zoomReady='1';
    target.classList.add('preview-zoom-target');
    const host=target.parentElement;
    if(host){host.classList.add('preview-zoom-host');}

    const bar=document.createElement('div');
    bar.className='preview-zoom-control';
    bar.innerHTML=`<label>프리뷰 크기</label><input type="range" min="10" max="200" step="5" value="100" aria-label="프리뷰 크기"><span class="preview-zoom-value">100%</span><button type="button" class="preview-zoom-reset">100%</button>`;
    const range=bar.querySelector('input'), value=bar.querySelector('.preview-zoom-value'), reset=bar.querySelector('.preview-zoom-reset');
    const apply=()=>{
      const z=Number(range.value)/100;
      /* CSS zoom은 실제 레이아웃 크기도 함께 조정하므로 확대했을 때 잘리는 대신 스크롤 가능 */
      target.style.zoom=String(z);
      value.textContent=range.value+'%';
    };
    range.addEventListener('input',apply);
    reset.addEventListener('click',()=>{range.value='100';apply();});
    const head=panel.querySelector('.preview-panel-head');
    if(head) head.insertAdjacentElement('afterend',bar);
    else panel.insertBefore(bar,panel.firstChild);

    /* 저장 결과에는 프리뷰 배율을 반영하지 않고 원래 크기로 저장 */
    panel.querySelectorAll('button[id$="SavePng"],button[id*="SavePng"],button[id$="savePngBtn"]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const old=target.style.zoom;
        if(old && old!=='1'){
          target.style.zoom='1';
          setTimeout(()=>{target.style.zoom=old;},50);
        }
      },true);
    });
  }
  function scan(){document.querySelectorAll('.app .preview-panel').forEach(setup);}
  scan();
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
})();


(function(){
 const q=id=>document.getElementById(id), c=q('naverCanvas'), panel=document.querySelector('#naverApp .naver-settings');
 if(!c||!panel)return;
 const fixed={
  nvSearchOut:{left:591,top:133,fontSize:28},
  nvAccountNameOut:{left:1517,top:390,fontSize:22,fontWeight:700,letterSpacing:-0.5},
  nvEmailOut:{left:1517,top:428},
  nvHeadlinesOut:{left:684,top:593,fontSize:25,fontWeight:430,letterSpacing:-2,lineHeight:2},
  nvFeatureTitle:{left:345,top:821,fontSize:22,fontWeight:520,letterSpacing:-0.5,lineHeight:1.35},
  nvFeatureMeta:{left:401,top:552,fontSize:22,fontWeight:400,letterSpacing:-1}
 };
 const applyFixed=(id,st)=>{const e=q(id);if(!e)return; for(const [k,v] of Object.entries(st)) e.style.setProperty(k, typeof v==='number' && ['left','top','fontSize'].includes(k)?v+'px':typeof v==='number'&&k==='letterSpacing'?v+'px':k==='fontWeight'?String(v):k==='lineHeight'?String(v):String(v),'important'); e.classList.add('nv-fixed-text');};
 Object.entries(fixed).forEach(([id,st])=>applyFixed(id,st));
 // 내용 입력은 그대로 가능. 위치/스타일만 다시 고정.
 const contentMap={nvSearch:'nvSearchOut',nvAccountName:'nvAccountNameOut',nvEmail:'nvEmailOut',nvFeatureTitleInput:'nvFeatureTitle',nvFeatureMetaInput:'nvFeatureMeta'};
 Object.entries(contentMap).forEach(([iid,oid])=>{const a=q(iid),b=q(oid);if(!a||!b)return; const sync=()=>{b.textContent=a.value;applyFixed(oid,fixed[oid]);}; a.addEventListener('input',sync); sync();});
 // 뉴스 제목 렌더링/입력 스크립트가 다시 그려도 위치는 즉시 복원.
 const restore=()=>Object.entries(fixed).forEach(([id,st])=>applyFixed(id,st));
 const mo=new MutationObserver(()=>{if(!window.__nvRestoring){window.__nvRestoring=true;restore();window.__nvRestoring=false;}});
 Object.keys(fixed).forEach(id=>{const e=q(id);if(e)mo.observe(e,{attributes:true,attributeFilter:['style','class']});});
 // 직접 편집 패널을 하나만 유지하고, 고정 요소는 목록에서 완전히 제외.
 const editors=panel.querySelectorAll('.nv-single-editor');
 editors.forEach((e,i)=>{if(i>0)e.remove();});
 const box=q('nvDirectEditorFinal');
 if(box){
   const sel=q('nvFinalTarget');
   if(sel){
     const fixedIds=new Set(Object.keys(fixed));
     [...sel.options].forEach(o=>{if(fixedIds.has(o.value))o.remove();});
     // 허용 대상만 유지
     const allowed=new Set(['nvRightTextOut','nvNewsbarMiddle','nvPressEditable1','nvPressEditable2','nvPressEditable3','nvPressEditable4','nvSubscribedOverlay','nvOtherNewsOverlay']);
     [...sel.options].forEach(o=>{if(o.value && !allowed.has(o.value))o.remove();});
   }
   // 패널 안내문을 명확히 변경
   const help=box.querySelector('.nv-f-help'); if(help)help.textContent='오른쪽 패널에서 선택한 항목만 위치와 스타일을 수정할 수 있습니다. 프로필/검색어/이메일/대표뉴스/뉴스목록/기사 날짜·출처는 고정입니다.';
 }
 // 구독언론사 옆 문구: 실제 화면에 보이게 하고 입력과 강제 연결.
 const mid=q('nvNewsbarMiddle'), midIn=q('nvNewsbarMiddleInput');
 if(mid){mid.classList.remove('nv-fixed-text');mid.style.setProperty('display','block','important');mid.style.setProperty('position','absolute','important');mid.style.setProperty('left','285px','important');mid.style.setProperty('top','465px','important');mid.style.setProperty('z-index','40','important');mid.style.setProperty('pointer-events','none','important');mid.style.setProperty('white-space','nowrap','important');}
 if(mid&&midIn){const sync=()=>{mid.textContent=midIn.value;mid.classList.remove('nv-fixed-text');mid.style.setProperty('display','block','important');};midIn.addEventListener('input',sync);sync();}
 // 언론사 이름 4개: 기존 숨김 fixed span 대신 별도 overlay를 사용.
 let layer=q('nvPressEditableLayer');
 if(!layer){layer=document.createElement('div');layer.id='nvPressEditableLayer';c.appendChild(layer);}
 layer.style.cssText='position:absolute;inset:0;z-index:40;pointer-events:none;';
 for(let i=1;i<=4;i++){
   let out=q('nvPressEditable'+i);if(!out){out=document.createElement('div');out.id='nvPressEditable'+i;layer.appendChild(out);}
   const inp=q('nvPressName'+i),xi=q('nvPressName'+i+'X'),yi=q('nvPressName'+i+'Y');
   const sync=()=>{
     out.textContent=inp?.value||'';
     out.style.cssText='position:absolute;display:block!important;left:'+(Number(xi?.value)||115)+'px;top:'+(Number(yi?.value)||570+(i-1)*57)+'px;width:150px;height:42px;box-sizing:border-box;padding:7px 12px;background:'+(i===4?'#4a58e8':'#fff')+';color:'+(i===4?'#fff':'#111')+';font-family:Pretendard,sans-serif;font-size:22px;font-weight:400;line-height:28px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none;z-index:40;';
   };
   [inp,xi,yi].forEach(e=>e?.addEventListener('input',sync));sync();
 }
 // 드롭다운에 동적으로 다시 추가되는 경우도 고정 요소는 제거하고 허용 항목만 남긴다.
 setTimeout(()=>{
   const sel=q('nvFinalTarget');if(!sel)return;
   const fixedIds=new Set(Object.keys(fixed)); const allowed=new Set(['nvRightTextOut','nvNewsbarMiddle','nvPressEditable1','nvPressEditable2','nvPressEditable3','nvPressEditable4','nvSubscribedOverlay','nvOtherNewsOverlay']);
   [...sel.options].forEach(o=>{if(fixedIds.has(o.value)||(!allowed.has(o.value)&&o.value))o.remove();});
 },0);
})();


(function(){
  const canvas=document.getElementById('naverCanvas');
  if(!canvas)return;
  const panel=document.querySelector('.naver-settings');
  if(!panel)return;

  const tools=document.createElement('div');
  tools.className='nv-guide-tools';
  tools.innerHTML=`<strong>줄자</strong>
    <label><input type="checkbox" id="nvRulerToggle"> 줄자 표시</label>
    <label>간격 <input id="nvGridSize" type="range" min="5" max="200" step="5" value="50"><output id="nvGridSizeVal">50px</output></label>`;
  panel.insertBefore(tools,panel.firstChild);

  const wrap=document.createElement('div');
  wrap.className='nv-ruler-wrap';
  wrap.innerHTML='<div class="nv-ruler-top"></div><div class="nv-ruler-left"></div><div class="nv-ruler-corner"></div>';
  canvas.appendChild(wrap);

  const rulerToggle=tools.querySelector('#nvRulerToggle');
  const size=tools.querySelector('#nvGridSize'), sizeVal=tools.querySelector('#nvGridSizeVal');

  function drawLabels(){
    const top=wrap.querySelector('.nv-ruler-top'), left=wrap.querySelector('.nv-ruler-left');
    top.querySelectorAll('.nv-ruler-label').forEach(x=>x.remove());
    left.querySelectorAll('.nv-ruler-label').forEach(x=>x.remove());
    const step=Math.max(5,Number(size.value)||50);
    for(let x=0;x<=2048;x+=step){
      const n=document.createElement('span'); n.className='nv-ruler-label'; n.textContent=x;
      n.style.left=(x+2)+'px'; n.style.top='5px'; top.appendChild(n);
    }
    for(let y=0;y<=1151;y+=step){
      const n=document.createElement('span'); n.className='nv-ruler-label'; n.textContent=y;
      n.style.left='4px'; n.style.top=(y+24)+'px'; left.appendChild(n);
    }
  }
  function update(){
    const s=Math.max(5,Number(size.value)||50);
    canvas.style.setProperty('--nv-grid-size',s+'px');
    canvas.classList.toggle('nv-show-ruler',rulerToggle.checked);
    sizeVal.textContent=s+'px';
    drawLabels();
  }
  rulerToggle.addEventListener('change',update);
  size.addEventListener('input',update);
  update();
})();


(function(){
  const canvas=document.getElementById('naverCanvas');
  if(!canvas || canvas.dataset.guideDragReady)return;
  canvas.dataset.guideDragReady='1';
  const wrap=canvas.querySelector('.nv-ruler-wrap');
  if(!wrap)return;

  // 가이드 전용 레이어를 줄자보다 아래, 실제 콘텐츠보다 위에 둔다.
  const layer=document.createElement('div');
  layer.className='nv-guide-layer';
  layer.style.cssText='position:absolute;inset:0;z-index:9975;pointer-events:none;';
  canvas.appendChild(layer);

  let guides=[];
  let drag=null;
  let guideId=0;

  const point=e=>{
    const r=canvas.getBoundingClientRect();
    return {
      x:(e.clientX-r.left)*(canvas.offsetWidth/r.width),
      y:(e.clientY-r.top)*(canvas.offsetHeight/r.height)
    };
  };
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

  function makeGuide(type,pos){
    const el=document.createElement('div');
    el.className='nv-guide-line '+type;
    el.dataset.guideId=String(++guideId);
    el.style.display='block';
    el.style.pointerEvents='auto';
    if(type==='h')el.style.top=clamp(pos,0,1151)+'px';
    else el.style.left=clamp(pos,0,2048)+'px';
    layer.appendChild(el);
    const g={id:guideId,type,el};
    guides.push(g);
    bindGuide(g);
    return g;
  }

  function bindGuide(g){
    g.el.addEventListener('pointerdown',e=>{
      if(!canvas.classList.contains('nv-show-ruler'))return;
      e.preventDefault();e.stopPropagation();
      const p=point(e);
      drag={kind:'guide',guide:g,offset:g.type==='h'?(p.y-(parseFloat(g.el.style.top)||0)):(p.x-(parseFloat(g.el.style.left)||0))};
      g.el.classList.add('nv-guide-dragging');
      try{g.el.setPointerCapture(e.pointerId);}catch(_){ }
    });
    g.el.addEventListener('dblclick',e=>{
      e.preventDefault();e.stopPropagation();
      g.el.remove();guides=guides.filter(x=>x!==g);
    });
  }

  function startFromRuler(e,type){
    if(!canvas.classList.contains('nv-show-ruler'))return;
    e.preventDefault();e.stopPropagation();
    const p=point(e);
    const pos=type==='h'?clamp(p.y,0,1151):clamp(p.x,0,2048);
    const g=makeGuide(type,pos);
    drag={kind:'guide',guide:g,offset:0,pointerId:e.pointerId};
    g.el.classList.add('nv-guide-dragging');
  }

  const top=wrap.querySelector('.nv-ruler-top');
  const left=wrap.querySelector('.nv-ruler-left');
  const corner=wrap.querySelector('.nv-ruler-corner');
  top?.addEventListener('pointerdown',e=>startFromRuler(e,'h'));
  left?.addEventListener('pointerdown',e=>startFromRuler(e,'v'));
  // 모서리에서 끌면 직관적으로 가로 가이드가 만들어지도록 한다.
  corner?.addEventListener('pointerdown',e=>startFromRuler(e,'h'));

  window.addEventListener('pointermove',e=>{
    if(!drag || drag.kind!=='guide')return;
    const g=drag.guide,p=point(e);
    if(g.type==='h')g.el.style.top=clamp(p.y-drag.offset,0,1151)+'px';
    else g.el.style.left=clamp(p.x-drag.offset,0,2048)+'px';
  },true);

  window.addEventListener('pointerup',e=>{
    if(!drag || drag.kind!=='guide')return;
    const g=drag.guide;
    g.el.classList.remove('nv-guide-dragging');
    const p=point(e);
    // 줄자 밖으로 완전히 끌어내리면 가이드를 삭제할 수 있게 한다.
    if(e.clientX<canvas.getBoundingClientRect().left-20 || e.clientX>canvas.getBoundingClientRect().right+20 ||
       e.clientY<canvas.getBoundingClientRect().top-20 || e.clientY>canvas.getBoundingClientRect().bottom+20){
      g.el.remove();guides=guides.filter(x=>x!==g);
    }
    drag=null;
  },true);

  // 줄자 토글이 꺼져 있으면 가이드도 작업 화면에서 숨기지만 삭제하지 않는다.
  const rulerToggle=document.getElementById('nvRulerToggle');
  rulerToggle?.addEventListener('change',()=>{
    layer.style.display=rulerToggle.checked?'block':'none';
  });
  layer.style.display=rulerToggle?.checked?'block':'none';
})();


(function(){
  const c=document.getElementById('naverCanvas');
  if(!c)return;
  const q=id=>document.getElementById(id);
  const fixedIds=['nvNewsSection','nvCat1','nvCat2','nvCat3','nvCat4','nvCat5','nvNewsbarLeft','nvNewsbarMiddle','nvNewsbarRight','nvPressSub','nvNaverId','nvLogoutText',
    'nvService1','nvService2','nvService3','nvService4','nvService5','nvService6','nvService7','nvService8','nvService9','nvService10','nvService11',
    'nvMenu1','nvMenu2','nvMenu3','nvMenu4','nvPress1','nvPress2','nvPress3','nvBadgeOut','nvPoint1Out','nvPoint2Out','nvPointMiddle'];
  fixedIds.forEach(id=>{const el=q(id);if(el)el.classList.add('nv-fixed-text');});
  // 프로필 이름 / 이메일 고정 좌표
  const profile=q('nvAccountNameOut'), email=q('nvEmailOut');
  if(profile){profile.style.left='1517px';profile.style.top='387px';profile.style.fontSize='22px';profile.style.fontWeight='700';profile.style.letterSpacing='-0.5px';}
  if(email){email.style.left='1517px';email.style.top='428px';email.style.fontSize='19px';email.style.fontWeight='400';}
  // 오른쪽 카드: 하나의 본문만 사용하고 기본값은 빈 문자열
  const right=q('nvRightTextOut'), rightInput=q('nvRightText');
  const oldLong=q('nvLongTextOut');
  if(oldLong) oldLong.remove();
  if(right){
    right.textContent=rightInput ? rightInput.value : '';
    right.style.left='1500px'; right.style.top='795px'; right.style.width='400px';
    right.style.textAlign='center'; right.style.whiteSpace='pre-wrap';
    right.style.overflow='visible';
  }
  if(rightInput){
    rightInput.value='';
    rightInput.addEventListener('input',()=>{ if(right) right.textContent=rightInput.value; });
  }
  // 제목 input/output duplicate 문제를 제거한 뒤 직접 연결
  const titleIn=q('nvFeatureTitleInput'), titleOut=q('nvFeatureTitle');
  if(titleIn && titleOut){
    const sync=()=>{titleOut.textContent=titleIn.value; titleOut.classList.toggle('nv-edited',titleIn.value!==titleOut.dataset.default);};
    sync(); titleIn.addEventListener('input',sync);
  }
  // 뉴스 제목: 입력한 줄바꿈만 유지하고 자동 줄바꿈은 금지
  const headlineBox=q('nvHeadlinesOut');
  function syncHeadlines(){
    if(!headlineBox)return;
    const vals=[...document.querySelectorAll('#nvHeadlineList input[data-nvh]')].map(x=>x.value);
    headlineBox.innerHTML=vals.map(v=>String(v).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))).join('<br>');
  }
  document.querySelectorAll('#nvHeadlineList input[data-nvh]').forEach(x=>x.addEventListener('input',syncHeadlines));
  syncHeadlines();
  // 모든 네이버 메인 텍스트를 Pretendard로 강제
  c.querySelectorAll('*').forEach(el=>el.style.fontFamily="'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif");
})();


(function(){
 const q=id=>document.getElementById(id);
 const set=(id,props)=>{const e=q(id);if(!e)return;Object.assign(e.style,props);};
 // 값/스타일 고정
 const search=q('nvSearch'); if(search){search.value=search.value||'박성화';}
 const meta=q('nvFeatureMetaInput'); if(meta){meta.value=meta.value||'2월 24일 9:30 직접 편집';}
 const hs=q('nvHeadlineSize'), hw=q('nvHeadlineWeight'); if(hs)hs.value='25'; if(hw)hw.value='400';
 const ms=q('nvFeatureMetaInput');
 set('nvSearchOut',{left:'591px',top:'130px',fontSize:'28px',letterSpacing:'-0.5px',fontWeight:'490'});
 set('nvFeatureMeta',{left:'398px',top:'559px',fontSize:'22px',fontWeight:'400',letterSpacing:'-0.5px',width:'max-content'});
 set('nvHeadlinesOut',{left:'668px',top:'590px',fontSize:'25px',fontWeight:'430',letterSpacing:'-0.5px',color:'#000',width:'max-content',maxWidth:'none',whiteSpace:'pre',lineHeight:'1.85'});
 set('nvFeatureTitle',{whiteSpace:'pre-wrap',width:'310px',maxWidth:'310px',wordBreak:'keep-all',overflowWrap:'normal',lineHeight:'1.45'});
 // 대표뉴스 제목은 입력한 줄바꿈을 그대로 허용
 const titleIn=q('nvFeatureTitleInput'),titleOut=q('nvFeatureTitle');
 if(titleIn&&titleOut){const sync=()=>{titleOut.textContent=titleIn.value;};sync();titleIn.addEventListener('input',sync);}
 // 대표 기사 날짜/출처
 if(meta){const out=q('nvFeatureMeta');const sync=()=>{if(out)out.textContent=meta.value;};sync();meta.addEventListener('input',sync);}
 // 뉴스 제목 목록 좌표/스타일이 기존 스타일 설정에 의해 바뀌어도 최종값 유지
 const headlineOut=q('nvHeadlinesOut');
 ['input','change'].forEach(ev=>{q('nvHeadlineSize')?.addEventListener(ev,()=>set('nvHeadlinesOut',{fontSize:'25px'}));q('nvHeadlineWeight')?.addEventListener(ev,()=>set('nvHeadlinesOut',{fontWeight:'430'}));});
 // 언론사 이름 4개: 배경 이미지에 박힌 기존 이름을 덮고 입력값을 표시
 const wrap=q('naverCanvas');
 if(wrap){
   let pressLayer=q('nvPressEditableLayer');
   if(!pressLayer){
     pressLayer=document.createElement('div');pressLayer.id='nvPressEditableLayer';
     pressLayer.style.cssText='position:absolute;inset:0;z-index:20;pointer-events:none;';wrap.appendChild(pressLayer);
   }
   const defs=[
     ['nvPressName1','nvPressEditable1',115,570,false],
     ['nvPressName2','nvPressEditable2',115,627,false],
     ['nvPressName3','nvPressEditable3',115,684,false],
     ['nvPressName4','nvPressEditable4',115,741,true]
   ];
   defs.forEach(([inId,outId,left,top,selected])=>{
     let el=q(outId);
     if(!el){el=document.createElement('div');el.id=outId;pressLayer.appendChild(el);}
     el.style.cssText=`position:absolute;left:${left}px;top:${top}px;width:150px;height:40px;box-sizing:border-box;padding:7px 12px;pointer-events:none;font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:22px;font-weight:400;line-height:26px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left;color:${selected?'#fff':'#111'};background:${selected?'#4a58e8':'#fff'};`;
     const inp=q(inId); if(inp){const sync=()=>el.textContent=inp.value;sync();inp.addEventListener('input',sync);}
   });
 }
 // 구독중 N / 다른 언론사 뉴스 N/N: 숫자만 편집 가능, 나머지는 고정
 const subIn=q('nvSubscribedCount'), otherIn=q('nvOtherNewsCount');
 const sub=q('nvPressSub'), footer=q('nvFooterMore');
 function updateNumbers(){
   if(sub){sub.textContent='구독중 '+(subIn?.value||'8')+'　⚙';}
   if(footer){footer.textContent='더보기 '+(otherIn?.value||'7')+'/8';}
 }
 updateNumbers(); subIn?.addEventListener('input',updateNumbers); otherIn?.addEventListener('input',updateNumbers);
 // 해당 숫자 외의 문구는 직접편집에서 고정
 if(sub)sub.classList.add('nv-fixed-text'); if(footer)footer.classList.add('nv-fixed-text');
 // 기존 직접편집 선택기가 고정 텍스트를 선택하지 못하게 방어
 wrap?.addEventListener('pointerdown',e=>{if(e.target.closest('#nvPressEditableLayer')){e.stopPropagation();}},true);
})();


(function(){
 const q=id=>document.getElementById(id), c=q('naverCanvas'); if(!c)return;
 // 숫자만 바꿀 수 있는 구독중 N / 다른 언론사 뉴스 더보기 N/N
 const subIn=q('nvSubscribedCount'), curIn=q('nvOtherNewsCount'), totalIn=q('nvOtherNewsTotal');
 const subX=q('nvSubscribedX'), subY=q('nvSubscribedY'), otherX=q('nvOtherNewsX'), otherY=q('nvOtherNewsY');
 let layer=q('nvNOnlyLayer');
 if(!layer){layer=document.createElement('div');layer.id='nvNOnlyLayer';layer.style.cssText='position:absolute;inset:0;z-index:25;pointer-events:none;';c.appendChild(layer);}
 function make(id,html,left,top,width,height){let e=q(id);if(!e){e=document.createElement('div');e.id=id;layer.appendChild(e);}e.innerHTML=html;e.style.cssText=`position:absolute;left:${left}px;top:${top}px;width:${width}px;height:${height}px;box-sizing:border-box;pointer-events:none;font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;`;return e;}
 function update(){
   const sub=String(subIn?.value??'8'), cur=String(curIn?.value??'7'), total=String(totalIn?.value??'8');
   // 원본의 '구독중 8' 부분만 깔끔하게 덮어쓴다. 오른쪽 톱니는 그대로 둔다.
   const a=make('nvSubscribedOverlay','구독중 <b>'+sub+'</b>',Number(subX?.value||115),Number(subY?.value||835),120,42);
   a.style.padding='7px 0';a.style.background='#fff';a.style.fontSize='22px';a.style.lineHeight='28px';a.style.color='#999';a.style.textAlign='center';a.style.whiteSpace='nowrap';
   a.querySelector('b').style.color='#3f5fe8';a.querySelector('b').style.fontWeight='700';
   // 하단의 '다른 언론사 뉴스 더보기 N/N'을 한 덩어리로 재현하되 숫자만 입력값을 사용한다.
   const b=make('nvOtherNewsOverlay','<span class="blue">다른 언론사 뉴스</span> <span class="black">더보기</span> <span class="nums">'+cur+'/'+total+'</span>',Number(otherX?.value||580),Number(otherY?.value||945),315,45);
   b.style.padding='8px 0';b.style.background='#fff';b.style.fontSize='20px';b.style.lineHeight='29px';b.style.whiteSpace='nowrap';b.style.textAlign='center';
   b.querySelector('.blue').style.color='#1675e8';b.querySelector('.black').style.color='#111';b.querySelector('.nums').style.color='#111';
 }
 update();
 [subIn,curIn,totalIn,subX,subY,otherX,otherY].forEach(x=>x?.addEventListener('input',update));
 // 숫자 이외의 고정 문구는 직접 편집으로 선택/이동되지 않게 한다.
 q('nvPressSub')?.classList.add('nv-fixed-text');q('nvFooterMore')?.classList.add('nv-fixed-text');
 // 검색어/메타/뉴스 목록 최종값 재확인
 const set=(id,props)=>{const e=q(id);if(e)Object.assign(e.style,props);};
 set('nvSearchOut',{left:'591px',top:'130px',fontSize:'28px',letterSpacing:'-0.5px',fontWeight:'490'});
 set('nvFeatureMeta',{left:'398px',top:'559px',fontSize:'22px',fontWeight:'400',letterSpacing:'-0.5px',width:'max-content'});
 set('nvHeadlinesOut',{left:'668px',top:'590px',fontSize:'25px',fontWeight:'430',letterSpacing:'-0.5px',color:'#000',width:'max-content',maxWidth:'none',whiteSpace:'pre',lineHeight:'1.85'});
})();


(function(){
  const c=document.getElementById('naverCanvas');
  const wrap=c?.closest('.naver-preview-wrap');
  if(!c||!wrap)return;
  const q=id=>document.getElementById(id);

  /* 격자 UI를 제거한다. 기존 줄자 스크립트의 내부 로직은 건드리지 않고
     만들어진 컨트롤만 제거해 기존 페이지의 다른 기능에는 영향이 없게 한다. */
  const guideTools=document.querySelector('.nv-guide-tools');
  if(guideTools){
    guideTools.querySelectorAll('label').forEach(label=>{
      if(label.textContent.includes('격자 표시')||label.textContent.includes('간격')||label.textContent.includes('투명도'))label.remove();
    });
    const title=guideTools.querySelector('strong');
    if(title)title.textContent='줄자';
  }
  c.classList.remove('nv-show-grid');

  /* 줄자 DOM을 캔버스 밖 프리뷰 viewport로 옮긴다.
     이렇게 해야 CSS zoom이 줄자 자체에 적용되지 않고 확대해도 화면 위에 남는다. */
  const ruler=c.querySelector('.nv-ruler-wrap');
  if(ruler){
    if(!ruler.classList.contains('nv-floating-ruler')){
      wrap.insertBefore(ruler,wrap.firstChild);
      ruler.classList.add('nv-floating-ruler');
    }
    const toggle=q('nvRulerToggle');
    const sync=()=>{
      const on=!!toggle?.checked;
      ruler.style.display=on?'block':'none';
      c.classList.toggle('nv-show-ruler',on);
    };
    sync();
    toggle?.addEventListener('change',sync);
    /* 기존 스크립트가 class만 바꾸는 경우에도 표시 상태를 따라간다. */
    new MutationObserver(()=>{
      ruler.style.display=c.classList.contains('nv-show-ruler')?'block':'none';
    }).observe(c,{attributes:true,attributeFilter:['class']});
  }

  /* 줄간격 설정값을 프리뷰에 연결 */
  const bindLH=(inputId,targetId,defaultValue)=>{
    const input=q(inputId), target=q(targetId);
    if(!input||!target)return;
    const sync=()=>{
      let v=parseFloat(input.value);
      if(!Number.isFinite(v))v=defaultValue;
      v=Math.max(.8,Math.min(3,v));
      target.style.lineHeight=String(v);
      target.style.setProperty('--nv-'+inputId.replace(/^nv/,'').replace(/LineHeight$/,'').toLowerCase()+'-line-height',String(v));
    };
    sync();input.addEventListener('input',sync);input.addEventListener('change',sync);
  };
  bindLH('nvFeatureLineHeight','nvFeatureTitle',1.45);
  bindLH('nvHeadlineLineHeight','nvHeadlinesOut',1.85);
  bindLH('nvRightLineHeight','nvRightTextOut',1.5);

  /* 직접 편집 선택 패널의 줄간격 컨트롤은 HTML에 이미 포함되어 있다. */
  const lh=q('nvSelectedLineHeight'), lhv=q('nvSelectedLineHeightVal');
  if(lh){
    const updateSelected=()=>{
      const el=document.querySelector('#naverCanvas .nv-edit-overlay.nv-selected');
      if(!el)return;
      const cs=getComputedStyle(el);
      let v=parseFloat(cs.lineHeight), fs=parseFloat(cs.fontSize)||16;
      if(!Number.isFinite(v))v=1.5;
      else if(v>6)v=v/fs;
      v=Math.max(.8,Math.min(3,v));
      lh.value=v; if(lhv)lhv.textContent=(Math.round(v*100)/100).toString();
    };
    lh.addEventListener('input',()=>{
      const el=document.querySelector('#naverCanvas .nv-edit-overlay.nv-selected');
      if(!el)return;
      el.style.lineHeight=String(lh.value);
      el.classList.add('nv-edited');
      if(lhv)lhv.textContent=(Math.round(Number(lh.value)*100)/100).toString();
    });
    /* 선택 패널의 기존 좌표/크기/두께/자간 갱신이 끝난 뒤 줄간격도 갱신 */
    wrap.addEventListener('click',()=>setTimeout(updateSelected,0),true);
  }

  /* 기존 저장 시 줄자/편집용 요소가 PNG에 섞이지 않도록 줄자는 캔버스 밖에 둔다. */
})();


(function(){
  const canvas=document.getElementById('naverCanvas');
  const panel=document.querySelector('#naverApp .naver-settings');
  if(!canvas||!panel)return;

  /* 혹시 이전 버전이 동적으로 남아 있을 경우 제거 */
  panel.querySelectorAll('.nv-edit-toggle,.nv-coord-panel,.nv-direct-editor-recovery').forEach(el=>el.remove());

  const box=document.createElement('div');
  box.id='nvDirectEditorSingle';
  box.className='nv-single-editor';
  box.innerHTML=`
    <h3>프리뷰에서 글자 직접 편집</h3>
    <div class="nv-se-row"><button type="button" id="nvSingleToggle" class="active">편집모드 켜짐</button><span class="nv-single-help">글자를 클릭하면 선택됩니다. 선택한 글자를 드래그하면 이동하고, 초록 점을 드래그하면 크기가 바뀝니다.</span></div>
    <div class="nv-se-row"><strong id="nvSingleName">선택한 글자 없음</strong></div>
    <div class="nv-se-row">
      <label>X <input id="nvSingleX" type="number" step="1"></label>
      <label>Y <input id="nvSingleY" type="number" step="1"></label>
      <label>크기 <input id="nvSingleSize" type="number" min="1" step="1"> px</label>
      <button type="button" id="nvSingleApply">적용</button>
      <button type="button" id="nvSingleUp">↑</button><button type="button" id="nvSingleDown">↓</button><button type="button" id="nvSingleLeft">←</button><button type="button" id="nvSingleRight">→</button>
    </div>
    <div class="nv-se-row">
      <label>두께 <input id="nvSingleWeight" type="range" min="100" max="900" step="10" value="400"><output id="nvSingleWeightVal">400</output></label>
      <label>자간 <input id="nvSingleSpacing" type="range" min="-10" max="30" step="0.1" value="0"><output id="nvSingleSpacingVal">0px</output></label>
      <label>줄간격 <input id="nvSingleLineHeight" type="range" min="0.8" max="3" step="0.05" value="1.5"><output id="nvSingleLineHeightVal">1.5</output></label>
    </div>`;
  panel.insertBefore(box,panel.firstElementChild);

  const $=id=>document.getElementById(id);
  let editing=true, selected=null, drag=null;
  canvas.classList.add('nv-direct-single');

  const visible=el=>{
    if(!el||el.classList.contains('nv-fixed-text'))return false;
    const s=getComputedStyle(el); return s.display!=='none'&&s.visibility!=='hidden';
  };
  const overlays=()=>[...canvas.querySelectorAll('.nv-edit-overlay')].filter(visible);
  const pos=el=>({x:parseFloat(el.style.left)||0,y:parseFloat(el.style.top)||0});
  const scale=()=>{
    const r=canvas.getBoundingClientRect();
    return {x:canvas.offsetWidth/r.width,y:canvas.offsetHeight/r.height};
  };
  const point=e=>{const r=canvas.getBoundingClientRect(),sc=scale();return {x:(e.clientX-r.left)*sc.x,y:(e.clientY-r.top)*sc.y};};
  function panelSync(el){
    if(!el)return;
    const cs=getComputedStyle(el), fs=parseFloat(cs.fontSize)||16, wt=parseFloat(cs.fontWeight)||400;
    let sp=parseFloat(cs.letterSpacing); if(!Number.isFinite(sp))sp=0;
    let lh=parseFloat(cs.lineHeight); if(!Number.isFinite(lh))lh=1.5; else if(lh>6)lh/=fs;
    const p=pos(el);
    $('nvSingleName').textContent=el.id||'텍스트';
    $('nvSingleX').value=Math.round(p.x); $('nvSingleY').value=Math.round(p.y); $('nvSingleSize').value=Math.round(fs);
    $('nvSingleWeight').value=Math.max(100,Math.min(900,wt)); $('nvSingleWeightVal').textContent=Math.round(wt);
    $('nvSingleSpacing').value=Math.max(-10,Math.min(30,sp)); $('nvSingleSpacingVal').textContent=(Math.round(sp*10)/10)+'px';
    $('nvSingleLineHeight').value=Math.max(.8,Math.min(3,lh)); $('nvSingleLineHeightVal').textContent=(Math.round(Math.max(.8,Math.min(3,lh))*100)/100);
  }
  function handle(el){
    let h=el.querySelector(':scope > .nv-single-handle');
    if(!h){h=document.createElement('span');h.className='nv-single-handle';h.setAttribute('aria-hidden','true');el.appendChild(h);}
    return h;
  }
  function select(el){
    if(!visible(el))return;
    overlays().forEach(x=>x.classList.remove('nv-single-selected'));
    selected=el; el.classList.add('nv-single-selected'); handle(el); panelSync(el);
  }
  function hit(e){
    /* pointer-events/overlap에 의존하지 않고 실제 화면상의 bounding box로 찾는다. */
    const candidates=overlays().map(el=>({el,r:el.getBoundingClientRect()})).filter(o=>
      e.clientX>=o.r.left && e.clientX<=o.r.right && e.clientY>=o.r.top && e.clientY<=o.r.bottom
    );
    candidates.sort((a,b)=>{
      const za=parseInt(getComputedStyle(a.el).zIndex)||0, zb=parseInt(getComputedStyle(b.el).zIndex)||0;
      return zb-za;
    });
    return candidates[0]?.el||null;
  }
  function startMove(el,e){
    const p=point(e), xy=pos(el);
    drag={type:'move',el,startX:p.x,startY:p.y,startLeft:xy.x,startTop:xy.y};
  }
  function startResize(el,e){
    const p=point(e), fs=parseFloat(getComputedStyle(el).fontSize)||16;
    drag={type:'resize',el,startX:p.x,startY:p.y,startSize:fs};
  }

  canvas.addEventListener('pointerdown',e=>{
    if(!editing)return;
    const handleEl=e.target.closest?.('.nv-single-handle');
    const el=handleEl?.parentElement || hit(e);
    if(!el||!visible(el))return;
    e.preventDefault(); e.stopPropagation();
    select(el);
    if(handleEl) startResize(el,e); else startMove(el,e);
    try{canvas.setPointerCapture(e.pointerId)}catch(_){ }
  },true);

  canvas.addEventListener('pointermove',e=>{
    if(!drag||!editing)return;
    e.preventDefault();
    const p=point(e),d=drag;
    if(d.type==='move'){
      d.el.style.left=Math.round(d.startLeft+p.x-d.startX)+'px';
      d.el.style.top=Math.round(d.startTop+p.y-d.startY)+'px';
    }else{
      const delta=(p.y-d.startY);
      const size=Math.max(6,Math.min(120,d.startSize*(1+delta/120)));
      d.el.style.fontSize=size.toFixed(1)+'px';
    }
    d.el.classList.add('nv-edited'); panelSync(d.el);
  },true);
  canvas.addEventListener('pointerup',()=>{drag=null;},true);
  canvas.addEventListener('pointercancel',()=>{drag=null;},true);

  $('nvSingleToggle').addEventListener('click',()=>{
    editing=!editing; canvas.classList.toggle('nv-direct-single',editing);
    $('nvSingleToggle').classList.toggle('active',editing);
    $('nvSingleToggle').textContent=editing?'편집모드 켜짐':'편집모드 꺼짐';
  });
  function apply(){
    if(!selected)return;
    const x=parseFloat($('nvSingleX').value),y=parseFloat($('nvSingleY').value),z=parseFloat($('nvSingleSize').value);
    if(Number.isFinite(x))selected.style.left=Math.round(x)+'px';
    if(Number.isFinite(y))selected.style.top=Math.round(y)+'px';
    if(Number.isFinite(z))selected.style.fontSize=Math.max(1,z)+'px';
    selected.classList.add('nv-edited');panelSync(selected);
  }
  $('nvSingleApply').addEventListener('click',apply);
  ['nvSingleX','nvSingleY','nvSingleSize'].forEach(id=>$(id).addEventListener('change',apply));
  const move=(dx,dy)=>{if(!selected)return;selected.style.left=((parseFloat(selected.style.left)||0)+dx)+'px';selected.style.top=((parseFloat(selected.style.top)||0)+dy)+'px';selected.classList.add('nv-edited');panelSync(selected);};
  $('nvSingleUp').addEventListener('click',()=>move(0,-1)); $('nvSingleDown').addEventListener('click',()=>move(0,1)); $('nvSingleLeft').addEventListener('click',()=>move(-1,0)); $('nvSingleRight').addEventListener('click',()=>move(1,0));
  $('nvSingleWeight').addEventListener('input',e=>{if(!selected)return;selected.style.fontWeight=e.target.value;selected.classList.add('nv-edited');$('nvSingleWeightVal').textContent=e.target.value;});
  $('nvSingleSpacing').addEventListener('input',e=>{if(!selected)return;selected.style.letterSpacing=e.target.value+'px';selected.classList.add('nv-edited');$('nvSingleSpacingVal').textContent=(Math.round(Number(e.target.value)*10)/10)+'px';});
  $('nvSingleLineHeight').addEventListener('input',e=>{if(!selected)return;selected.style.lineHeight=e.target.value;selected.classList.add('nv-edited');$('nvSingleLineHeightVal').textContent=(Math.round(Number(e.target.value)*100)/100);});
})();


(function(){
  const canvas=document.getElementById('naverCanvas');
  const panel=document.querySelector('#naverApp .naver-settings');
  if(!canvas||!panel)return;

  /* 이전 버전의 직접편집 패널은 하나도 남기지 않는다. */
  panel.querySelectorAll('.nv-single-editor,.nv-edit-toggle,.nv-coord-panel,.nv-direct-editor-recovery').forEach(el=>el.remove());
  canvas.querySelectorAll('.nv-single-handle,.nv-single-selected').forEach(el=>el.classList.remove('nv-single-selected'));
  canvas.classList.remove('nv-direct-single','nv-direct-editing');
  canvas.classList.add('nv-right-panel-edit-only');

  /* 줄자 도구가 항상 패널 최상단, 직접편집은 그 바로 아래가 되도록 순서를 강제한다. */
  const rulerTools=panel.querySelector('.nv-guide-tools');
  if(rulerTools)panel.insertBefore(rulerTools,panel.firstElementChild);

  const box=document.createElement('div');
  box.id='nvDirectEditorFinal';
  box.className='nv-single-editor nv-final-direct';
  box.innerHTML=`
    <h3>프리뷰에서 글자 직접 편집</h3>
    <div class="nv-f-row">
      <select id="nvFinalTarget">
        <option value="">편집할 글자를 선택하세요</option>
      </select>
    </div>
    <div class="nv-f-help">프리뷰에서 움직이지 않아도 됩니다. 위에서 글자를 선택한 뒤 오른쪽 패널의 X/Y/크기/두께/자간/줄간격을 조절하면 즉시 반영됩니다.</div>
    <div class="nv-f-row">
      <label>X <input id="nvFinalX" type="number" step="1"></label>
      <label>Y <input id="nvFinalY" type="number" step="1"></label>
      <label>크기 <input id="nvFinalSize" type="number" min="1" step="1"> px</label>
      <button type="button" id="nvFinalApply" class="primary">적용</button>
    </div>
    <div class="nv-f-row">
      <button type="button" id="nvFinalUp">↑</button><button type="button" id="nvFinalDown">↓</button><button type="button" id="nvFinalLeft">←</button><button type="button" id="nvFinalRight">→</button>
    </div>
    <div class="nv-f-row">
      <label>두께 <input id="nvFinalWeight" type="range" min="100" max="900" step="10" value="400"><output id="nvFinalWeightVal">400</output></label>
      <label>자간 <input id="nvFinalSpacing" type="range" min="-20" max="30" step="0.1" value="0"><output id="nvFinalSpacingVal">0px</output></label>
      <label>줄간격 <input id="nvFinalLineHeight" type="range" min="0.8" max="3" step="0.05" value="1.5"><output id="nvFinalLineHeightVal">1.5</output></label>
    </div>`;
  panel.insertBefore(box, rulerTools ? rulerTools.nextSibling : panel.firstElementChild);

  const $=id=>document.getElementById(id);
  const targets=[
    ['nvSearchOut','검색어'],
    ['nvAccountNameOut','프로필 이름'],
    ['nvEmailOut','이메일'],
    ['nvFeatureMeta','대표기사 날짜/출처'],
    ['nvFeatureTitle','대표뉴스 제목'],
    ['nvHeadlinesOut','뉴스 제목 목록'],
    ['nvRightTextOut','오른쪽 카드']
  ];
  const get=id=>document.getElementById(id);
  const editableTargets=targets.map(([id,name])=>[id,name,get(id)]).filter(x=>x[2] && !x[2].classList.contains('nv-fixed-text'));
  const select=$('nvFinalTarget');
  editableTargets.forEach(([id,name,el])=>{
    const o=document.createElement('option');o.value=id;o.textContent=name;select.appendChild(o);
  });

  let selected=null;
  const num=v=>Number.isFinite(parseFloat(v))?parseFloat(v):0;
  function setImportant(el,prop,value){el.style.setProperty(prop,String(value), 'important');}
  function currentLineHeight(el){
    const cs=getComputedStyle(el),fs=num(cs.fontSize)||16;
    let lh=num(cs.lineHeight);
    if(!Number.isFinite(lh))lh=1.5;
    else if(lh>6)lh/=fs;
    return Math.max(.8,Math.min(3,lh));
  }
  function sync(){
    if(!selected){
      $('nvFinalX').value='';$('nvFinalY').value='';$('nvFinalSize').value='';
      $('nvFinalWeight').value=400;$('nvFinalWeightVal').textContent='400';
      $('nvFinalSpacing').value=0;$('nvFinalSpacingVal').textContent='0px';
      $('nvFinalLineHeight').value=1.5;$('nvFinalLineHeightVal').textContent='1.5';
      return;
    }
    const cs=getComputedStyle(selected);
    $('nvFinalX').value=Math.round(num(selected.style.left));
    $('nvFinalY').value=Math.round(num(selected.style.top));
    $('nvFinalSize').value=Math.round(num(cs.fontSize)||16);
    const wt=num(cs.fontWeight)||400;
    $('nvFinalWeight').value=Math.max(100,Math.min(900,wt));$('nvFinalWeightVal').textContent=Math.round(wt);
    let sp=num(cs.letterSpacing);if(!Number.isFinite(sp))sp=0;
    $('nvFinalSpacing').value=Math.max(-20,Math.min(30,sp));$('nvFinalSpacingVal').textContent=(Math.round(sp*10)/10)+'px';
    const lh=currentLineHeight(selected);$('nvFinalLineHeight').value=lh;$('nvFinalLineHeightVal').textContent=(Math.round(lh*100)/100).toString();
  }
  function choose(id){
    const el=get(id);if(!el)return;
    selected=el;select.value=id;
    el.classList.add('nv-edited');
    sync();
  }
  select.addEventListener('change',()=>choose(select.value));

  function apply(){
    if(!selected)return;
    const x=parseFloat($('nvFinalX').value),y=parseFloat($('nvFinalY').value),s=parseFloat($('nvFinalSize').value);
    if(Number.isFinite(x))setImportant(selected,'left',Math.round(x)+'px');
    if(Number.isFinite(y))setImportant(selected,'top',Math.round(y)+'px');
    if(Number.isFinite(s))setImportant(selected,'font-size',Math.max(1,s)+'px');
    selected.classList.add('nv-edited');sync();
  }
  $('nvFinalApply').addEventListener('click',apply);
  ['nvFinalX','nvFinalY','nvFinalSize'].forEach(id=>$(id).addEventListener('change',apply));

  function move(dx,dy){
    if(!selected)return;
    const x=num(selected.style.left),y=num(selected.style.top);
    setImportant(selected,'left',(x+dx)+'px');setImportant(selected,'top',(y+dy)+'px');selected.classList.add('nv-edited');sync();
  }
  $('nvFinalUp').addEventListener('click',()=>move(0,-1));
  $('nvFinalDown').addEventListener('click',()=>move(0,1));
  $('nvFinalLeft').addEventListener('click',()=>move(-1,0));
  $('nvFinalRight').addEventListener('click',()=>move(1,0));
  $('nvFinalWeight').addEventListener('input',e=>{if(!selected)return;setImportant(selected,'font-weight',e.target.value);$('nvFinalWeightVal').textContent=e.target.value;selected.classList.add('nv-edited');});
  $('nvFinalSpacing').addEventListener('input',e=>{if(!selected)return;setImportant(selected,'letter-spacing',e.target.value+'px');$('nvFinalSpacingVal').textContent=(Math.round(Number(e.target.value)*10)/10)+'px';selected.classList.add('nv-edited');});
  $('nvFinalLineHeight').addEventListener('input',e=>{if(!selected)return;setImportant(selected,'line-height',e.target.value);$('nvFinalLineHeightVal').textContent=(Math.round(Number(e.target.value)*100)/100);selected.classList.add('nv-edited');});

  /* 기본 선택: 검색어. 즉시 조작 가능하도록 한다. */
  if(get('nvSearchOut'))choose('nvSearchOut');
})();


(function(){
 const q=id=>document.getElementById(id), panel=document.querySelector('#naverApp .naver-settings'), canvas=q('naverCanvas');
 if(!panel||!canvas)return;
 const first=x=>x?.firstElementChild;
 // 1) 기존 고정값으로 묶여 있던 '구독언론사 옆 문구'는 사용자 편집 가능으로 전환
 const middle=q('nvNewsbarMiddle'); if(middle)middle.classList.remove('nv-fixed-text');
 // 2) 설정 최상단에 사용자 편집 영역 하나만 만든다. 기존 입력 DOM은 그대로 이동시켜 이벤트를 보존한다.
 let top=q('nvUserEditableTop');
 if(!top){
   top=document.createElement('div'); top.id='nvUserEditableTop';
   top.innerHTML='<h3>네이버 메인 편집 설정</h3>';
   const direct=q('nvDirectEditorFinal');
   const ruler=panel.querySelector('.nv-guide-tools');
   panel.insertBefore(top, direct ? direct.nextSibling : (ruler ? ruler.nextSibling : panel.firstElementChild));
 }
 // 기존 기본 설정 제목/구조에서 사용자가 편집할 항목을 뽑아 최상단으로 이동
 const moveField=id=>{
   const el=q(id); if(!el)return;
   const p=el.closest('.field'); if(p && !top.contains(p)) top.appendChild(p);
 };
 const moveRowIds=ids=>{
   const nodes=ids.map(q).filter(Boolean);
   if(!nodes.length)return;
   const row=nodes[0].closest('.row');
   if(row && !top.contains(row))top.appendChild(row);
 };
 moveField('nvSearch');
 moveRowIds(['nvAccountName','nvEmail']);
 moveRowIds(['nvFeatureTitleInput','nvFeatureMetaInput']);
 moveField('nvRightText');
 moveField('nvHeadlineList');
 moveField('nvPressName1');
 // The press-name field is moved above; add position controls beside its inputs.
 const pressField=q('nvPressName1')?.closest('.field');
 if(pressField){
   const wrap=pressField.querySelector('.nv-press-name-settings');
   if(wrap){
     // existing four name inputs remain; add x/y controls only once
     for(let i=1;i<=4;i++){
       const name=q('nvPressName'+i); if(!name)continue;
       let row=q('nvPressPos'+i);
       if(!row){
         row=document.createElement('div');row.className='nv-press-pos-row';row.id='nvPressPos'+i;
         row.innerHTML='<input id="nvPressName'+i+'X" type="number" value="115" aria-label="언론사 '+i+' X"><input id="nvPressName'+i+'Y" type="number" value="570" aria-label="언론사 '+i+' Y">';
         name.insertAdjacentElement('afterend',row);
       }
     }
     const lab=pressField.querySelector('label'); if(lab)lab.textContent='언론사 이름 / X / Y (최대 4개)';
     let note=pressField.querySelector('.nv-press-pos-note');
     if(!note){note=document.createElement('small');note.className='nv-press-pos-note';note.textContent='각 언론사 이름과 위치를 따로 설정할 수 있습니다.';pressField.appendChild(note);}
   }
 }
 moveRowIds(['nvSubscribedCount','nvSubscribedX','nvSubscribedY']);
 moveRowIds(['nvOtherNewsCount','nvOtherNewsTotal','nvOtherNewsX','nvOtherNewsY']);
 moveField('nvPressLogoImage'); moveField('nvFeatureImage');
 // 3) 오른쪽 카드 사진 업로드 입력 추가
 let rightImageField=q('nvRightCardImage')?.closest('.field');
 if(!rightImageField){
   rightImageField=document.createElement('div');rightImageField.className='field';rightImageField.id='nvRightCardImageField';
   rightImageField.innerHTML='<label>오른쪽 카드 사진 (선택)</label><input accept="image/*" id="nvRightCardImage" type="file"><small>사진을 넣으면 오른쪽 카드 영역을 사진으로 꽉 채웁니다. 텍스트는 위에 표시됩니다.</small>';
   const textField=q('nvRightText')?.closest('.field');
   if(textField && textField.parentElement===top)textField.insertAdjacentElement('afterend',rightImageField); else top.appendChild(rightImageField);
 }
 // 4) 대표 제목/메타/검색어/뉴스목록의 현재 요청값을 설정창에도 반영
 const vals={nvFeatureSize:'23',nvFeatureWeight:'560',nvFeatureLineHeight:'1.35',nvHeadlineSize:'25',nvHeadlineWeight:'430',nvHeadlineLineHeight:'2',nvSearch:'박성화'};
 // 스타일 inputs themselves are below; force values when present so UI agrees with preview.
 const setVal=(id,v)=>{const e=q(id);if(e)e.value=v;};
 setVal('nvFeatureSize',23);setVal('nvFeatureWeight',560);setVal('nvFeatureLineHeight',1.35);
 setVal('nvHeadlineSize',25);setVal('nvHeadlineWeight',430);setVal('nvHeadlineLineHeight',2);
 // 5) 오른쪽 카드 이미지 overlay
 let img=q('nvRightCardImageOverlay');
 if(!img){img=document.createElement('img');img.id='nvRightCardImageOverlay';img.alt='';canvas.appendChild(img);}
 const syncRightImage=()=>{
   const file=q('nvRightCardImage')?.files?.[0];
   if(!file){img.style.display='none';return;}
   const reader=new FileReader(); reader.onload=e=>{img.src=e.target.result;img.style.display='block';};reader.readAsDataURL(file);
 };
 q('nvRightCardImage')?.addEventListener('change',syncRightImage);
 img.style.left='1370px';img.style.top='640px';img.style.width='648px';img.style.height='511px';
 // 6) '구독언론사 옆 문구'를 위한 실제 편집 input을 최상단에 추가
 let middleField=q('nvNewsbarMiddleInput')?.closest('.field');
 if(!middleField){
   middleField=document.createElement('div');middleField.className='field';middleField.id='nvNewsbarMiddleField';
   middleField.innerHTML='<label>구독언론사 옆 문구</label><input id="nvNewsbarMiddleInput" value="ANEWZ · 넌 대체 뭐하는 남자길래"><small>구독언론사 오른쪽에 표시되는 문구입니다.</small>';
   top.appendChild(middleField);
 }
 const midIn=q('nvNewsbarMiddleInput');
 if(midIn && middle){const sync=()=>{middle.textContent=midIn.value;middle.classList.remove('nv-fixed-text');};sync();midIn.addEventListener('input',sync);}
 // 7) 대표 제목 줄바꿈 유지
 const title=q('nvFeatureTitle'), titleIn=q('nvFeatureTitleInput');
 if(title){title.style.setProperty('white-space','pre-wrap','important');title.style.setProperty('line-height','1.35','important');}
 if(titleIn){titleIn.rows=3;titleIn.style.minHeight='70px';}
 // 8) 강제 좌표/스타일. 사용자가 이후 직접 편집 패널에서 바꾸면 그 값이 우선하도록 !important는 기본값용으로만 사용.
 const force=(id,styles)=>{const e=q(id);if(!e)return;Object.entries(styles).forEach(([p,v])=>e.style.setProperty(p,v,'important'));};
 force('nvSearchOut',{left:'591px',top:'133px',fontSize:'28px'});
 force('nvHeadlinesOut',{left:'682px',top:'593px',fontSize:'25px',fontWeight:'430',letterSpacing:'-1.5px',lineHeight:'2',color:'#000',width:'max-content',maxWidth:'none',whiteSpace:'pre'});
 force('nvFeatureMeta',{left:'401px',top:'555px',fontSize:'21px',fontWeight:'400',letterSpacing:'-0.5px',width:'max-content'});
 force('nvFeatureTitle',{left:'343px',top:'821px',fontSize:'23px',fontWeight:'560',letterSpacing:'-0.5px',lineHeight:'1.35',width:'310px',maxWidth:'310px',whiteSpace:'pre-wrap'});
 force('nvAccountNameOut',{left:'1517px',top:'390px',fontSize:'22px',fontWeight:'700',letterSpacing:'-0.5px'});
 // 9) counts: 숫자 + 위치는 기존 overlay를 직접 갱신. 위치값 입력은 상단에서 가능.
 const subIn=q('nvSubscribedCount'), subX=q('nvSubscribedX'), subY=q('nvSubscribedY'), otherIn=q('nvOtherNewsCount'), totalIn=q('nvOtherNewsTotal'), otherX=q('nvOtherNewsX'), otherY=q('nvOtherNewsY');
 const subOv=q('nvSubscribedOverlay'), otherOv=q('nvOtherNewsOverlay');
 const pos=(e,x,y)=>{if(!e)return;e.style.setProperty('left',(Number(x)||0)+'px','important');e.style.setProperty('top',(Number(y)||0)+'px','important');};
 function syncCounts(){
   if(subOv){subOv.innerHTML='구독중 <b>'+String(subIn?.value||8)+'</b>';pos(subOv,subX?.value||115,subY?.value||835);subOv.style.setProperty('pointer-events','none','important');}
   if(otherOv){otherOv.innerHTML='<span style="color:#1675e8">다른 언론사 뉴스</span> <span style="color:#111">더보기</span> <span style="color:#111">'+String(otherIn?.value||7)+'/'+String(totalIn?.value||8)+'</span>';pos(otherOv,otherX?.value||580,otherY?.value||945);otherOv.style.setProperty('pointer-events','none','important');}
 }
 [subIn,subX,subY,otherIn,totalIn,otherX,otherY].forEach(e=>e?.addEventListener('input',syncCounts));syncCounts();
 // 10) 언론사 이름 overlay의 이름/위치 연결
 const pressDefs=[1,2,3,4];
 pressDefs.forEach((i,idx)=>{
   const input=q('nvPressName'+i); let out=q('nvPressEditable'+i); if(!input||!out)return;
   const xi=q('nvPressName'+i+'X'), yi=q('nvPressName'+i+'Y');
   const sync=()=>{out.textContent=input.value;pos(out,xi?.value||115,yi?.value||(570+idx*57));out.style.pointerEvents='none';};
   input.addEventListener('input',sync);xi?.addEventListener('input',sync);yi?.addEventListener('input',sync);sync();
 });
 // 11) direct editor가 새로 추가된 editable targets까지 선택할 수 있게 옵션을 보강
 const sel=q('nvFinalTarget');
 if(sel){
   const add=(id,name)=>{if(!q(id)||[...sel.options].some(o=>o.value===id))return;const o=document.createElement('option');o.value=id;o.textContent=name;sel.appendChild(o);};
   add('nvNewsbarMiddle','구독언론사 옆 문구');
   for(let i=1;i<=4;i++)add('nvPressEditable'+i,'언론사 이름 '+i);
   add('nvSubscribedOverlay','구독중 숫자');add('nvOtherNewsOverlay','다른 언론사 뉴스 더보기');
 }
 // direct editor's choose function is closure-private, so selecting via dropdown is handled by its listener.
 // 12) 오래된 설정 중복은 숨기되 텍스트 꾸미기 영역은 유지
 const oldH=panel.querySelector(':scope > h2');if(oldH)oldH.style.display='none';
})();


(function(){
 const q=id=>document.getElementById(id), c=q('naverCanvas'), panel=document.querySelector('#naverApp .naver-settings'); if(!c||!panel)return;
 // 정확한 사용자 지정 굵기(560/430)를 위해 기존 스타일 슬라이더를 10단위로 변경
 ['nvFeatureWeight','nvHeadlineWeight','nvRightWeight'].forEach(id=>{const e=q(id);if(e)e.step='10';});
 // 오른쪽 카드 사진 overlay가 없었던 경우도 안전하게 생성
 let img=q('nvRightCardImageOverlay');
 if(!img){img=document.createElement('img');img.id='nvRightCardImageOverlay';img.alt='';c.appendChild(img);}
 img.style.cssText='position:absolute;left:1370px;top:640px;width:648px;height:511px;z-index:4;object-fit:cover;object-position:center;border-radius:12px;display:none;pointer-events:none;';
 // 언론사/숫자 overlay가 혹시 없으면 생성하여 설정값과 항상 연결
 let nlayer=q('nvNOnlyLayer');
 if(!nlayer){nlayer=document.createElement('div');nlayer.id='nvNOnlyLayer';nlayer.style.cssText='position:absolute;inset:0;z-index:25;pointer-events:none;';c.appendChild(nlayer);}
 const ensure=(id)=>{let e=q(id);if(!e){e=document.createElement('div');e.id=id;nlayer.appendChild(e);}return e;};
 const sub=ensure('nvSubscribedOverlay'), other=ensure('nvOtherNewsOverlay');
 const setPos=(e,x,y)=>{e.style.setProperty('left',(Number(x)||0)+'px','important');e.style.setProperty('top',(Number(y)||0)+'px','important');};
 function counts(){
   const sv=q('nvSubscribedCount')?.value||'8', ov=q('nvOtherNewsCount')?.value||'7', tv=q('nvOtherNewsTotal')?.value||'8';
   sub.innerHTML='구독중 <b>'+sv+'</b>';sub.style.cssText='position:absolute;width:120px;height:42px;box-sizing:border-box;padding:7px 0;background:#fff;pointer-events:none;font-family:Pretendard,sans-serif;font-size:22px;line-height:28px;color:#999;text-align:center;white-space:nowrap;z-index:25;';sub.querySelector('b').style.cssText='color:#3f5fe8;font-weight:700;';setPos(sub,q('nvSubscribedX')?.value||115,q('nvSubscribedY')?.value||835);
   other.innerHTML='<span style="color:#1675e8">다른 언론사 뉴스</span> <span style="color:#111">더보기</span> <span style="color:#111">'+ov+'/'+tv+'</span>';other.style.cssText='position:absolute;width:315px;height:45px;box-sizing:border-box;padding:8px 0;background:#fff;pointer-events:none;font-family:Pretendard,sans-serif;font-size:20px;line-height:29px;text-align:center;white-space:nowrap;z-index:25;';setPos(other,q('nvOtherNewsX')?.value||580,q('nvOtherNewsY')?.value||945);
 }
 ['nvSubscribedCount','nvSubscribedX','nvSubscribedY','nvOtherNewsCount','nvOtherNewsTotal','nvOtherNewsX','nvOtherNewsY'].forEach(id=>q(id)?.addEventListener('input',counts));counts();
 // press overlay 안전 생성/연결
 let layer=q('nvPressEditableLayer');
 if(!layer){layer=document.createElement('div');layer.id='nvPressEditableLayer';layer.style.cssText='position:absolute;inset:0;z-index:20;pointer-events:none;';c.appendChild(layer);}
 for(let i=1;i<=4;i++){
   let out=q('nvPressEditable'+i);if(!out){out=document.createElement('div');out.id='nvPressEditable'+i;layer.appendChild(out);}
   const inp=q('nvPressName'+i), xi=q('nvPressName'+i+'X'), yi=q('nvPressName'+i+'Y');
   const sync=()=>{out.textContent=inp?.value||'';out.style.cssText='position:absolute;width:150px;height:40px;box-sizing:border-box;padding:7px 12px;pointer-events:none;font-family:Pretendard,sans-serif;font-size:22px;font-weight:400;line-height:26px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left;color:'+(i===4?'#fff':'#111')+';background:'+(i===4?'#4a58e8':'#fff')+';z-index:20;';setPos(out,xi?.value||115,yi?.value||(570+(i-1)*57));};
   [inp,xi,yi].forEach(e=>e?.addEventListener('input',sync));sync();
 }
 // 사용자 요청의 정확한 기본값을 메인 스타일 입력에도 기록
 const vals={nvFeatureSize:23,nvFeatureWeight:560,nvFeatureLineHeight:1.35,nvHeadlineSize:25,nvHeadlineWeight:430,nvHeadlineLineHeight:2};Object.entries(vals).forEach(([id,v])=>{const e=q(id);if(e)e.value=v;});
 // right card image input
 q('nvRightCardImage')?.addEventListener('change',()=>{const f=q('nvRightCardImage').files?.[0];if(!f){img.style.display='none';return;}const r=new FileReader();r.onload=e=>{img.src=e.target.result;img.style.display='block';};r.readAsDataURL(f);});
 // 구독언론사 옆 문구는 반드시 editable
 const mid=q('nvNewsbarMiddle'), midIn=q('nvNewsbarMiddleInput');if(mid&&midIn){mid.classList.remove('nv-fixed-text');const s=()=>mid.textContent=midIn.value;midIn.addEventListener('input',s);s();}
})();
