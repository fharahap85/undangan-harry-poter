/* =========================================================
   Undangan Digital — logika frontend (tanpa backend)
   Data diambil dari window.INVITE (assets/js/config.js)
   RSVP & ucapan disimpan di localStorage (per perangkat).
   ========================================================= */
(() => {
  const C = window.INVITE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage penuh/diblokir */ } }
  };

  const fmtDate = (iso) => new Date(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
  const fmtTime = (iso) => new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Lilin dekorasi ---------- */
  const candles = $(".candles");
  const count = window.innerWidth < 600 ? 9 : 16;
  for (let i = 0; i < count; i++) {
    const c = document.createElement("span");
    c.className = "candle";
    c.style.left = `${Math.random() * 96 + 2}%`;
    c.style.top = `${Math.random() * 85 + 5}%`;
    c.style.animationDelay = `${-Math.random() * 7}s`;
    c.style.transform = `scale(${0.6 + Math.random() * 0.6})`;
    candles.appendChild(c);
  }

  /* ---------- 1. Gerbang akses ---------- */
  const params = new URLSearchParams(location.search);
  let code = (params.get("u") || sessionStorage.getItem("invite-code") || "").toUpperCase().trim();
  let guest = C.guests[code];

  function showGate(msg) {
    $("#gate").hidden = false;
    $("#envelope").hidden = true;
    if (msg) $("#gateError").textContent = msg;
    $("#gateCode").focus();
  }

  $("#gateForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#gateCode").value.toUpperCase().trim();
    if (!input) return showGate("Masukkan kode undangan terlebih dahulu.");
    if (!C.guests[input]) return showGate("Kode tidak dikenali. Periksa kembali kode pada pesan undangan Anda.");
    code = input; guest = C.guests[input];
    history.replaceState(null, "", `?u=${code}`);
    $("#gate").hidden = true;
    start();
  });


  /* ---------- 2. Isi data & amplop ---------- */
  function start() {
    sessionStorage.setItem("invite-code", code);
    const { groom, bride } = C.couple;
    const bind = {
      guestName: guest.name,
      initials: C.couple.initials,
      groomShort: groom.short, brideShort: bride.short,
      groomFull: groom.full, brideFull: bride.full,
      groomParents: groom.parents, brideParents: bride.parents,
      groomInitial: groom.short[0], brideInitial: bride.short[0],
      coupleShort: `${groom.short} & ${bride.short}`,
      mainDateLong: fmtDate(C.mainDate)
    };
    $$("[data-bind]").forEach((el) => (el.textContent = bind[el.dataset.bind] ?? ""));
    $$("[data-bind-value]").forEach((el) => (el.value = bind[el.dataset.bindValue] ?? ""));
    document.title = `Undangan ${bind.coupleShort} untuk ${guest.name}`;

    $("#envelope").hidden = false;
    renderEvents(); renderStory(); renderGallery(); setupRSVP(); setupWishes(); renderGifts();
  }

  $("#openLetter").addEventListener("click", () => {
    const env = $("#openLetter");
    if (env.classList.contains("is-open")) return;
    env.classList.add("is-open");
    music.play();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      $("#envelope").hidden = true;
      $("#letter").hidden = false;
      $("#dock").hidden = false;
      $("#musicBtn").hidden = false;
      document.body.classList.remove("is-locked");
      window.scrollTo(0, 0);
      startCountdown();
      watchSections();
    }, reduce ? 0 : 1500);
  });

  /* ---------- Countdown ---------- */
  function startCountdown() {
    const target = new Date(C.mainDate).getTime();
    const el = { d: $("[data-cd=d]"), h: $("[data-cd=h]"), m: $("[data-cd=m]"), s: $("[data-cd=s]") };
    const tick = () => {
      let diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 864e5); diff -= d * 864e5;
      const h = Math.floor(diff / 36e5); diff -= h * 36e5;
      const m = Math.floor(diff / 6e4); diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);
      el.d.textContent = d; el.h.textContent = String(h).padStart(2, "0");
      el.m.textContent = String(m).padStart(2, "0"); el.s.textContent = String(s).padStart(2, "0");
      if (target <= Date.now()) $("#countdown").setAttribute("aria-label", "Acara telah berlangsung");
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Acara + kalender ---------- */
  function renderEvents() {
    $("#eventList").innerHTML = C.events.map((ev, i) => `
      <article class="event">
        <h3>${esc(ev.title)}</h3>
        <p>${fmtDate(ev.start)}</p>
        <p class="event__time">${fmtTime(ev.start)} – ${fmtTime(ev.end)} WIB</p>
        <p class="event__place">${esc(ev.place)}<br>${esc(ev.address)}</p>
        <div class="event__actions">
          <a href="${ev.maps}" target="_blank" rel="noopener">Lihat peta</a>
          <button type="button" data-ics="${i}">Simpan ke kalender</button>
        </div>
      </article>`).join("");
    $$("[data-ics]").forEach((b) => b.addEventListener("click", () => downloadICS(C.events[b.dataset.ics])));
  }

  function downloadICS(ev) {
    const t = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Undangan Digital//ID", "BEGIN:VEVENT",
      `UID:${Date.now()}@undangan`, `DTSTAMP:${t(new Date().toISOString())}`,
      `DTSTART:${t(ev.start)}`, `DTEND:${t(ev.end)}`,
      `SUMMARY:${ev.title} ${C.couple.groom.short} & ${C.couple.bride.short}`,
      `LOCATION:${ev.place}, ${ev.address}`, "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${ev.title.toLowerCase().replace(/\s+/g, "-")}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast("Jadwal diunduh. Buka file untuk menambah ke kalender.");
  }

  /* ---------- Kisah ---------- */
  function renderStory() {
    $("#storyList").innerHTML = C.story.map((s) => `
      <li><time>${esc(s.year)}</time><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join("");
  }

  /* ---------- Galeri (placeholder, ganti dengan foto asli) ---------- */
  const tones = [
    ["#3a4372", "#121729"], ["#7b1e2c", "#3a1d2a"], ["#c49a45", "#5b4a38"],
    ["#2c3561", "#7b1e2c"], ["#5b4a38", "#1d2442"], ["#e3c47f", "#7b1e2c"], ["#1d2442", "#c49a45"]
  ];
  const tileBg = (t) => `radial-gradient(circle at 30% 30%, rgba(247,217,139,.35), transparent 40%), linear-gradient(150deg, ${t[0]}, ${t[1]})`;
  function renderGallery() {
    const g = $("#gallery");
    g.innerHTML = tones.map((t, i) => `<button type="button" aria-label="Buka foto ${i + 1}" style="background:${tileBg(t)}" data-i="${i}"></button>`).join("");
    g.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $("#lightboxImg").style.background = tileBg(tones[b.dataset.i]);
      $("#lightbox").hidden = false; $("#lightboxClose").focus();
    });
  }
  const closeLightbox = () => ($("#lightbox").hidden = true);
  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  /* ---------- RSVP ---------- */
  function setupRSVP() {
    const form = $("#rsvpForm"), key = `rsvp-${code}`;
    $("#seatSelect").innerHTML = Array.from({ length: guest.seats }, (_, i) => `<option value="${i + 1}">${i + 1} orang</option>`).join("");
    form.addEventListener("change", () => ($("#seatField").hidden = form.attend.value !== "hadir"));

    const show = (d) => {
      form.hidden = true; $("#rsvpDone").hidden = false;
      $("#rsvpMsg").textContent = d.attend === "hadir"
        ? `Terima kasih, ${d.name}. Kursi untuk ${d.seats} orang telah kami catat.`
        : `Terima kasih atas kabarnya, ${d.name}. Doa Anda tetap kami nantikan.`;
    };
    const saved = store.get(key);
    if (saved) show(saved);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = { name: form.name.value.trim(), attend: form.attend.value, seats: form.seats.value, at: new Date().toISOString() };
      if (!d.name) return form.name.focus();
      store.set(key, d); show(d);
      toast("Konfirmasi terkirim");
    });
    $("#rsvpEdit").addEventListener("click", () => { form.hidden = false; $("#rsvpDone").hidden = true; });
  }

  /* ---------- Ucapan ---------- */
  function setupWishes() {
    const list = $("#wishList"), form = $("#wishForm");
    const render = (fresh) => {
      const mine = store.get("wishes", []);
      list.innerHTML = [...mine, ...C.seedWishes].map((w, i) => `
        <li class="${fresh && i === 0 ? "is-new" : ""}"><b>${esc(w.name)}</b><small>${esc(w.time)}</small><p>${esc(w.text)}</p></li>`).join("");
    };
    render();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const w = { name: form.name.value.trim(), text: form.text.value.trim(), time: "baru saja" };
      if (!w.name || !w.text) return;
      store.set("wishes", [w, ...store.get("wishes", [])]);
      form.text.value = ""; render(true);
      toast("Ucapan terkirim");
    });
  }

  /* ---------- Hadiah ---------- */
  function renderGifts() {
    $("#giftList").innerHTML = C.gift.map((g) => `
      <div class="gift"><p>${esc(g.bank)}</p><p class="gift__num">${esc(g.number)}</p><p>a.n. ${esc(g.holder)}</p>
      <button type="button" class="btn btn--ghost" data-copy="${esc(g.number)}">Salin nomor</button></div>`).join("");
    $("#giftList").addEventListener("click", async (e) => {
      const b = e.target.closest("[data-copy]"); if (!b) return;
      try { await navigator.clipboard.writeText(b.dataset.copy); }
      catch {
        const t = Object.assign(document.createElement("textarea"), { value: b.dataset.copy });
        document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
      }
      toast("Nomor disalin");
    });
  }

  /* ---------- Navigasi aktif ---------- */
  function watchSections() {
    const links = $$(".dock a");
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
    }), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((a) => { const s = $(a.getAttribute("href")); if (s) io.observe(s); });
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("is-show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("is-show"), 2400);
  }

  /* ---------- Musik ----------
     Default: melodi kotak musik orisinal (Web Audio, tanpa file).
     Untuk memakai lagu sendiri: isi MUSIC_FILE, mis. "assets/audio/lagu.mp3"
     (pastikan lagu bebas royalti / berlisensi). */
  const MUSIC_FILE = "";
  const music = (() => {
    let ctx, timer, audioEl, playing = false;
    const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66]; // C mayor pentatonik+
    const pattern = [0, 2, 4, 5, 4, 2, 3, 1, 0, 2, 4, 6, 5, 3, 4, 2];
    let step = 0;
    function bell(freq, when) {
      const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o2.type = "triangle"; o.frequency.value = freq; o2.frequency.value = freq * 2.01;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(0.09, when + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 1.8);
      o.connect(g); o2.connect(g); g.connect(ctx.destination);
      o.start(when); o2.start(when); o.stop(when + 2); o2.stop(when + 2);
    }
    function loop() {
      const now = ctx.currentTime;
      bell(scale[pattern[step % pattern.length]], now);
      if (step % 4 === 0) bell(scale[pattern[step % pattern.length]] / 2, now);
      step++;
    }
    function play() {
      if (playing) return;
      if (MUSIC_FILE) {
        audioEl = audioEl || Object.assign(new Audio(MUSIC_FILE), { loop: true, volume: 0.5 });
        audioEl.play().catch(() => {});
      } else {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        ctx.resume(); timer = setInterval(loop, 520);
      }
      playing = true; updateBtn();
    }
    function pause() {
      if (audioEl) audioEl.pause();
      clearInterval(timer); playing = false; updateBtn();
    }
    function updateBtn() {
      const b = $("#musicBtn");
      b.setAttribute("aria-pressed", playing); b.setAttribute("aria-label", playing ? "Hentikan musik" : "Putar musik");
    }
    $("#musicBtn").addEventListener("click", () => (playing ? pause() : play()));
    return { play, pause };
  })();

  /* ---------- Inisialisasi ---------- */
  if (!guest) {
    showGate(code ? "Kode pada tautan ini tidak dikenali." : "");
  } else {
    start();
  }
})();
