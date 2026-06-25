if (window.location.protocol === 'http:') {
  window.location.replace(`https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`);
}

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
    const name = form.get('name') || '';
    const email = form.get('email') || '';
    const type = form.get('type') || '';
    const message = form.get('message') || '';
    const recipient = 'info@trillions.ae';
    const subject = encodeURIComponent(`Trillions inquiry: ${type}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInquiry type: ${type}\n\nMessage:\n${message}`);
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });
}

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatLog = document.getElementById('chat-log');

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
    appendMessage('Thinking...', 'bot');
    const thinkingNode = chatLog.lastElementChild;

    try {
      const response = await fetch('/api/chat.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      thinkingNode.textContent = data.reply || 'No response was returned.';
    } catch (error) {
      thinkingNode.textContent = 'The assistant is not connected yet. Please configure /api/chat.php and the OPENAI_API_KEY server variable.';
    }
  });
}
