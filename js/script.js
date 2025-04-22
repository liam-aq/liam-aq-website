// == FULL JS: THUMBNAILS • FOOTER • PARALLAX • EYES • WAITER & BILL ==
document.addEventListener("DOMContentLoaded", () => {
  // ────────────────────────────────────────────────────────────────
  // 1) PROJECT THUMBNAILS + POPUPS
  // ────────────────────────────────────────────────────────────────
  const popup = document.getElementById('popup');
  const sitesContainer = document.getElementById('sites-container');
  document.body.appendChild(popup);

  const projects = [
    { name: 'weekdays',      image: 'weekdays.gif',      client: 'Weekdays',      work: 'website',             year: '2025', description: 'A clean and minimal website…',          link: 'https://week-days.com.au/' },
    { name: 'studio blank',  image: 'studio-blank.gif',  client: 'studio blank',  work: 'website, motion design', year: '2024', description: 'A quirky website for a furniture…',    link: 'https://www.studioblank.com.au/' },
    { name: 'veraison',      image: 'veraison.png',      client: 'veraison',      work: 'brand, website, print', year: '2025', description: 'A print-turned-digital wine zine.',     link: 'https://www.veraisonmag.com/' },
    { name: 'claire adey',   image: 'claire-adey.gif',   client: 'claire adey',   work: 'website',             year: '2025', description: 'A portfolio site with a cookies section.', link: 'https://www.claireadey.com/' },
    { name: 'oishii dry',    image: 'oishii-dry.png',    client: 'Oishii Dry',    work: 'brand, packaging',     year: '2025', description: 'A local yuzu rice lager with Japanese sensibilities.', link: 'https://www.oishiiworld.com.au/' }
  ];

  let activeBlock = null, isOverPopup = false;

  projects.forEach(project => {
    const block = document.createElement('div');
    block.classList.add('floating-block');
    block.style.backgroundImage = `url(images/${project.image})`;

    // random initial position + size
    const thumbSize = window.innerWidth <= 728 ? 75 : 120;
    let x = Math.random() * (sitesContainer.offsetWidth - thumbSize);
    let y = Math.random() * (sitesContainer.offsetHeight - thumbSize);
    block.style.cssText += `width:${thumbSize}px;height:${thumbSize}px;left:${x}px;top:${y}px;`;
    sitesContainer.appendChild(block);

    // floating animation
    let vx = (Math.random() - 0.5) * 0.5, vy = (Math.random() - 0.5) * 0.5;
    (function float() {
      if (!block.classList.contains('paused')) {
        x += vx; y += vy;
        if (x < 0 || x > sitesContainer.offsetWidth - thumbSize) vx *= -1;
        if (y < 0 || y > sitesContainer.offsetHeight - thumbSize) vy *= -1;
        block.style.left = `${x}px`;
        block.style.top  = `${y}px`;
      }
      requestAnimationFrame(float);
    })();

    // popup builder
    function showProjectPopup(e) {
      e.stopPropagation();
      block.classList.add('paused');
      activeBlock = block;

      const rect   = block.getBoundingClientRect();
      const maxW   = window.innerWidth < 640 ? window.innerWidth * 0.9 : 300;
      const spaceR = window.innerWidth - rect.right;
      const spaceL = rect.left;
      const preferR= spaceR > maxW + 20;
      const preferL= spaceL > maxW + 20;

      popup.className = 'popup project-popup';
      popup.innerHTML = `
        <span class="link-text">${project.client}</span>
        <span>${project.work}</span>
        <span>${project.year}</span>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank"><span class="link-text">Visit site</span></a>
      `;

      popup.style.cssText += `
        display:flex;
        max-width:${maxW}px;
        left:-9999px; top:-9999px;
        visibility:hidden; opacity:0;
      `;

      const pw = popup.offsetWidth;
      const ph = popup.offsetHeight;
      const tooLow = rect.bottom + ph > window.innerHeight;
      const py = tooLow
        ? rect.bottom + window.pageYOffset - ph
        : rect.top + window.pageYOffset;

      let px;
      if (window.innerWidth < 640) {
        px = rect.left + (rect.width - pw)/2;
      } else if (preferR) {
        px = rect.right + 12;
      } else if (preferL) {
        px = rect.left - pw - 12;
      } else {
        px = rect.left + (rect.width - pw)/2;
      }
      px = Math.max(12, Math.min(px, window.innerWidth - pw - 12));

      popup.style.cssText += `
        left:${px}px;
        top:${py}px;
        opacity:1;
        visibility:visible;
      `;
    }

    // desktop hover / mobile tap
    block.addEventListener('mouseenter', e => {
      if (window.innerWidth > 728) showProjectPopup(e);
    });
    block.addEventListener('click', e => {
      if (window.innerWidth <= 728) showProjectPopup(e);
    });

    block.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!isOverPopup) {
          popup.style.display = 'none';
          block.classList.remove('paused');
          activeBlock = null;
        }
      }, 20);
    });
  });

  popup.addEventListener('mouseenter', () => {
    isOverPopup = true;
    if (activeBlock) activeBlock.classList.add('paused');
  });
  popup.addEventListener('mouseleave', () => {
    isOverPopup = false;
    if (activeBlock) activeBlock.classList.remove('paused');
    popup.style.display = 'none';
    activeBlock = null;
  });

  // ────────────────────────────────────────────────────────────────
  // 2) FOOTER FADE ON SCROLL
  // ────────────────────────────────────────────────────────────────

  window.addEventListener('scroll', () => {
  const footer    = document.getElementById('footer');
  const scrollY   = window.scrollY || window.pageYOffset;
  const docH      = document.documentElement.scrollHeight;
  const viewH     = window.innerHeight;
  const maxScroll = docH - viewH;

  // fire at just 30% down the page instead of waiting to the bottom
  const progress = maxScroll > 0
    ? Math.min(scrollY / (maxScroll * 0.3), 1)
    : 1;

  footer.style.opacity       = progress;
  footer.style.transform     = `translateY(${(1 - progress) * 100}%)`;
  footer.style.pointerEvents = progress > 0.05 ? 'auto' : 'none';
});

  // ────────────────────────────────────────────────────────────────
  // 3) PARALLAX ON THUMBNAILS
  // ────────────────────────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    const parallax = document.querySelector('.sites');
    if (parallax) parallax.style.transform = `translateY(${window.scrollY * 0.05}px)`;
  });

  // ────────────────────────────────────────────────────────────────
  // 4) EYE TRACKING + BLINK
  // ────────────────────────────────────────────────────────────────
  const eyes = document.querySelectorAll('span.intro-eyes-wrapper .eye');
  eyes.forEach(eye => {
    const line = document.createElement('div');
    line.className = 'blink-line';
    eye.appendChild(line);
  });

  function trackPupils(e) {
    eyes.forEach(eye => {
      const pupil = eye.querySelector('.pupil');
      const rect  = eye.getBoundingClientRect();
      const dx    = e.clientX - (rect.left + rect.width/2);
      const dy    = e.clientY - (rect.top  + rect.height/2);
      const angle = Math.atan2(dy, dx);
      const moveX = Math.cos(angle)*rect.width * 0.35;
      const moveY = Math.sin(angle)*rect.height*0.15 + 0.1*rect.height;
      pupil.style.left = `calc(50% + ${moveX}px)`;
      pupil.style.top  = `calc(50% + ${moveY}px)`;
    });
  }

  function blinkEye(eye) {
    eye.classList.add('blinking');
    setTimeout(() => eye.classList.remove('blinking'), 200);
  }

  function blinkAll() {
    eyes.forEach(blinkEye);
  }

  document.addEventListener('mousemove', trackPupils);
  setInterval(() => { if (Math.random()<0.3) blinkAll(); }, 2500);

  // ────────────────────────────────────────────────────────────────
  // 5) WAITER SEQUENCE • BILL • FINAL PAYPAL
  // ────────────────────────────────────────────────────────────────
  let waiterIndex   = 0,
      waiterStopped = false,
      waiterTimeout = null,
      billTotal     = 0;

  const waiterSteps = [
    {
      question: "Welcome to Liam's website. I'll be taking care of you today. Can I start you with any still or sparkling water?",
      options: [
        { label:'STILL',     cost:0 },
        { label:'SPARKLING', cost:3.5 }
      ],
      mandatory: true
    },
    {
      question: "How are we settling in? Can I interest you in a freshly shucked oyster and a glass of chablis? Or perhaps some manchego croquetas, paprika aioli and a crisp lager?",
      options:[
        { label:'OYSTER & CHABLIS', cost:15.5 },
        { label:'CROQUETAS & BEER', cost:13.5 }
      ]
    },
    {
      question: "Are we feeling like some more snacks? We have a lovely simple tart of snow crab and chives, and a beautiful kangaroo tataki brushed with our house dashi.",
      options:[
        { label:'CRAB TART',       cost:21 },
        { label:'KANGAROO TATAKI', cost:19 }
      ]
    },
    {
      question: "Can I get you another drink at all? We do a killer rye old fashioned. There's also a bouncy new Tasmanian gamay on the list.",
      options:[
        { label:'RYE OLD FASH', cost:14 },
        { label:'GAMAY',       cost:11 }
      ]
    },
    {
      question: "Are we feeling ready for mains? Our pie of the evening is ethically hunted venison stewed in red wine and herbs de Provence. And tonight's fish is a swordfish steak cooked in brown butter, served on sauce vierge.",
      options:[
        { label:'DEER PIE',   cost:21 },
        { label:'SWORDFISH',  cost:24 }
      ]
    },
    {
      question: "Room for dessert? We have a simple lemon tart, or Crêpes Suzette finished tableside if you feel like a show.",
      options:[
        { label:'LEMON TART',     cost:9 },
        { label:'CRÊPES SUZETTE', cost:11 }
      ]
    },
    {
      question: "Can I offer you any tea, coffee, or a complimentary cigarette to round out the meal?",
      options:[
        { label:'TEA',       cost:3 },
        { label:'COFFEE',    cost:4 },
        { label:'CIGARETTE', cost:0 }
      ]
    },
    {
      question: "Shall I bring you the cheque?",
      options:[
        { label:'YES', cost:0, isFinal:true }
      ]
    }
  ];

  function addToBill(item, cost) {
    billTotal += cost;
    let bill = document.getElementById("waiter-bill");
    if (!bill) {
      bill = document.createElement("div");
      bill.id = "waiter-bill";
      bill.className = "bill";
      document.body.appendChild(bill);
    }
    // remove old settle‑up link
    bill.querySelector(".settle-link")?.remove();
    // header
    if (!bill.querySelector(".bill-header")) {
      const hdr = document.createElement("span");
      hdr.className = "bill-header";
      hdr.textContent = "BILL";
      bill.prepend(hdr, document.createElement("br"));
    }
    // item line
    const line = document.createElement("div");
    line.className = "bill-item";
    line.textContent = `${item} – ${cost === 0 ? "FREE" : `$${cost.toFixed(2)}`}`;
    bill.appendChild(line);
    // final settle‑up
    const settle = document.createElement("a");
    settle.href = "#";
    settle.className = "settle-link";
    settle.innerHTML = `<span class="link-text">settle up</span>`;
    settle.onclick = e => {
      e.preventDefault();
      waiterStopped = true;
      document.querySelectorAll(".popup.waiter-popup").forEach(p=>p.remove());
      showPayment();
    };
    bill.appendChild(settle);
  }

  function showWaiterStep(i) {
    if (waiterStopped || i >= waiterSteps.length) return;
    const step = waiterSteps[i];
    const w = document.createElement("div");
    w.className = "popup waiter-popup";

    const questionEl = document.createElement("p");
    w.appendChild(questionEl);

    step.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "waiter-option";
      btn.textContent = opt.label;
      btn.onclick = () => {
        w.remove();
        addToBill(opt.label, opt.cost);
        if (opt.isFinal) return showPayment();
        waiterIndex++;
        waiterTimeout = setTimeout(()=>showWaiterStep(waiterIndex), 20000);
      };
      w.appendChild(btn);
    });

    if (!step.mandatory) {
      const noBtn = document.createElement("a");
      noBtn.className = "waiter-no";
      noBtn.href = "#";
      noBtn.innerHTML = `<span class="link-text">no thanks</span>`;
      noBtn.onclick = e => { e.preventDefault(); waiterStopped = true; w.remove(); };
      w.appendChild(noBtn);
    }

    document.body.appendChild(w);

    // typewriter
    const text = step.question;
    let idx = 0;
    function typeChar() {
      questionEl.textContent = text.slice(0, idx++);
      if (idx <= text.length) setTimeout(typeChar, 15);
      else w.classList.add("ready");
    }
    typeChar();

    // outside-click closes this popup only
    setTimeout(() => {
      const outside = e => {
        if (!w.contains(e.target)) {
          w.remove();
          window.removeEventListener("click", outside);
        }
      };
      window.addEventListener("click", outside);
    }, 0);
  }

  function showPayment() {
    waiterStopped = true;
    document.querySelectorAll(".popup.waiter-popup").forEach(p=>p.remove());
    const pay = document.createElement("div");
    pay.className = "popup final-popup";
    pay.innerHTML = `
      <p>Pay Liam $${billTotal.toFixed(2)} AUD?</p>
      <button class="waiter-option pay-button">PAY</button>
    `;
    document.body.appendChild(pay);
    pay.querySelector(".pay-button").onclick = () => {
      window.open(`https://paypal.me/liamalexanderquinn/${billTotal.toFixed(2)}`, "_blank");
      pay.remove();
      document.getElementById("waiter-bill")?.remove();
    };
  }

  // start waiter after 10s
  waiterTimeout = setTimeout(() => showWaiterStep(0), 10000);
});