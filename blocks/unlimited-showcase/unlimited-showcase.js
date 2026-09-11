/**
 * unlimited-showcase — two headlines wrapping a fanned cover-art image.
 * Expected authored structure:
 *   Row 1: top headline
 *   Row 2: cover art image
 *   Row 3: bottom headline
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    if (row.querySelector('picture, img')) {
      row.className = 'unlimited-showcase-art';
    } else {
      row.className = 'unlimited-showcase-heading';
    }
  });
}
