<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <NavBar />
  <div class="about-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">About UniThrift</h1>
        <p class="hero-subtitle">Affordable Fashion for South African Students</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Story Section -->
      <section class="about-section">
        <div class="section-header">
          <div class="icon-circle story-icon">📖</div>
          <h2>Our Story</h2>
        </div>
        <p class="section-text">
          UniThrift is a proudly South African fashion-focused company dedicated to making affordable, high-quality fashion accessible to university and college students. We believe that financial constraints shouldn't prevent young people from expressing themselves through fashion. By combating the expensive and exclusive nature of the fashion sector, we're democratizing style for the youth of South Africa.
        </p>
      </section>

      <!-- Mission Section -->
      <section class="about-section">
        <div class="section-header">
          <div class="icon-circle mission-icon">🎯</div>
          <h2>Our Mission</h2>
        </div>
        <p class="section-text">
          To provide an affordable, user-friendly, and hassle-free thrifting platform tailored to university and college students. We're building a fashion-forward community by scholars, for scholars. Our goal is to empower today's youth to express themselves authentically without compromising their budgets or academic schedules, while maintaining the highest standards in our product catalogue.
        </p>
      </section>

      <!-- Vision Section -->
      <section class="about-section">
        <div class="section-header">
          <div class="icon-circle vision-icon">🚀</div>
          <h2>Our Vision</h2>
        </div>
        <p class="section-text">
          We envision UniThrift expanding to serve students at all tertiary institutions across South Africa. As we grow, we plan to introduce multiple distribution points with secure authentication for pickups and deliveries at each campus. Our roadmap includes enhanced logistics, expanded inventory, and seamless integration with student communities nationwide.
        </p>
      </section>

      <!-- Values Section -->
      <section class="values-section">
        <h2 class="values-title">Our Values</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">💚</div>
            <h3>Affordability</h3>
            <p>Quality fashion shouldn't require a premium price</p>
          </div>
          <div class="value-card">
            <div class="value-icon">👥</div>
            <h3>Community</h3>
            <p>Built by students, for students</p>
          </div>
          <div class="value-card">
            <div class="value-icon">✨</div>
            <h3>Quality</h3>
            <p>High standards in every item we curate</p>
          </div>
          <div class="value-card">
            <div class="value-icon">🌱</div>
            <h3>Sustainability</h3>
            <p>Promoting the circular fashion economy</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  width: 100%;
  background-color: #0f0f12;
  color: #d9d9d9;
}

/* Hero Section */
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

/* Content Wrapper */
.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
}

/* About Sections */
.about-section {
  margin-bottom: 60px;
  animation: fadeIn 0.8s ease-in;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
}

.story-icon {
  background: rgba(0, 250, 171, 0.2);
  border: 2px solid #00faab;
}

.mission-icon {
  background: rgba(0, 250, 171, 0.2);
  border: 2px solid #00faab;
}

.vision-icon {
  background: rgba(0, 250, 171, 0.2);
  border: 2px solid #00faab;
}

.section-header h2 {
  font-size: 2rem;
  margin: 0;
  color: #00faab;
  font-weight: 700;
}

.section-text {
  font-size: 1rem;
  line-height: 1.8;
  color: #d9d9d9;
  margin: 0;
  padding-left: 75px;
}

/* Values Section */
.values-section {
  margin-top: 80px;
  padding-top: 60px;
  border-top: 2px solid rgba(0, 250, 171, 0.2);
}

.values-title {
  text-align: center;
  font-size: 2.2rem;
  color: #00faab;
  margin-bottom: 50px;
  font-weight: 700;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
}

.value-card {
  background: linear-gradient(135deg, #27272a 0%, #1f1f23 100%);
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(0, 250, 171, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.value-card:hover {
  border-color: #00faab;
  box-shadow: 0 8px 24px rgba(0, 250, 171, 0.15);
  transform: translateY(-5px);
}

.value-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  display: block;
}

.value-card h3 {
  font-size: 1.3rem;
  color: #00faab;
  margin: 10px 0;
  font-weight: 700;
}

.value-card p {
  font-size: 0.95rem;
  color: #888;
  margin: 0;
  line-height: 1.6;
}

/* Animations */
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

/* Responsive */
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

  .section-header h2 {
    font-size: 1.5rem;
  }

  .section-text {
    padding-left: 0;
    font-size: 0.95rem;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .content-wrapper {
    padding: 40px 20px;
  }
}
</style>