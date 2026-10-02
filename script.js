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
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) { if (el.id) data[el.id] = el.value; });
      data.date = new Date().toISOString();
      try {
        var saved = JSON.parse(localStorage.getItem('kasim-registrations') || '[]');
        saved.push(data);
        localStorage.setItem('kasim-registrations', JSON.stringify(saved));
      } catch (err) {}
      var name = (data['f-name'] || '').trim().split(' ')[0];
      if (form.classList.contains('apply-form')) {
        var box = document.createElement('div');
        box.className = 'form-success';
        box.setAttribute('role', 'status');
        box.innerHTML = '<i data-lucide="circle-check"></i><h3>¡Inscripción completada!</h3><p></p>';
        box.querySelector('p').textContent = (name ? name + ', your' : 'Your') + ' seat request is in. An advisor will contact you within 24 hours.';
        form.replaceWith(box);
        msg.textContent = '';
        if (window.lucide) window.lucide.createIcons();
      } else {
        msg.textContent = '¡Inscripción completada! We’ll send the details to your email.';
        msg.className = 'form-msg ok';
        form.reset();
      }
    });
  });

  var panel = document.getElementById('chat-panel');
  var body = document.getElementById('chat-body');
  document.querySelectorAll('[data-chat-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { panel.hidden = !panel.hidden; });
  });
  var answers = {
    program: 'Simple: I diagnose your business, install AI and Google Ads systems that actually convert, then automate the operations so it doesn’t all depend on you. Test. Scale. Automate.',
    who: 'Service founders and small agencies doing roughly $10k–$100k a month who already run Google Ads (or are ready to) and still answer leads by hand.',
    cost: 'I don’t sell cheap advice. The Accelerator is an investment, not an expense — and with the guarantee, the risk is on me, not you.',
    price: '$2,997 one time, or 3 payments of $1,099. The full stack is valued at $12,470 — one or two new clients pay for it.',
    time: 'Plan on 3–4 hours a week: one live coaching call plus implementing what we decide. We set the systems up with you, not for you to figure out alone.',
    tech: 'You don’t need to be. Every automation is a plug-and-play template and we install it with you on the calls.',
    budget: 'Most founders start with $1,500–$5,000 a month in ad spend. Below that we focus on structure and conversion first, then scale.',
    results: 'First optimized campaigns and the AI lead responder go live in weeks 3–4. The full system is running by day 90.',
    guarantee: 'Two: a 14-day money-back guarantee, no questions asked — and if you do the work and don’t have steady qualified leads by day 90, I keep coaching you for free until you do.',
    bonus: 'The AI Lead Automation Hub (Claude Skill + MCP) so follow-up runs itself, this “Ask Kasim” AI mentor 24/7, and a private community of founders building the same system.',
    ads: 'Most accounts I audit are bleeding budget on the wrong campaign structure. Fix the structure first, then scale — not the other way around.',
    ai: 'AI answers and qualifies every lead in minutes, books the call and logs it in your CRM. Leads go cold in hours — AI makes sure that never happens.',
    hiring: 'Your problem probably isn’t hiring. Before you hire ten more people, figure out what the first ten are actually doing. Document it. Delegate it. Measure it.',
    seats: 'Only 20 founders per cohort because I review every account live — 13 are already taken. Enrollment closes October 31, 2026.',
    apply: 'Scroll to the form at the bottom of the page, add your name, email and WhatsApp, and click “Claim my seat”. An advisor reaches out within 24 hours.'
  };
  var keywords = {
    program: ['program', 'programa', 'accelerator', 'what is', 'qué es', 'que es', 'how it works', 'cómo funciona', 'como funciona'],
    who: ['who', 'quién', 'quien', 'para quién', 'for me', 'para mí', 'para mi'],
    price: ['price', 'cost', 'how much', 'precio', 'cuesta', 'cuánto', 'cuanto', 'pay', 'pagar', 'pago'],
    cost: ['worth', 'vale la pena', 'value', 'valor'],
    time: ['time', 'tiempo', 'hours', 'horas', 'week', 'semana'],
    tech: ['technical', 'técnico', 'tecnico', 'code', 'código', 'skills', 'conocimientos'],
    budget: ['budget', 'presupuesto', 'spend', 'inversión en anuncios'],
    results: ['result', 'resultado', 'when', 'cuándo', 'cuando', 'fast', 'rápido', 'rapido'],
    guarantee: ['guarantee', 'garantía', 'garantia', 'refund', 'reembolso', 'money back', 'devolución'],
    bonus: ['bonus', 'bono', 'extra', 'community', 'comunidad'],
    ads: ['google', 'ads', 'anuncios', 'campaign', 'campaña', 'ppc'],
    ai: ['ai', 'ia', 'automation', 'automatiza', 'bot', 'leads', 'crm'],
    hiring: ['hire', 'hiring', 'contratar', 'team', 'equipo', 'employee', 'empleado'],
    seats: ['seat', 'cupo', 'cupos', 'plaza', 'left', 'quedan', 'deadline', 'fecha', 'close', 'cierra'],
    apply: ['sign up', 'apply', 'register', 'join', 'inscrib', 'inscripción', 'registr', 'enroll', 'unirme']
  };
  function addMsg(text, me) {
    var p = document.createElement('p');
    p.className = me ? 'msg me' : 'msg';
    p.textContent = text;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }
  function match(text) {
    var t = ' ' + text.toLowerCase() + ' ';
    var best = null, score = 0;
    Object.keys(keywords).forEach(function (k) {
      var n = keywords[k].filter(function (w) { return w.length <= 3 ? new RegExp('\\b' + w + '\\b').test(t) : t.indexOf(w) !== -1; }).length;
      if (n > score) { score = n; best = k; }
    });
    return best;
  }
  document.querySelectorAll('[data-ask]').forEach(function (b) {
    b.addEventListener('click', function () {
      addMsg(b.textContent, true);
      addMsg(answers[b.getAttribute('data-ask')]);
    });
  });
  var chatForm = document.getElementById('chat-form');
  if (chatForm) chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('chat-text');
    var text = input.value.trim();
    if (!text) return;
    addMsg(text, true);
    var k = match(text);
    addMsg(k ? answers[k] : 'Good question. I don’t have a documented answer for that yet — try one of the suggested questions, or claim your seat and ask me live on the coaching call.');
    input.value = '';
  });

  var io = 'IntersectionObserver' in window && new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-head, .card, .steps li, .benefits li, .media-frame, .offer, .stats div').forEach(function (el) {
    el.classList.add('reveal');
    if (io) io.observe(el); else el.classList.add('in');
  });
})();
