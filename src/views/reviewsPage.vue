<script setup>
import { ref, onMounted } from "vue";
import NavBar from "@/components/NavBar.vue";

const reviews = ref([]);
const submittedReviews = ref([]);
const deletingReviewId = ref(null);

const formData = ref({
  username: "",
  product_id: "",
  rating: "",
  comment: ""
});

const fetchReviews = async () => {
  try {
    const res = await fetch("http://localhost:2006/reviews");
    if (!res.ok) throw new Error("Failed to fetch reviews");

    const data = await res.json();
    reviews.value = Array.isArray(data) ? data : data.reviews || [];
  } catch (err) {
    console.error(err);
  }
};

const submitReview = async () => {
  try {
    const payload = {
      product_id: parseInt(formData.value.product_id, 10),
      username: formData.value.username.trim(),
      rating: parseInt(formData.value.rating, 10),
      comment: formData.value.comment
    };

    const res = await fetch("http://localhost:2006/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      let message = "Failed to submit review";
      try {
        const errorBody = await res.json();
        if (errorBody?.message) message = errorBody.message;
      } catch {
        const errorText = await res.text();
        if (errorText) message = errorText;
      }
      throw new Error(message);
    }

    submittedReviews.value.unshift({
      username: formData.value.username,
      product_id: formData.value.product_id,
      rating: parseInt(formData.value.rating, 10),
      comment: formData.value.comment,
      submitted_at: new Date().toISOString()
    });

    await fetchReviews();

    formData.value = {
      username: "",
      product_id: "",
      rating: "",
      comment: ""
    };

    alert("Review submitted successfully!");
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to submit review");
  }
};

const deleteReview = async (reviewId) => {
  try {
    deletingReviewId.value = reviewId;
    const res = await fetch(`http://localhost:2006/reviews/${reviewId}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      let message = "Failed to delete review";
      try {
        const errorBody = await res.json();
        if (errorBody?.message) message = errorBody.message;
      } catch {
        const errorText = await res.text();
        if (errorText) message = errorText;
      }
      throw new Error(message);
    }

    reviews.value = reviews.value.filter((review) => review.id !== reviewId);
    alert("Review deleted successfully!");
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to delete review");
  } finally {
    deletingReviewId.value = null;
  }
};

const formatDate = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

onMounted(fetchReviews);
</script>

<template>
  <NavBar />

  <div class="review-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Product Reviews</h1>
        <p class="hero-subtitle">See what our customers are saying</p>
      </div>
    </div>

    <div class="review-wrapper">
      <div class="review-grid">
        <form class="review-form" @submit.prevent="submitReview">
          <div class="form-group row-2">
            <div class="form-field">
              <label>Username</label>
              <input v-model="formData.username" type="text" placeholder="e.g. john_doe" required />
            </div>
            <div class="form-field">
              <label>Product ID</label>
              <input v-model="formData.product_id" type="number" min="1" placeholder="e.g. 12" required />
            </div>
          </div>

          <div class="form-group">
            <label>Rating <span class="rating-hint">(1-5)</span></label>
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

          <button type="submit" class="submit-btn">Submit Review</button>
        </form>

        <div class="reviews-list">
          <div v-if="reviews.length === 0" class="empty-state">
            <span class="empty-icon">Reviews</span>
            <p>No reviews yet. Be the first!</p>
          </div>

          <div class="review-card" v-for="review in reviews" :key="review.id">
            <div class="review-rating">
              <span v-for="n in review.rating" :key="n">*</span>
              <span class="rating-num">{{ review.rating }}/5</span>
            </div>
            <div class="review-comment">{{ review.comment }}</div>
            <div class="review-meta">
              <span class="reviewer-id">@{{ review.username }}</span>
              <span class="review-date">{{ formatDate(review.created_at) }}</span>
            </div>
            <button
              type="button"
              class="delete-btn"
              :disabled="deletingReviewId === review.id"
              @click="deleteReview(review.id)"
            >
              {{ deletingReviewId === review.id ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="submittedReviews.length > 0" class="submitted-panel">
        <h2 class="submitted-title">Your Submitted Reviews</h2>
        <div class="submitted-list">
          <div class="submitted-card" v-for="(rev, i) in submittedReviews" :key="i">
            <div class="submitted-header">
              <span class="submitted-user">@{{ rev.username }}</span>
              <span class="submitted-product">Product #{{ rev.product_id }}</span>
            </div>
            <div class="submitted-rating">
              <span v-for="n in rev.rating" :key="n">*</span>
              <span class="rating-num">{{ rev.rating }}/5</span>
            </div>
            <div class="submitted-comment">{{ rev.comment }}</div>
            <div class="submitted-date">{{ formatDate(rev.submitted_at) }}</div>
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
  max-width: 1200px;
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

.rating-hint {
  font-size: 0.8rem;
  color: #555;
  font-weight: 400;
}

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

.empty-icon {
  font-size: 2.5rem;
}

.empty-state p {
  font-size: 0.95rem;
}

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

.delete-btn {
  margin-top: 12px;
  padding: 8px 14px;
  border: 1px solid #ff6b6b;
  background: transparent;
  color: #ff6b6b;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.delete-btn:hover {
  background: rgba(255, 107, 107, 0.12);
}

.delete-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Submitted Reviews Panel */
.submitted-panel {
  margin-top: 50px;
  padding: 30px;
  background-color: #111115;
  border: 1px solid rgba(0, 250, 171, 0.25);
  border-radius: 16px;
}

.submitted-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #00faab;
  margin-bottom: 20px;
}

.submitted-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.submitted-card {
  background-color: #1a1a1f;
  border: 1px solid rgba(0, 250, 171, 0.2);
  border-radius: 12px;
  padding: 16px;
  transition: 0.3s ease;
}

.submitted-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 250, 171, 0.15);
}

.submitted-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.submitted-user {
  font-size: 0.85rem;
  font-weight: 700;
  color: #00faab;
}

.submitted-product {
  font-size: 0.75rem;
  color: #555;
  background-color: #222;
  padding: 2px 8px;
  border-radius: 20px;
}

.submitted-rating {
  color: #00faab;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.submitted-comment {
  font-size: 0.9rem;
  color: #bbb;
  line-height: 1.5;
  margin-bottom: 10px;
}

.submitted-date {
  font-size: 0.75rem;
  color: #555;
  text-align: right;
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

  .submitted-list {
    grid-template-columns: 1fr;
  }
}
</style>
