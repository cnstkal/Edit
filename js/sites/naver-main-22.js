
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
