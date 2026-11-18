/* Harmony HR — interaksi ringan (tanpa dependensi) */
(function () {
  'use strict';

  var doc = document;
  var header = doc.querySelector('.header');
  var toggle = doc.querySelector('.nav-toggle');
  var nav = doc.getElementById('nav');

  /* Tahun otomatis di footer */
  var yr = doc.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Header: bayangan saat scroll */
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile */
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });

  /* Reveal saat scroll */
  var items = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* FAQ: buka satu per satu */
  var faqs = doc.querySelectorAll('.faq-item');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ------------------------------------------------------------------
     Formulir demo
     - Validasi dengan pesan Bahasa Indonesia + ringkasan error yang fokus
     - Jika form[data-endpoint] diisi → kirim via fetch (POST JSON)
     - Jika kosong → buka WhatsApp dengan pesan terisi otomatis
  ------------------------------------------------------------------ */
  var form = doc.getElementById('demo-form');
  if (!form) return;

  var summary = doc.getElementById('form-summary');
  var summaryList = doc.getElementById('summary-list');
  var statusEl = doc.getElementById('form-status');
  var btn = doc.getElementById('submit-btn');

  var labels = {
    'f-nama': 'Nama', 'f-hp': 'Nomor Handphone', 'f-email': 'Email',
    'f-perusahaan': 'Perusahaan', 'f-domisili': 'Domisili', 'f-subjek': 'Subjek', 'f-pertanyaan': 'Pertanyaan'
  };

  function messageFor(input) {
    var v = input.validity, name = labels[input.id];
    if (v.valueMissing) return name + ' wajib diisi.';
    if (v.typeMismatch && input.type === 'email') return 'Format email belum benar, contoh: hr@mail.com.';
    if (v.patternMismatch) return 'Nomor handphone hanya boleh berisi angka, +, tanda kurung, atau spasi (min. 8 karakter).';
    return name + ' belum valid.';
  }

  function setError(input, msg) {
    var err = doc.getElementById(input.getAttribute('aria-describedby'));
    if (msg) { input.setAttribute('aria-invalid', 'true'); err.textContent = msg; err.classList.add('is-visible'); }
    else { input.removeAttribute('aria-invalid'); err.textContent = ''; err.classList.remove('is-visible'); }
  }

  form.addEventListener('input', function (e) {
    if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity()) setError(e.target, '');
  });
  form.addEventListener('focusout', function (e) {
    if (e.target.matches('input, textarea') && e.target.value) setError(e.target, e.target.checkValidity() ? '' : messageFor(e.target));
  });

  function say(text, kind) { statusEl.textContent = text; statusEl.className = 'form-status ' + (kind || ''); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    say('');
    var fields = Array.prototype.slice.call(form.querySelectorAll('input, textarea'));
    var invalid = [];
    fields.forEach(function (f) {
      if (f.checkValidity()) setError(f, '');
      else { setError(f, messageFor(f)); invalid.push(f); }
    });

    if (invalid.length) {
      summaryList.innerHTML = '';
      invalid.forEach(function (f) {
        var li = doc.createElement('li'), a = doc.createElement('a');
        a.href = '#' + f.id; a.textContent = messageFor(f);
        a.addEventListener('click', function (ev) { ev.preventDefault(); f.focus(); });
        li.appendChild(a); summaryList.appendChild(li);
      });
      summary.classList.add('is-visible');
      summary.focus();
      return;
    }
    summary.classList.remove('is-visible');

    var data = {};
    fields.forEach(function (f) { data[f.name] = f.value.trim(); });
    var endpoint = form.getAttribute('data-endpoint');

    if (endpoint) {
      btn.disabled = true; btn.textContent = 'Mengirim…';
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        form.reset();
        say('Terima kasih! Pengajuan Anda sudah kami terima. Tim kami akan segera menghubungi Anda.', 'ok');
      }).catch(function () {
        say('Maaf, pengiriman gagal. Silakan coba lagi atau hubungi kami di (021) 84311636.', 'bad');
      }).finally(function () { btn.disabled = false; btn.textContent = 'Kirim'; });
      return;
    }

    /* Fallback: WhatsApp */
    var text = [
      'Halo Harmony HR, saya ingin mengajukan demo.',
      '',
      'Nama: ' + data.nama,
      'No. HP: ' + data['nomor-handphone'],
      'Email: ' + data.email,
      'Perusahaan: ' + data.perusahaan,
      'Domisili: ' + data.domisili,
      'Subjek: ' + data.subjek,
      'Pertanyaan: ' + data.pertanyaan
    ].join('\n');
    var url = 'https://wa.me/' + form.getAttribute('data-wa') + '?text=' + encodeURIComponent(text);
    say('Membuka WhatsApp dengan pesan yang sudah terisi. Tekan kirim di WhatsApp untuk menyelesaikan pengajuan.', 'ok');
    window.open(url, '_blank', 'noopener');
  });
})();
