
window.showScreen = window.showScreen || function(name) {
  const ids = {menu:"homeScreen", news:"newsApp", dispatch:"dispatchApp", dcinside:"dcApp", story:"storyApp", kakao:"kakaoApp", notification:"notificationApp", everytime:"everytimeApp", gpt:"gptApp", google:"googleApp", googleResults:"googleResultsApp", instagram:"instagramApp", instagramDm:"instagramDmApp", twitter:"twitterApp", naver:"naverApp", naverBlog:"naverBlogApp", naverSearch:"naverSearchApp", youtube:"youtubeApp", netflix:"netflixApp", tinder:"tinderApp", discord:"discordApp"};
  Object.keys(ids).forEach(k => {
    const el = document.getElementById(ids[k]);
    if (el) el.classList.toggle("hidden", k !== name);
  });
  try { sessionStorage.setItem("virtual_source_screen", name); } catch(e) {}
};



function toggleHomeCategory(btn){
  const category=btn.closest('.home-category');
  if(!category) return;
  const open=!category.classList.contains('open');
  document.querySelectorAll('.home-category.open').forEach(el=>{el.classList.remove('open'); const b=el.querySelector('.home-category-main'); if(b){b.setAttribute('aria-expanded','false'); const a=b.querySelector('.home-category-arrow'); if(a)a.textContent='＋';}});
  if(open){category.classList.add('open');btn.setAttribute('aria-expanded','true');const a=btn.querySelector('.home-category-arrow');if(a)a.textContent='－';}
}


