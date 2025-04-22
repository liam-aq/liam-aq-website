// == FULL JS: THUMBNAILS • FOOTER • PARALLAX • EYES • WAITER & BILL ==
document.addEventListener("DOMContentLoaded", () => {
  // ────────────────────────────────────────────────────────────────
  // 1) PROJECT THUMBNAILS + POPUPS
  // ────────────────────────────────────────────────────────────────
  const popup = document.getElementById("popup");
  const sitesContainer = document.getElementById("sites-container");
  if (!sitesContainer) {
    console.error("No #sites-container found");
    return;
  }
  // make sure popup exists
  if (!popup) {
    console.error("No #popup found");
    return;
  }
  document.body.appendChild(popup);

  const projects = [
    {
      name: "weekdays",
      image: "weekdays.png",
      client: "Weekdays",
      work: "website",
      year: "2025",
      description: "Brand and web work across hospitality clients.",
      link: "https://week-days.com.au/",
    },
    {
      name: "veraison",
      image: "veraison.png",
      client: "veraison",
      work: "brand, website, print",
      year: "2025",
      description: "A print-turned-digital wine and culture zine.",
      link: "https://www.veraisonmag.com/",
    },
    {
      name: "oishii dry",
      image: "oishii-dry.png",
      client: "Oishii Dry",
      work: "brand, website, packaging",
      year: "2025",
      description: "A local yuzu rice lager with Japanese sensibilities.",
      link: "https://www.oishiiworld.com.au/",
    },
  ];

  let activeBlock = null;
  let isOverPopup = false;

  projects.forEach((project) => {
    const block = document.createElement("div");
    block.classList.add("floating-block");
    block.style.backgroundImage = `url(images/${project.image})`;
    const thumbSize = window.innerWidth <= 728 ? 75 : 120;
    let x = Math.random() * (sitesContainer.offsetWidth - thumbSize);
    let y = Math.random() * (sitesContainer.offsetHeight - thumbSize);
    block.style.cssText += `
      width: ${thumbSize}px;
      height: ${thumbSize}px;
      left: ${x}px;
      top: ${y}px;
    `;
    sitesContainer.appendChild(block);

    let vx = (Math.random() - 0.5) * 0.5;
    let vy = (Math.random() - 0.5) * 0.5;

    (function float() {
      if (!block.classList.contains("paused")) {
        x += vx;
        y += vy;
        if (x < 0 || x > sitesContainer.offsetWidth - thumbSize) vx *= -1;
        if (y < 0 || y > sitesContainer.offsetHeight - thumbSize) vy *= -1;
        block.style.left = `${x}px`;
        block.style.top = `${y}px`;
      }
      requestAnimationFrame(float);
    })();

    block.addEventListener("mouseenter", () => {
      block.classList.add("paused");
      if (activeBlock !== block) popup.style.display = "none";
      activeBlock = block;

      // build & position the popup
      const rect = block.getBoundingClientRect();
      const popupMaxW = window.innerWidth < 640 ? window.innerWidth * 0.9 : 300;
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;
      const preferRight = spaceRight > popupMaxW + 20;
      const preferLeft = spaceLeft > popupMaxW + 20;

      popup.className = "popup project-popup";
      popup.innerHTML = `
        <span class="link-text">${project.client}</span>
        <span>${project.work}</span>
        <span>${project.year}</span>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank"><span class="link-text">Visit site</span></a>
      `;
      // offscreen measure
      popup.style.cssText += `
        display:flex;
        max-width:${popupMaxW}px;
        left:-9999px; top:-9999px;
        visibility:hidden; opacity:0;
      `;
      const { width, height } = popup.getBoundingClientRect();
      const tooLow = rect.bottom + height > window.innerHeight;
      const popupY = tooLow
        ? rect.bottom + window.pageYOffset - height
        : rect.top + window.pageYOffset;
      let popupX = window.innerWidth < 640
        ? rect.left + (rect.width - width) / 2
        : preferRight
          ? rect.right + 12
          : preferLeft
            ? rect.left - width - 12
            : rect.left + (rect.width - width) / 2;
      popupX = Math.max(12, Math.min(popupX, window.innerWidth - width - 12));
      popup.style.cssText += `
        left:${popupX}px;
        top:${popupY}px;
        opacity:1; visibility:visible;
      `;
    });

    block.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!isOverPopup) {
          popup.style.display = "none";
          block.classList.remove("paused");
          activeBlock = null;
        }
      }, 20);
    });
  });

  popup.addEventListener("mouseenter", () => {
    isOverPopup = true;
    if (activeBlock) activeBlock.classList.add("paused");
  });
  popup.addEventListener("mouseleave", () => {
    isOverPopup = false;
    if (activeBlock) activeBlock.classList.remove("paused");
    popup.style.display = "none";
    activeBlock = null;
  });

  // ────────────────────────────────────────────────────────────────
  // 2) FOOTER FADE ON SCROLL
  // ────────────────────────────────────────────────────────────────
  window.addEventListener("scroll", () => {
    const footer = document.getElementById("footer");
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const p = Math.min(scrollY / maxScroll, 1);
    footer.style.opacity = p;
    footer.style.transform = `translateY(${(1 - p) * 100}%)`;
    footer.style.pointerEvents = p > 0.05 ? "auto" : "none";
  });

  // ────────────────────────────────────────────────────────────────
  // 3) PARALLAX ON THUMBNAILS
  // ────────────────────────────────────────────────────────────────
  window.addEventListener("scroll", () => {
    const parallax = document.querySelector(".sites");
    const offset = window.scrollY * 0.05;
    if (parallax) parallax.style.transform = `translateY(${offset}px)`;
  });

  // ────────────────────────────────────────────────────────────────
  // 4) EYE TRACKING + BLINK + WINK + JIGGLE
  // ────────────────────────────────────────────────────────────────
  const eyes = document.querySelectorAll("span.intro-eyes-wrapper .eye");
  eyes.forEach((eye) => {
    const blinkLine = document.createElement("div");
    blinkLine.className = "blink-line";
    eye.appendChild(blinkLine);
  });

  function trackPupils(e) {
    eyes.forEach((eye) => {
      const pupil = eye.querySelector(".pupil");
      const rect = eye.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const angle = Math.atan2(dy, dx);
      const moveX = Math.cos(angle) * rect.width * 0.35;
      const moveY = Math.sin(angle) * rect.height * 0.15 + 0.1 * rect.height;
      pupil.style.left = `calc(50% + ${moveX}px)`;
      pupil.style.top = `calc(50% + ${moveY}px)`;
    });
  }
  function blinkEye(eye) {
    eye.classList.add("blinking");
    setTimeout(() => eye.classList.remove("blinking"), 200);
  }
  function blinkAll() { eyes.forEach(blinkEye); }
  function winkRight() { if (eyes[1]) blinkEye(eyes[1]); }
  function jiggle() {
    eyes.forEach((eye) => {
      eye.style.transition = "transform 0.1s";
      eye.style.transform = "translateY(-1px)";
      setTimeout(() => (eye.style.transform = "translateY(0)"), 100);
    });
  }
  document.addEventListener("mousemove", trackPupils);
  setInterval(() => { if (Math.random() < 0.3) { blinkAll(); jiggle(); } }, 2000);

  // ────────────────────────────────────────────────────────────────
  // 5) WAITER SEQUENCE • BILL • FINAL PAYPAL
  // ────────────────────────────────────────────────────────────────
  let waiterIndex = 0,
      waiterStopped = false,
      waiterTimeout = null,
      billTotal = 0;

  // create (or return) the bill container
  function addToBill(item, cost) {
    billTotal += cost;
    let bill = document.getElementById("waiter-bill");
    if (!bill) {
      bill = document.createElement("div");
      bill.id = "waiter-bill";
      bill.className = "bill";
      document.body.appendChild(bill);
    }
  
    // remove old settle‑up if present
    const oldLink = bill.querySelector(".settle-link");
    if (oldLink) oldLink.remove();
  
    // add the new item
    const line = document.createElement("div");
    line.className = "bill-item";
    line.textContent = `${item} – ${cost === 0 ? "FREE" : `$${cost.toFixed(2)}`}`;
    bill.appendChild(line);
  
    // re‑append the header if it's missing
    if (!bill.querySelector(".bill-header")) {
      const hdr = document.createElement("span");
      hdr.className = "bill-header";
      hdr.textContent = "BILL";
      bill.prepend(hdr, document.createElement("br"));
    }
  
    // now append settle‑up as the very last child
    const settle = document.createElement("a");
    settle.href = "#";
    settle.className = "settle-link";
    settle.innerHTML = `<span class="link-text">settle up</span>`;
    settle.onclick = (e) => {
      e.preventDefault();
      waiterStopped = true;
      document.querySelectorAll(".popup.waiter-popup").forEach((p) => p.remove());
      showPayment();
    };
    bill.appendChild(settle);
  }

  const waiterSteps = [
    {
      question: "Welcome to Liam's website. Can I start you with any still or sparkling water?",
      options: [
        { label: "STILL", cost: 0 },
        { label: "SPARKLING", cost: 3.5 },
      ],
      mandatory: true,
    },
    {
      question: "Would you like an oyster & chablis, or croquette & beer?",
      options: [
        { label: "OYSTER & CHABLIS", cost: 18 },
        { label: "CROQUETTE & BEER", cost: 14 },
      ],
    },
    {
      question: "Octopus tentacle skewer, or seasonal vegetable tart?",
      options: [
        { label: "OCTOPUS & LAP CHEONG", cost: 22 },
        { label: "VEGETABLE TART", cost: 19 },
      ],
    },
    {
      question: "Steak frites or snails from the mulch?",
      options: [
        { label: "STEAK FRITES", cost: 29 },
        { label: "SNAILS FROM THE MULCH", cost: 25 },
      ],
    },
    {
      question: "Dessert: Crêpes Suzette, panna cotta or affogato?",
      options: [
        { label: "CREPES SUZETTE", cost: 14 },
        { label: "PANNA COTTA", cost: 13 },
        { label: "I'M STUFFED", cost: 0 },
      ],
    },
    {
      question: "Shall I bring you the cheque?",
      options: [
        { label: "YES", cost: 0, isFinal: true },
      ],
    },
  ];

  function showWaiterStep(i) {
    if (waiterStopped || i >= waiterSteps.length) return;
    const step = waiterSteps[i];
    const w = document.createElement("div");
    w.className = "popup waiter-popup";
    w.innerHTML = `<p>${step.question}</p>`;

    step.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "waiter-option";
      btn.textContent = opt.label;
      btn.onclick = () => {
        w.remove();
        if (opt.cost > 0) addToBill(opt.label, opt.cost);
        if (opt.isFinal) {
          showPayment();
        } else {
          waiterIndex++;
          waiterTimeout = setTimeout(() => showWaiterStep(waiterIndex), 20000);
        }
      };
      w.appendChild(btn);
    });

    if (!step.mandatory) {
      const a = document.createElement("a");
      a.className = "waiter-no";
      a.href = "#";
      a.innerHTML = `<span class="link-text">no thanks</span>`;
      a.onclick = (e) => {
        e.preventDefault();
        waiterStopped = true;
        w.remove();
      };
      w.appendChild(a);
    }

    document.body.appendChild(w);
    // clicking outside closes just this
    setTimeout(() => {
      const outside = (e) => {
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
    document.querySelectorAll(".popup.waiter-popup").forEach((p) => p.remove());
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

  waiterTimeout = setTimeout(() => showWaiterStep(0), 10000);
});