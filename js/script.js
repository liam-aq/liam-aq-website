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
        link: 'https:/www.week-days.com.au/'
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
      },
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
  
      // Initial position
      let x = Math.random() * (sitesContainer.offsetWidth - 120);
      let y = Math.random() * (sitesContainer.offsetHeight - 120);
      block.style.left = `${x}px`;
      block.style.top = `${y}px`;
  
      sitesContainer.appendChild(block);
  
      // Random movement
      let vx = (Math.random() - 0.5) * 0.5;
      let vy = (Math.random() - 0.5) * 0.5;
  
      function float() {
        if (!block.classList.contains('paused')) {
          x += vx;
          y += vy;
  
          if (x < 0 || x > sitesContainer.offsetWidth - 120) vx *= -1;
          if (y < 0 || y > sitesContainer.offsetHeight - 120) vy *= -1;
  
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
        const top = rect.top + window.pageYOffset;
        const left = rect.left + window.pageXOffset;
        const right = rect.right + window.pageXOffset;
        const width = rect.width;
  
        const popupMaxWidth = window.innerWidth < 640 ? window.innerWidth * 0.9 : 300;
        const spaceRight = window.innerWidth - rect.right;
        const spaceLeft = rect.left;
        const preferRight = spaceRight > popupMaxWidth + 20;
        const preferLeft = spaceLeft > popupMaxWidth + 20;
  
        popup.innerHTML = `
          <strong>${project.client}</strong>
          <span>${project.work}</span>
          <span>${project.year}</span>
          <p>${project.description}</p>
          <a href="${project.link}" target="_blank">Visit site</a>
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
  });