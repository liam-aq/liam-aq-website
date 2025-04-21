document.addEventListener("DOMContentLoaded", () => {
    const blocks = document.querySelectorAll('.floating-block');
    const popup = document.getElementById('popup');
    document.body.appendChild(popup); // keep popup global
    const container = document.querySelector('.sites');
    const padding = 60;
  
    // Position blocks responsively
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
    });
  
    // Handle popup logic
    blocks.forEach(block => {
      block.addEventListener('mouseenter', () => {
        const { top, left, right, bottom, width, height } = block.getBoundingClientRect();
        const popupMaxWidth = window.innerWidth < 640 ? window.innerWidth * 0.9 : 300;
        const spaceRight = window.innerWidth - right;
        const spaceLeft = left;
  
        const preferRight = spaceRight > popupMaxWidth + 20;
        const preferLeft = spaceLeft > popupMaxWidth + 20;
  
        popup.innerHTML = `
          <strong>${block.dataset.client}</strong>
          <span>${block.dataset.work}</span>
          <span>${block.dataset.year}</span>
          <p>${block.dataset.description}</p>
          <a href="${block.dataset.link}" target="_blank">Visit site</a>
        `;
  
        popup.style.display = 'flex';
        popup.style.maxWidth = `${popupMaxWidth}px`;
        popup.style.visibility = 'hidden'; // prevent layout flash
        popup.style.opacity = '0';
        popup.style.left = '-9999px'; // offscreen for measurement
        popup.style.top = '-9999px';
  
        // Trigger reflow to measure
        const popupHeight = popup.offsetHeight;
        const popupWidth = popup.offsetWidth;
  
        // Vertical alignment: bottom if near viewport edge
        const tooLow = bottom + popupHeight > window.innerHeight;
        const verticalAlign = tooLow ? (bottom - popupHeight) : top;
  
        // Horizontal alignment: left/right or overlap on mobile
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
  
        // Clamp within viewport
        popupX = Math.max(12, Math.min(popupX, window.innerWidth - popupWidth - 12));
        const popupY = Math.max(12, Math.min(verticalAlign, window.innerHeight - popupHeight - 12));
  
        popup.style.left = `${popupX}px`;
        popup.style.top = `${popupY}px`;
        popup.style.opacity = '1';
        popup.style.visibility = 'visible';
      });
  
      block.addEventListener('mouseleave', () => {
        // Only hide if not hovering the popup itself
        popup.style.display = 'none';
      });
    });
  
    popup.addEventListener('mouseenter', () => {
      // allow popup to persist if hovered (optional — you can remove this block to disable)
    });
  
    popup.addEventListener('mouseleave', () => {
      popup.style.display = 'none';
    });
  });