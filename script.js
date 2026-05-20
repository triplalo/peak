(() => {
  "use strict";

  const DISCORD_CONFIG = {
    clientId: "YOUR_DISCORD_CLIENT_ID",
    redirectUri: "https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO/",
    scopes: ["identify"],
    oauthUrl: "https://discord.com/api/oauth2/authorize",
    mode: "demo-localStorage",
  };

  const STORAGE = {
    user: "peak.user",
    votes: "peak.votes",
    counts: "peak.counts",
    sound: "peak.sound",
  };

  const CATEGORIES = [
    { id: "humor", name: "Peak Humor", phrase: "Risus in ruina" },
    { id: "vibe", name: "Peak Vibe", phrase: "Aura ante ferrum" },
    { id: "activity", name: "Peak Activity", phrase: "Motus sub cinere" },
    { id: "wealth", name: "Peak Wealth", phrase: "Aurum in tenebris" },
    { id: "madness", name: "Peak Madness", phrase: "Furor sacer manet" },
    { id: "aura", name: "Peak Aura", phrase: "Lux fracta regnat" },
    { id: "legend", name: "Peak Legend", phrase: "Nomen super ossa" },
    { id: "chaos", name: "Peak Chaos", phrase: "Ordo per ignem" },
    { id: "intelligence", name: "Peak Intelligence", phrase: "Mens claudit abyssum" },
    { id: "loyalty", name: "Peak Loyalty", phrase: "Fides ferro signata" },
  ];

  const FRIENDS = [
    {
      id: "raven",
      name: "Raven",
      title: "The Hollow Herald",
      initials: "RV",
      colors: ["#151515", "#7f070b"],
      lore: "Говорит мало, но каждая реплика звучит как приговор старого совета.",
      seed: {
        humor: 17,
        vibe: 21,
        activity: 9,
        wealth: 10,
        madness: 18,
        aura: 25,
        legend: 20,
        chaos: 16,
        intelligence: 15,
        loyalty: 19,
      },
    },
    {
      id: "vesper",
      name: "Vesper",
      title: "Saint of Bad Timing",
      initials: "VS",
      colors: ["#20201d", "#8f6b2d"],
      lore: "Появляется в самый странный момент и почему-то сразу становится центром сцены.",
      seed: {
        humor: 19,
        vibe: 17,
        activity: 12,
        wealth: 15,
        madness: 20,
        aura: 18,
        legend: 16,
        chaos: 22,
        intelligence: 14,
        loyalty: 13,
      },
    },
    {
      id: "moroz",
      name: "Moroz",
      title: "Iron Host",
      initials: "MZ",
      colors: ["#15191c", "#56616b"],
      lore: "Холодный стиль, железная выдержка, редкая способность не паниковать в хаосе.",
      seed: {
        humor: 11,
        vibe: 23,
        activity: 16,
        wealth: 14,
        madness: 8,
        aura: 21,
        legend: 18,
        chaos: 10,
        intelligence: 24,
        loyalty: 22,
      },
    },
    {
      id: "saint",
      name: "Saint",
      title: "The Red Prior",
      initials: "ST",
      colors: ["#1b1111", "#9e1016"],
      lore: "Может превратить обычную беседу в культовый фрагмент общей мифологии.",
      seed: {
        humor: 21,
        vibe: 19,
        activity: 15,
        wealth: 12,
        madness: 24,
        aura: 17,
        legend: 23,
        chaos: 19,
        intelligence: 11,
        loyalty: 18,
      },
    },
    {
      id: "cipher",
      name: "Cipher",
      title: "Archivist of Schemes",
      initials: "CP",
      colors: ["#111513", "#55705e"],
      lore: "Собирает факты так, будто пишет манускрипт для суда над будущим.",
      seed: {
        humor: 9,
        vibe: 14,
        activity: 18,
        wealth: 16,
        madness: 13,
        aura: 16,
        legend: 15,
        chaos: 12,
        intelligence: 27,
        loyalty: 20,
      },
    },
    {
      id: "onyx",
      name: "Onyx",
      title: "Keeper of the Vault",
      initials: "OX",
      colors: ["#151311", "#8c7438"],
      lore: "Всегда выглядит так, будто у него есть запасной план и скрытая казна.",
      seed: {
        humor: 12,
        vibe: 15,
        activity: 11,
        wealth: 29,
        madness: 9,
        aura: 18,
        legend: 14,
        chaos: 8,
        intelligence: 19,
        loyalty: 17,
      },
    },
    {
      id: "warden",
      name: "Warden",
      title: "Last Gate",
      initials: "WD",
      colors: ["#121212", "#3d4246"],
      lore: "Если всё рушится, рядом с ним всё равно кажется, что крепость ещё держится.",
      seed: {
        humor: 10,
        vibe: 13,
        activity: 21,
        wealth: 11,
        madness: 7,
        aura: 14,
        legend: 17,
        chaos: 9,
        intelligence: 18,
        loyalty: 29,
      },
    },
    {
      id: "hex",
      name: "Hex",
      title: "The Chapel Error",
      initials: "HX",
      colors: ["#1b151f", "#6c1f49"],
      lore: "Случайность вокруг него быстро становится традицией, а традиция превращается в легенду.",
      seed: {
        humor: 18,
        vibe: 16,
        activity: 14,
        wealth: 13,
        madness: 23,
        aura: 19,
        legend: 19,
        chaos: 26,
        intelligence: 13,
        loyalty: 12,
      },
    },
  ];

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const state = {
    activeCategory: CATEGORIES[0].id,
    user: null,
    votes: {},
    counts: {},
    soundEnabled: false,
    cursor: { x: window.innerWidth / 2, y: window.innerHeight / 2, tx: window.innerWidth / 2, ty: window.innerHeight / 2 },
    audio: null,
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheElements();
    loadLedger();
    syncAuthUI();
    renderCategories();
    renderVoteSurface();
    renderLeaderboards();
    bindEvents();
    initLoader();
    initAshText();
    initCursor();
    initParallax();
    initAshCanvas();
    initThreeVeil();
    initReveal();
    document.body.dataset.sound = state.soundEnabled ? "on" : "off";
  }

  function cacheElements() {
    els.loader = qs("#loader");
    els.loaderProgress = qs("#loaderProgress");
    els.loaderPercent = qs("#loaderPercent");
    els.loaderPhrase = qs("#loaderPhrase");
    els.screenFlash = qs("#screenFlash");
    els.sealLayer = qs("#sealLayer");
    els.categoryTabs = qs("#categoryTabs");
    els.categoryCount = qs("#categoryCount");
    els.currentCategoryTitle = qs("#currentCategoryTitle");
    els.currentCategoryPhrase = qs("#currentCategoryPhrase");
    els.voteStatus = qs("#voteStatus");
    els.nomineeGrid = qs("#nomineeGrid");
    els.categoryRanking = qs("#categoryRanking");
    els.categoryVoteTotal = qs("#categoryVoteTotal");
    els.crownBoard = qs("#crownBoard");
    els.overallRanking = qs("#overallRanking");
    els.totalVotes = qs("#totalVotes");
    els.loginButton = qs("#loginButton");
    els.heroLoginButton = qs("#heroLoginButton");
    els.logoutButton = qs("#logoutButton");
    els.userBadge = qs("#userBadge");
    els.userAvatar = qs("#userAvatar");
    els.userName = qs("#userName");
    els.authDialog = qs("#authDialog");
    els.demoUsername = qs("#demoUsername");
    els.demoLogin = qs("#demoLogin");
    els.closeAuth = qs("#closeAuth");
    els.soundToggle = qs("#soundToggle");
    els.menuToggle = qs("#menuToggle");
    els.siteNav = qs("#siteNav");
    els.easterEgg = qs("#easterEgg");
    els.ashCanvas = qs("#ash-field");
    els.webglCanvas = qs("#webgl-veil");
  }

  function loadLedger() {
    state.user = readJSON(STORAGE.user, null);
    state.votes = readJSON(STORAGE.votes, {});
    state.counts = readJSON(STORAGE.counts, null) || createSeedCounts();
    state.soundEnabled = localStorage.getItem(STORAGE.sound) === "on";
    saveCounts();
  }

  function createSeedCounts() {
    return CATEGORIES.reduce((ledger, category) => {
      ledger[category.id] = FRIENDS.reduce((categoryLedger, friend) => {
        const base = friend.seed[category.id] || 0;
        categoryLedger[friend.id] = base + deterministicJitter(`${category.id}:${friend.id}`);
        return categoryLedger;
      }, {});
      return ledger;
    }, {});
  }

  function deterministicJitter(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 4);
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function saveCounts() {
    writeJSON(STORAGE.counts, state.counts);
  }

  function saveVotes() {
    writeJSON(STORAGE.votes, state.votes);
  }

  function bindEvents() {
    els.categoryTabs.addEventListener("click", onCategoryClick);
    els.nomineeGrid.addEventListener("click", onVoteClick);
    els.nomineeGrid.addEventListener("pointermove", onCardPointerMove);
    els.nomineeGrid.addEventListener("pointerleave", resetCardTilt, true);

    els.loginButton.addEventListener("click", openAuthDialog);
    els.heroLoginButton.addEventListener("click", openAuthDialog);
    els.demoLogin.addEventListener("click", loginDemoUser);
    els.closeAuth.addEventListener("click", closeAuthDialog);
    els.logoutButton.addEventListener("click", logoutUser);
    els.soundToggle.addEventListener("click", toggleSound);
    els.menuToggle.addEventListener("click", toggleMenu);

    qsa(".site-nav a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", onSecretKey);
    qs(".brand-lockup").addEventListener("click", onBrandClick);

    if (els.authDialog) {
      els.authDialog.addEventListener("click", (event) => {
        if (event.target === els.authDialog) {
          closeAuthDialog();
        }
      });
    }
  }

  function initLoader() {
    const phrases = [
      "Ferrum silentium tenet",
      "Nebula portas aperit",
      "Sanguis signum vocat",
      "Nulla lux sine umbra",
      "Peak surgit ex cinere",
    ];
    const start = performance.now();
    const duration = 2350;

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * 100);
      els.loaderProgress.style.width = `${value}%`;
      els.loaderPercent.textContent = `${value}%`;
      els.loaderPhrase.textContent = phrases[Math.min(phrases.length - 1, Math.floor(progress * phrases.length))];

      if (progress < 1) {
        requestAnimationFrame(frame);
        return;
      }

      setTimeout(revealInterface, 250);
    }

    requestAnimationFrame(frame);
  }

  function revealInterface() {
    playMetalHit(0.7);

    if (window.gsap) {
      const blade = qs(".blade-sweep");
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.body.classList.remove("is-loading");
          document.body.classList.add("motion-ready");
          els.loader.hidden = true;
          animateHeroIntro();
        },
      });

      timeline
        .to(blade, { opacity: 1, scaleY: 1.5, duration: 0.34, ease: "power4.in" })
        .to(els.screenFlash, { opacity: 1, x: "115%", duration: 0.32, ease: "power4.out" }, "-=0.08")
        .to(els.loader, { autoAlpha: 0, duration: 0.6 }, "-=0.05")
        .set(els.screenFlash, { opacity: 0, x: "-100%" });
    } else {
      els.loader.style.opacity = "0";
      setTimeout(() => {
        document.body.classList.remove("is-loading");
        document.body.classList.add("motion-ready");
        els.loader.hidden = true;
        animateHeroIntro();
      }, 520);
    }
  }

  function animateHeroIntro() {
    if (!window.gsap) {
      return;
    }

    gsap.fromTo(
      ".hero__image",
      { scale: 1.24, filter: "contrast(1.25) saturate(0.72) brightness(0.5)" },
      { scale: 1.12, filter: "contrast(1.12) saturate(0.82) brightness(0.76)", duration: 2.4, ease: "power2.out" }
    );

    gsap.fromTo(
      ".chain, .sword",
      { y: -36, opacity: 0 },
      { y: 0, opacity: 0.46, duration: 1.4, stagger: 0.08, ease: "back.out(1.4)" }
    );
  }

  function initAshText() {
    const targets = qsa("[data-ash-text]");
    targets.forEach((target) => {
      const words = target.textContent.trim().split(/\s+/);
      target.textContent = "";
      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.className = "ash-word";
        span.textContent = word;
        target.append(span);
        if (index < words.length - 1) {
          target.append(document.createTextNode(" "));
        }
      });
    });

    const reveal = () => {
      const words = qsa(".ash-word");
      if (window.gsap) {
        gsap.to(words, {
          opacity: 1,
          y: 0,
          rotate: 0,
          filter: "blur(0px)",
          duration: 1.05,
          stagger: 0.035,
          ease: "power3.out",
          delay: 0.25,
        });
      } else {
        words.forEach((word) => {
          word.style.opacity = "1";
          word.style.filter = "blur(0)";
          word.style.transform = "none";
        });
      }
    };

    setTimeout(reveal, 2550);
  }

  function initCursor() {
    const core = qs(".cursor-core");
    const ring = qs(".cursor-ring");
    const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover || !core || !ring) {
      return;
    }

    document.body.classList.add("cursor-ready");

    window.addEventListener("pointermove", (event) => {
      state.cursor.tx = event.clientX;
      state.cursor.ty = event.clientY;
      document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
      document.documentElement.style.setProperty("--my", `${event.clientY}px`);
    });

    window.addEventListener("pointerdown", () => document.body.classList.add("cursor-press"));
    window.addEventListener("pointerup", () => document.body.classList.remove("cursor-press"));

    document.addEventListener("mouseover", (event) => {
      if (event.target.closest("a, button, input, .nominee-card")) {
        document.body.classList.add("cursor-hot");
      }
    });

    document.addEventListener("mouseout", (event) => {
      if (event.target.closest("a, button, input, .nominee-card")) {
        document.body.classList.remove("cursor-hot");
      }
    });

    const tick = () => {
      state.cursor.x += (state.cursor.tx - state.cursor.x) * 0.22;
      state.cursor.y += (state.cursor.ty - state.cursor.y) * 0.22;
      core.style.transform = `translate3d(${state.cursor.tx}px, ${state.cursor.ty}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${state.cursor.x}px, ${state.cursor.y}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };

    tick();
  }

  function initParallax() {
    const hero = qs(".hero");
    if (!hero) {
      return;
    }

    window.addEventListener("pointermove", (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      hero.style.setProperty("--tilt-x", `${x}`);
      hero.style.setProperty("--tilt-y", `${y}`);

      const leftSword = qs(".sword--left");
      const rightSword = qs(".sword--right");
      const runes = qs(".rune-ring");

      if (leftSword) {
        leftSword.style.translate = `${x * -10}px ${y * -6}px`;
      }
      if (rightSword) {
        rightSword.style.translate = `${x * 12}px ${y * -5}px`;
      }
      if (runes) {
        runes.style.transform = `translate3d(${x * 8}px, ${y * 8}px, 0)`;
      }
    });
  }

  function initReveal() {
    const nodes = qsa("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      document.body.classList.add("motion-ready");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    nodes.forEach((node) => observer.observe(node));
  }

  function renderCategories() {
    els.categoryCount.textContent = CATEGORIES.length.toString();
    els.categoryTabs.innerHTML = CATEGORIES.map((category) => {
      const selected = category.id === state.activeCategory;
      const voted = Boolean(state.votes[category.id]);
      return `
        <button
          class="category-tab ${voted ? "is-voted" : ""}"
          type="button"
          role="tab"
          aria-selected="${selected ? "true" : "false"}"
          data-category="${category.id}"
        >
          <span class="category-tab__name">${category.name}</span>
          <span class="category-tab__mark" aria-hidden="true"></span>
        </button>
      `;
    }).join("");
  }

  function renderVoteSurface() {
    const category = getCategory(state.activeCategory);
    const selectedFriend = state.votes[category.id];
    const counts = state.counts[category.id];
    const total = totalForCategory(category.id);
    const max = Math.max(...Object.values(counts), 1);

    els.currentCategoryTitle.textContent = category.name;
    els.currentCategoryPhrase.textContent = category.phrase;
    els.categoryVoteTotal.textContent = total.toString();
    els.voteStatus.textContent = selectedFriend ? "Печать уже поставлена" : "Ожидает печати";
    els.voteStatus.classList.toggle("is-sealed", Boolean(selectedFriend));

    els.nomineeGrid.innerHTML = FRIENDS.map((friend) => {
      const count = counts[friend.id] || 0;
      const percent = total ? Math.round((count / total) * 100) : 0;
      const heat = Math.round((count / max) * 100);
      const chosen = selectedFriend === friend.id;
      const locked = Boolean(selectedFriend);

      return `
        <article
          class="nominee-card ${chosen ? "is-chosen" : ""} ${locked ? "is-locked" : ""}"
          data-card="${friend.id}"
          style="${avatarVars(friend)}"
        >
          <div class="nominee-top">
            <span class="nominee-avatar" aria-hidden="true">${friend.initials}</span>
            <div class="nominee-meta">
              <h4 class="nominee-name">${friend.name}</h4>
              <span class="nominee-title">${friend.title}</span>
            </div>
          </div>
          <p class="nominee-lore">${friend.lore}</p>
          <div class="nominee-stat">
            <div class="nominee-stat__row">
              <span>${category.name}</span>
              <strong>${count} / ${percent}%</strong>
            </div>
            <div class="progress-track" aria-hidden="true">
              <span style="width: ${heat}%"></span>
            </div>
          </div>
          <button class="vote-button" type="button" data-vote="${friend.id}" ${locked ? "disabled" : ""}>
            ${chosen ? "Печать поставлена" : locked ? "Категория закрыта" : "Поставить печать"}
          </button>
        </article>
      `;
    }).join("");

    renderCategoryRanking();
  }

  function renderCategoryRanking() {
    const categoryId = state.activeCategory;
    const rows = sortFriendsByCategory(categoryId);
    const max = Math.max(...rows.map((row) => row.score), 1);

    els.categoryRanking.innerHTML = rows.map((row, index) => rankRow(row.friend, row.score, index, max, "votes")).join("");
  }

  function renderLeaderboards() {
    const totals = getOverallTotals();
    const top = totals.slice(0, 3);
    const max = Math.max(...totals.map((row) => row.score), 1);
    const totalVotes = totals.reduce((sum, row) => sum + row.score, 0);

    els.totalVotes.textContent = totalVotes.toString();
    els.crownBoard.innerHTML = top.map((row, index) => crownCard(row.friend, row.score, index)).join("");
    els.overallRanking.innerHTML = totals.map((row, index) => rankRow(row.friend, row.score, index, max, "aura")).join("");
  }

  function crownCard(friend, score, index) {
    const place = index === 0 ? "First seal" : index === 1 ? "Second seal" : "Third seal";
    return `
      <article class="crown-card" style="${avatarVars(friend)}">
        <span class="crown-place">${place}</span>
        <h3>${friend.name}</h3>
        <p>${friend.title}</p>
        <span class="crown-score">${score}<small>total</small></span>
      </article>
    `;
  }

  function rankRow(friend, score, index, max, label) {
    const width = Math.max(8, Math.round((score / max) * 100));
    return `
      <div class="rank-row" style="${avatarVars(friend)} --rank-width: ${width}%">
        <span class="rank-avatar" aria-hidden="true">${friend.initials}</span>
        <span class="rank-info">
          <span class="rank-name">${index + 1}. ${friend.name}</span>
          <span class="rank-sub">${friend.title}</span>
        </span>
        <strong class="rank-score">${score}</strong>
      </div>
    `;
  }

  function onCategoryClick(event) {
    const button = event.target.closest("[data-category]");
    if (!button) {
      return;
    }

    state.activeCategory = button.dataset.category;
    renderCategories();
    renderVoteSurface();
    forgeTransition();
  }

  function onVoteClick(event) {
    const button = event.target.closest("[data-vote]");
    if (!button) {
      return;
    }

    if (!state.user) {
      openAuthDialog();
      pulseVoteStatus("Сначала откройте Discord gate");
      return;
    }

    if (state.votes[state.activeCategory]) {
      pulseVoteStatus("Эта категория уже закрыта");
      return;
    }

    const friendId = button.dataset.vote;
    const friend = getFriend(friendId);
    state.votes[state.activeCategory] = friendId;
    state.counts[state.activeCategory][friendId] = (state.counts[state.activeCategory][friendId] || 0) + 1;
    saveVotes();
    saveCounts();
    renderCategories();
    renderVoteSurface();
    renderLeaderboards();
    createBloodSeal(event.clientX, event.clientY, friend.name);
    screenShake(10);
    playMetalHit(0.54);
  }

  function pulseVoteStatus(text) {
    const previous = els.voteStatus.textContent;
    els.voteStatus.textContent = text;
    els.voteStatus.classList.add("is-sealed");
    if (window.gsap) {
      gsap.fromTo(els.voteStatus, { x: -8 }, { x: 0, duration: 0.35, ease: "elastic.out(1, 0.4)" });
    }
    setTimeout(() => {
      const selectedFriend = state.votes[state.activeCategory];
      els.voteStatus.textContent = selectedFriend ? "Печать уже поставлена" : previous;
      els.voteStatus.classList.toggle("is-sealed", Boolean(selectedFriend));
    }, 1300);
  }

  function forgeTransition() {
    if (!window.gsap) {
      return;
    }

    gsap.fromTo(
      ".nominee-card",
      { y: 28, opacity: 0, filter: "blur(12px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.68, stagger: 0.045, ease: "power3.out" }
    );
    gsap.fromTo(
      ".rank-row",
      { x: 18, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.035, ease: "power2.out" }
    );
  }

  function createBloodSeal(x, y, name) {
    const seal = document.createElement("div");
    seal.className = "blood-seal";
    seal.textContent = "PEAK";
    seal.style.left = `${x}px`;
    seal.style.top = `${y}px`;
    seal.dataset.name = name;
    els.sealLayer.append(seal);

    if (window.gsap) {
      gsap.timeline({
        onComplete: () => seal.remove(),
      })
        .to(seal, { opacity: 1, scale: 1, rotate: -8, duration: 0.22, ease: "power4.out" })
        .to(seal, { scale: 1.08, duration: 0.12, ease: "power2.inOut" })
        .to(seal, { opacity: 0, scale: 0.92, duration: 0.8, delay: 0.55, ease: "power2.in" });
    } else {
      seal.animate(
        [
          { opacity: 0, transform: "translate(-50%, -50%) scale(2.2) rotate(-18deg)" },
          { opacity: 1, transform: "translate(-50%, -50%) scale(1) rotate(-8deg)" },
          { opacity: 0, transform: "translate(-50%, -50%) scale(0.92) rotate(-8deg)" },
        ],
        { duration: 1700, easing: "cubic-bezier(.16,1,.3,1)" }
      ).addEventListener("finish", () => seal.remove());
    }
  }

  function screenShake(strength = 8) {
    if (window.gsap) {
      gsap.fromTo(
        document.body,
        { x: -strength },
        { x: 0, duration: 0.38, ease: "elastic.out(1, 0.25)", clearProps: "transform" }
      );
      gsap.fromTo(
        els.screenFlash,
        { opacity: 0.8, x: "-40%" },
        { opacity: 0, x: "120%", duration: 0.42, ease: "power3.out" }
      );
    }
  }

  function onCardPointerMove(event) {
    const card = event.target.closest(".nominee-card");
    if (!card || !matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-3px)`;
  }

  function resetCardTilt(event) {
    const card = event.target.closest ? event.target.closest(".nominee-card") : null;
    if (card) {
      card.style.transform = "";
    }
  }

  function openAuthDialog() {
    if (typeof els.authDialog.showModal === "function") {
      els.authDialog.showModal();
    } else {
      els.authDialog.setAttribute("open", "");
    }
    setTimeout(() => els.demoUsername.focus(), 80);
  }

  function closeAuthDialog() {
    if (typeof els.authDialog.close === "function") {
      els.authDialog.close();
    } else {
      els.authDialog.removeAttribute("open");
    }
  }

  function loginDemoUser() {
    const username = sanitizeName(els.demoUsername.value || "AshenKnight");
    const hue = Math.abs(hashString(username)) % 360;
    state.user = {
      id: `demo-${Math.abs(hashString(username + Date.now()))}`,
      username,
      discriminator: String(1000 + (Math.abs(hashString(username)) % 8999)),
      avatar: initialsFromName(username),
      colors: [`hsl(${hue} 18% 14%)`, `hsl(${(hue + 330) % 360} 64% 28%)`],
      provider: "discord-demo",
      config: DISCORD_CONFIG.mode,
    };
    writeJSON(STORAGE.user, state.user);
    syncAuthUI();
    closeAuthDialog();
    pulseVoteStatus("Discord gate открыт");
    playMetalHit(0.36);
  }

  function logoutUser() {
    state.user = null;
    localStorage.removeItem(STORAGE.user);
    syncAuthUI();
  }

  function syncAuthUI() {
    if (!els.userBadge) {
      return;
    }

    const loggedIn = Boolean(state.user);
    els.loginButton.hidden = loggedIn;
    els.userBadge.hidden = !loggedIn;

    if (loggedIn) {
      els.userName.textContent = `${state.user.username}#${state.user.discriminator}`;
      els.userAvatar.textContent = state.user.avatar;
      els.userAvatar.style.setProperty("--avatar-a", state.user.colors[0]);
      els.userAvatar.style.setProperty("--avatar-b", state.user.colors[1]);
    }
  }

  function toggleMenu() {
    const isOpen = els.siteNav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    els.menuToggle.setAttribute("aria-expanded", String(isOpen));
  }

  function closeMenu() {
    els.siteNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    els.menuToggle.setAttribute("aria-expanded", "false");
  }

  function toggleSound() {
    if (state.soundEnabled) {
      stopAudio();
      return;
    }

    startAudio();
  }

  function startAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }

    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);

    const low = ctx.createOscillator();
    low.type = "sine";
    low.frequency.value = 41;
    const lowGain = ctx.createGain();
    lowGain.gain.value = 0.16;
    low.connect(lowGain).connect(master);

    const overtone = ctx.createOscillator();
    overtone.type = "triangle";
    overtone.frequency.value = 82;
    const overtoneGain = ctx.createGain();
    overtoneGain.gain.value = 0.045;
    overtone.connect(overtoneGain).connect(master);

    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i += 1) {
      channel[i] = (Math.random() * 2 - 1) * 0.38;
    }
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.025;
    noise.connect(filter).connect(noiseGain).connect(master);

    low.start();
    overtone.start();
    noise.start();

    master.gain.exponentialRampToValueAtTime(0.42, ctx.currentTime + 1.4);

    state.audio = { ctx, master, nodes: [low, overtone, noise] };
    state.soundEnabled = true;
    localStorage.setItem(STORAGE.sound, "on");
    document.body.dataset.sound = "on";
  }

  function stopAudio() {
    if (state.audio) {
      const { ctx, master, nodes } = state.audio;
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      setTimeout(() => {
        nodes.forEach((node) => {
          try {
            node.stop();
          } catch (error) {
            return undefined;
          }
        });
        ctx.close();
      }, 320);
    }

    state.audio = null;
    state.soundEnabled = false;
    localStorage.setItem(STORAGE.sound, "off");
    document.body.dataset.sound = "off";
  }

  function playMetalHit(volume = 0.45) {
    if (!state.soundEnabled || !state.audio) {
      return;
    }

    const { ctx, master } = state.audio;
    const impact = ctx.createOscillator();
    const ring = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    impact.type = "square";
    impact.frequency.setValueAtTime(92, ctx.currentTime);
    impact.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.18);
    ring.type = "triangle";
    ring.frequency.setValueAtTime(280, ctx.currentTime);
    ring.frequency.exponentialRampToValueAtTime(142, ctx.currentTime + 0.42);
    filter.type = "bandpass";
    filter.frequency.value = 620;
    filter.Q.value = 4;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.48);

    impact.connect(filter);
    ring.connect(filter);
    filter.connect(gain).connect(master);
    impact.start();
    ring.start();
    impact.stop(ctx.currentTime + 0.5);
    ring.stop(ctx.currentTime + 0.5);
  }

  function initAshCanvas() {
    const canvas = els.ashCanvas;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const particles = [];
    const density = 115;
    let width = 0;
    let height = 0;
    let last = performance.now();

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles.length = 0;
      for (let i = 0; i < density; i += 1) {
        particles.push(createAsh(width, height, true));
      }
    }

    function draw(now) {
      const delta = Math.min(32, now - last);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      particles.forEach((particle) => {
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.life += delta;
        particle.rotation += particle.spin * delta;

        if (particle.y < -20 || particle.x < -40 || particle.x > width + 40 || particle.life > particle.maxLife) {
          Object.assign(particle, createAsh(width, height, false));
          particle.y = height + 20;
        }

        const flicker = 0.68 + Math.sin((particle.life + particle.phase) * 0.006) * 0.26;
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = particle.alpha * flicker;
        ctx.fillStyle = particle.hot ? "rgba(214, 47, 32, 0.85)" : "rgba(205, 201, 190, 0.58)";
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.34);
        ctx.restore();
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(draw);
  }

  function createAsh(width, height, initial) {
    return {
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + Math.random() * 120,
      vx: (Math.random() - 0.5) * 0.024,
      vy: -0.018 - Math.random() * 0.05,
      size: 1 + Math.random() * 4,
      alpha: 0.08 + Math.random() * 0.28,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.006,
      life: Math.random() * 1600,
      maxLife: 5200 + Math.random() * 4200,
      phase: Math.random() * 1000,
      hot: Math.random() > 0.9,
    };
  }

  function initThreeVeil() {
    if (!els.webglCanvas) {
      return;
    }

    if (!window.THREE) {
      initRawWebglVeil(els.webglCanvas);
      return;
    }

    const canvas = els.webglCanvas;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.045);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(0, 0, 24);

    const group = new THREE.Group();
    scene.add(group);

    const positions = [];
    const colors = [];
    const particleCount = 680;
    const colorA = new THREE.Color(0x8b0e12);
    const colorB = new THREE.Color(0xb8b2a2);

    for (let i = 0; i < particleCount; i += 1) {
      positions.push((Math.random() - 0.5) * 46);
      positions.push((Math.random() - 0.5) * 28);
      positions.push((Math.random() - 0.5) * 36);
      const color = colorA.clone().lerp(colorB, Math.random() * 0.55);
      colors.push(color.r, color.g, color.b);
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(particleGeometry, particleMaterial);
    group.add(points);

    const shardMaterial = new THREE.MeshBasicMaterial({
      color: 0xbfb7a5,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });

    const shardGeometry = new THREE.ConeGeometry(0.08, 2.8, 3);
    const shards = [];
    for (let i = 0; i < 24; i += 1) {
      const shard = new THREE.Mesh(shardGeometry, shardMaterial);
      shard.position.set((Math.random() - 0.5) * 28, (Math.random() - 0.5) * 15, -4 - Math.random() * 16);
      shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      shard.userData = {
        speed: 0.001 + Math.random() * 0.003,
        drift: Math.random() * Math.PI * 2,
      };
      shards.push(shard);
      group.add(shard);
    }

    const redLight = new THREE.PointLight(0x8b0e12, 1.8, 42);
    redLight.position.set(-6, 3, 8);
    scene.add(redLight);

    const silverLight = new THREE.PointLight(0xd2d0c8, 1.2, 36);
    silverLight.position.set(8, -2, 12);
    scene.add(silverLight);

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("pointermove", (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    }

    function animate(now) {
      const t = now * 0.001;
      group.rotation.y += (mouseX * 0.08 - group.rotation.y) * 0.025;
      group.rotation.x += (mouseY * 0.05 - group.rotation.x) * 0.025;
      points.rotation.z = t * 0.018;
      points.rotation.y = t * 0.012;
      shards.forEach((shard) => {
        shard.rotation.y += shard.userData.speed;
        shard.rotation.x += shard.userData.speed * 0.7;
        shard.position.y += Math.sin(t + shard.userData.drift) * 0.0018;
      });
      redLight.intensity = 1.4 + Math.sin(t * 1.7) * 0.35;
      silverLight.intensity = 0.95 + Math.sin(t * 1.1) * 0.22;
      renderer.render(scene, camera);
      window.__peakWebglReady = true;
      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(animate);
  }

  function initRawWebglVeil(canvas) {
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, preserveDrawingBuffer: true });
    if (!gl) {
      return;
    }
    window.__peakWebglReady = "fallback-context";

    const vertexSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / max(u_resolution, vec2(1.0));
        vec2 centered = uv - 0.5;
        float mist = noise(uv * 5.0 + vec2(u_time * 0.035, -u_time * 0.02));
        float fine = noise(uv * 42.0 + u_time * 0.08);
        float pulse = sin(u_time * 1.3 + uv.y * 8.0) * 0.5 + 0.5;
        float red = smoothstep(0.72, 0.05, length(centered * vec2(1.1, 0.78)));
        float ash = smoothstep(0.988, 1.0, fine + mist * 0.08);
        vec3 metal = vec3(0.65, 0.62, 0.54) * mist * 0.12;
        vec3 blood = vec3(0.68, 0.03, 0.045) * red * (0.18 + pulse * 0.12);
        vec3 color = metal + blood + vec3(0.9, 0.32, 0.18) * ash;
        float alpha = 0.05 + red * 0.13 + mist * 0.045 + ash * 0.32;
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const program = createWebglProgram(gl, vertexSource, fragmentSource);
    if (!program) {
      window.__peakWebglReady = "fallback-program-failed";
      return;
    }

    const position = gl.getAttribLocation(program, "a_position");
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    function resize() {
      window.__peakWebglReady = "fallback-resize";
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function drawFrame(now) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, now * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      window.__peakWebglReady = true;
    }

    function animate(now) {
      drawFrame(now);
      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);
    resize();
    drawFrame(performance.now());
    requestAnimationFrame(animate);
  }

  function createWebglProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) {
      return null;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return null;
    }

    return program;
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  }

  function getCategory(id) {
    return CATEGORIES.find((category) => category.id === id) || CATEGORIES[0];
  }

  function getFriend(id) {
    return FRIENDS.find((friend) => friend.id === id) || FRIENDS[0];
  }

  function sortFriendsByCategory(categoryId) {
    const counts = state.counts[categoryId] || {};
    return FRIENDS.map((friend) => ({
      friend,
      score: counts[friend.id] || 0,
    })).sort((a, b) => b.score - a.score || a.friend.name.localeCompare(b.friend.name));
  }

  function getOverallTotals() {
    return FRIENDS.map((friend) => {
      const score = CATEGORIES.reduce((sum, category) => sum + ((state.counts[category.id] || {})[friend.id] || 0), 0);
      return { friend, score };
    }).sort((a, b) => b.score - a.score || a.friend.name.localeCompare(b.friend.name));
  }

  function totalForCategory(categoryId) {
    return Object.values(state.counts[categoryId] || {}).reduce((sum, value) => sum + value, 0);
  }

  function avatarVars(friend) {
    return `--avatar-a: ${friend.colors[0]}; --avatar-b: ${friend.colors[1]};`;
  }

  function sanitizeName(value) {
    return value
      .replace(/[^\p{L}\p{N}_ .-]/gu, "")
      .trim()
      .slice(0, 24) || "AshenKnight";
  }

  function initialsFromName(name) {
    const parts = name.split(/[\s_.-]+/).filter(Boolean);
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2);
    return initials.toUpperCase();
  }

  function hashString(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  let secretBuffer = "";
  let brandClicks = 0;
  let brandTimer = null;

  function onSecretKey(event) {
    if (event.key.length !== 1) {
      return;
    }

    secretBuffer = `${secretBuffer}${event.key.toLowerCase()}`.slice(-16);
    if (secretBuffer.includes("abyss") || secretBuffer.includes("memento")) {
      showEasterEgg();
      secretBuffer = "";
    }
  }

  function onBrandClick() {
    brandClicks += 1;
    clearTimeout(brandTimer);
    brandTimer = setTimeout(() => {
      brandClicks = 0;
    }, 900);

    if (brandClicks >= 3) {
      showEasterEgg();
      brandClicks = 0;
    }
  }

  function showEasterEgg() {
    els.easterEgg.classList.add("is-visible");
    screenShake(7);
    setTimeout(() => {
      els.easterEgg.classList.remove("is-visible");
    }, 3600);
  }
})();
