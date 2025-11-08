// Contact page specific JS

document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = {
      name: document.getElementById('name')?.value,
      email: document.getElementById('email')?.value,
      phone: document.getElementById('phone')?.value,
      subject: document.getElementById('subject')?.value,
      message: document.getElementById('message')?.value
    };
    if (!formData.name || !formData.email || !formData.message) { alert('Please fill in all required fields.'); return; }
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
  });
});
