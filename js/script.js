// == FULL JS: THUMBNAILS • FOOTER PARALLAX • EYES • WAITER & BILL ==
document.addEventListener("DOMContentLoaded", () => {
  // ────────────────────────────────────────────────────────────────
  // 0) shared state & DOM refs
  // ────────────────────────────────────────────────────────────────
  const popup = document.getElementById("popup");
  const sitesContainer = document.getElementById("sites-container");
  document.body.appendChild(popup);


  let activeBlock = null;
  let isOverPopup = false;
  const floatCancels = new Set();

  // ────────────────────────────────────────────────────────────────
  // 1) PROJECT THUMBNAILS → GRID LAYOUT + FLOATING + POPUPS
  // ────────────────────────────────────────────────────────────────
  const projects = [
    { name:'weekdays',    image:'weekdays.gif',    client:'Weekdays',       work:'website',           year:'2025', description:'A clean and minimal website, unless you want it not to be. Built for Weekdays at Weekdays.', link:'https://week-days.com.au/' },
    { name:'studio blank',image:'studio-blank.gif',client:'studio blank',   work:'website, motion design',year:'2024', description:'A quirky website for a furniture studio (via Weekdays).', link:'https://www.studioblank.com.au/' },
    { name:'veraison',    image:'veraison.png',     client:'veraison',       work:'brand, website, print',  year:'2025', description:'A print-turned-digital wine and culture zine.',                   link:'https://www.veraisonmag.com/' },
    { name:'claire adey', image:'claire-adey.gif',  client:'claire adey',    work:'website',           year:'2025', description:'A portfolio website for a foodie needs a good cookies section.',    link:'https://www.claireadey.com/' },
    { name:'oishii dry',  image:'oishii-dry.png',   client:'Oishii Dry',     work:'brand, website, packaging',year:'2025', description:'A local yuzu rice lager with Japanese sensibilities.',             link:'https://www.oishiiworld.com.au/' }
  ];

  function layoutThumbnails() {
    // clear out old floats & blocks
    floatCancels.forEach(fn => fn());
    floatCancels.clear();
    sitesContainer.innerHTML = "";
    popup.style.display = "none";

    // compute grid
    const thumbSize = window.innerWidth <= 728 ? 75 : 120;
    const count     = projects.length;
    const cols      = Math.ceil(Math.sqrt(count));
    const rows      = Math.ceil(count/cols);
    const cellW     = sitesContainer.clientWidth  / cols;
    const cellH     = sitesContainer.clientHeight / rows;

    projects.forEach((project, i) => {
      const block = document.createElement("div");
      block.classList.add("floating-block");
      block.style.backgroundImage = `url(images/${project.image})`;

      // position in center of grid cell
      const col = i % cols, row = Math.floor(i/cols);
      const x   = col*cellW + (cellW - thumbSize)/2;
      const y   = row*cellH + (cellH - thumbSize)/2;
      block.style.cssText += `
        width:${thumbSize}px;
        height:${thumbSize}px;
        left:${x}px;
        top:${y}px;
      `;
      sitesContainer.appendChild(block);

      // floating animation
      let vx = (Math.random()-0.5)*0.5;
      let vy = (Math.random()-0.5)*0.5;
      let cancelled = false;
      (function floatLoop(){
        if(cancelled) return;
        if(!block.classList.contains("paused")){
          let nx = parseFloat(block.style.left);
          let ny = parseFloat(block.style.top);
          nx += vx; ny += vy;
          if(nx < 0 || nx > sitesContainer.clientWidth - thumbSize) vx *= -1;
          if(ny < 0 || ny > sitesContainer.clientHeight - thumbSize) vy *= -1;
          block.style.left = `${nx}px`;
          block.style.top  = `${ny}px`;
        }
        requestAnimationFrame(floatLoop);
      })();
      floatCancels.add(() => cancelled = true);

      // popup handler
      function showProjectPopup(e) {
        e.stopPropagation();
        block.classList.add("paused");
        activeBlock = block;

        const rect   = block.getBoundingClientRect();
        const maxW   = window.innerWidth < 640 ? window.innerWidth * 0.9 : 300;
        const spaceR = window.innerWidth - rect.right;
        const spaceL = rect.left;
        const preferR= spaceR > maxW+20;
        const preferL= spaceL > maxW+20;

        popup.className = "popup project-popup";
        popup.innerHTML = `
          <span class="link-text">${project.client}</span>
          <span>${project.work}</span>
          <span>${project.year}</span>
          <p>${project.description}</p>
          <a href="${project.link}" target="_blank"><span class="link-text">Visit site</span></a>
        `;

        // offscreen to measure
        popup.style.cssText += `
          display:flex;
          max-width:${maxW}px;
          left:-9999px; top:-9999px;
          visibility:hidden; opacity:0;
        `;

        const pw = popup.offsetWidth, ph = popup.offsetHeight;
        const tooLow = rect.bottom + ph > window.innerHeight;
        const py = tooLow
          ? rect.bottom + window.pageYOffset - ph
          : rect.top    + window.pageYOffset;
        let px;
        if(window.innerWidth < 640) {
          px = rect.left + (rect.width - pw)/2;
        } else if(preferR) {
          px = rect.right + 12;
        } else if(preferL) {
          px = rect.left - pw - 12;
        } else {
          px = rect.left + (rect.width - pw)/2;
        }
        px = Math.max(12, Math.min(px, window.innerWidth - pw -12));

        // show it
        popup.style.cssText += `
          left:${px}px;
          top:${py}px;
          opacity:1; visibility:visible;
        `;
      }

      block.addEventListener("mouseenter", e => {
        if(window.innerWidth > 728) showProjectPopup(e);
      });
      block.addEventListener("click", e => {
        if(window.innerWidth <= 728) showProjectPopup(e);
      });
      block.addEventListener("mouseleave", () => {
        setTimeout(() => {
          if(!isOverPopup) {
            popup.style.display = "none";
            block.classList.remove("paused");
            activeBlock = null;
          }
        }, 20);
      });
    });
  }

  // initial layout + live resizes
  layoutThumbnails();
  window.addEventListener("resize", layoutThumbnails);

  // keep popup from hiding while hovered
  popup.addEventListener("mouseenter", () => {
    isOverPopup = true;
    activeBlock?.classList.add("paused");
  });
  popup.addEventListener("mouseleave", () => {
    isOverPopup = false;
    activeBlock?.classList.remove("paused");
    popup.style.display = "none";
    activeBlock = null;
  });

  // ────────────────────────────────────────────────────────────────
  // 2) FOOTER PARALLAX SLIDE (no fade)
  // ────────────────────────────────────────────────────────────────
  window.addEventListener("scroll", () => {
    const footer = document.getElementById("footer");
    const trigger = window.innerHeight * 0.3;    // first 30% of scroll
    const sc = Math.min(window.scrollY, trigger);
    const pct = sc / trigger;                   // 0 → 1
    const y = 100 - pct*100;                     // 100% → 0%
    footer.style.transform = `translateY(${y}%)`;
    footer.style.pointerEvents = pct > 0.1 ? "auto" : "none";
  });

  // ────────────────────────────────────────────────────────────────
  // 3) THUMBNAILS PARALLAX BEHIND (gentle)
  // ────────────────────────────────────────────────────────────────
  window.addEventListener("scroll", () => {
    document.querySelector(".sites")?.style.setProperty(
      "transform",
      `translateY(${window.scrollY*0.05}px)`
    );
  });

  // ────────────────────────────────────────────────────────────────
  // 4) EYE TRACKING + BLINK
  // ────────────────────────────────────────────────────────────────
  const eyes = document.querySelectorAll("span.intro-eyes-wrapper .eye");
  eyes.forEach(eye => {
    const line = document.createElement("div");
    line.className = "blink-line";
    eye.appendChild(line);
  });
  function trackPupils(e) {
    eyes.forEach(eye => {
      const pupil = eye.querySelector(".pupil"),
            rect  = eye.getBoundingClientRect(),
            dx    = e.clientX - (rect.left + rect.width/2),
            dy    = e.clientY - (rect.top  + rect.height/2),
            ang   = Math.atan2(dy, dx),
            moveX = Math.cos(ang)*rect.width*0.35,
            moveY = Math.sin(ang)*rect.height*0.15 + 0.1*rect.height;
      pupil.style.left = `calc(50% + ${moveX}px)`;
      pupil.style.top  = `calc(50% + ${moveY}px)`;
    });
  }
  function blinkEye(eye) {
    eye.classList.add("blinking");
    setTimeout(() => eye.classList.remove("blinking"), 200);
  }
  function blinkAll() {
    eyes.forEach(blinkEye);
  }
  document.addEventListener("mousemove", trackPupils);
  setInterval(() => { if(Math.random() < 0.3) blinkAll(); }, 2500);

// ────────────────────────────────────────────────────────────────
// 5) WAITER SEQUENCE • BILL • FINAL PAYPAL
// ────────────────────────────────────────────────────────────────
let waiterIndex    = 0,
    waiterStopped  = false,
    waiterTimeout  = null,
    billTotal      = 0,
    lightsDimmed   = false;

// grab our new UI pieces
const overlayEl  = document.getElementById('dim-overlay');
const jazzUI     = document.getElementById('jazz-ui');
const jazzPlayer = document.getElementById('jazz-player');

// create the lights toggle link on‐demand
let lightToggle = null;
function ensureLightToggle() {
  if (!lightToggle) {
    lightToggle = document.createElement('a');
    lightToggle.id = 'light-toggle';
    lightToggle.textContent = 'turn the lights back up';
    document.body.appendChild(lightToggle);
    lightToggle.onclick = () => {
      lightsDimmed = !lightsDimmed;
      overlayEl.classList.toggle('active', lightsDimmed);
      lightToggle.textContent = lightsDimmed
        ? 'turn the lights back up'
        : 'dim the lights again';
    };
  }
}

// wire up jazz play/pause
document.getElementById('jazz-toggle').onclick = () => {
  if (jazzPlayer.paused) {
    jazzPlayer.play();
    jazzUI.querySelector('#jazz-toggle').textContent = 'pause';
  } else {
    jazzPlayer.pause();
    jazzUI.querySelector('#jazz-toggle').textContent = 'play';
  }
};

function addToBill(item, cost) {
  billTotal += cost;
  let bill = document.getElementById("waiter-bill");
  if (!bill) {
    bill = document.createElement("div");
    bill.id = "waiter-bill";
    bill.className = "bill";
    document.body.appendChild(bill);
  }
  bill.querySelector(".settle-link")?.remove();
  const line = document.createElement("div");
  line.className = "bill-item";
  line.textContent = `${item} – ${cost === 0 ? "FREE" : `$${cost.toFixed(2)}`}`;
  bill.appendChild(line);
  if (!bill.querySelector(".bill-header")) {
    const hdr = document.createElement("span");
    hdr.className = "bill-header";
    hdr.textContent = "BILL";
    bill.prepend(hdr, document.createElement("br"));
  }
  const settle = document.createElement("a");
  settle.href = "#"; settle.className = "settle-link";
  settle.innerHTML = `<span class="link-text">settle up</span>`;
  settle.onclick = e => {
    e.preventDefault();
    waiterStopped = true;
    document.querySelectorAll(".popup.waiter-popup").forEach(p => p.remove());
    showPayment();
  };
  bill.appendChild(settle);
}

const waiterSteps = [
  {
    question: "Welcome to Liam's website. I'll be taking care of you today. Can I start you with any still or sparkling water?",
    options: [
      { label: 'STILL',     cost: 0 },
      { label: 'SPARKLING', cost: 3.5 }
    ],
    mandatory: true
  },
  {
    question: "How are we settling in? Can I interest you in a freshly shucked oyster and a glass of chablis? Or perhaps some manchego croquetas, paprika aioli and a crisp lager?",
    options: [
      { label: 'OYSTER & CHABLIS', cost: 15.5 },
      { label: 'CROQUETAS & BEER', cost: 13.5 }
    ]
  },
  // ← AMBIANCE STEP
  {
    question: "How’s the website’s ambiance? Can I do anything to make you more comfortable?",
    options: [
      {
        label: 'DIM THE LIGHTS',
        cost: 0,
        action: () => {
          overlayEl.classList.add('active');
          lightsDimmed = true;
          ensureLightToggle();
          lightToggle.classList.remove('hidden');
        }
      },
      {
        label: 'PUT ON SOME JAZZ',
        cost: 0,
        action: () => {
          jazzUI.classList.remove('hidden');
          jazzPlayer.play();
        }
      }
    ]
  },
  {
    question: "Are we feeling like some more snacks? We have a lovely simple tart of snow crab and chives, and a beautiful kangaroo tataki brushed with our house dashi.",
    options: [
      { label: 'CRAB TART',       cost: 21 },
      { label: 'KANGAROO TATAKI', cost: 19 }
    ]
  },
  {
    question: "Can I get you another drink at all? We do a killer rye old fashioned. There's also a bouncy new Tasmanian gamay on the list.",
    options: [
      { label: 'RYE OLD FASH', cost: 14 },
      { label: 'GAMAY',       cost: 11 }
    ]
  },
  {
    question: "Are we feeling ready for mains? The specials tonight are to die for. Our pie of the evening is ethically hunted venison stewed in red wine and herbs de Provence. And tonight's fish is a swordfish steak cooked in brown butter, served on sauce vierge.",
    options: [
      { label: 'DEER PIE',  cost: 21 },
      { label: 'SWORDFISH', cost: 24 }
    ]
  },
  {
    question: "Room for dessert? Go on, just take a peep. Treat yourself. We have a very simple lemon tart, and we're also doing a Crêpes Suzette finished tableside if you feel like a bit of a show.",
    options: [
      { label: 'LEMON TART',     cost: 9 },
      { label: 'CRÊPES SUZETTE', cost: 11 }
    ]
  },
  {
    question: "Can I offer you any tea, coffee, or a complimentary cigarette to round out the meal?",
    options: [
      { label: 'TEA',       cost: 3 },
      { label: 'COFFEE',    cost: 4 },
      { label: 'CIGARETTE', cost: 0 }
    ]
  },
  {
    question: "Shall I bring you the cheque?",
    options: [
      { label: 'YES', cost: 0, isFinal: true }
    ]
  }
];

function showWaiterStep(i) {
  if (waiterStopped || i >= waiterSteps.length) return;
  const step = waiterSteps[i];
  const w    = document.createElement("div");
  w.className = "popup waiter-popup";

  // question
  const qEl = document.createElement("p");
  w.appendChild(qEl);

  // options
  step.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "waiter-option";
    btn.textContent = opt.label;
    btn.onclick = () => {
      clearTimeout(waiterTimeout);
      w.remove();

      // only add to bill if it's not the final “Yes” step and no special action
      if (!opt.isFinal && !opt.action) {
        addToBill(opt.label, opt.cost);
      }

      // run any ambiance/jazz action
      if (opt.action) opt.action();

      // final choice → showPayment
      if (opt.isFinal) return showPayment();

      // otherwise continue
      waiterIndex++;
      waiterTimeout = setTimeout(() => showWaiterStep(waiterIndex), 20000);
    };
    w.appendChild(btn);
  });

  // “no thanks” always advances
  if (!step.mandatory) {
    const noBtn = document.createElement("a");
    noBtn.className = "waiter-no";
    noBtn.href = "#";
    noBtn.innerHTML = `<span class="link-text">no thanks</span>`;
    noBtn.onclick = e => {
      e.preventDefault();
      clearTimeout(waiterTimeout);
      w.remove();
      waiterIndex++;
      waiterTimeout = setTimeout(() => showWaiterStep(waiterIndex), 20000);
    };
    w.appendChild(noBtn);
  }

  document.body.appendChild(w);

  // TYPEWRITER + outside-click advance
  const txt = step.question;
  let idx = 0;
  (function typeChar() {
    qEl.textContent = txt.slice(0, idx++);
    if (idx <= txt.length) {
      setTimeout(typeChar, 15);
    } else {
      w.classList.add("ready");
      function outside(e) {
        if (!w.contains(e.target)) {
          clearTimeout(waiterTimeout);
          w.remove();
          window.removeEventListener("click", outside);
          waiterIndex++;
          waiterTimeout = setTimeout(() => showWaiterStep(waiterIndex), 20000);
        }
      }
      window.addEventListener("click", outside);
    }
  })();
}

