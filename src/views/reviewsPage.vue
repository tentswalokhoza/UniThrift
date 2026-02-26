<script setup>
import { ref, watch, onMounted } from "vue";
import NavBar from '@/components/NavBar.vue';

const reviews = ref([]);

const formData = ref({
  product_id: "",
  reviewer_id: "",
  rating: "",
  comment: ""
});



const fetchReviews = async () => {
  try {
    const res = await fetch(`http://localhost:2006/reviews`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    reviews.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const submitReview = async () => {
  try {
    const payload = {
      product_id: parseInt(formData.value.product_id),
      reviewer_id: parseInt(formData.value.reviewer_id),
      rating: parseInt(formData.value.rating),
      comment: formData.value.comment
    };

    const res = await fetch("http://localhost:2006/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server error:", errorText);
      throw new Error("Failed to submit review");
    }

    await fetchReviews();

    formData.value = {
      product_id: "",
      reviewer_id: "",
      rating: "",
      comment: ""
    };

    alert("Review submitted successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to submit review");
  }
};

const formatDate = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric"
  });
};

onMounted(fetchReviews);
</script>

<template>
  <NavBar />

  <div class="review-container">
    <!-- Hero Banner -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Product Reviews</h1>
        <p class="hero-subtitle">See what our customers are saying</p>
      </div>
    </div>

    <div class="review-wrapper">
      <div class="review-grid">

        <!-- Form -->
        <form class="review-form" @submit.prevent="submitReview">
          <div class="form-group row-2">
            <div class="form-field">
              <label>Product ID</label>
              <input v-model="formData.product_id" type="number" placeholder="e.g. 12" required />
            </div>
            <div class="form-field">
              <label>Your ID</label>
              <input v-model="formData.reviewer_id" type="number" placeholder="e.g. 5" required />
            </div>
          </div>

          <div class="form-group">
            <label>Rating <span class="rating-hint">(1 – 5)</span></label>
            <input
              v-model="formData.rating"
              type="number"
              min="1"
              max="5"
              placeholder="Enter a rating from 1 to 5"
              required
            />
          </div>

          <div class="form-group">
            <label>Comment</label>
            <textarea v-model="formData.comment" rows="5" placeholder="Write your thoughts..." required></textarea>
          </div>

          <button type="submit" class="submit-btn">
            Submit Review
          </button>
        </form>

        <!-- Reviews List -->
        <div class="reviews-list">
          <div v-if="reviews.length === 0" class="empty-state">
            <span class="empty-icon">💬</span>
            <p>No reviews yet. Be the first!</p>
          </div>

          <div
            class="review-card"
            v-for="review in reviews"
            :key="review.id"
          >
            <div class="review-rating">
              <span v-for="n in review.rating" :key="n">★</span>
              <span class="rating-num">{{ review.rating }}/5</span>
            </div>
            <div class="review-comment">{{ review.comment }}</div>
            <div class="review-meta">
              <span class="reviewer-id">User #{{ review.reviewer_id }}</span>
              <span class="review-date">{{ formatDate(review.created_at) }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.review-container {
  width: 100%;
  background-color: #0f0f12;
  color: #d9d9d9;
  min-height: 100vh;
}

/* Hero */
.hero-section {
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  padding: 80px 20px;
  text-align: center;
  color: black;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: "";
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
  margin-bottom: 10px;
}

.hero-subtitle {
  font-size: 1.2rem;
  font-weight: 500;
}

/* Layout */
.review-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
}

.review-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

/* Form */
.review-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  flex-direction: unset;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label,
.form-field label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #00faab;
}

.review-form input,
.review-form textarea {
  padding: 12px 16px;
  background-color: #18181b;
  border: 1px solid rgba(0, 250, 171, 0.2);
  border-radius: 8px;
  color: #d9d9d9;
  font-size: 1rem;
  transition: 0.3s ease;
  outline: none;
  resize: vertical;
}

.review-form input:focus,
.review-form textarea:focus {
  border-color: #00faab;
  box-shadow: 0 0 12px rgba(0, 250, 171, 0.2);
}

/* Rating hint */
.rating-hint {
  font-size: 0.8rem;
  color: #555;
  font-weight: 400;
}

/* Submit */
.submit-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  color: black;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 250, 171, 0.3);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #555;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon { font-size: 2.5rem; }
.empty-state p { font-size: 0.95rem; }

/* Review cards */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  background-color: #18181b;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(0, 250, 171, 0.15);
  transition: 0.3s ease;
}

.review-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 250, 171, 0.15);
}

.review-rating {
  color: #00faab;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-num {
  font-size: 0.8rem;
  color: #555;
  font-weight: 400;
}

.review-comment {
  margin-bottom: 12px;
  color: #ccc;
  font-size: 1rem;
  line-height: 1.6;
}

.review-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reviewer-id {
  font-size: 0.8rem;
  color: #00faab;
  opacity: 0.6;
  font-weight: 600;
}

.review-date {
  font-size: 0.8rem;
  color: #777;
}

/* Responsive */
@media (max-width: 768px) {
  .review-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-section {
    padding: 50px 20px;
  }

  .row-2 {
    grid-template-columns: 1fr;
  }
}
</style>