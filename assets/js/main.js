if (window.location.protocol === 'http:') {
  window.location.replace(`https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`);
}

const CONTACT_EMAIL = 'info@trillions.ae';
const WHATSAPP_NUMBER = '+971500000000';

function whatsappUrl(message) {
  const phone = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('a[href="https://wa.me/971500000000"]').forEach((link) => {
  const pageTitle = document.title.replace(/\s*\|\s*Trillions.*/, '').trim() || 'Trillions';
  link.href = whatsappUrl(`Hello Trillions, I would like help with ${pageTitle}.`);
  link.target = '_blank';
  link.rel = 'noopener';
});

const floatingStyle = document.createElement('style');
floatingStyle.textContent = `
  .floating-whatsapp{position:fixed;right:18px;bottom:18px;z-index:60;display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:0 18px;border-radius:999px;background:#128c7e;color:#fff;font-weight:800;box-shadow:0 18px 36px rgba(16,24,40,.22);border:1px solid rgba(255,255,255,.35)}
  .floating-whatsapp:hover,.floating-whatsapp:focus-visible{background:#0f6f65;outline:none;transform:translateY(-1px)}
  .floating-whatsapp span:first-child{display:grid;place-items:center;width:28px;height:28px;border-radius:999px;background:rgba(255,255,255,.18)}
  @media(max-width:620px){.floating-whatsapp{left:14px;right:14px;bottom:14px;justify-content:center}.site-footer{padding-bottom:92px}}
`;
document.head.appendChild(floatingStyle);

const floatingWhatsapp = document.createElement('a');
floatingWhatsapp.className = 'floating-whatsapp';
floatingWhatsapp.href = whatsappUrl('Hello Trillions, I would like help reviewing a supplier, quote, product link, or private-label request.');
floatingWhatsapp.target = '_blank';
floatingWhatsapp.rel = 'noopener';
floatingWhatsapp.setAttribute('aria-label', 'Contact Trillions on WhatsApp');
floatingWhatsapp.innerHTML = '<span aria-hidden="true">WA</span><span>WhatsApp</span>';
document.body.appendChild(floatingWhatsapp);

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(contactForm);
    const value = (name) => String(form.get(name) || '').trim();
    const name = value('name');
    const email = value('email');
    const phone = value('phone');
    const type = value('type');
    const market = value('market');
    const product = value('product');
    const quantity = value('quantity');
    const supplierLink = value('supplier_link');
    const budget = value('budget');
    const stage = value('stage');
    const timeline = value('timeline');
    const message = value('message');
    const subject = encodeURIComponent(`Trillions ${type || 'sourcing request'} from ${name || 'website visitor'}`);
    const body = encodeURIComponent([
      'Hello Trillions team,',
      '',
      'I would like sourcing support with the following request:',
      '',
      'Contact details',
      `Name: ${name || 'Not provided'}`,
      `Email: ${email || 'Not provided'}`,
      `Phone or WhatsApp: ${phone || 'Not provided'}`,
      '',
      'Inquiry details',
      `Request type: ${type || 'Not provided'}`,
      `Request stage: ${stage || 'Not provided'}`,
      `Product or category: ${product || 'Not provided'}`,
      `Destination market: ${market || 'Not provided'}`,
      `Target quantity: ${quantity || 'Not provided'}`,
      `Target price or budget: ${budget || 'Not provided'}`,
      `Timeline: ${timeline || 'Not provided'}`,
      `Supplier or product link: ${supplierLink || 'Not provided'}`,
      '',
      'Message',
      message || 'Not provided',
      '',
      'I can attach photos, quotes, catalogs, certificates, packing details, or supplier documents to this email before sending.',
      '',
      'Thank you.'
    ].join('\n'));
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });
}

function setFormStatus(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `form-status visible ${type || 'info'}`;
}

const supplierForm = document.getElementById('supplier-form');
const supplierFormStatus = document.getElementById('supplier-form-status');
if (supplierForm) {
  supplierForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = supplierForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';
    const payload = Object.fromEntries(new FormData(supplierForm).entries());

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }
    setFormStatus(supplierFormStatus, 'Sending supplier registration to Trillions...', 'info');

    try {
      const response = await fetch('/api/supplier-registration.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      let data = {};
      try {
        data = await response.json();
      } catch (error) {
        data = {};
      }
      if (!response.ok) {
        throw new Error(data.reply || 'The supplier registration could not be sent. Please email info@trillions.ae directly.');
      }
      setFormStatus(supplierFormStatus, data.reply || 'Supplier registration sent to Trillions. Thank you.', 'success');
      supplierForm.reset();
    } catch (error) {
      setFormStatus(
        supplierFormStatus,
        error.message || 'The supplier registration could not be sent. Please email info@trillions.ae directly.',
        'error'
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
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
      try {
        data = await response.json();
      } catch (error) {
        data = {};
      }
      if (!response.ok) {
        throw new Error(data.reply || 'The assistant is temporarily unavailable. Please try again later.');
      }
      thinkingNode.textContent = data.reply || 'No response was returned.';
    } catch (error) {
      thinkingNode.textContent = error.message || 'The assistant is temporarily unavailable. Please try again later.';
    }
  });
}
