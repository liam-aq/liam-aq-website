// == FULL JS: THUMBNAILS • FOOTER PARALLAX • EYES • AMBIANCE • WAITER & BILL ==
document.addEventListener("DOMContentLoaded", () => {
  // ────────────────────────────────────────────────────────────────
  // 0) Shared state & DOM references
  // ────────────────────────────────────────────────────────────────
  let popup = document.getElementById("popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popup";
    popup.className = "popup project-popup";
    document.body.appendChild(popup);
  } else if (!popup.isConnected) {
    document.body.appendChild(popup);
  }
  const sitesContainer = document.getElementById("sites-container") || document.querySelector(".sites");

  let activeBlock   = null;
  let isOverPopup   = false;
  let popupHideTimeout = null;
  const floatCancels= new Set();

// ────────────────────────────────────────────────────────────────
// 00) SET ACCENT COLOUR
// ────────────────────────────────────────────────────────────────

  (function setRandomAccent() {
    const colours = ['#f1240d', '#0062FF', '#FF9D00'];
    const choice = colours[Math.floor(Math.random() * colours.length)];
    document.documentElement.style.setProperty('--accent', choice);
    // no need to set --footer-bg any more
  })();

// ────────────────────────────────────────────────────────────────
// 1) PROJECT THUMBNAILS → GRID LAYOUT + FLOATING + POPUPS
// ────────────────────────────────────────────────────────────────
const projects = [
  { name:'Weekdays',
    image:'weekdays.gif',
    images: [], client:'Weekdays',
    work:'Website',
    year:'2025',
    description:'A clean and minimal website (unless you want it not to be). Built for Weekdays.',
    link:'https://week-days.com.au/'},

  { name:'Studio Blank',
    image:'studio-blank.gif',
    images: [],
    client:'Studio Blank',
    work:'Website, Motion Design',
    year:'2024',
    description:'A quirky website for a furniture studio (via Weekdays).',
    link:'https://www.studioblank.com.au/' },

  { name:'Veraison',
    image:'veraison.png',
    images: ["veraison-1.png", "veraison-2.png", "veraison-3.png", "veraison-4.png", "veraison-5.png", "veraison-6.png", "veraison-7.png"],
    client:'Veraison',
    work:'Brand, Website, Print',
    year:'2025',
    description:'A print-turned-digital wine & culture zine.',
    link:'https://www.veraisonmag.com/' },

  { name:'Anti-Doomdruff',
    image:'shampoo.png',
    images: [],
    client:'Self',
    work:'Website',
    year:'2025',
    description:'Before phones, we would just read a shampoo bottle on the toilet. Reject doomscrolling, embrace tradition.',
    link:'https://antidoomdruff.com/' },

  { name:'Claire Adey',
    image:'claire-adey.gif',
    images: [],
    client:'Claire Adey',
    work:'Website',
    year:'2025',
    description:'A portfolio website for a foodie needs a good cookies section.',
    link:'https://www.claireadey.com/' },

  { name:'Oishii Dry',
    image:'oishii-dry.png',
    images: [],
    client:'Oishii Dry',
    work:'Brand, Website, Packaging',
    year:'2025',
    description:'A local yuzu rice lager with Japanese sensibilities.',
    link:'https://www.oishiiworld.com.au/'}
];

  // ─── Populate project list from projects array ─────────────────────
  const projectListEl = document.getElementById('project-list');
  if (projectListEl) {
    projectListEl.innerHTML = '';
    projects.forEach(p => {
      const li = document.createElement('li');
      li.className = 'project-item';
      li.dataset.name        = p.name;
      li.dataset.image       = `images/${p.image}`;
      li.dataset.client      = p.client;
      li.dataset.work        = p.work;
      li.dataset.year        = p.year;
      li.dataset.description = p.description;
      li.dataset.link        = p.link;
      li.dataset.images      = JSON.stringify(p.images || []);
      const titleSpan = document.createElement('span');
      titleSpan.className = 'project-title';
      titleSpan.textContent = p.name;
      li.appendChild(titleSpan);
      projectListEl.appendChild(li);
    });
  }

// ─── STATIC INTRO-THUMBS POPUPS & CLICK HANDLERS ─────────────────────────────────────────────────
document.querySelectorAll('.intro-thumb').forEach(thumb => {
  const key     = thumb.dataset.project.toLowerCase();
  const project = projects.find(p => p.client.toLowerCase() === key);
  if (!project) return;

  // set pointer cursor on desktop only
  thumb.style.cursor = window.innerWidth > 728 ? 'pointer' : 'default';

  // hover to show popup (desktop only)
  if (window.innerWidth > 728) {
    thumb.addEventListener('mouseenter', e => {
      clearTimeout(popupHideTimeout);
      showProjectPopupFor(thumb, project);
    });
    thumb.addEventListener('mouseleave', () => {
      clearTimeout(popupHideTimeout);
      popupHideTimeout = setTimeout(() => {
        if (!isOverPopup) hidePopup();
      }, 200);
    });
  }

  // click: open link on desktop, show popup on mobile
  thumb.addEventListener('click', e => {
    e.preventDefault();
    clearTimeout(popupHideTimeout);
    if (window.innerWidth > 728) {
      window.open(project.link, '_blank');
    } else {
      showProjectPopupFor(thumb, project);
    }
  });
});

// keep your popup’s own mouseenter/leave logic intact:
popup.addEventListener('mouseenter', () => {
  clearTimeout(popupHideTimeout);
  isOverPopup = true;
});
popup.addEventListener('mouseleave', () => {
  isOverPopup = false;
  clearTimeout(popupHideTimeout);
  popupHideTimeout = setTimeout(hidePopup, 200);
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
  document.querySelectorAll(".intro-eyes-wrapper .eye").forEach(eye => {
    const line = document.createElement("div");
    line.className = "blink-line";
    eye.appendChild(line);
  });
  document.addEventListener("mousemove", e => {
    document.querySelectorAll(".intro-eyes-wrapper .eye").forEach(eye => {
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
    if(Math.random() < 0.3) document.querySelectorAll(".intro-eyes-wrapper .eye").forEach(eye => {
      eye.classList.add("blinking");
      setTimeout(() => eye.classList.remove("blinking"), 200);
    });
  }, 2500);

// ────────────────────────────────────────────────────────────────
// 5) AMBIANCE CONTROLS • JAZZ & LIGHT TOGGLE
// ────────────────────────────────────────────────────────────────
const overlayEl  = document.getElementById('dim-overlay');
const jazzPlayer = document.getElementById('jazz-player');
jazzPlayer.loop    = true;
jazzPlayer.preload = 'auto';

let lightToggle = null;

// create a single fixed container for both controls
const ambianceControls = document.createElement('div');
ambianceControls.id = 'ambiance-controls';
document.body.appendChild(ambianceControls);

// — Jazz toggle IIFE —
;(function initJazzToggle(){
  const jazzUi = document.createElement('div');
  jazzUi.id            = 'jazz-ui';
  jazzUi.style.display = 'none';  // CSS will position it

  const btn = document.createElement('button');
  btn.id          = 'jazz-toggle';
  btn.textContent = 'play jazz';
  Object.assign(btn.style, {
    background:    'none',
    border:        'none',
    padding:       '0',
    fontFamily:    'Commit Mono, monospace',
    textTransform: 'uppercase',
    cursor:        'pointer',
    color:         'inherit'
  });
  btn.onclick = () => {
    if (jazzPlayer.paused) jazzPlayer.play();
    else                   jazzPlayer.pause();
  };

  jazzUi.appendChild(btn);
  ambianceControls.appendChild(jazzUi);

  jazzPlayer.addEventListener('play', () => {
    btn.textContent     = 'pause jazz';
    jazzUi.style.display = 'block';
  });
  jazzPlayer.addEventListener('pause', () => {
    btn.textContent     = 'play jazz';
    jazzUi.style.display = 'block';
  });
})();

// — Build the light‐toggle button —
function ensureLightToggle() {
  if (lightToggle) return;

  lightToggle = document.createElement('button');
  lightToggle.id = 'light-toggle';
  lightToggle.textContent = overlayEl.classList.contains('active')
    ? 'turn the lights up'
    : 'dim the lights';
  Object.assign(lightToggle.style, {
    background:    'none',
    border:        'none',
    padding:       '0',
    fontFamily:    'Commit Mono, monospace',
    textTransform: 'uppercase',
    cursor:        'pointer',
    color:         'inherit',
    display:       'none'    // start hidden; CSS container will position it
  });

  lightToggle.onclick = () => {
    const nowOn = overlayEl.classList.toggle('active');
    lightToggle.textContent = nowOn 
      ? 'turn the lights up' 
      : 'dim the lights';
  };

  ambianceControls.appendChild(lightToggle);
}

ensureLightToggle();

// ────────────────────────────────────────────────────────────────
// 6) WAITER SEQUENCE • BILL • CHEQUE POPUP • POLICE
// ────────────────────────────────────────────────────────────────
let waiterIndex    = 0,
    waiterStopped  = false,
    waiterTimeout  = null,
    billTotal      = 0;

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
      {
        label: "Dim the Lights",
        action: () => {
          ensureLightToggle();
          overlayEl.classList.add('active');
          lightToggle.textContent = 'turn the lights up';
          lightToggle.style.display = 'block';
        }
      },
      {
        label: "Both",
        action: () => {
          jazzPlayer.play();
          ensureLightToggle();
          overlayEl.classList.add('active');
          lightToggle.textContent = 'turn the lights up';
          lightToggle.style.display = 'block';
        }
      }
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

  // build popup (starts hidden via CSS)
  const w = document.createElement("div");
  w.className = "popup waiter-popup";

  // question
  const q = document.createElement("p");
  q.style.lineHeight = "1.5";
  q.textContent = step.question;
  w.appendChild(q);

  // options
  step.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "waiter-option";
    btn.textContent = opt.label;
    btn.onclick = () => {
      clearTimeout(waiterTimeout);
      w.remove();
      if (!opt.isFinal && !opt.action) addToBill(opt.label, opt.cost);
      if (opt.action) opt.action();
      if (opt.isFinal) return showPayment();
      waiterIndex++;
      waiterTimeout = setTimeout(() => showWaiterStep(waiterIndex), 20000);
    };
    w.appendChild(btn);
  });

  // “no thanks”
  if (!step.mandatory) {
    const no = document.createElement("a");
    no.className = "waiter-no";
    no.href = "#";
    no.innerHTML = `<span class="link-text">no thanks</span>`;
    no.onclick = e => {
      e.preventDefault();
      w.remove();
      waiterIndex++;
      waiterTimeout = setTimeout(() => showWaiterStep(waiterIndex), 20000);
    };
    w.appendChild(no);
  }

  // insert & trigger CSS fade-in
  document.body.appendChild(w);
  requestAnimationFrame(() => w.classList.add("visible"));
}

waiterTimeout = setTimeout(() => showWaiterStep(0), 10000);

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

  // fade it in via CSS
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
    if (!jazzPlayer.paused) jazzPlayer.pause();
    const siren = new Audio('assets/siren.mp3');
    siren.play();
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

// helper: show project popup under any element
function showProjectPopupFor(block, project) {
  // prevent any pending hide before showing a new popup
  clearTimeout(popupHideTimeout);

  const OFFSET = 20;
  block.classList.add("paused");
  activeBlock = block;

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

  // instant show (no fade)
  popup.style.transition = "none";
  Object.assign(popup.style, {
    display:    "flex",
    visibility: "visible",
    opacity:    "1",
    maxWidth:   (window.innerWidth < 640 ? window.innerWidth * 0.9 : 300) + "px",
    left:       "-9999px",
    top:        "-9999px"
  });

  // measure & position: flush-left at thumbnail, 20px below
  const rect = block.getBoundingClientRect();
  const pw   = popup.offsetWidth;
  const ph   = popup.offsetHeight;

  const px = rect.left;
  const tooLow = rect.bottom + ph > window.innerHeight;
  const py    = tooLow
    ? rect.bottom + pageYOffset - ph
    : rect.bottom + pageYOffset + OFFSET;

  popup.style.left = `${px}px`;
  popup.style.top  = `${py}px`;
}

function hidePopup() {
  popup.style.display = 'none';
  activeBlock?.classList.remove('paused');
  activeBlock = null;
}

// ────────────────────────────────────────────────────────────────

;(function(){
  const emailLink = document.getElementById('email-link');
  if (!emailLink) {
    console.warn('No email link found; skipping tooltip.');
    return;
  }
  const address   = emailLink.textContent;
  let tooltipEl;

  function makeTooltip(text) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'email-tooltip';
    tooltipEl.textContent = text;
    document.body.appendChild(tooltipEl);
  }

  function showTooltip(x, y, text = 'click to copy') {
    if (!tooltipEl) makeTooltip(text);
    tooltipEl.textContent = text;
    tooltipEl.classList.add('visible');
    tooltipEl.style.left = (x + 12) + 'px';
    tooltipEl.style.top  = (y + 12) + 'px';
  }

  function hideTooltip() {
    if (!tooltipEl) return;
    tooltipEl.classList.remove('visible');
    setTimeout(() => {
      tooltipEl.remove();
      tooltipEl = null;
    }, 200);
  }

  function copyEmail() {
    navigator.clipboard.writeText(address).catch(console.error);
  }

  emailLink.addEventListener('mouseenter', e => showTooltip(e.pageX, e.pageY));
  emailLink.addEventListener('mousemove',  e => tooltipEl && showTooltip(e.pageX, e.pageY, tooltipEl.textContent));
  emailLink.addEventListener('mouseleave', hideTooltip);
  emailLink.addEventListener('click', e => {
    e.preventDefault();
    copyEmail();
    showTooltip(e.pageX, e.pageY, 'copied!');
    setTimeout(hideTooltip, 1000);
  });
})();

  // ─── Toggle Home vs Sites (delegated) ─────────────────────────────
  document.body.addEventListener('click', e => {
    // View sites toggle
    const viewBtn = e.target.closest('#view-sites');
    if (viewBtn) {
      e.preventDefault();
      document.getElementById('home-content').style.display = 'none';
      document.getElementById('sites-content').style.display = 'block';
      return;
    }
    // Back to home toggle
    const backBtn = e.target.closest('#back-button');
    if (backBtn) {
      e.preventDefault();
      document.getElementById('sites-content').style.display = 'none';
      document.getElementById('home-content').style.display = 'block';
      return;
    }
  });

  // ─── Project List Hover & Accordion ─────────────────────────────
  const projectList = document.getElementById('project-list');
  const thumbnailPreview = document.getElementById('thumbnail-preview');
  if (!projectList || !thumbnailPreview) {
    console.warn('Project list or thumbnail preview missing; skipping accordion init.');
  } else {
    let currentProject = null;

    // Hover → show thumbnail under cursor (only on title)
    projectList.addEventListener('mousemove', e => {
      const title = e.target.closest('.project-title');
      if (!title) {
        thumbnailPreview.style.display = 'none';
        return;
      }
      const item = title.closest('.project-item');
      thumbnailPreview.style.backgroundImage = `url('${item.dataset.image}')`;
      thumbnailPreview.style.left = `${e.pageX + 16}px`;
      thumbnailPreview.style.top  = `${e.pageY + 16}px`;
      thumbnailPreview.style.display = 'block';
    });

    projectList.addEventListener('mouseleave', () => {
      thumbnailPreview.style.display = 'none';
    });

    // Click → accordion toggle (only on title)
    projectList.addEventListener('click', e => {
      const title = e.target.closest('.project-title');
      if (!title) return;
      const item = title.closest('.project-item');
      // Only toggle when clicking the title, ignore clicks inside details
      if (e.target.closest('.project-accordion')) return;

      // If already open, close it
      const existing = item.querySelector('.project-accordion');
      if (existing) {
        existing.remove();
        item.classList.remove('selected');
        return;
      }

      // Close any other open accordions
      projectList.querySelectorAll('.project-accordion').forEach(div => div.remove());
      projectList.querySelectorAll('.project-item.selected').forEach(li => li.classList.remove('selected'));

      // Build accordion panel with dynamic images
      item.classList.add('selected');
      const details = document.createElement('div');
      details.className = 'project-accordion project-details';
      // start HTML         <p>${item.dataset.client}</p> 
      let html = `
        <p>${item.dataset.work}</p>
        <p>${item.dataset.year}</p>
        <p>${item.dataset.description}</p>
      `;
      // insert all images inside a scrolling flex container
      const imgs = JSON.parse(item.dataset.images || '[]');
      if (imgs.length) {
        html += `<div class="project-accordion-images">`;
        imgs.forEach(src => {
          html += `<img src="images/${src}" alt="${item.dataset.name}" class="project-accordion-image" />`;
        });
        html += `</div>`;
      }
      // finish with link
      html += `<p><a href="${item.dataset.link}" target="_blank" class="link-text">→ Visit Site</a></p>`;
      details.innerHTML = html;
      item.appendChild(details);
    });
  }
  // ─── Hide ambiance controls when overlapping the footer ────────────────────
  const footerEl = document.getElementById('footer');
  if (footerEl && ambianceControls) {
    ['home-content', 'sites-content'].forEach(id => {
      const container = document.getElementById(id);
      if (!container) return;
      container.addEventListener('scroll', () => {
        const controlsRect = ambianceControls.getBoundingClientRect();
        const footerRect   = footerEl.getBoundingClientRect();
        // hide if controls overlap footer area
        ambianceControls.style.display = (controlsRect.bottom > footerRect.top ? 'none' : 'flex');
      });
    });
  }
}); // end DOMContentLoaded