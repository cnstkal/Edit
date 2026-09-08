===== Twitter / X PC generator =====
const TW_DEFAULT={search:'',activeTab:'recommend',trendTitle:'무슨 일이 일어나고 있나요?',trends:['햄부기 광고','원서접수','사망신고'],posts:[
 {name:'tabaco',handle:'@tabaco7529',date:'23시간',text:'어머니\n퍼퍼톤스공연어디로가요\n이쪽방향이라고\n오케이감사드리고\n자\n출발\n달달달달달달달달달\n어머니안녕하세요\n부원입니다',avatar:null,replies:'',reposts:'',likes:'',views:'',reposted:false,liked:false,bookmarked:false,privateAccount:false},
 {name:'페퍼톤스',handle:'@pptnzexpress',date:'9월 6일',text:'희춘\n\n@pptnzhoshel\n#페퍼톤스 #PEPPERTONES\n#신재평 #이장원...',avatar:null,replies:'',reposts:'',likes:'',views:'',reposted:false,liked:false,bookmarked:false,privateAccount:false},
 {name:'새로운 소식',handle:'@newsource',date:'1시간',text:'오늘 올라온 새로운 이야기입니다.',avatar:null,replies:'',reposts:'',likes:'',views:'',reposted:false,liked:false,bookmarked:false,privateAccount:false}
]};
let twState=JSON.parse(JSON.stringify(TW_DEFAULT));
function twEsc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function twSave(){try{sessionStorage.setItem('virtual_twitter_v1',JSON.stringify(twState))}catch(e){}}
try{
  const x=sessionStorage.getItem('virtual_twitter_v1');
  if(x){
    const saved=JSON.parse(x);
    if(saved && typeof saved==='object') twState={...TW_DEFAULT,...saved};
  }
}catch(e){}
twState.activeTab=twState.activeTab==='following'?'following':'recommend';
if(!Array.isArray(twState.trends)) twState.trends=JSON.parse(JSON.stringify(TW_DEFAULT.trends));
if(typeof twState.search!=='string') twState.search='';
if(typeof twState.trendTitle!=='string') twState.trendTitle=TW_DEFAULT.trendTitle;
if(!Array.isArray(twState.posts)) twState.posts=JSON.parse(JSON.stringify(TW_DEFAULT.posts));
twState.posts=twState.posts.map(p=>({...p,replies:p.replies??'',reposts:p.reposts??'',likes:p.likes??'',views:p.views??'',reposted:!!p.reposted,liked:!!p.liked,bookmarked:!!p.bookmarked,privateAccount:!!p.privateAccount,photos:Array.isArray(p.photos)?p.photos.slice(0,4):[]}));
function twEditors(){
  const box=document.getElementById('twPostEditors');
  box.innerHTML=twState.posts.map((p,i)=>`<div class="tw-editor-post">
    <b>게시글 ${i+1}</b>
    <div class="field"><label>프로필 사진</label><input type="file" accept="image/*" data-tw-avatar="${i}"></div>
    <div class="field"><label>이름</label><input data-tw="name" data-i="${i}" value="${twEsc(p.name)}"></div>
    <div class="field"><label>아이디</label><input data-tw="handle" data-i="${i}" value="${twEsc(p.handle)}"></div>
    <div class="field"><label>계정 설정</label><label class="tw-private-option"><input type="checkbox" data-tw-private="${i}" ${p.privateAccount?'checked':''}> 비공개 계정</label></div>
    <div class="field"><label>시간</label><input data-tw="date" data-i="${i}" value="${twEsc(p.date)}"></div>
    <div class="field"><label>본문</label><textarea rows="5" data-tw="text" data-i="${i}">${twEsc(p.text)}</textarea></div>
    <div class="field"><label>트윗 사진 <small>(최대 4장)</small></label><input type="file" accept="image/*" multiple data-tw-photos="${i}">
      ${p.photos?.length?`<div class="tw-photo-previews">${p.photos.map((src,j)=>`<div class="tw-photo-thumb"><img src="${src}" alt=""><button type="button" class="tw-photo-remove" data-tw-photo-remove="${i}" data-j="${j}">×</button></div>`).join('')}</div>`:''}
    </div>
    <div class="row2"><div class="field"><label>댓글 수</label><input data-tw="replies" data-i="${i}" value="${twEsc(p.replies||'')}"></div><div class="field"><label>리트윗 수</label><input data-tw="reposts" data-i="${i}" value="${twEsc(p.reposts||'')}"></div></div>
    <div class="row2"><div class="field"><label>좋아요 수</label><input data-tw="likes" data-i="${i}" value="${twEsc(p.likes||'')}"></div><div class="field"><label>조회수</label><input data-tw="views" data-i="${i}" value="${twEsc(p.views||'')}"></div></div>
    <div class="field"><label>직접 누른 상태</label><div class="tw-state-row">
      <label class="tw-state-option active-repost"><input type="checkbox" data-tw-state="reposted" data-i="${i}" ${p.reposted?'checked':''}>리트윗</label>
      <label class="tw-state-option active-like"><input type="checkbox" data-tw-state="liked" data-i="${i}" ${p.liked?'checked':''}>마음</label>
      <label class="tw-state-option active-bookmark"><input type="checkbox" data-tw-state="bookmarked" data-i="${i}" ${p.bookmarked?'checked':''}>북마크</label>
    </div></div>
  </div>`).join('')+`<button type="button" class="btn btn-primary tw-add-post" id="twAddPost">+ 게시글 추가</button>`;
  box.querySelectorAll('[data-tw]').forEach(el=>el.addEventListener('input',()=>{
    twState.posts[+el.dataset.i][el.dataset.tw]=el.value; twSave(); twRender();
  }));
  box.querySelectorAll('[data-tw-state]').forEach(el=>el.addEventListener('change',()=>{
    const i=+el.dataset.i, key=el.dataset.twState;
    twState.posts[i][key]=el.checked; twSave(); twRender();
  }));
  box.querySelectorAll('[data-tw-private]').forEach(el=>el.addEventListener('change',()=>{
    const i=+el.dataset.twPrivate;
    twState.posts[i].privateAccount=el.checked;
    if(el.checked) twState.posts[i].reposted=false;
    twSave(); twRender(); twEditors();
  }));
  box.querySelectorAll('[data-tw-avatar]').forEach(el=>el.addEventListener('change',e=>{
    const f=e.target.files[0]; if(!f)return;
    const r=new FileReader(); r.onload=ev=>{twState.posts[+el.dataset.twAvatar].avatar=ev.target.result;twSave();twRender()}; r.readAsDataURL(f);
  }));
  box.querySelectorAll('[data-tw-photos]').forEach(el=>el.addEventListener('change',e=>{
    const i=+el.dataset.twPhotos, files=Array.from(e.target.files||[]).slice(0,4-twState.posts[i].photos.length);
    if(!files.length)return;
    Promise.all(files.map(f=>new Promise(resolve=>{const r=new FileReader();r.onload=ev=>resolve(ev.target.result);r.readAsDataURL(f)}))).then(imgs=>{
      twState.posts[i].photos=(twState.posts[i].photos||[]).concat(imgs).slice(0,4);twSave();twEditors();twRender();
    });
  }));
  box.querySelectorAll('[data-tw-photo-remove]').forEach(el=>el.addEventListener('click',()=>{
    const i=+el.dataset.twPhotoRemove,j=+el.dataset.j;
    twState.posts[i].photos.splice(j,1);twSave();twEditors();twRender();
  }));
  document.getElementById('twAddPost').addEventListener('click',()=>{
    twState.posts.push({name:'새로운 사용자',handle:'@username',date:'방금 전',text:'',avatar:null,replies:'',reposts:'',likes:'',views:'',reposted:false,liked:false,bookmarked:false,privateAccount:false,photos:[]});
    twSave();twEditors();twRender();
    setTimeout(()=>{const cards=box.querySelectorAll('.tw-editor-post');cards[cards.length-1]?.scrollIntoView({behavior:'smooth',block:'center'});},30);
  });
}

