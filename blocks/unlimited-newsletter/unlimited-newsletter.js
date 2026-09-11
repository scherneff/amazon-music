/**
 * unlimited-newsletter — teal email signup bar.
 * Expected authored structure:
 *   Row 1: prompt copy
 *   Row 2: email placeholder text | submit button label
 * Builds an accessible form with an email input and submit button.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [copyRow, fieldRow] = rows;

  if (copyRow) copyRow.className = 'unlimited-newsletter-copy';

  // Derive placeholder + button label from the field row cells (data-driven, no hard-coded text).
  let placeholder = 'Your email';
  let buttonLabel = 'Subscribe';
  if (fieldRow) {
    const cells = [...fieldRow.children];
    if (cells[0] && cells[0].textContent.trim()) placeholder = cells[0].textContent.trim();
    if (cells[1] && cells[1].textContent.trim()) buttonLabel = cells[1].textContent.trim();
    fieldRow.remove();
  }

  const form = document.createElement('form');
  form.className = 'unlimited-newsletter-form';
  form.setAttribute('novalidate', '');

  const input = document.createElement('input');
  input.type = 'email';
  input.name = 'email';
  input.required = true;
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder);

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = buttonLabel;

  form.append(input, button);
  block.append(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.checkValidity()) {
      form.setAttribute('data-submitted', 'true');
    } else {
      input.reportValidity();
    }
  });
}
