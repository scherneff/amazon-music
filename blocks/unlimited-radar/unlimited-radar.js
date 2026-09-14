/**
 * unlimited-radar — "On the radar" news section.
 * Each authored row is one grid cell:
 *   - Intro cell: heading + supporting line, no image
 *   - News card: image + optional caption text. The caption renders as an
 *     editable text overlay (with a gradient scrim) at the bottom of the
 *     photo, so the title no longer has to be baked into the artwork. An
 *     image-only card still renders as-is.
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
      // News photo card. Any authored caption text becomes an editable
      // overlay; with no text it renders as the plain photo (baked caption).
      cell.className = 'unlimited-radar-card';
      const media = cell.querySelector('picture') || cell.querySelector('img');
      const texts = [...cell.querySelectorAll('p')]
        .filter((el) => !el.querySelector('picture, img, a') && el.textContent.trim());
      if (media && texts.length) {
        const caption = document.createElement('div');
        caption.className = 'unlimited-radar-card-caption';
        texts.forEach((t) => caption.append(t));
        cell.append(caption);
      }
    }
  });
}
