document.addEventListener("DOMContentLoaded", () => {
    const blocks = document.querySelectorAll('.floating-block');
    const popup = document.getElementById('popup');
    document.body.appendChild(popup);
    const container = document.querySelector('.sites');
    const padding = 60;
  
    let isOverBlock = false;
    let isOverPopup = false;
    let popupIsFrozen = false;
  
    function updatePopupVisibility() {
      if (!isOverBlock && !isOverPopup) {
        popup.style.display = 'none';
        popupIsFrozen = false;
      }
    }
  
    blocks.forEach(block => {
      const tag = block.querySelector('.floating-tag');
  
      const label = tag.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      block.style.backgroundImage = `url(images/${label}.png)`;
  
      const maxX = 100 - (block.offsetWidth / container.offsetWidth) * 100;
      const maxY = 100 - (block.offsetHeight / container.offsetHeight) * 100;
      const xPercent = Math.random() * maxX;
      const yPercent = Math.random() * maxY;
      block.style.left = `${xPercent}%`;
      block.style.top = `${yPercent}%`;
  
      block.addEventListener('mouseenter', () => {
        isOverBlock = true;
      });
  
      block.addEventListener('mouseleave', () => {
        isOverBlock = false;
        setTimeout(updatePopupVisibility, 50);
      });
  
      block.addEventListener('mousemove', (e) => {
        if (popupIsFrozen) return;
  
        const { pageX: x, pageY: y } = e;
  
        popup.innerHTML = `
          <strong>${block.dataset.client}</strong>
          <span>${block.dataset.work}</span>
          <span>${block.dataset.year}</span>
          <p>${block.dataset.description}</p>
          <a href="${block.dataset.link}" target="_blank">Visit site</a>
        `;
  
        popup.style.visibility = 'hidden';
        popup.style.opacity = '0';
        popup.style.display = 'flex';
        popup.style.left = `-9999px`;
        popup.style.top = `-9999px`;
  
        const popupWidth = popup.offsetWidth;
        const shouldFlip = x + popupWidth + 20 > window.innerWidth;
  
        const offsetX = popupWidth / 2;
        const offsetY = popup.offsetHeight / 2;
        
        popup.style.left = shouldFlip
          ? `${x - offsetX - popupWidth / 2}px`
          : `${x - offsetX}px`;
        
        popup.style.top = `${y - offsetY}px`;
        popup.style.visibility = 'visible';
        popup.style.opacity = '1';
  
        popupIsFrozen = true;
      });
    });
  
    popup.addEventListener('mouseenter', () => {
      isOverPopup = true;
    });
  
    popup.addEventListener('mouseleave', () => {
      isOverPopup = false;
      setTimeout(updatePopupVisibility, 50);
    });
  });