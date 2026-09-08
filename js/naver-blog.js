
(function(){
 const bind=(id,out)=>{const a=document.getElementById(id),b=document.getElementById(out);if(!a||!b)return;a.addEventListener('input',()=>b.textContent=a.value);};
 bind('nbHeadTitle','nbHeadTitleOut');bind('nbCategory','nbCategoryOut');bind('nbTitle','nbTitleOut');bind('nbAuthor','nbAuthorOut');bind('nbDate','nbDateOut');
 const body=document.getElementById('nbBody'),out=document.getElementById('nbBodyOut');
 function renderBody(){
   if(!body||!out)return;
   const lines=body.value.split('\n');
   const frag=document.createDocumentFragment();
   lines.forEach((line,i)=>{
     if(!line.trim()){
       const p=document.createElement('p');p.className='nb-gap';p.innerHTML='&nbsp;';frag.appendChild(p);
     }else{
       const p=document.createElement('p');p.textContent=line;
       if(line.trim()==='고백하기 입니다!')p.className='nb-bold';
       frag.appendChild(p);
     }
   });
   const first=out.querySelector('#nbMainImage'), last=out.querySelector('.nb-bottom-image');
   out.innerHTML='';
   if(first)out.appendChild(first);
   Array.from(frag.children).forEach(x=>out.appendChild(x));
   if(last)out.appendChild(last);
 }
 body?.addEventListener('input',renderBody);
 function imageBind(id,target){
   document.getElementById(id)?.addEventListener('change',e=>{
     const f=e.target.files[0];if(!f)return;const r=new FileReader();
     r.onload=ev=>{const el=document.getElementById(target);if(el)el.style.backgroundImage=`url("${ev.target.result}")`;};
     r.readAsDataURL(f);
   });
 }
 imageBind('nbImage1','nbMainImage');imageBind('nbImage2','nbBottomImage');
 document.getElementById('nbAvatar')?.addEventListener('change',e=>{
   const f=e.target.files[0];if(!f)return;const r=new FileReader();
   r.onload=ev=>document.getElementById('nbAuthorAvatar').style.backgroundImage=`url("${ev.target.result}")`;
   r.readAsDataURL(f);
 });
 document.getElementById('naverBlogSavePng')?.addEventListener('click',()=>{
   const t=document.getElementById('naverBlogCanvas');
   if(typeof html2canvas==='undefined'){alert('이미지 생성 기능을 불러오지 못했습니다.');return;}
   html2canvas(t,{scale:2,backgroundColor:'#fff',useCORS:true}).then(c=>{
     const a=document.createElement('a');a.download='naver_blog.png';a.href=c.toDataURL('image/png');a.click();
   });
 });
 renderBody();
})();
