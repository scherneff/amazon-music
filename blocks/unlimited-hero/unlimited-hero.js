/**
 * unlimited-hero — teal hero with logo, headline, and CTA.
 * Expected authored structure:
 *   Row 1: logo image
 *   Row 2: headline (H1) + CTA link
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [logoRow] = rows;

  if (logoRow && logoRow.querySelector('picture, img')) {
    logoRow.className = 'unlimited-hero-logo';
  }

  // Any remaining rows hold headline + CTA content; flatten wrappers.
  rows.slice(1).forEach((row) => {
    row.classList.add('unlimited-hero-content');
  });
}