function showPayment() {
  waiterStopped = true;
  document.querySelectorAll(".popup.waiter-popup").forEach(p => p.remove());

  // final bill popup
  const pay = document.createElement("div");
  pay.className = "popup final-popup";
  pay.innerHTML = `
    <p>Pay Liam $${billTotal.toFixed(2)} AUD?</p>
    <button class="waiter-option pay-button">PAY</button>
    <a href="#" class="runner-link"><span class="link-text">do a runner</span></a>
  `;
  document.body.appendChild(pay);

  // PAY button
  pay.querySelector(".pay-button").onclick = () => {
    window.open(`https://paypal.me/liamalexanderquinn/${billTotal.toFixed(2)}`, "_blank");
    pay.remove();
    document.getElementById("waiter-bill")?.remove();
  };

  // DO A RUNNER → call police
  pay.querySelector(".runner-link").onclick = e => {
    e.preventDefault();
    pay.remove();
    document.getElementById("waiter-bill")?.remove();
    showPolice();
  };
}

function showPolice() {
  // create overlay
  if (!document.querySelector(".police-overlay")) {
    const ov = document.createElement("div");
    ov.className = "police-overlay";
    document.body.appendChild(ov);
  }

  // create police popup
  const pop = document.createElement("div");
  pop.className = "popup police-popup";
  pop.innerHTML = `
    <p>The police have been called to your location</p>
    <button class="ok-button">okay</button>
  `;
  document.body.appendChild(pop);

  // ok closes just the popup (overlay stays)
  pop.querySelector(".ok-button").onclick = () => pop.remove();
}

