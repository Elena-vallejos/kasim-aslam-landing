(function () {
  if (window.lucide) window.lucide.createIcons();

  var deadline = new Date('2026-10-31T23:59:59').getTime();
  var cd = document.getElementById('countdown');
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var left = Math.max(0, deadline - Date.now());
    var s = Math.floor(left / 1000);
    var parts = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    Object.keys(parts).forEach(function (k) {
      cd.querySelector('[data-unit="' + k + '"]').textContent = pad(parts[k]);
    });
  }
  if (cd) { tick(); setInterval(tick, 1000); }

  document.querySelectorAll('.js-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.nextElementSibling;
      var invalid = Array.prototype.find.call(form.elements, function (el) { return el.required && !el.checkValidity(); });
      if (invalid) {
        msg.textContent = invalid.type === 'email' ? 'Please enter a valid email address.' : 'Please fill in the required fields.';
        msg.className = 'form-msg err';
        invalid.focus();
        return;
      }
      msg.textContent = 'You’re on the list! An advisor will reach out within 24 hours. (Demo — no data was sent.)';
      msg.className = 'form-msg ok';
      form.reset();
    });
  });

  var panel = document.getElementById('chat-panel');
  var body = document.getElementById('chat-body');
  document.querySelectorAll('[data-chat-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { panel.hidden = !panel.hidden; });
  });
  var answers = {
    program: 'Simple: I diagnose your business, install AI and Google Ads systems that actually convert, then automate the operations so it doesn’t all depend on you. Test. Scale. Automate.',
    cost: 'I don’t sell cheap advice. The Accelerator is an investment, not an expense — and with the guarantee, the risk is on me, not you.',
    ads: 'Most accounts I audit are bleeding budget on the wrong campaign structure. Fix the structure first, then scale — not the other way around.',
    hiring: 'Your problem probably isn’t hiring. Before you hire ten more people, figure out what the first ten are actually doing. Document it. Delegate it. Measure it.'
  };
  document.querySelectorAll('[data-ask]').forEach(function (b) {
    b.addEventListener('click', function () {
      var q = document.createElement('p');
      q.className = 'msg me';
      q.textContent = b.textContent;
      var a = document.createElement('p');
      a.className = 'msg';
      a.textContent = answers[b.getAttribute('data-ask')];
      body.appendChild(q);
      body.appendChild(a);
      body.scrollTop = body.scrollHeight;
    });
  });

  var io = 'IntersectionObserver' in window && new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-head, .card, .steps li, .benefits li, .media-frame, .offer, .stats div').forEach(function (el) {
    el.classList.add('reveal');
    if (io) io.observe(el); else el.classList.add('in');
  });
})();
