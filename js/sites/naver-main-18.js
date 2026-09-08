
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
