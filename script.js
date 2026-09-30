const menu=document.querySelector('.menu');
const nav=document.querySelector('.site-header nav');

if(menu&&nav){
  const closeMenu=()=>{
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','Open navigation');
  };

  menu.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });

  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&nav.classList.contains('open')){
      closeMenu();
      menu.focus();
    }
  });

  document.addEventListener('click',e=>{
    if(nav.classList.contains('open')&&!nav.contains(e.target)&&!menu.contains(e.target)){
      closeMenu();
    }
  });
}
