// == FULL JS: THUMBNAILS • FOOTER PARALLAX • EYES • AMBIANCE • WAITER & BILL ==
document.addEventListener("DOMContentLoaded", () => {
  // ────────────────────────────────────────────────────────────────
  // 0) Shared state & DOM references
  // ────────────────────────────────────────────────────────────────
  const popup          = document.getElementById("popup");
  const sitesContainer = document.getElementById("sites-container") || document.querySelector(".sites");
  document.body.appendChild(popup);

  let activeBlock   = null;
  let isOverPopup   = false;
  const floatCancels= new Set();

// ────────────────────────────────────────────────────────────────
// 1) PROJECT THUMBNAILS → GRID LAYOUT + FLOATING + POPUPS
// ────────────────────────────────────────────────────────────────
const projects = [
  { name:'weekdays',    image:'weekdays.gif',    client:'Weekdays',     work:'website',               year:'2025', description:'A clean and minimal website (unless you want it not to be). Built for Weekdays.', link:'https://week-days.com.au/'},
  { name:'studio blank',image:'studio-blank.gif',client:'studio blank', work:'website, motion design', year:'2024', description:'A quirky website for a furniture studio (via Weekdays).',             link:'https://www.studioblank.com.au/' },
  { name:'veraison',    image:'veraison.png',    client:'veraison',     work:'brand, website, print',  year:'2025', description:'A print-turned-digital wine & culture zine.',                       link:'https://www.veraisonmag.com/' },
  { name:'claire adey', image:'claire-adey.gif', client:'claire adey',  work:'website',               year:'2025', description:'A portfolio website for a foodie needs a good cookies section.',      link:'https://www.claireadey.com/' },
  { name:'oishii dry',  image:'oishii-dry.png',  client:'Oishii Dry',   work:'brand, website, packaging',year:'2025', description:'A local yuzu rice lager with Japanese sensibilities.',               link:'https://www.oishiiworld.com.au/'}
];

function layoutThumbnails() {
  // clear existing thumbs & hide any open popup
  floatCancels.forEach(fn => fn());
  floatCancels.clear();
  sitesContainer.innerHTML = "";
  popup.style.display = "none";

  const thumbSize = window.innerWidth <= 728 ? 75 : 120;
  const count     = projects.length;
  const cols      = Math.ceil(Math.sqrt(count));
  const rows      = Math.ceil(count/cols);
  const cellW     = sitesContainer.clientWidth  / cols;
  const cellH     = sitesContainer.clientHeight / rows;

  projects.forEach((project, i) => {
    const block = document.createElement("div");
    block.className = "floating-block";
    block.style.backgroundImage = `url(images/${project.image})`;

    // position
    const col = i % cols, row = Math.floor(i/cols);
    const x   = col*cellW + (cellW - thumbSize)/2;
    const y   = row*cellH + (cellH - thumbSize)/2;
    block.style.cssText += `
      width:${thumbSize}px;
      height:${thumbSize}px;
      left:${x}px;
      top:${y}px;
    `;

    // fade-in
    block.style.opacity    = "0";
    block.style.transition = "opacity 1s ease";
    sitesContainer.appendChild(block);
    setTimeout(() => block.style.opacity = "1", Math.random() * 1000);

    // floating motion
    let vx = (Math.random()-0.5)*0.5;
    let vy = (Math.random()-0.5)*0.5;
    let cancelled = false;
    (function floatLoop(){
      if(cancelled) return;
      if(!block.classList.contains("paused")) {
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

    // showProjectPopup is defined _per_-thumb so it captures `project` correctly
    function showProjectPopup(e) {
      console.log(`🎤 showProjectPopup for ${project.client}`);
      e.stopPropagation();
      block.classList.add("paused");
      activeBlock = block;

      // build & position popup
      const rect   = block.getBoundingClientRect();
      const maxW   = window.innerWidth < 640 ? window.innerWidth * 0.9 : 300;
      const spaceR = window.innerWidth - rect.right;
      const spaceL = rect.left;
      const preferR= spaceR > maxW + 20;
      const preferL= spaceL > maxW + 20;

      popup.className = "popup project-popup";
      popup.innerHTML = `
        <span class="link-text">${project.client}</span>
        <span>${project.work}</span>
        <span>${project.year}</span>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank">
          <span class="link-text">Visit site</span>
        </a>
      `;
      popup.style.cssText += `
        display:flex;
        max-width:${maxW}px;
        left:-9999px; top:-9999px;
        visibility:hidden; opacity:0;
      `;

      const pw     = popup.offsetWidth;
      const ph     = popup.offsetHeight;
      const tooLow = rect.bottom + ph > window.innerHeight;
      const py     = tooLow
        ? rect.bottom + pageYOffset - ph
        : rect.top + pageYOffset;

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
      px = Math.max(12, Math.min(px, window.innerWidth - pw - 12));

      popup.style.cssText += `
        left:${px}px;
        top:${py}px;
        opacity:1; visibility:visible;
      `;
    }

    // wire up hover/click
    block.addEventListener("mouseenter", e => {
      console.log(`🖱 mouseenter on ${project.client}`);
      if(window.innerWidth > 728) showProjectPopup(e);
    });
    block.addEventListener("click", e => {
      console.log(`🖱 click on ${project.client}`);
      if(window.innerWidth <= 728) showProjectPopup(e);
    });
    block.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if(!isOverPopup) {
          popup.style.display = "none";
          block.classList.remove("paused");
          activeBlock = null;
        }
      }, 200);
    });
  });
}

// kick it off & re-run on resize
layoutThumbnails();
window.addEventListener("resize", layoutThumbnails);

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
// TOGGLE “View / Hide Websites” LINK + WAVE EFFECT
// (drop in right after layoutThumbnails() and its resize listener)
// ────────────────────────────────────────────────────────────────
;(function() {
  const toggleWebsites = document.getElementById('toggle-websites');

  // wrap each character in a <span> for the wave
  function wrapWave(el, text) {
    el.textContent = '';
    el.classList.add('wave');
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${i * 0.1}s`;
      el.appendChild(span);
    });
  }

  // initialize as “View some of my websites.”
  wrapWave(toggleWebsites, 'View some of my websites.');

  toggleWebsites.addEventListener('click', e => {
    e.preventDefault();
    const nowShowing = sitesContainer.classList.toggle('visible');

    if (nowShowing) {
      // just opened → switch to “Hide websites.” and lay out thumbs
      toggleWebsites.classList.remove('wave');
      toggleWebsites.textContent = 'Hide websites.';
      // ensure the container is visible before positioning
      requestAnimationFrame(layoutThumbnails);
    } else {
      // just closed → restore “View…” with wave
      wrapWave(toggleWebsites, 'View some of my websites.');
    }
  });
})();

  // ────────────────────────────────────────────────────────────────
  // 2) FOOTER PARALLAX SLIDE
  // ────────────────────────────────────────────────────────────────
  window.addEventListener("scroll", () => {
    const footer  = document.getElementById("footer");
    const trigger = window.innerHeight * 0.3;
    const sc      = Math.min(window.scrollY, trigger);
    const pct     = sc / trigger;
    footer.style.transform     = `translateY(${100 - pct*100}%)`;
    footer.style.pointerEvents = pct > 0.1 ? "auto" : "none";
  });

  // ────────────────────────────────────────────────────────────────
  // 3) THUMBNAILS PARALLAX BEHIND
  // ────────────────────────────────────────────────────────────────
  window.addEventListener("scroll", () => {
    document.querySelector(".sites")?.style.setProperty(
      "transform", `translateY(${window.scrollY * 0.05}px)`
    );
  });

  // ────────────────────────────────────────────────────────────────
  // 4) EYE TRACKING + BLINK
  // ────────────────────────────────────────────────────────────────
  const eyes = document.querySelectorAll(".intro-eyes-wrapper .eye");
  eyes.forEach(eye => {
    const line = document.createElement("div");
    line.className = "blink-line";
    eye.appendChild(line);
  });
  document.addEventListener("mousemove", e => {
    eyes.forEach(eye => {
      const pupil = eye.querySelector(".pupil"),
            rect  = eye.getBoundingClientRect(),
            dx    = e.clientX - (rect.left + rect.width/2),
            dy    = e.clientY - (rect.top + rect.height/2),
            ang   = Math.atan2(dy, dx),
            moveX = Math.cos(ang)*rect.width*0.35,
            moveY = Math.sin(ang)*rect.height*0.15 + rect.height*0.1;
      pupil.style.left = `calc(50% + ${moveX}px)`;
      pupil.style.top  = `calc(50% + ${moveY}px)`;
    });
  });
  setInterval(() => {
    if(Math.random() < 0.3) eyes.forEach(eye => {
      eye.classList.add("blinking");
      setTimeout(() => eye.classList.remove("blinking"), 200);
    });
  }, 2500);

// ────────────────────────────────────────────────────────────────
// 5) AMBIANCE CONTROLS • INIT JAZZ TOGGLE & LIGHT TOGGLE
// ────────────────────────────────────────────────────────────────
const heroEl     = document.querySelector('.hero');
const overlayEl  = document.getElementById('dim-overlay');
const jazzPlayer = document.getElementById('jazz-player');
jazzPlayer.loop    = true;
jazzPlayer.preload = 'auto';

;(function initJazzToggle(){
  const jazzUi = document.createElement('div');
  jazzUi.id             = 'jazz-ui';
  jazzUi.style.position = 'absolute';
  jazzUi.style.left     = '20px';
  jazzUi.style.bottom   = '20px';
  jazzUi.style.zIndex   = '2';
  jazzUi.style.display  = 'none';
  jazzUi.style.pointerEvents = 'auto';   // ← enable pointer events here

  const btn = document.createElement('button');
  btn.id                  = 'jazz-toggle';
  btn.style.background    = 'none';
  btn.style.border        = 'none';
  btn.style.padding       = '0';
  btn.style.fontFamily    = 'Commit Mono, monospace';
  btn.style.textTransform = 'uppercase';
  btn.style.cursor        = 'pointer';
  btn.style.color         = 'inherit';
  btn.onclick = () => {
    if (jazzPlayer.paused) jazzPlayer.play();
    else                   jazzPlayer.pause();
  };

  jazzUi.appendChild(btn);
  heroEl.appendChild(jazzUi);

  function positionJazz() {
    const lt = document.getElementById('light-toggle');
    if (lt) {
      const gap = lt.offsetHeight + 20;
      jazzUi.style.bottom = `${gap}px`;
    }
  }

  jazzPlayer.addEventListener('play', () => {
    btn.textContent     = 'pause jazz';
    positionJazz();
    jazzUi.style.display = 'block';
  });
  jazzPlayer.addEventListener('pause', () => {
    btn.textContent     = 'play jazz';
    positionJazz();
    jazzUi.style.display = 'block';
  });
})();

let lightToggle = null;
function ensureLightToggle() {
  if (lightToggle) return;
  lightToggle = document.createElement('button');
  lightToggle.id             = 'light-toggle';
  lightToggle.textContent    = 'turn the lights up';
  lightToggle.style.position = 'absolute';
  lightToggle.style.left     = '20px';
  lightToggle.style.bottom   = '20px';
  lightToggle.style.zIndex   = '2';
  lightToggle.style.pointerEvents = 'auto';   // ← and here
  lightToggle.style.background = 'none';
  lightToggle.style.border     = 'none';
  lightToggle.style.padding    = '0';
  lightToggle.style.fontFamily = 'Commit Mono, monospace';
  lightToggle.style.textTransform = 'uppercase';
  lightToggle.style.cursor     = 'pointer';
  lightToggle.style.color      = 'inherit';

  lightToggle.onclick = () => {
    const on = overlayEl.classList.toggle('active');
    lightToggle.textContent = on
      ? 'turn the lights up'
      : 'dim the lights again';
  };

  heroEl.appendChild(lightToggle);
}

  // ────────────────────────────────────────────────────────────────
  // 6) WAITER SEQUENCE • BILL • CHEQUE POPUP • POLICE
  // ────────────────────────────────────────────────────────────────
  let waiterIndex   = 0,
      waiterStopped = false,
      waiterTimeout = null,
      billTotal     = 0;

      function addToBill(item, cost) {
        billTotal += cost;
        let bill = document.getElementById("waiter-bill");
        if (!bill) {
          bill = document.createElement("div");
          bill.id = "waiter-bill";
          bill.className = "bill";
          document.body.appendChild(bill);
        }
        bill.classList.add("visible");
        bill.querySelector(".settle-link")?.remove();
      
        const line = document.createElement("div");
        line.className = "bill-item";
        // ← use an en-dash here, not a hyphen-minus
        line.textContent = `${item} – ${cost === 0 ? "FREE" : cost.toFixed(2)}`;
        bill.appendChild(line);
      
        if (!bill.querySelector(".bill-header")) {
          const hdr = document.createElement("span");
          hdr.className = "bill-header";
          hdr.textContent = "BILL";
          bill.prepend(hdr, document.createElement("br"));
        }
      
        const settle = document.createElement("a");
        settle.href = "#";
        settle.className = "settle-link";
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
      question: "Welcome to Liam's website. Can I get you some still or sparkling water to start?",
      options: [
        { label: "Still Water", cost: 0 },
        { label: "Sparkling Water", cost: 2.5 }
      ],
      mandatory: true
    },
    {
      question: "How are you finding the ambiance of the website? Can I do anything to make your stay more comfortable?",
      options: [
        { label: "Play Some Jazz", action: () => { jazzPlayer.play(); } },
        { label: "Dim the Lights",  action: () => { overlayEl.classList.add('active'); ensureLightToggle(); } },
        { label: "Both",            action: () => { jazzPlayer.play(); overlayEl.classList.add('active'); ensureLightToggle(); } }
      ],
      mandatory: false
    },
    {
      question: "Can I get you some snacks? Perhaps an oyster & a glass of chablis, or a manchego croquette & a crisp lager?",
      options: [
        { label: "Oyster & Chablis", cost: 14.5 },
        { label: "Croquette & Beer", cost: 12.5 }
      ],
      mandatory: false
    },
    {
      question: "The specials tonight are divine. We have a venison pie with celeriac mash, or grilled swordfish on a rustic sauce vierge.",
      options: [
        { label: "Deer Pie", cost: 22.5 },
        { label: "Swordfish", cost: 28.0 }
      ],
      mandatory: false
    },
    {
      question: "Are you interested in some dessert? Sticky Date Pudding or a classic Lemon Tart?",
      options: [
        { label: "Sticky Date Pudding", cost: 8.5 },
        { label: "Lemon Tart", cost: 9.5 }
      ],
      mandatory: false
    },
    {
      question: "Can I get you a digestif, maybe a black Coffee or a complimentary cigarette?",
      options: [
        { label: "Coffee", cost: 3.0 },
        { label: "Cigarette", cost: 0 }
      ],
      mandatory: false
    },
    {
      question: "All done here? Shall I bring you the bill?",
      options: [
        { label: "Yes, please", isFinal: true }
      ],
      mandatory: true
    }
  ];

  function showWaiterStep(i) {
    if (waiterStopped || i >= waiterSteps.length) return;
    const step = waiterSteps[i];
    const w    = document.createElement("div");
    w.className = "popup waiter-popup";

    const q = document.createElement("p");
    q.style.lineHeight = "1.5";
    q.textContent = step.question;
    w.appendChild(q);

    step.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className   = "waiter-option";
      btn.textContent = opt.label;
      btn.onclick     = () => {
        cleanup();
        if (!opt.isFinal && !opt.action) addToBill(opt.label, opt.cost);
        if (opt.action) opt.action();
        if (opt.isFinal) return showPayment();
        advance();
      };
      w.appendChild(btn);
    });

    if (!step.mandatory) {
      const no = document.createElement("a");
      no.className = "waiter-no";
      no.href      = "#";
      no.innerHTML = `<span class="link-text">no thanks</span>`;
      no.onclick   = e => { e.preventDefault(); cleanup(); advance(); };
      w.appendChild(no);
    }

    function cleanup() {
      clearTimeout(waiterTimeout);
      w.remove();
    }
    function advance() {
      waiterIndex++;
      waiterTimeout = setTimeout(() => showWaiterStep(waiterIndex), 20000);
    }

    document.body.appendChild(w);
    requestAnimationFrame(() => w.classList.add("ready"));
  }

  function showPayment() {
    waiterStopped = true;
    document.querySelectorAll(".popup.waiter-popup").forEach(p => p.remove());

    const pay = document.createElement("div");
    pay.className = "popup cheque-popup";
    pay.innerHTML = `
      <div class="cheque-header">LIAM ALEXANDER QUINN<br>PTY LTD</div>
      <div class="cheque-items"></div>
      <hr class="cheque-line">
      <div class="cheque-total"><span>Total</span><span>$${billTotal.toFixed(2)}</span></div>
      <hr class="cheque-line">
      <button class="waiter-option pay-button">PAY BILL</button>
      <button class="waiter-option runner-button">DO A RUNNER</button>
      <hr class="cheque-line">
      <div class="cheque-footer">"WE SERVE TO SERVE AGAIN"</div>
    `;
    document.body.appendChild(pay);
    requestAnimationFrame(() => pay.classList.add("visible"));

    const itemsContainer = pay.querySelector(".cheque-items");
    document.querySelectorAll(".bill-item").forEach(li => {
      const row = document.createElement("div");
      row.className = "cheque-item-row";
      const [name, price] = li.textContent.split(" – ");
      row.innerHTML = `<span class="cheque-name">${name}</span><span class="cheque-price">${price}</span>`;
      itemsContainer.appendChild(row);
    });

    pay.querySelector(".pay-button").onclick = () => {
      window.open(`https://paypal.me/liamalexanderquinn/${billTotal.toFixed(2)}`, "_blank");
      document.getElementById("waiter-bill")?.remove();
      pay.remove();
    };
    pay.querySelector(".runner-button").onclick = e => {
      e.preventDefault();
      document.getElementById("waiter-bill")?.remove();
      pay.remove();
      showPolice();
    };
  }

  function showPolice() {
    if (!document.querySelector(".police-overlay")) {
      const ov = document.createElement("div");
      ov.className = "police-overlay";
      document.body.appendChild(ov);
    }
    const pop = document.createElement("div");
    pop.className = "popup police-popup";
    pop.innerHTML = `
      <p>The police have been called to your location</p>
      <button class="ok-button">okay</button>
    `;
    document.body.appendChild(pop);
    pop.querySelector(".ok-button").onclick = () => pop.remove();
  }

  waiterTimeout = setTimeout(() => showWaiterStep(0), 10000);
});