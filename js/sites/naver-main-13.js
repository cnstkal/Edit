
(function(){
 const videos=[
  {title:"Q&A",meta:"조회수 92만회 · 6일 전",img:null},
  {title:"12월 기록",meta:"조회수 50만회 · 4일 전",img:null},
  {title:"3월 기록",meta:"조회수 34만회 · 1달 전",img:null}
 ];
 const ids=[
  ["ytName","ytNameOut"],["ytHandle","ytHandleOut"],["ytSubscribers","ytSubscribersOut"],
  ["ytVideoCount","ytVideoCountOut"],["ytAbout","ytAboutOut"],["ytFeatureTitle","ytFeatureTitleOut"],
  ["ytFeatureMeta","ytFeatureMetaOut"]
 ];
 // Handle text fields that are embedded in the channel header/meta.
 const update=()=>{
   const name=document.getElementById("ytName"),outName=document.getElementById("ytNameOut"); if(name&&outName)outName.textContent=name.value;
   const handle=document.getElementById("ytHandle"),meta=document.querySelector(".yt-meta"); 
   if(meta&&handle)meta.innerHTML=`<b>${handle.value}</b> · 구독자 ${document.getElementById("ytSubscribers").value} · 동영상 ${document.getElementById("ytVideoCount").value}`;
   const about=document.getElementById("ytAbout"),aboutOut=document.getElementById("ytAboutOut");if(about&&aboutOut)aboutOut.textContent=about.value;
   const ft=document.getElementById("ytFeatureTitle"),fto=document.getElementById("ytFeatureTitleOut");if(ft&&fto)fto.textContent=ft.value;
   const fm=document.getElementById("ytFeatureMeta"),fmo=document.getElementById("ytFeatureMetaOut");if(fm&&fmo)fmo.textContent=fm.value;
   document.getElementById("ytGridOut").innerHTML=videos.map((v,i)=>`<article class="yt-card"><div class="yt-thumb" style="${v.img?`background-image:url('${v.img}')`:""}"></div><h3>${v.title}</h3><p>${v.meta}</p><span class="yt-card-more">⋮</span></article>`).join("");
 };
 ["ytName","ytHandle","ytSubscribers","ytVideoCount","ytAbout","ytFeatureTitle","ytFeatureMeta"].forEach(id=>document.getElementById(id)?.addEventListener("input",update));
 function fileTo(id,apply){document.getElementById(id)?.addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>apply(ev.target.result);r.readAsDataURL(f);});}
 fileTo("ytAvatarInput",src=>document.getElementById("ytAvatar").style.backgroundImage=`url("${src}")`);
 fileTo("ytFeatureInput",src=>document.getElementById("ytFeatureImg").style.backgroundImage=`url("${src}")`);
 function editors(){
   const box=document.getElementById("ytVideoEditors");if(!box)return;
   box.innerHTML=videos.map((v,i)=>`<div class="yt-video-editor">
     <div class="row"><div class="field"><label>제목</label><input value="${v.title.replace(/"/g,'&quot;')}" data-yv="title" data-i="${i}"></div>
     <div class="field"><label>조회수 / 시점</label><input value="${v.meta.replace(/"/g,'&quot;')}" data-yv="meta" data-i="${i}"></div></div>
     <div class="field"><label>썸네일</label><input type="file" accept="image/*" data-yv-img="${i}"></div>
   </div>`).join("");
 }
 document.getElementById("ytVideoEditors")?.addEventListener("input",e=>{if(!e.target.dataset.yv)return;videos[+e.target.dataset.i][e.target.dataset.yv]=e.target.value;update();});
 document.getElementById("ytVideoEditors")?.addEventListener("change",e=>{const i=e.target.dataset.yvImg;if(i==null)return;const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{videos[+i].img=ev.target.result;update();};r.readAsDataURL(f);});
 document.getElementById("ytAddVideo")?.addEventListener("click",()=>{videos.push({title:"새 영상",meta:"조회수 0회 · 방금 전",img:null});editors();update();});
 document.getElementById("ytSavePng")?.addEventListener("click",()=>{const t=document.getElementById("youtubeCanvas");html2canvas(t,{scale:2,backgroundColor:"#fff",useCORS:true}).then(c=>{const a=document.createElement("a");a.download="youtube_channel.png";a.href=c.toDataURL("image/png");a.click();});});
 editors();update();
})();
