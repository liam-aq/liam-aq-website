// js/sites.js – hover thumbnail preview + accordion expand/contract
document.addEventListener('DOMContentLoaded', () => {
  const projectList      = document.getElementById('project-list');
  const thumbnailPreview = document.getElementById('thumbnail-preview');

  // Hover → show thumbnail under cursor
  projectList.addEventListener('mousemove', e => {
    const item = e.target.closest('.project-item');
    if (!item) {
      thumbnailPreview.style.display = 'none';
      return;
    }
    thumbnailPreview.style.backgroundImage = `url('${item.dataset.image}')`;
    thumbnailPreview.style.left           = `${e.pageX + 16}px`;
    thumbnailPreview.style.top            = `${e.pageY + 16}px`;
    thumbnailPreview.style.display        = 'block';
  });
  projectList.addEventListener('mouseleave', () => {
    thumbnailPreview.style.display = 'none';
  });

  // Click → accordion toggle
  projectList.addEventListener('click', e => {
    const item = e.target.closest('.project-item');
    if (!item) return;

    // If already open, close it
    const existing = item.querySelector('.project-accordion');
    if (existing) {
      existing.remove();
      item.classList.remove('selected');
      return;
    }

    // Close any other
    projectList.querySelectorAll('.project-accordion').forEach(div => div.remove());
    projectList.querySelectorAll('.project-item.selected').forEach(li => li.classList.remove('selected'));

    // Build and insert new accordion panel
    item.classList.add('selected');
    const details = document.createElement('div');
    details.className = 'project-accordion';
    details.innerHTML = `
      <p><strong>Client:</strong> ${item.dataset.client}</p>
      <p><strong>Year:</strong> ${item.dataset.year}</p>
      <p>${item.dataset.description}</p>
      <p><a href="${item.dataset.link}" class="link-text" target="_blank">Visit site</a></p>
    `;
    item.appendChild(details);
  });
});