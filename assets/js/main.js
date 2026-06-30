if (window.location.protocol === 'http:') {
  window.location.replace(`https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`);
}

const CONTACT_EMAIL = 'info@trillions.ae';
const WHATSAPP_NUMBER = '+971500000000';
const DEFAULT_WHATSAPP_MESSAGE = 'Hello Trillions, I want to check a supplier or quotation.';

function whatsappUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  const phone = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function hidePricingForNow() {
  document.querySelectorAll('a[href="pricing.html"]').forEach((link) => {
    const parentListItem = link.closest('li');
    if (parentListItem) {
      parentListItem.remove();
      return;
    }
    link.remove();
  });

  document.querySelectorAll('.price, .price-card').forEach((node) => {
    node.remove();
  });

  document.querySelectorAll('p').forEach((paragraph) => {
    const text = paragraph.textContent || '';
    if (/Starting fee:|AED\s|Custom quote/i.test(text)) {
      paragraph.remove();
    }
  });
}

hidePricingForNow();

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('[data-whatsapp], a[href="https://wa.me/971500000000"]').forEach((link) => {
  const message = link.getAttribute('data-whatsapp') || DEFAULT_WHATSAPP_MESSAGE;
  link.href = whatsappUrl(message);
  link.target = '_blank';
  link.rel = 'noopener';
});

const floatingWhatsapp = document.createElement('a');
floatingWhatsapp.className = 'floating-whatsapp';
floatingWhatsapp.href = whatsappUrl(DEFAULT_WHATSAPP_MESSAGE);
floatingWhatsapp.target = '_blank';
floatingWhatsapp.rel = 'noopener';
floatingWhatsapp.setAttribute('aria-label', 'Contact Trillions on WhatsApp');
floatingWhatsapp.innerHTML = '<span aria-hidden="true">WA</span><span>WhatsApp</span>';
document.body.appendChild(floatingWhatsapp);

function formValue(form, name) {
  return String(new FormData(form).get(name) || '').trim();
}

function openMailto(subject, lines) {
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const type = formValue(contactForm, 'type');
    const name = formValue(contactForm, 'name');
    openMailto(`Trillions ${type || 'sourcing request'} from ${name || 'website visitor'}`, [
      'Hello Trillions team,',
      '',
      'I would like support with the following request:',
      '',
      `Request type: ${type || 'Not provided'}`,
      `Name: ${name || 'Not provided'}`,
      `Email: ${formValue(contactForm, 'email') || 'Not provided'}`,
      `Phone or WhatsApp: ${formValue(contactForm, 'phone') || 'Not provided'}`,
      `Destination market: ${formValue(contactForm, 'market') || 'Not provided'}`,
      `Product or category: ${formValue(contactForm, 'product') || 'Not provided'}`,
      `Target quantity: ${formValue(contactForm, 'quantity') || 'Not provided'}`,
      `Supplier or product link: ${formValue(contactForm, 'supplier_link') || 'Not provided'}`,
      `Target price or budget: ${formValue(contactForm, 'budget') || 'Not provided'}`,
      `Request stage: ${formValue(contactForm, 'stage') || 'Not provided'}`,
      `Timeline: ${formValue(contactForm, 'timeline') || 'Not provided'}`,
      '',
      'Message',
      formValue(contactForm, 'message') || 'Not provided',
      '',
      'I can attach files by email or send them through WhatsApp after submitting this request.',
      '',
      'Thank you.'
    ]);
  });
}

const supplierForm = document.getElementById('supplier-form');
if (supplierForm) {
  supplierForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const company = formValue(supplierForm, 'company');
    openMailto(`Supplier registration for Trillions: ${company || 'New supplier'}`, [
      'Hello Trillions team,',
      '',
      'Please review this supplier registration:',
      '',
      `Company name: ${company || 'Not provided'}`,
      `Country and city: ${formValue(supplierForm, 'country_city') || 'Not provided'}`,
      `Factory or trading company: ${formValue(supplierForm, 'supplier_type') || 'Not provided'}`,
      `Product categories: ${formValue(supplierForm, 'categories') || 'Not provided'}`,
      `MOQ: ${formValue(supplierForm, 'moq') || 'Not provided'}`,
      `Lead time: ${formValue(supplierForm, 'lead_time') || 'Not provided'}`,
      `Payment terms: ${formValue(supplierForm, 'payment_terms') || 'Not provided'}`,
      `Export markets: ${formValue(supplierForm, 'export_markets') || 'Not provided'}`,
      `Certificates: ${formValue(supplierForm, 'documents') || 'Not provided'}`,
      `Catalog link: ${formValue(supplierForm, 'catalog_link') || 'Not provided'}`,
      `Website: ${formValue(supplierForm, 'website') || 'Not provided'}`,
      `WhatsApp: ${formValue(supplierForm, 'whatsapp') || formValue(supplierForm, 'phone') || 'Not provided'}`,
      `Contact person: ${formValue(supplierForm, 'contact_name') || 'Not provided'}`,
      '',
      'Top products',
      formValue(supplierForm, 'top_products') || 'Not provided',
      '',
      'Message',
      formValue(supplierForm, 'message') || 'Not provided',
      '',
      'Supplier registration does not mean automatic verification, endorsement, or approval by Trillions.'
    ]);
  });
}

function setFormStatus(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `form-status visible ${type || 'info'}`;
}

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatLog = document.getElementById('chat-log');
const promptButtons = document.querySelectorAll('[data-chat-prompt]');

if (chatInput && promptButtons.length) {
  promptButtons.forEach((button) => {
    button.addEventListener('click', () => {
      chatInput.value = button.dataset.chatPrompt || '';
      chatInput.focus();
      chatInput.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  });
}

function appendMessage(text, role) {
  const div = document.createElement('div');
  div.className = `chat-message ${role}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

if (chatForm && chatInput && chatLog) {
  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;
    appendMessage(message, 'user');
    chatInput.value = '';
    appendMessage('Preparing...', 'bot');
    const thinkingNode = chatLog.lastElementChild;

    try {
      const response = await fetch('/api/chat.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      let data = {};
      try { data = await response.json(); } catch (error) { data = {}; }
      if (!response.ok) {
        throw new Error(data.reply || 'The assistant is temporarily unavailable. Please try again later.');
      }
      thinkingNode.textContent = data.reply || 'No response was returned.';
    } catch (error) {
      thinkingNode.textContent = error.message || 'The assistant is temporarily unavailable. Please try again later.';
    }
  });
}
