
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
