/**
 * unlimited-radar — "On the radar" news section.
 * Each authored row is one grid cell:
 *   - Intro cell: heading + supporting line, no image
 *   - News card: image + caption text
 *   - See-more cell: icon image + link/label
 * Cells render in authored order across a 3-column grid.
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cell = row.querySelector(':scope > div') ? row : row;
    const hasImage = !!cell.querySelector('picture, img');
    const hasHeading = !!cell.querySelector('h1, h2, h3');
    const link = cell.querySelector('a');

    if (hasHeading && !hasImage) {
      cell.className = 'unlimited-radar-intro';
      const h = cell.querySelector('h1, h2, h3');
      if (h && h.tagName !== 'H2') {
        const h2 = document.createElement('h2');
        h2.innerHTML = h.innerHTML;
        h.replaceWith(h2);
      }
    } else if (hasImage && link) {
      // See-more tile: icon + link
      cell.className = 'unlimited-radar-more';
    } else if (hasImage) {
      cell.className = 'unlimited-radar-card';
      // Turn the trailing text into an overlaid caption
      const caption = [...cell.children].find((c) => !c.querySelector('picture, img') && c.textContent.trim());
      if (caption) {
        caption.classList.add('unlimited-radar-caption');
      } else {
        // caption may be a bare text node / paragraph sibling
        const p = cell.querySelector('p:not(:has(picture)):not(:has(img))');
        if (p) p.classList.add('unlimited-radar-caption');
      }
    }
  });
}
