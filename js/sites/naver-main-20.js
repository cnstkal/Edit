
(function(){
  const c=document.getElementById('naverCanvas');
  if(!c)return;
  const q=id=>document.getElementById(id);
  const fixedIds=['nvNewsSection','nvCat1','nvCat2','nvCat3','nvCat4','nvCat5','nvNewsbarLeft','nvNewsbarMiddle','nvNewsbarRight','nvPressSub','nvNaverId','nvLogoutText',
    'nvService1','nvService2','nvService3','nvService4','nvService5','nvService6','nvService7','nvService8','nvService9','nvService10','nvService11',
    'nvMenu1','nvMenu2','nvMenu3','nvMenu4','nvPress1','nvPress2','nvPress3','nvBadgeOut','nvPoint1Out','nvPoint2Out','nvPointMiddle'];
  fixedIds.forEach(id=>{const el=q(id);if(el)el.classList.add('nv-fixed-text');});
  // 프로필 이름 / 이메일 고정 좌표
  const profile=q('nvAccountNameOut'), email=q('nvEmailOut');
  if(profile){profile.style.left='1517px';profile.style.top='387px';profile.style.fontSize='22px';profile.style.fontWeight='700';profile.style.letterSpacing='-0.5px';}
  if(email){email.style.left='1517px';email.style.top='428px';email.style.fontSize='19px';email.style.fontWeight='400';}
  // 오른쪽 카드: 하나의 본문만 사용하고 기본값은 빈 문자열
  const right=q('nvRightTextOut'), rightInput=q('nvRightText');
  const oldLong=q('nvLongTextOut');
  if(oldLong) oldLong.remove();
  if(right){
    right.textContent=rightInput ? rightInput.value : '';
    right.style.left='1500px'; right.style.top='795px'; right.style.width='400px';
    right.style.textAlign='center'; right.style.whiteSpace='pre-wrap';
    right.style.overflow='visible';
  }
  if(rightInput){
    rightInput.value='';
    rightInput.addEventListener('input',()=>{ if(right) right.textContent=rightInput.value; });
  }
  // 제목 input/output duplicate 문제를 제거한 뒤 직접 연결
  const titleIn=q('nvFeatureTitleInput'), titleOut=q('nvFeatureTitle');
  if(titleIn && titleOut){
    const sync=()=>{titleOut.textContent=titleIn.value; titleOut.classList.toggle('nv-edited',titleIn.value!==titleOut.dataset.default);};
    sync(); titleIn.addEventListener('input',sync);
  }
  // 뉴스 제목: 입력한 줄바꿈만 유지하고 자동 줄바꿈은 금지
  const headlineBox=q('nvHeadlinesOut');
  function syncHeadlines(){
    if(!headlineBox)return;
    const vals=[...document.querySelectorAll('#nvHeadlineList input[data-nvh]')].map(x=>x.value);
    headlineBox.innerHTML=vals.map(v=>String(v).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))).join('<br>');
  }
  document.querySelectorAll('#nvHeadlineList input[data-nvh]').forEach(x=>x.addEventListener('input',syncHeadlines));
  syncHeadlines();
  // 모든 네이버 메인 텍스트를 Pretendard로 강제
  c.querySelectorAll('*').forEach(el=>el.style.fontFamily="'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif");
})();