function showWaiterStep(i) {
  if (waiterStopped || i >= waiterSteps.length) return;
  const step = waiterSteps[i];
  const w    = document.createElement("div");
  w.className = "popup waiter-popup";

  // question
  const qEl = document.createElement("p");
  w.appendChild(qEl);

  // options
  step.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "waiter-option";
    btn.textContent = opt.label;
    btn.onclick = () => {
      clearTimeout(waiterTimeout);
      w.remove();

      // only add to bill if it's not the final “Yes” step and no special action
      if (!opt.isFinal && !opt.action) {
        addToBill(opt.label, opt.cost);
      }

      // run any ambiance/jazz action
      if (opt.action) opt.action();

      // final choice → showPayment
      if (opt.isFinal) return showPayment();

      // otherwise continue
      waiterIndex++;
      waiterTimeout = setTimeout(() => showWaiterStep(waiterIndex), 20000);
    };
    w.appendChild(btn);
  });

  // “no thanks” always advances
  if (!step.mandatory) {
    const noBtn = document.createElement("a");
    noBtn.className = "waiter-no";
    noBtn.href = "#";
    noBtn.innerHTML = `<span class="link-text">no thanks</span>`;
    noBtn.onclick = e => {
      e.preventDefault();
      clearTimeout(waiterTimeout);
      w.remove();
      waiterIndex++;
      waiterTimeout = setTimeout(() => showWaiterStep(waiterIndex), 20000);
    };
    w.appendChild(noBtn);
  }

  document.body.appendChild(w);

  // TYPEWRITER + outside-click advance
  const txt = step.question;
  let idx = 0;
  (function typeChar() {
    qEl.textContent = txt.slice(0, idx++);
    if (idx <= txt.length) {
      setTimeout(typeChar, 15);
    } else {
      w.classList.add("ready");
      function outside(e) {
        if (!w.contains(e.target)) {
          clearTimeout(waiterTimeout);
          w.remove();
          window.removeEventListener("click", outside);
          waiterIndex++;
          waiterTimeout = setTimeout(() => showWaiterStep(waiterIndex), 20000);
        }
      }
      window.addEventListener("click", outside);
    }
  })();
}

// kick it off after 10s
waiterTimeout = setTimeout(() => showWaiterStep(0), 10000);
});