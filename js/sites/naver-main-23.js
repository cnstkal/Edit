
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
