/* Dhig Labs — main.js
   Two enhancements only: theme toggle and mobile nav.
   The site is fully usable with this file absent or JS disabled. */

(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  /* ---- Theme toggle ---- */

  var themeBtn = document.querySelector('.theme-toggle');

  function currentTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit === 'dark' || explicit === 'light') return explicit;
    var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    return mq && mq.matches ? 'dark' : 'light';
  }

  function setLabel() {
    // Button names the theme it will switch TO.
    themeBtn.textContent = currentTheme() === 'dark' ? 'Light' : 'Dark';
  }

  if (themeBtn) {
    themeBtn.hidden = false;
    setLabel();
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        /* private mode or storage disabled — theme still applies this visit */
      }
      setLabel();
    });
  }

  /* ---- Mobile nav ---- */

  var menuBtn = document.querySelector('.menu-toggle');
  var navList = document.getElementById('site-nav');

  if (menuBtn && navList) {
    menuBtn.hidden = false;
    menuBtn.addEventListener('click', function () {
      var open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      navList.classList.toggle('is-open', !open);
    });
  }
})();
