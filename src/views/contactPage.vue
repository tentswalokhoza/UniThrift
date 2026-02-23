<script setup>
import { ref  } from "vue";
import NavBar from '@/components/NavBar.vue'



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
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  padding: 80px 20px;
  text-align: center;
  color: black;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.contact-info h2 {
  font-size: 2rem;
  color: #00faab;
  margin-bottom: 40px;
  font-weight: 700;
}

.info-item {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  animation: fadeIn 0.8s ease-in;
}

.info-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.info-item h3 {
  font-size: 1.2rem;
  color: #00faab;
  margin: 0 0 8px 0;
}

.info-item p {
  margin: 0;
  color: #888;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  padding: 12px 16px;
  background-color: #18181b;
  border: 1px solid rgba(0, 250, 171, 0.2);
  border-radius: 8px;
  color: #d9d9d9;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #00faab;
  box-shadow: 0 0 12px rgba(0, 250, 171, 0.2);
}

.submit-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  color: black;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 250, 171, 0.3);
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
    padding: 50px 20px;
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