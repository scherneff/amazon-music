/**
 * unlimited-footer — brand logo on the left, social columns + copyright on the right.
 * Expected authored structure:
 *   Row 1: brand logo image
 *   Row 2: social links (two lists) | copyright text
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [brandRow, infoRow] = rows;

  if (brandRow && brandRow.querySelector('picture, img')) {
    brandRow.className = 'unlimited-footer-brand';
  }

  if (infoRow) {
    infoRow.className = 'unlimited-footer-info';

    const social = document.createElement('div');
    social.className = 'unlimited-footer-social';

    const copy = document.createElement('div');
    copy.className = 'unlimited-footer-copy';

    [...infoRow.children].forEach((cell) => {
      if (cell.querySelector('ul, a')) {
        social.append(cell);
      } else {
        copy.append(cell);
      }
    });

    infoRow.textContent = '';
    infoRow.append(social, copy);
  }

  block.setAttribute('role', 'contentinfo');
}
