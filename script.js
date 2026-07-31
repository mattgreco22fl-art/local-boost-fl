/* Local Boost FL
   No scroll listeners anywhere. Header state and reveals both use IntersectionObserver. */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------
     1. Header stuck state (IntersectionObserver on a sentinel)
     --------------------------------------------------------- */
  var hdr = document.getElementById('hdr');
  var sentinel = document.getElementById('top-sentinel');

  if (hdr && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      hdr.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------------------------------------------------------
     2. Mobile navigation
     --------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var desktop = window.matchMedia('(min-width: 900px)');

  function setNav(open) {
    if (!burger || !nav) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      setNav(burger.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && !desktop.matches) {
        setNav(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        burger.focus();
      }
    });

    // Reset when crossing into desktop so the panel never gets stranded open.
    desktop.addEventListener('change', function (e) {
      if (e.matches) setNav(false);
    });
  }

  /* ---------------------------------------------------------
     3. Expandable service cards
     Single open at a time. Height is animated explicitly so the
     panel can push the page down, then released to auto so the
     layout stays correct if the viewport changes.
     --------------------------------------------------------- */
  var list = document.getElementById('svc-list');

  if (list) {
    var buttons = Array.prototype.slice.call(list.querySelectorAll('.svc__btn'));

    var panels = buttons.map(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      panel.style.height = '0px';
      panel.inert = true;
      return panel;
    });

    function collapse(btn, panel) {
      if (btn.getAttribute('aria-expanded') !== 'true') return;
      btn.setAttribute('aria-expanded', 'false');
      panel.style.height = panel.scrollHeight + 'px';
      void panel.offsetHeight; // commit the pixel height before animating to 0
      panel.style.height = '0px';
      panel.inert = true;
    }

    function expand(btn, panel) {
      btn.setAttribute('aria-expanded', 'true');
      panel.inert = false;
      panel.style.height = panel.scrollHeight + 'px';
    }

    buttons.forEach(function (btn, i) {
      var panel = panels[i];

      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';

        buttons.forEach(function (other, j) {
          if (other !== btn) collapse(other, panels[j]);
        });

        if (isOpen) {
          collapse(btn, panel);
        } else {
          expand(btn, panel);
        }
      });

      // Once open, release to auto so long copy reflows correctly on resize.
      panel.addEventListener('transitionend', function (e) {
        if (e.target !== panel || e.propertyName !== 'height') return;
        if (btn.getAttribute('aria-expanded') === 'true') {
          panel.style.height = 'auto';
        }
      });
    });
  }

  /* ---------------------------------------------------------
     4. Scroll reveals
     --------------------------------------------------------- */
  var revealables = document.querySelectorAll('[data-rv]');

  function showAll() {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-in');
    });
  }

  if (!revealables.length) {
    // nothing to do
  } else if (reduce.matches || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(revealables, function (el) {
      io.observe(el);
    });

    // If the user turns reduced motion on mid-session, stop hiding content.
    reduce.addEventListener('change', function (e) {
      if (e.matches) {
        io.disconnect();
        showAll();
      }
    });
  }
})();
