// Recovery loader: use the last known-good split bundle while the current bundle is repaired.
(function(){
  // The Twitter editor expects this button before its initialization reaches that section.
  // The current HTML generates the real button dynamically, so a temporary hidden stub
  // prevents one missing element from aborting every generator below it.
  if(!document.getElementById('twAddPost')){
    const stub=document.createElement('button');
    stub.id='twAddPost';
    stub.type='button';
    stub.style.display='none';
    document.body.appendChild(stub);
  }
  const s=document.createElement('script');
  s.src='https://raw.githubusercontent.com/cnstkal/edit/2c190fc2b924bf619e83c2c95c9f67ec3d470847/js/main.js';
  s.async=false;
  s.onload=function(){
    // The known-good bundle rebuilds the Twitter editor after its initial handlers are bound.
    // Rebind the dynamically-created add button so that feature remains usable too.
    setTimeout(function(){
      const b=document.getElementById('twAddPost');
      if(b && !b.dataset.recoveryBound){
        b.dataset.recoveryBound='1';
        b.addEventListener('click',function(){
          if(typeof twState==='undefined' || typeof twEditors!=='function' || typeof twRender!=='function') return;
          twState.posts.push({name:'새로운 사용자',handle:'@username',date:'방금 전',text:'',avatar:null,replies:'',reposts:'',likes:'',views:'',reposted:false,liked:false,bookmarked:false,privateAccount:false,photos:[]});
          if(typeof twSave==='function') twSave();
          twEditors();
          twRender();
        });
      }
    },50);
  };
  s.onerror=function(){ console.error('Known-good generator bundle failed to load.'); };
  document.head.appendChild(s);
})();
