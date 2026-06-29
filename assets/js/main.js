if (window.location.protocol === 'http:') {
  window.location.replace(`https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`);
}

const CONTACT_EMAIL = 'info@trillions.ae';

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

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
    const subject = encodeURIComponent(`Trillions ${type || 'sourcing'} from ${name || 'website visitor'}`);
    const body = encodeURIComponent([
      'Hello Trillions team,',
      '',
      'I would like support with the following sourcing request:',
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
      'I can attach any photos, quotes, catalogs, or supplier documents to this email before sending.',
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
