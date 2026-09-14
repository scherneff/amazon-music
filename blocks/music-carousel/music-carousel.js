/**
 * Music Carousel — a 3D "coverflow" turntable of album / playlist cards.
 *
 * Cards ring around a vertical axis on a black stage: the front card faces the
 * viewer, cards toward the edges rotate away (rotateY) and recede (translateZ),
 * and each is mirrored on a reflective floor. The ring auto-rotates and can be
 * grabbed / swiped.
 *
 * Authoring (Document Authoring) — one row per card. In each row provide:
 *   • an image  — the artwork (required)
 *   • a caption — short text shown over the artwork (optional)
 *   • a link    — where the card points (optional)
 * Separate columns or stacked lines both work; the block finds each part and
 * quietly ignores anything an author leaves out.
 *
 * Variants (add as block classes): `reverse` spins the other way,
 *   `slow` / `fast` change speed, `square` uses 1:1 art instead of 3:4.
 *
 * @param {Element} block
 */
import { createTag } from '../../scripts/shared.js';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
const CAN_HOVER = window.matchMedia('(hover: hover)');

// degrees / second for each speed variant
const SPEEDS = { slow: 5, default: 9, fast: 18 };
// gap between neighbouring cards (1 = touching, lower = more overlap)
const SPACING = 1.08;
// spin (degrees) applied per pixel of horizontal drag
const DRAG_FACTOR = 0.25;
// movement (px) past which a pointer gesture counts as a drag, not a click
const DRAG_THRESHOLD = 6;

const isUrl = (text) => /^https?:\/\//i.test(text);

/**
 * Collect the caption text lines authored in a row. The first line is the
 * title; any further lines become the subtitle (e.g. an artist). Falls back
 * to the link text when no separate caption is given.
 */
function readCaptionLines(row, link) {
  const seen = new Set();
  const lines = [...row.querySelectorAll('p, h1, h2, h3, h4, h5, h6')]
    .filter((node) => !node.querySelector('picture, img, a'))
    .map((node) => node.textContent.trim())
    .filter((text) => text && !isUrl(text) && !seen.has(text) && seen.add(text));
  if (lines.length) return lines;
  const linkText = link ? link.textContent.trim() : '';
  return linkText && !isUrl(linkText) ? [linkText] : [];
}

/** Turn one authored row into a card element (or null if the row is empty). */
function buildCard(row) {
  const media = row.querySelector('picture') || row.querySelector('img');
  const link = row.querySelector('a[href]');
  if (!media && !link) return null;

  const lines = readCaptionLines(row, link);
  const card = createTag(link ? 'a' : 'div', { class: 'music-carousel-card' });
  if (link) {
    card.href = link.getAttribute('href');
    if (link.title) card.title = link.title;
  }
  if (lines.length) card.setAttribute('aria-label', lines.join(', '));

  const art = createTag('div', { class: 'music-carousel-card-art' });
  if (media) art.append(media);
  if (lines.length) {
    const caption = createTag('div', { class: 'music-carousel-caption' });
    caption.append(createTag('span', { class: 'music-carousel-title' }, lines[0]));
    if (lines.length > 1) {
      caption.append(createTag('span', { class: 'music-carousel-subtitle' }, lines.slice(1).join(' · ')));
    }
    art.append(caption);
  }
  card.append(art);
  return card;
}

export default function decorate(block) {
  const cards = [...block.children].map(buildCard).filter(Boolean);
  if (!cards.length) return;

  const count = cards.length;
  cards.forEach((card, i) => card.style.setProperty('--i', i));

  const ring = createTag('div', { class: 'music-carousel-ring' });
  ring.style.setProperty('--angle', `${360 / count}deg`);
  ring.append(...cards);
  const stage = createTag('div', { class: 'music-carousel-stage' });
  stage.append(ring);
  block.replaceChildren(stage);

  // ---- geometry: size the ring radius from the measured card width --------
  const layout = () => {
    const w = cards[0].getBoundingClientRect().width || 180;
    let radius = (w / 2) / Math.tan(Math.PI / count) * SPACING;
    if (!Number.isFinite(radius) || radius < w) radius = w; // tiny / degenerate counts
    ring.style.setProperty('--radius', `${Math.round(radius)}px`);
  };
  layout();
  new ResizeObserver(layout).observe(block);

  // ---- rotation state -----------------------------------------------------
  const direction = block.classList.contains('reverse') ? 1 : -1;
  let speed = SPEEDS.default;
  if (block.classList.contains('slow')) speed = SPEEDS.slow;
  if (block.classList.contains('fast')) speed = SPEEDS.fast;

  let rot = 0;
  let paused = false;
  let dragging = false;
  let running = false;
  let onscreen = false;
  let rafId = 0;
  let lastTs = 0;

  const render = () => ring.style.setProperty('--rot', `${rot}deg`);

  const frame = (ts) => {
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if (!paused && !dragging && !REDUCED_MOTION.matches) {
      rot += direction * speed * dt;
    }
    render();
    rafId = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running) return;
    running = true;
    lastTs = 0;
    rafId = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(rafId);
  };

  // ---- drag / swipe -------------------------------------------------------
  let startX = 0;
  let startRot = 0;
  let moved = 0;

  stage.addEventListener('pointerdown', (e) => {
    dragging = true;
    moved = 0;
    startX = e.clientX;
    startRot = rot;
    stage.setPointerCapture?.(e.pointerId);
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    rot = startRot + dx * DRAG_FACTOR;
    render();
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    lastTs = 0;
    stage.releasePointerCapture?.(e.pointerId);
    stage.classList.remove('is-dragging');
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  // swallow the click that ends a drag so a card doesn't navigate mid-spin
  stage.addEventListener('click', (e) => {
    if (moved > DRAG_THRESHOLD) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // pause while the pointer rests on the carousel (hover-capable devices only)
  if (CAN_HOVER.matches) {
    stage.addEventListener('pointerenter', () => { paused = true; });
    stage.addEventListener('pointerleave', () => { paused = false; lastTs = 0; });
  }

  // bring a focused card to the front for keyboard users
  ring.addEventListener('focusin', (e) => {
    const card = e.target.closest('.music-carousel-card');
    if (!card) return;
    rot = -(Number(card.style.getPropertyValue('--i')) || 0) * (360 / count);
    render();
  });

  // ---- run only when visible ---------------------------------------------
  new IntersectionObserver((entries) => {
    onscreen = entries.some((entry) => entry.isIntersecting);
    if (onscreen && !document.hidden) start();
    else stop();
  }, { threshold: 0 }).observe(block);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (onscreen) start();
  });
}
