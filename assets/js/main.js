/* Harmony HR — interaksi (tanpa dependensi) */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var animOn = root.classList.contains('anim');
  var header = doc.querySelector('.header');
  var toggle = doc.querySelector('.nav-toggle');
  var nav = doc.getElementById('nav');
  var EASE = 'cubic-bezier(.22, 1, .36, 1)';

  /* Tahun otomatis di footer */
  var yr = doc.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Header: garis bawah saat halaman di-scroll */
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  requestAnimationFrame(onScroll);
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

  /* Muncul halus saat di-scroll */
  var items = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && animOn) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ------------------------------------------------------------------
     Slip gaji interaktif (ilustrasi)
     Total = gaji pokok + tunjangan + lembur − potongan absen
  ------------------------------------------------------------------ */
  var slip = doc.getElementById('slip');
  if (slip) {
    var nf = new Intl.NumberFormat('id-ID');
    var HARI_KERJA = 22, POKOK = 8000000, TUNJANGAN = 1500000, TARIF_LEMBUR = 50000, POTONGAN_HARI = 250000;
    var limits = { hadir: [16, HARI_KERJA], lembur: [0, 20] };
    var state = { hadir: 20, lembur: 6 };
    var shown = POKOK + TUNJANGAN + state.lembur * TARIF_LEMBUR - (HARI_KERJA - state.hadir) * POTONGAN_HARI;
    var tween = null;

    var el = {
      hadir: doc.getElementById('v-hadir'), lembur: doc.getElementById('v-lembur'),
      lLembur: doc.getElementById('l-lembur'), aLembur: doc.getElementById('a-lembur'),
      lPot: doc.getElementById('l-pot'), aPot: doc.getElementById('a-pot'),
      total: doc.getElementById('v-total')
    };

    function render() {
      var absen = HARI_KERJA - state.hadir;
      var lembur = state.lembur * TARIF_LEMBUR, pot = absen * POTONGAN_HARI;
      var total = POKOK + TUNJANGAN + lembur - pot;

      el.hadir.textContent = state.hadir;
      el.lembur.textContent = state.lembur;
      el.lLembur.textContent = 'Lembur · ' + state.lembur + ' jam × ' + nf.format(TARIF_LEMBUR);
      el.aLembur.textContent = nf.format(lembur);
      el.lPot.textContent = 'Potongan absen · ' + absen + ' hari';
      el.aPot.textContent = pot ? '− ' + nf.format(pot) : '0';

      slip.querySelectorAll('.stepper button').forEach(function (b) {
        var f = b.getAttribute('data-field'), step = parseInt(b.getAttribute('data-step'), 10);
        b.disabled = (step < 0 && state[f] <= limits[f][0]) || (step > 0 && state[f] >= limits[f][1]);
      });

      if (tween) cancelAnimationFrame(tween);
      if (!animOn) { el.total.textContent = nf.format(total); shown = total; return; }
      var from = shown, t0 = null;
      (function frame(t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / 320), e = 1 - Math.pow(1 - k, 3);
        shown = Math.round(from + (total - from) * e);
        el.total.textContent = nf.format(shown);
        if (k < 1) tween = requestAnimationFrame(frame);
      })(performance.now());
    }

    slip.addEventListener('click', function (e) {
      var b = e.target.closest('.stepper button');
      if (!b || b.disabled) return;
      var f = b.getAttribute('data-field');
      state[f] = Math.max(limits[f][0], Math.min(limits[f][1], state[f] + parseInt(b.getAttribute('data-step'), 10)));
      render();
    });
    render();
  }

  /* ------------------------------------------------------------------
     FAQ: buka-tutup halus, satu per satu
  ------------------------------------------------------------------ */
  var faqs = Array.prototype.slice.call(doc.querySelectorAll('.qa'));

  function setFaq(d, open) {
    var ans = d.querySelector('.answer');
    if (!animOn || !ans.animate) { d.open = open; return; }
    if (d._anim) d._anim.cancel();
    d._closing = false;
    var pb = parseFloat(getComputedStyle(ans).paddingBottom) || 0, h;
    ans.style.overflow = 'hidden';
    if (open) {
      d.open = true;
      h = ans.offsetHeight;
      d._anim = ans.animate(
        { height: ['0px', h + 'px'], paddingBottom: ['0px', pb + 'px'], opacity: [0, 1] },
        { duration: 320, easing: EASE }
      );
      d._anim.onfinish = d._anim.oncancel = function () { ans.style.overflow = ''; d._anim = null; };
    } else {
      d._closing = true;
      h = ans.offsetHeight;
      d._anim = ans.animate(
        { height: [h + 'px', '0px'], paddingBottom: [pb + 'px', '0px'], opacity: [1, 0] },
        { duration: 220, easing: EASE }
      );
      d._anim.onfinish = function () { d.open = false; d._closing = false; ans.style.overflow = ''; d._anim = null; };
      d._anim.oncancel = function () { d._closing = false; ans.style.overflow = ''; };
    }
  }
  faqs.forEach(function (d) {
    d.querySelector('summary').addEventListener('click', function (e) {
      e.preventDefault();
      var willOpen = !(d.open && !d._closing);
      if (willOpen) faqs.forEach(function (o) { if (o !== d && o.open) setFaq(o, false); });
      setFaq(d, willOpen);
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
