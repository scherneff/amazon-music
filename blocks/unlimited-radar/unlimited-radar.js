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
      // overlay pinned to the image; an authored link makes the whole card
      // clickable. With no caption it renders as the plain photo.
      cell.className = 'unlimited-radar-card';
      const media = cell.querySelector('picture') || cell.querySelector('img');
      const href = link ? link.getAttribute('href') : null;
      const linkTitle = link ? link.getAttribute('title') : null;

      // image + caption in a relative container so the caption stays on the
      // image regardless of the card's height
      const figure = document.createElement('div');
      figure.className = 'unlimited-radar-card-media';
      if (media) figure.append(media);
      if (media && captionEls.length) {
        const caption = document.createElement('div');
        caption.className = 'unlimited-radar-card-caption';
        captionEls.forEach((t) => caption.append(t));
        figure.append(caption);
      }

      cell.textContent = '';
      if (href) {
        const cardLink = document.createElement('a');
        cardLink.className = 'unlimited-radar-card-link';
        cardLink.href = href;
        if (linkTitle) cardLink.title = linkTitle;
        cardLink.append(figure);
        cell.append(cardLink);
      } else {
        cell.append(figure);
      }
    }
  });
}
