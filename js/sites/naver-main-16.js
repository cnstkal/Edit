
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
