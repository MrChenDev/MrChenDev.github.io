/* =========================================================
   陈工的世界 — 交互增强
   原则：所有内容在无 JS 时依然完整可见；JS 只做增强。
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- 主题切换 ---------- */
  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* 隐私模式下忽略 */ }

    var btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      var isLight = theme === 'light';
      btn.setAttribute('aria-label', isLight ? '切换到深色模式' : '切换到浅色模式');
      btn.setAttribute('aria-pressed', String(isLight));
      btn.innerHTML = isLight ? ICON_MOON : ICON_SUN;
    }
  }

  var ICON_SUN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="4"></circle>' +
    '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>' +
    '</svg>';

  var ICON_MOON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>' +
    '</svg>';

  var themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    applyTheme(currentTheme());
    themeBtn.addEventListener('click', function () {
      applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
    });
  }

  /* ---------- 移动端菜单 ---------- */
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navLinks = document.querySelector('[data-nav-links]');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // 点击任意导航项后收起
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // 视口变宽时复位，避免桌面端残留展开态
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 入场动画（滚动进入视口） ---------- */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    reveals.forEach(function (el) { io.observe(el); });

    // 兜底：2.5s 后仍未触发的元素直接显示，避免长页面下方内容永久隐藏
    window.setTimeout(function () {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 2) {
          el.classList.add('is-visible');
        }
      });
    }, 2500);
  } else {
    // 不支持 IO：直接全部显示
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 摄影分类筛选 ---------- */
  var chips = document.querySelectorAll('[data-filter]');
  var photoCards = document.querySelectorAll('[data-category]');

  if (chips.length && photoCards.length) {
    var emptyHint = document.querySelector('[data-empty-hint]');

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var target = chip.getAttribute('data-filter');

        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-pressed', String(on));
        });

        var visible = 0;
        photoCards.forEach(function (card) {
          var match = target === 'all' || card.getAttribute('data-category') === target;
          card.hidden = !match;
          if (match) visible += 1;
        });

        // 静态站作品数量有限，筛选后可能为空，给明确反馈而不是一片空白
        if (emptyHint) emptyHint.hidden = visible > 0;
      });
    });
  }

  /* ---------- 联系表单（纯静态：交由本机邮件客户端发送）---------- */
  var mailForm = document.querySelector('[data-mail-form]');

  if (mailForm) {
    var hint = mailForm.querySelector('[data-form-hint]');
    var TO = mailForm.getAttribute('data-mail-to') || '2969823274@qq.com';

    mailForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = new FormData(mailForm);
      var name = (data.get('name') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var subject = (data.get('subject') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();

      if (!name || !subject || !message) {
        if (hint) {
          hint.textContent = '请先填写姓名、主题和消息内容（标 * 的为必填项）。';
          hint.style.color = '#f87171';
        }
        return;
      }

      var body = [
        '姓名：' + name,
        phone ? '电话：' + phone : '',
        email ? '邮箱：' + email : '',
        '',
        message,
        '',
        '—— 来自个人主页联系表单'
      ].filter(Boolean).join('\n');

      var href = 'mailto:' + TO +
        '?subject=' + encodeURIComponent('[个人主页] ' + subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = href;

      if (hint) {
        hint.textContent = '已唤起邮件客户端，请确认内容后点击发送。若没有反应，请直接发邮件到 ' + TO + '。';
        hint.style.color = '';
      }
    });
  }

  /* ---------- 年份自动更新 ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