const TW_ACTIVE_IMG={"reply": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M20%204.5H4A2.5%202.5%200%200%200%201.5%207v8A2.5%202.5%200%200%200%204%2017.5h2v3l4-3h10a2.5%202.5%200%200%200%202.5-2.5V7A2.5%202.5%200%200%200%2020%204.5Z%22%20fill%3D%22none%22%20stroke%3D%22%235f6368%22%20stroke-width%3D%221.8%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E", "repost": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M17%204l4%204-4%204M21%208H7a4%204%200%200%200-4%204M7%2020l-4-4%204-4M3%2016h14a4%204%200%200%200%204-4%22%20fill%3D%22none%22%20stroke%3D%22%2300ba7c%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E", "like": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M20.8%208.9c0%205.4-8.8%2010.1-8.8%2010.1S3.2%2014.3%203.2%208.9A4.6%204.6%200%200%201%2012%206.4a4.6%204.6%200%200%201%208.8%202.5Z%22%20fill%3D%22%23f91880%22%20stroke%3D%22%23f91880%22%20stroke-width%3D%221.8%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E", "views": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M4%2019V10M10%2019V5M16%2019v-7M22%2019V8%22%20fill%3D%22none%22%20stroke%3D%22%235f6368%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E", "bookmark": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M6%204.5A1.5%201.5%200%200%201%207.5%203h9A1.5%201.5%200%200%201%2018%204.5V21l-6-3.5L6%2021V4.5Z%22%20fill%3D%22%231d9bf0%22%20stroke%3D%22%231d9bf0%22%20stroke-width%3D%221.8%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E", "share": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M12%203v12M7%208l5-5%205%205M5%2013v6a2%202%200%200%200%202%202h10a2%202%200%200%200%202-2v-6%22%20fill%3D%22none%22%20stroke%3D%22%235f6368%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E"};
const TW_INACTIVE_IMG={"reply": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M20%204.5H4A2.5%202.5%200%200%200%201.5%207v8A2.5%202.5%200%200%200%204%2017.5h2v3l4-3h10a2.5%202.5%200%200%200%202.5-2.5V7A2.5%202.5%200%200%200%2020%204.5Z%22%20fill%3D%22none%22%20stroke%3D%22%235f6368%22%20stroke-width%3D%221.8%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E", "repost": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M17%204l4%204-4%204M21%208H7a4%204%200%200%200-4%204M7%2020l-4-4%204-4M3%2016h14a4%204%200%200%200%204-4%22%20fill%3D%22none%22%20stroke%3D%22%235f6368%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E", "like": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M20.8%208.9c0%205.4-8.8%2010.1-8.8%2010.1S3.2%2014.3%203.2%208.9A4.6%204.6%200%200%201%2012%206.4a4.6%204.6%200%200%201%208.8%202.5Z%22%20fill%3D%22none%22%20stroke%3D%22%235f6368%22%20stroke-width%3D%221.8%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E", "views": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M4%2019V10M10%2019V5M16%2019v-7M22%2019V8%22%20fill%3D%22none%22%20stroke%3D%22%235f6368%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E", "bookmark": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M6%204.5A1.5%201.5%200%200%201%207.5%203h9A1.5%201.5%200%200%201%2018%204.5V21l-6-3.5L6%2021V4.5Z%22%20fill%3D%22none%22%20stroke%3D%22%235f6368%22%20stroke-width%3D%221.8%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E", "share": "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M12%203v12M7%208l5-5%205%205M5%2013v6a2%202%200%200%200%202%202h10a2%202%200%200%200%202-2v-6%22%20fill%3D%22none%22%20stroke%3D%22%235f6368%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E"};
const TW_LOCK_IMG="이미지/img-f028c6992e04.webp";
function twIcon(type,active){
  const src=(active && TW_ACTIVE_IMG[type])||TW_INACTIVE_IMG[type];
  return `<img class="tw-icon-img" src="${src}" alt="">`;
}
function twRender(){
  if(!Array.isArray(twState.posts)) twState.posts=JSON.parse(JSON.stringify(TW_DEFAULT.posts));
  document.getElementById('twTabRecommend').classList.toggle('active',twState.activeTab==='recommend');
  document.getElementById('twTabFollowing').classList.toggle('active',twState.activeTab==='following');
  document.getElementById('twOutSearch').innerHTML='⌕ <span>'+twEsc(twState.search||'검색')+'</span>';
  document.getElementById('twOutTrendTitle').textContent=twState.trendTitle||'';
  document.getElementById('twOutTrends').innerHTML=twState.trends.map(t=>`<div class="tw-trend"><small>대한민국에서 트렌드 중</small><strong>${twEsc(t)}</strong></div>`).join('');
  document.getElementById('twOutPosts').innerHTML=twState.posts.map((p,i)=>`<article class="tw-post">
    <img class="tw-avatar" src="${p.avatar||'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><circle cx="22" cy="22" r="22" fill="#ddd"/></svg>')}" />
    <div class="tw-post-main">
      <div class="tw-post-head"><span class="tw-name">${twEsc(p.name)}</span>${p.privateAccount?`<img class="tw-lock" src="${TW_LOCK_IMG}" alt="">`:''} <span class="tw-handle">${twEsc(p.handle)} · ${twEsc(p.date)}</span></div>
      <div class="tw-post-text">${twEsc(p.text)}</div>
      ${p.photos?.length?`<div class="tw-post-media count-${Math.min(p.photos.length,4)}">${p.photos.slice(0,4).map(src=>`<img src="${src}" alt="">`).join('')}</div>`:''}
      <div class="tw-actions">
        <span class="tw-action">${twIcon('reply')}<span>${p.replies||''}</span></span>
        <span class="tw-action is-toggle ${p.privateAccount?'private-repost':(p.reposted?'active-repost':'')}" ${p.privateAccount?'':'data-tw-preview-toggle="reposted"'} data-i="${i}">${twIcon('repost',p.reposted && !p.privateAccount)}<span>${p.reposts||''}</span></span>
        <span class="tw-action is-toggle ${p.liked?'active-like':''}" data-tw-preview-toggle="liked" data-i="${i}">${twIcon('like',p.liked)}<span>${p.likes||''}</span></span>
        <span class="tw-action">${twIcon('views')}<span>${p.views||''}</span></span>
        <span class="tw-action tw-action-bookmark is-toggle ${p.bookmarked?'active-bookmark':''}" data-tw-preview-toggle="bookmarked" data-i="${i}">${twIcon('bookmark',p.bookmarked)}</span>
        <span class="tw-action tw-action-share">${twIcon('share')}</span>
      </div>
    </div>
  </article>`).join('');
  document.querySelectorAll('[data-tw-preview-toggle]').forEach(el=>el.addEventListener('click',()=>{
    const i=+el.dataset.i, key=el.dataset.twPreviewToggle;
    if(key==='reposted' && twState.posts[i].privateAccount) return;
    twState.posts[i][key]=!twState.posts[i][key];
    twSave(); twEditors(); twRender();
  }));
}
document.getElementById('twSearch').addEventListener('input',e=>{twState.search=e.target.value;twSave();twRender()});document.getElementById('twActiveTab').addEventListener('change',e=>{twState.activeTab=e.target.value==='following'?'following':'recommend';twSave();twRender()});document.getElementById('twTrendTitle').addEventListener('input',e=>{twState.trendTitle=e.target.value;twSave();twRender()});document.getElementById('twTrends').addEventListener('input',e=>{twState.trends=e.target.value.split('\n');twSave();twRender()});document.getElementById('twReset').addEventListener('click',()=>{twState=JSON.parse(JSON.stringify(TW_DEFAULT));twSave();twEditors();twRender()});document.getElementById('twSavePng').addEventListener('click',()=>{const target=document.getElementById('twitterPreview');if(typeof html2canvas==='undefined'){alert('이미지 생성 기능을 불러오지 못했습니다.');return}html2canvas(target,{backgroundColor:'#fff',scale:2,useCORS:true,allowTaint:true}).then(c=>{const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='twitter_pc.png';a.click()})});
document.getElementById('twSearch').value=twState.search;document.getElementById('twActiveTab').value=twState.activeTab;document.getElementById('twTrendTitle').value=twState.trendTitle;document.getElementById('twTrends').value=twState.trends.join('\n');twEditors();twRender();

kkSetView("mobile");
kkRenderPanel();
kkRenderPreview();
