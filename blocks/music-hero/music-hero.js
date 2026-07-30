/**
 * Music Hero — full-bleed gradient banner with an overlaid logo, heading,
 * subheading and call-to-action. Mirrors the Amazon Music landing hero.
 *
 * Expected content (2 rows):
 *   Row 1: background image
 *   Row 2: logo image, heading, subheading, CTA link, optional fine print
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows[0]) rows[0].classList.add('music-hero-bg');
  if (rows[1]) {
    rows[1].classList.add('music-hero-content');
    // The last paragraph (if it is not the CTA) is treated as fine print.
    const inner = rows[1].firstElementChild || rows[1];
    const paras = [...inner.querySelectorAll(':scope > p')];
    const last = paras[paras.length - 1];
    if (last && !last.classList.contains('button-container')) {
      last.classList.add('music-hero-fineprint');
    }
  }
}
