(function(){
  var nav=document.querySelector('.site-header>.site-nav');
  if(!nav)return;
  var menu=document.createElement('details');menu.className='public-menu';
  var summary=document.createElement('summary');summary.textContent='Menu';
  nav.before(menu);menu.append(summary,nav);
  var media=window.matchMedia('(max-width:760px)');
  function layout(){menu.open=!media.matches;}
  media.addEventListener('change',layout);layout();
  var names={en:'Menu',es:'Menú',pt:'Menu',fr:'Menu',it:'Menu',de:'Menü',ru:'Меню',uk:'Меню',ja:'メニュー',zh:'菜单'};
  function language(lang){summary.textContent=names[lang]||names.en;}
  language(document.documentElement.lang);
  window.addEventListener('human-rounds:language',function(e){language(e.detail.lang);});
  menu.addEventListener('keydown',function(e){if(e.key==='Escape'&&media.matches){menu.open=false;summary.focus();}});
  nav.addEventListener('click',function(e){if(e.target.closest('a')&&media.matches)menu.open=false;});
})();
