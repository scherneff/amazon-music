/**
 * unlimited-radar — "On the radar" news section.
 * Each authored row is one grid cell:
 *   - Intro cell: heading + supporting line, no image
 *   - News card: image only (the photo already has its caption + gradient
 *     baked into the artwork from the design export; the alt text carries
 *     the accessible label)
 *   - See-more cell: icon image + link/label
 * Cells render in authored order across the grid.
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cell = row;
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
      // News photo card — the image is the whole card (caption baked in)
      cell.className = 'unlimited-radar-card';
    }
  });
}
