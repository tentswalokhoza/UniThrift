<script setup>
import NavBar from '@/components/NavBar.vue'


//ignore this0
// const formData = ref({
//   name: '',
//   email: '',
//   subject: '',
//   message: ''
// })

// const handleSubmit = () => {
//   console.log('Form submitted:', formData.value)
//   formData.value = { name: '', email: '', subject: '', message: '' }
// }

const submitContact = async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  try {
    const res = await fetch('http://localhost:2006/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        subject,
        message
      })
    });

    if (!res.ok) {
      throw new Error('Failed to submit contact form');
    }

    alert('Contact form submitted successfully');

    // Clear inputs after success
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';

  } catch (err) {
    console.error(err);
    alert('Submission failed');
  }
}
</script>

<template>
<NavBar/>
<div class="contact-container">
  <div class="hero-section">
    <div class="hero-content">
      <p class="eyebrow">UniThrift Support</p>
      <h1 class="hero-title">Contact Us</h1>
      <p class="hero-subtitle">We'd love to hear from you</p>
    </div>
  </div>

  <div class="content-wrapper">
    <div class="contact-grid">
      <div class="contact-info">
        <h2>Get in Touch</h2>
        <div class="info-item">
          <div class="info-icon">📍</div>
          <div>
            <h3>Location</h3>
            <p>South Africa</p>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">📧</div>
          <div>
            <h3>Email</h3>
            <p>UniAdmin@unithrift.com</p>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">📱</div>
          <div>
            <h3>Phone</h3>
            <p>+27 (0) 63 069 6767</p>
          </div>
        </div>
      </div>

      <form class="contact-form" @submit="submitContact">
        <div class="form-group">
          <label for="name">Name</label>
          <input  type="text" id="name" placeholder="Enter Name"  required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Enter Email" required>
        </div>
        <div class="form-group">
          <label for="subject">Subject</label>
          <input type="text" id="subject" placeholder="Enter subject" required>
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea  id="message" rows="5" placeholder="send a message " required></textarea>
        </div>
        <button type="submit" class="submit-btn">Send Message</button>
      </form>
    </div>
  </div>
</div>
</template>

<style scoped>
.contact-container {
  width: 100%;
  background-color: #0f0f12;
  color: #d9d9d9;
}

.hero-section {
  max-width: 1220px;
  margin: 20px auto 0;
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 48%),
    linear-gradient(125deg, #00faab 0%, #00c896 56%, #009e8f 100%);
  color: #041311;
  padding: 36px 28px;
  border: 1px solid rgba(0, 250, 171, 0.24);
}

.hero-content {
  text-align: center;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.7rem;
  font-weight: 800;
  opacity: 0.9;
}

.hero-title {
  font-size: 2.45rem;
  font-weight: 900;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: rgba(4, 19, 17, 0.8);
}

.content-wrapper {
  max-width: 1180px;
  margin: 0 auto;
  padding: 60px 20px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.contact-info,
.contact-form {
  background: linear-gradient(160deg, #1b1f26, #14161c);
  border: 1px solid rgba(0, 250, 171, 0.16);
  border-radius: 16px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.34);
  padding: 24px;
}

.contact-info h2 {
  font-size: 1.9rem;
  color: #00faab;
  margin-bottom: 24px;
  font-weight: 700;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 24px;
  animation: fadeIn 0.8s ease-in;
}

.info-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.info-item h3 {
  font-size: 1.06rem;
  color: #00faab;
  margin: 0 0 4px 0;
}

.info-item p {
  margin: 0;
  color: #888;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #00faab;
}

.form-group input,
.form-group textarea {
  padding: 11px 14px;
  background-color: #11141a;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  color: #e3e8ef;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #00faab;
  box-shadow: 0 0 0 3px rgba(0, 250, 171, 0.16);
}

.submit-btn {
  padding: 11px 18px;
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  color: #071916;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-top: 10px;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 250, 171, 0.28);
}

.submit-btn:active {
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-section {
    margin: 14px 12px 0;
    padding: 28px 18px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .content-wrapper {
    padding: 40px 20px;
  }
}
</style>
