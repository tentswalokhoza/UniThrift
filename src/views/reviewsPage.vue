<script setup>
import { ref, onMounted } from "vue";
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
    const res = await fetch("http://localhost:2006/reviews");
    if (!res.ok) throw new Error("Failed to fetch reviews");
    reviews.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const submitReview = async () => {
  try {
    const res = await fetch("http://localhost:2006/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData.value)
    });

    if (!res.ok) throw new Error("Failed to submit review");

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

onMounted(fetchReviews);
</script>

<template>
  <NavBar />

  <div class="review-container">
    <!-- Banner -->
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
          <div class="form-group">
            <label>Product ID</label>
            <input v-model="formData.product_id" type="text" required />
          </div>

          <div class="form-group">
            <label>Your ID</label>
            <input v-model="formData.reviewer_id" type="text" required />
          </div>

          <div class="form-group">
            <label>Rating</label>
            <select v-model="formData.rating" required>
              <option disabled value="">Select Rating</option>
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐</option>
              <option value="3">3 ⭐</option>
              <option value="4">4 ⭐</option>
              <option value="5">5 ⭐</option>
            </select>
          </div>

          <div class="form-group">
            <label>Comment</label>
            <textarea v-model="formData.comment" rows="5" required></textarea>
          </div>

          <button type="submit" class="submit-btn">
            Submit Review
          </button>
        </form>

        <!-- review lists-->
        <div class="reviews-list">
          <div
            class="review-card"
            v-for="review in reviews"
            :key="review.id"
          >
            <div class="review-rating">
              {{ review.rating }} ⭐
            </div>

            <div class="review-comment">
              {{ review.comment }}
            </div>

            <div class="review-date">
              {{ review.created_at }}
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

.form-group label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #00faab;
}

.review-form input,
.review-form select,
.review-form textarea {
  padding: 12px 16px;
  background-color: #18181b;
  border: 1px solid rgba(0, 250, 171, 0.2);
  border-radius: 8px;
  color: #d9d9d9;
  font-size: 1rem;
  transition: 0.3s ease;
}

.review-form input:focus,
.review-form select:focus,
.review-form textarea:focus {
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
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 250, 171, 0.3);
}


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
  margin-bottom: 10px;
}

.review-comment {
  margin-bottom: 10px;
  color: #ccc;
}

.review-date {
  font-size: 0.8rem;
  color: #777;
}


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
}
</style>