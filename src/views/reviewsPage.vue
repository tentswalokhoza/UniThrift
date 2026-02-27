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
      const raw = await res.text();
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.message) {
            message = parsed.message;
          } else {
            message = raw;
          }
        } catch {
          message = raw;
        }
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
      const raw = await res.text();
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.message) {
            message = parsed.message;
          } else {
            message = raw;
          }
        } catch {
          message = raw;
        }
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
        <p class="eyebrow">Community Feedback</p>
        <h1 class="hero-title">Product Reviews</h1>
        <p class="hero-subtitle">See what our customers are saying</p>
      </div>
    </div>

    <div class="review-wrapper">
      <div class="review-grid">
        <form class="review-form" @submit.prevent="submitReview">
          <div class="form-group row-2">
            <div class="form-field">
              <label>Registered Name</label>
              <input v-model="formData.username" type="text" placeholder="e.g. Michael Jackson" required />
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
  color: #d9d9d9;
  min-height: 100vh;
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
  margin: 10px 0 8px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(4, 19, 17, 0.8);
}

.review-wrapper {
  max-width: 1220px;
  margin: 0 auto;
  padding: 60px 20px;
}

.review-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(160deg, #1b1f26, #14161c);
  border: 1px solid rgba(0, 250, 171, 0.16);
  border-radius: 16px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.34);
  padding: 24px;
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
  padding: 11px 14px;
  background-color: #11141a;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  color: #e3e8ef;
  font-size: 1rem;
  transition: 0.3s ease;
  outline: none;
  resize: vertical;
}

.review-form input:focus,
.review-form textarea:focus {
  border-color: #00faab;
  box-shadow: 0 0 0 3px rgba(0, 250, 171, 0.16);
}

.rating-hint {
  font-size: 0.8rem;
  color: #555;
  font-weight: 400;
}

.submit-btn {
  padding: 11px 18px;
  background: linear-gradient(135deg, #00faab 0%, #00c896 100%);
  color: #071916;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 250, 171, 0.28);
}

.empty-state {
  text-align: center;
  padding: 56px 20px;
  color: #8d97a3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 1.1rem;
  color: #00faab;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.empty-state p {
  font-size: 0.95rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  background: linear-gradient(160deg, #1b1f26, #151821);
  padding: 20px;
  border-radius: 14px;
  border: 1px solid rgba(0, 250, 171, 0.16);
  transition: 0.3s ease;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.review-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 26px rgba(0, 0, 0, 0.38);
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
  color: #8d97a3;
  font-weight: 400;
}

.review-comment {
  margin-bottom: 12px;
  color: #d4dae2;
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
  opacity: 0.75;
  font-weight: 600;
}

.review-date {
  font-size: 0.8rem;
  color: #8d97a3;
}

.delete-btn {
  margin-top: 12px;
  padding: 8px 14px;
  border: 1px solid rgba(255, 107, 107, 0.55);
  background: rgba(122, 20, 20, 0.18);
  color: #ffd4d4;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.delete-btn:hover {
  background: rgba(122, 20, 20, 0.34);
}

.delete-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.submitted-panel {
  margin-top: 50px;
  padding: 28px;
  background: linear-gradient(160deg, #1b1f26, #14161c);
  border: 1px solid rgba(0, 250, 171, 0.22);
  border-radius: 16px;
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.34);
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
  background: #141820;
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
  color: #c8d2dd;
  background-color: #2a303a;
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
  color: #ced6df;
  line-height: 1.5;
  margin-bottom: 10px;
}

.submitted-date {
  font-size: 0.75rem;
  color: #8d97a3;
  text-align: right;
}

@media (max-width: 768px) {
  .review-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-section {
    margin: 14px 12px 0;
    padding: 28px 18px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .row-2 {
    grid-template-columns: 1fr;
  }

  .submitted-list {
    grid-template-columns: 1fr;
  }
}
</style>
