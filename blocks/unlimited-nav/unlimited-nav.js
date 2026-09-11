/**
 * unlimited-nav — page-specific top navigation.
 * Expected authored structure:
 *   Row 1: brand logo (image) | nav links (list of links)
 *   Row 2: CTA button (single standalone link)
 * Rows are classified by content so extra/missing rows don't break layout.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];
    const hasImage = !!row.querySelector('picture, img');

    if (hasImage) {
      // Brand row: first cell = logo, remaining cell(s) = nav links
      const [brandCell, linksCell] = cells;
      if (brandCell) brandCell.className = 'unlimited-nav-brand';
      if (linksCell) {
        linksCell.className = 'unlimited-nav-links';
        if (!linksCell.querySelector('ul')) {
          const list = document.createElement('ul');
          [...linksCell.querySelectorAll('a')].forEach((a) => {
            const li = document.createElement('li');
            li.append(a);
            list.append(li);
          });
          linksCell.textContent = '';
          linksCell.append(list);
        }
      }
    } else if (row.querySelector('a')) {
      // CTA row: a single standalone link/button
      row.className = 'unlimited-nav-cta';
    }
  });

  block.setAttribute('role', 'navigation');
}
