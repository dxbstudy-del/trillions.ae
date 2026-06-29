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

const supplierForm = document.getElementById('supplier-form');
if (supplierForm) {
  supplierForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(supplierForm);
    const value = (name) => String(form.get(name) || '').trim();
    const company = value('company');
    const supplierType = value('supplier_type');
    const countryCity = value('country_city');
    const contactName = value('contact_name');
    const email = value('email');
    const phone = value('phone');
    const website = value('website');
    const categories = value('categories');
    const moq = value('moq');
    const leadTime = value('lead_time');
    const paymentTerms = value('payment_terms');
    const exportMarkets = value('export_markets');
    const documents = value('documents');
    const topProducts = value('top_products');
    const address = value('address');
    const message = value('message');
    const subject = encodeURIComponent(`Trillions supplier registration from ${company || contactName || 'website supplier'}`);
    const body = encodeURIComponent([
      'Hello Trillions team,',
      '',
      'I would like to register our company for supplier review:',
      '',
      'Company details',
      `Company name: ${company || 'Not provided'}`,
      `Supplier type: ${supplierType || 'Not provided'}`,
      `Country and city: ${countryCity || 'Not provided'}`,
      `Factory or warehouse address: ${address || 'Not provided'}`,
      '',
      'Contact details',
      `Contact person: ${contactName || 'Not provided'}`,
      `Email: ${email || 'Not provided'}`,
      `Phone or WhatsApp: ${phone || 'Not provided'}`,
      `Website or catalog link: ${website || 'Not provided'}`,
      '',
      'Product and commercial details',
      `Product categories: ${categories || 'Not provided'}`,
      `Top products: ${topProducts || 'Not provided'}`,
      `MOQ range: ${moq || 'Not provided'}`,
      `Lead time: ${leadTime || 'Not provided'}`,
      `Payment terms: ${paymentTerms || 'Not provided'}`,
      `Export markets: ${exportMarkets || 'Not provided'}`,
      `Documents available: ${documents || 'Not provided'}`,
      '',
      'Why buyers should consider us',
      message || 'Not provided',
      '',
      'We understand registration does not guarantee approval, verification, buyer orders, or public listing.',
      '',
      'Thank you.'
    ].join('\n'));
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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
