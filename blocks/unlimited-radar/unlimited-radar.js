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
    const link = cell.querySelector('a[href]');
    const captionEls = [...cell.querySelectorAll('p')]
      .filter((el) => !el.querySelector('picture, img, a') && el.textContent.trim());

    if (hasHeading && !hasImage) {
      cell.className = 'unlimited-radar-intro';
      const h = cell.querySelector('h1, h2, h3');
      if (h && h.tagName !== 'H2') {
        const h2 = document.createElement('h2');
        h2.innerHTML = h.innerHTML;
        h.replaceWith(h2);
      }
    } else if (hasImage && link && !captionEls.length) {
      // See-more tile: icon + link, no caption
      cell.className = 'unlimited-radar-more';
    } else if (hasImage) {
      // News photo card. Any authored caption text becomes an editable
      // overlay; an authored link makes the whole card clickable. With no
      // caption it renders as the plain photo (baked caption).
      cell.className = 'unlimited-radar-card';
      const media = cell.querySelector('picture') || cell.querySelector('img');
      const href = link ? link.getAttribute('href') : null;
      const linkTitle = link ? link.getAttribute('title') : null;
      // the authored link only carries the destination — drop its paragraph
      if (link) (link.closest('p') || link).remove();
      if (media && captionEls.length) {
        const caption = document.createElement('div');
        caption.className = 'unlimited-radar-card-caption';
        captionEls.forEach((t) => caption.append(t));
        cell.append(caption);
      }
      if (href) {
        const cardLink = document.createElement('a');
        cardLink.className = 'unlimited-radar-card-link';
        cardLink.href = href;
        if (linkTitle) cardLink.title = linkTitle;
        while (cell.firstChild) cardLink.append(cell.firstChild);
        cell.append(cardLink);
      }
    }
  });
}
