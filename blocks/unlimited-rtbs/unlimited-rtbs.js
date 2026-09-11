/**
 * unlimited-rtbs — reason-to-believe cards.
 * Each authored row is one card: cell 1 = icon image, cell 2 = headline.
 * Renders a pagination-dot indicator matching the design.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  const track = document.createElement('div');
  track.className = 'unlimited-rtbs-track';

  rows.forEach((row) => {
    row.classList.add('unlimited-rtbs-card');
    const [iconCell, textCell] = row.children;
    if (iconCell && iconCell.querySelector('picture, img')) {
      iconCell.classList.add('unlimited-rtbs-icon');
    }
    if (textCell) {
      textCell.classList.add('unlimited-rtbs-copy');
    }
    track.append(row);
  });

  block.textContent = '';
  block.append(track);

  // Pagination dots — one per card, first active.
  const dots = document.createElement('div');
  dots.className = 'unlimited-rtbs-dots';
  dots.setAttribute('aria-hidden', 'true');
  rows.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.setAttribute('aria-current', 'true');
    dots.append(dot);
  });
  block.append(dots);
}
