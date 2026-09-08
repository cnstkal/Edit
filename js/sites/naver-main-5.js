
(function(){
  const DEFAULTS=[
    {name:'호호호호',text:'유우님 새로운 스킨 보셨어요??\n잘 어울리실것같던뎅 ㅎ',time:'오전 11:08',color:'#7289da'},
    {name:'백금독수리온세상을놀라게하다',text:'백은의 발키리요?\n예쁘긴 하더라구요 ㅠ\n탱커였으면 샀을 듯',time:'오전 11:09',color:'#43b581'},
    {name:'유유',text:'봤어요\n근데 저는 불꽃의 선봉장이 더 괜찮은 것 같아서...',time:'오전 11:10',color:'#faa61a'},
    {name:'호호호호',text:'허거덩 그거 엄청 비싸던뎅 ㅠ\n발키리한다 그랬음 선물해주려고했져',time:'오전 11:11',color:'#7289da'},
    {name:'유유',text:'하하...',time:'오전 11:12',color:'#faa61a'}
  ];
  let messages=DEFAULTS.map(x=>({...x,avatar:''}));
  const server=document.getElementById('discordServerName');
  const channel=document.getElementById('discordChannelName');
  const serverPv=document.getElementById('discordServerPreview');
  const channelPv=document.getElementById('discordChannelPreview');
  const list=document.getElementById('discordMessageList');
  const chat=document.getElementById('discordChatPreview');
  const add=document.getElementById('discordAddMessage');
  if(!server||!channel||!list||!chat)return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const discordMark=(color)=>`<svg class="discord-avatar-mark" viewBox="0 0 24 24" aria-hidden="true"><path fill="white" d="M19.54 5.16A16.2 16.2 0 0 0 15.56 4l-.48.98a14.4 14.4 0 0 0-4.16 0L10.44 4a16.2 16.2 0 0 0-3.98 1.16C3.94 8.7 3.26 12.14 3.6 15.54a16.3 16.3 0 0 0 4.9 2.5l1.18-1.62c-.65-.25-1.27-.56-1.84-.93l.45-.34c3.55 1.63 7.4 1.63 10.91 0l.46.34c-.57.37-1.2.68-1.85.93l1.18 1.62a16.2 16.2 0 0 0 4.9-2.5c.4-4-.68-7.4-3.35-10.38ZM9.9 14.16c-1.05 0-1.9-.96-1.9-2.13s.83-2.13 1.9-2.13 1.92.96 1.9 2.13c0 1.17-.84 2.13-1.9 2.13Zm4.2 0c-1.05 0-1.9-.96-1.9-2.13s.83-2.13 1.9-2.13 1.92.96 1.9 2.13c0 1.17-.84 2.13-1.9 2.13Z"/></svg>`;
  function renderPreview(){
    serverPv.textContent=server.value||'황아의 합짭이';
    channelPv.textContent='# '+(channel.value||'황잡이');
    chat.innerHTML='';
    messages.forEach((m,i)=>{
      const row=document.createElement('div');row.className='discord-msg';
      const avatar=document.createElement('div');avatar.className='discord-avatar';avatar.style.background=m.color||'#7289da';
      if(m.avatar){const im=document.createElement('img');im.src=m.avatar;im.alt='';avatar.appendChild(im)}else avatar.innerHTML=discordMark(m.color);
      const body=document.createElement('div');
      body.innerHTML='<div class="discord-msg-head"><span class="discord-msg-name">'+esc(m.name||'사용자')+'</span><span class="discord-msg-time">'+esc(m.time||'오전 11:08')+'</span></div><div class="discord-msg-text">'+esc(m.text||'')+'</div>';
      row.append(avatar,body);chat.appendChild(row);
    });
  }
  function renderEditors(){
    list.innerHTML='';
    messages.forEach((m,i)=>{
      const card=document.createElement('div');card.className='discord-message-card';
      card.innerHTML='<div class="discord-message-top"><span class="discord-message-title">채팅 '+(i+1)+'</span><button type="button" class="discord-remove" data-i="'+i+'">삭제</button></div>'+
        '<div class="field"><label>이름</label><input type="text" data-i="'+i+'" data-k="name" value="'+esc(m.name)+'"></div>'+
        '<div class="field"><label>메시지</label><textarea data-i="'+i+'" data-k="text" rows="2">'+esc(m.text)+'</textarea></div>'+
        '<div class="field"><label>시간</label><input type="text" data-i="'+i+'" data-k="time" value="'+esc(m.time)+'"></div>'+
        '<div class="discord-color-row"><div class="field"><label>아바타 색상</label><input type="color" data-i="'+i+'" data-k="color" value="'+(m.color||'#7289da')+'"></div><div class="field"><label>아바타 사진</label><input class="discord-file" type="file" accept="image/*" data-i="'+i+'" data-k="avatar"></div></div>';
      list.appendChild(card);
    });
    list.querySelectorAll('[data-k]').forEach(el=>{
      el.addEventListener('input',e=>{const i=+e.target.dataset.i,k=e.target.dataset.k;if(k!=='avatar')messages[i][k]=e.target.value;renderPreview();});
      el.addEventListener('change',e=>{const i=+e.target.dataset.i,k=e.target.dataset.k;if(k==='avatar'){const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{messages[i].avatar=r.result;renderPreview()};r.readAsDataURL(f)}else{messages[i][k]=e.target.value;renderPreview()}});
    });
    list.querySelectorAll('.discord-remove').forEach(b=>b.addEventListener('click',()=>{if(messages.length<=1)return;messages.splice(+b.dataset.i,1);renderEditors();renderPreview()}));
  }
  server.addEventListener('input',renderPreview);channel.addEventListener('input',renderPreview);
  add.addEventListener('click',()=>{messages.push({name:'사용자',text:'새로운 메시지',time:'오전 11:13',color:'#5865f2',avatar:''});renderEditors();renderPreview()});
  renderEditors();renderPreview();
})();
