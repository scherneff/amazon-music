import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer (Amazon-style global footer).
 * Content-first: all copy/links/images live in the footer fragment. This JS
 * only reads that DOM, groups the link columns, and wires interactive bits.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load footer as fragment (skip if aem-embed already provided content)
  if (block.textContent === '') {
    const footerMeta = getMetadata('footer');
    const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
    const fragment = await loadFragment(footerPath);
    if (!fragment) return;

    block.textContent = '';
    const footer = document.createElement('div');
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
    block.append(footer);
  }

  const sections = [...block.querySelectorAll('.section')];

  // Section 0: Back to top — full-width bar that scrolls to top
  const backToTop = sections[0];
  if (backToTop) {
    backToTop.classList.add('footer-back-to-top');
    const label = backToTop.querySelector('p');
    if (label) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'footer-back-to-top-btn';
      btn.textContent = label.textContent.trim();
      btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      label.replaceWith(btn);
    }
  }

  // Section 1: Link columns — group each <h6> with the <ul> that follows it
  const columnsSection = sections[1];
  if (columnsSection) {
    columnsSection.classList.add('footer-columns');
    const wrapper = columnsSection.querySelector(':scope > div') || columnsSection;
    const nodes = [...wrapper.children];
    wrapper.textContent = '';
    let currentCol = null;
    nodes.forEach((node) => {
      if (node.tagName === 'H6') {
        currentCol = document.createElement('div');
        currentCol.className = 'footer-column';
        currentCol.append(node);
        wrapper.append(currentCol);
      } else if (currentCol) {
        currentCol.append(node);
      } else {
        wrapper.append(node);
      }
    });
  }

  // Section 2: Locale row (logo + language + country)
  const localeSection = sections[2];
  if (localeSection) localeSection.classList.add('footer-locale');

  // Section 3: Legal links + copyright
  const legalSection = sections[3];
  if (legalSection) legalSection.classList.add('footer-legal');
}
