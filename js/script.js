// == CLEANED UP FULL JS SCRIPT ==

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById('popup');
  const sitesContainer = document.getElementById('sites-container');
  document.body.appendChild(popup);

  const projects = [
    {
      name: 'weekdays',
      image: 'weekdays.png',
      client: 'Weekdays',
      work: 'website',
      year: '2025',
      description: 'Brand and web work across hospitality clients.',
      link: 'https://week-days.com.au/'
    },
    {
      name: 'veraison',
      image: 'veraison.png',
      client: 'veraison',
      work: 'brand, website, print',
      year: '2025',
      description: 'A print-turned-digital wine and culture zine.',
      link: 'https://www.veraisonmag.com/'
    },
    {
      name: 'oishii dry',
      image: 'oishii-dry.png',
      client: 'Oishii Dry',
      work: 'brand, website, packaging',
      year: '2025',
      description: 'A local yuzu rice lager with japanese sensibilities.',
      link: 'https://www.oishiiworld.com.au/'
    }
  ];

  let activeBlock = null;
  let isOverPopup = false;

  projects.forEach(project => {
    const block = document.createElement('div');
    block.classList.add('floating-block');
    block.setAttribute('data-client', project.client);
    block.setAttribute('data-work', project.work);
    block.setAttribute('data-year', project.year);
    block.setAttribute('data-description', project.description);
    block.setAttribute('data-link', project.link);
    block.style.backgroundImage = `url(images/${project.image})`;

    const thumbSize = window.innerWidth <= 728 ? 75 : 120;
    let x = Math.random() * (sitesContainer.offsetWidth - thumbSize);
    let y = Math.random() * (sitesContainer.offsetHeight - thumbSize);
    block.style.width = `${thumbSize}px`;
    block.style.height = `${thumbSize}px`;
    block.style.left = `${x}px`;
    block.style.top = `${y}px`;

    sitesContainer.appendChild(block);

    let vx = (Math.random() - 0.5) * 0.5;
    let vy = (Math.random() - 0.5) * 0.5;

    function float() {
      if (!block.classList.contains('paused')) {
        x += vx;
        y += vy;

        if (x < 0 || x > sitesContainer.offsetWidth - thumbSize) vx *= -1;
        if (y < 0 || y > sitesContainer.offsetHeight - thumbSize) vy *= -1;

        block.style.left = `${x}px`;
        block.style.top = `${y}px`;
      }
      requestAnimationFrame(float);
    }

    requestAnimationFrame(float);

    block.addEventListener('mouseenter', () => {
      block.classList.add('paused');
      if (activeBlock !== block) popup.style.display = 'none';
      activeBlock = block;

      const rect = block.getBoundingClientRect();
      const popupMaxWidth = window.innerWidth < 640 ? window.innerWidth * 0.9 : 300;
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;
      const preferRight = spaceRight > popupMaxWidth + 20;
      const preferLeft = spaceLeft > popupMaxWidth + 20;
      const width = rect.width;
      const top = rect.top + window.pageYOffset;
      const left = rect.left + window.pageXOffset;
      const right = rect.right + window.pageXOffset;

      popup.className = 'popup project-popup';
      popup.innerHTML = `
        <strong>${project.client}</strong>
        <span>${project.work}</span>
        <span>${project.year}</span>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank"><span class="link-text">Visit site</span></a>
      `;

      popup.style.display = 'flex';
      popup.style.maxWidth = `${popupMaxWidth}px`;
      popup.style.visibility = 'hidden';
      popup.style.opacity = '0';
      popup.style.left = `-9999px`;
      popup.style.top = `-9999px`;

      const popupHeight = popup.offsetHeight;
      const popupWidth = popup.offsetWidth;
      const tooLow = rect.bottom + popupHeight > window.innerHeight;
      const popupY = tooLow ? rect.bottom + window.pageYOffset - popupHeight : top;

      let popupX;
      if (window.innerWidth < 640) {
        popupX = left + width / 2 - popupWidth / 2;
      } else if (preferRight) {
        popupX = right + 12;
      } else if (preferLeft) {
        popupX = left - popupWidth - 12;
      } else {
        popupX = left + width / 2 - popupWidth / 2;
      }

      popupX = Math.max(12, Math.min(popupX, window.innerWidth - popupWidth - 12));
      const finalY = Math.max(12, Math.min(popupY, window.innerHeight + window.pageYOffset - popupHeight - 12));

      popup.style.left = `${popupX}px`;
      popup.style.top = `${finalY}px`;
      popup.style.opacity = '1';
      popup.style.visibility = 'visible';
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

  // FOOTER SCROLL
  window.addEventListener('scroll', () => {
    const footer = document.getElementById('footer');
    const footerOverlay = document.querySelector('.footer-blur-overlay');
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollY / maxScroll, 1);

    footer.style.opacity = progress;
    footer.style.transform = `translateY(${(1 - progress) * 100}%)`;
    footer.style.pointerEvents = progress > 0.05 ? 'auto' : 'none';

    const eased = Math.pow(Math.min(Math.max(progress - 0.8, 0) / 0.2, 1), 2);
    const blurAmount = 120 - eased * 120;
    const textBlur = 10 - eased * 10;

    if (footerOverlay) {
      footerOverlay.style.opacity = `${1 - eased}`;
      footerOverlay.style.filter = `blur(${blurAmount}px)`;
    }
    const footerInner = document.querySelector('.footer-inner');
    if (footerInner) {
      footerInner.style.filter = `blur(${textBlur}px)`;
    }
  });

  // PARALLAX
  window.addEventListener('scroll', () => {
    const parallax = document.querySelector('.sites');
    const offset = window.scrollY * 0.05;
    parallax.style.transform = `translateY(${offset}px)`;
  });

  // WAITER LOGIC
  let waiterIndex = 0;
  let waiterStopped = false;
  let waiterTimeout = null;
  let billTotal = 0;

  const waiterSteps = [
    {
      question: "Welcome to Liam's website. Can I start you with any still or sparkling water?",
      options: [
        { label: 'STILL', cost: 0 },
        { label: 'SPARKLING', cost: 3.5 }
      ],
      mandatory: true
    },
    {
      question: "Would we like to start with an oyster and a glass of chablis? or a salt cod croquette and a beer?",
      options: [
        { label: 'OYSTER & CHABLIS', cost: 18 },
        { label: 'CROQUETTE & BEER', cost: 14 }
      ]
    },
    {
      question: "Can I interest you in a skewer of octopus tentacle, lap cheong and pork belly, with a blood plum glaze? Or perhaps a charming tart of seasonal vegetables, goats cheese mousse and puffed grains?",
      options: [
        { label: 'OCTOPUS & LAP CHEONG', cost: 22 },
        { label: 'VEGETABLE TART', cost: 19 }
      ]
    },
    {
      question: "The theme tonight is bistro classics. Steak frites or snails from the mulch?",
      options: [
        { label: 'STEAK FRITES', cost: 29 },
        { label: 'SNAILS FROM THE MULCH', cost: 25 }
      ]
    },
    {
      question: "Dessert? Crêpes Suzette, pandan panna cotta or affogato?",
      options: [
        { label: 'CREPES SUZETTE', cost: 14 },
        { label: 'PANNA COTTA', cost: 13 },
        { label: "I'M STUFFED", cost: 0 }
      ]
    },
    {
      question: "Shall I bring you the cheque?",
      options: [
        { label: 'YES', cost: 0, isFinal: true }
      ]
    }
  ];

  function showWaiterStep(index) {
    if (waiterStopped || index >= waiterSteps.length) return;

    const step = waiterSteps[index];
    const popup = document.createElement('div');
    popup.className = 'popup waiter-popup';
    popup.innerHTML = `<p>${step.question}</p>`;

    step.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt.label;
      btn.className = 'waiter-option';
      btn.onclick = () => {
        popup.remove();

        if (opt.label === 'STILL') addToBill(opt.label, 0);
        else if (opt.label !== "I'M STUFFED") addToBill(opt.label, opt.cost);

        if (opt.isFinal) {
          showPaymentPopup();
        } else {
          waiterIndex++;
          waiterTimeout = setTimeout(() => showWaiterStep(waiterIndex), 20000);
        }
      };
      popup.appendChild(btn);
    });

    if (!step.mandatory) {
      const noBtn = document.createElement('a');
      noBtn.href = '#';
      noBtn.className = 'waiter-no';
      noBtn.innerHTML = '<span class="link-text">no thanks</span>';
      noBtn.onclick = (e) => {
        e.preventDefault();
        waiterStopped = true;
        popup.remove();
        clearTimeout(waiterTimeout);
      };
      popup.appendChild(noBtn);
    }

    document.body.appendChild(popup);
  }

  function addToBill(item, price) {
    billTotal += price;
  
    let bill = document.getElementById('waiter-bill');
    if (!bill) {
      bill = document.createElement('div');
      bill.id = 'waiter-bill';
      bill.className = 'bill';
      document.body.appendChild(bill);
    }
  
    // Prepare the new list of bill items
    const existingItems = bill.querySelectorAll('.bill-item');
    const itemsHTML = Array.from(existingItems).map(item => item.outerHTML).join('');
  
    const newItem = `<div class="bill-item">${item} - ${price === 0 ? 'FREE' : `$${price.toFixed(2)}`}</div>`;
  
    // Always overwrite bill HTML so "settle up" is at the end
    bill.innerHTML = `
      <span style="text-decoration: underline; display: inline-block; padding-bottom: 10px; font-weight: normal;">BILL</span><br>
      ${itemsHTML}
      ${newItem}
    `;
  
    if (!bill.querySelector('.settle-link')) {
      const settleLink = document.createElement('a');
      settleLink.href = '#';
      settleLink.className = 'settle-link';
      settleLink.innerHTML = '<span class="link-text">settle up</span>';
      settleLink.onclick = (e) => {
        e.preventDefault();
        const popups = document.querySelectorAll('.popup.waiter-popup');
        popups.forEach(p => p.remove());
        showPaymentPopup();
        waiterStopped = true;
        clearTimeout(waiterTimeout);
      };
      bill.appendChild(settleLink);
    }
  }

  function showPaymentPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup waiter-popup';
    popup.innerHTML = `<div class="final-pay-popup">
  <p>PAY LIAM $${billTotal.toFixed(2)} AUD?</p>
  <a href="https://paypal.me/liamalexanderquinn/${billTotal.toFixed(2)}" target="_blank" class="waiter-option waiter-pay-button">PAY</a>
</div>`;
  
  document.body.appendChild(popup);
  }
  function showPaymentPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup waiter-popup final-popup';
    popup.innerHTML = `
      <p style="text-align: center;">Pay Liam $${billTotal.toFixed(2)} AUD?</p>
      <button class="waiter-option pay-button" style="margin-top: 20px; width: 100%; text-align: center;">
        PAY
      </button>
    `;
  
    popup.querySelector('.pay-button').onclick = () => {
      window.open(`https://paypal.me/liamalexanderquinn/${billTotal.toFixed(2)}`, '_blank');
      popup.remove();
      const bill = document.getElementById('waiter-bill');
      if (bill) bill.remove();
      waiterStopped = true;
    };
  
    document.body.appendChild(popup);
  
    // Dismiss if clicking outside
    setTimeout(() => {
      window.addEventListener('click', function outsideClick(e) {
        if (!popup.contains(e.target)) {
          popup.remove();
          window.removeEventListener('click', outsideClick);
        }
      });
    }, 0);
  }

  setTimeout(() => showWaiterStep(waiterIndex), 10000);
});

function dismissFinalPopupOnce(e) {
  const popup = document.querySelector('.popup.waiter-popup');
  if (popup) popup.remove();
}