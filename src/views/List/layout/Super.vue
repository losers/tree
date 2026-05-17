<template>
  <div class="list-wrapper">
    <!-- Info Banner -->
    <div class="info-banner">
      <div class="banner-icon">⚡</div>
      <div class="banner-content">
        <h4 class="banner-title">What are Super Families?</h4>
        <p class="banner-text">Families who donate and support Bloodline become super families.</p>
        <p class="banner-contact">For more info, write to <a href="mailto:hello@bloodline.app" class="banner-link">hello@bloodline.app</a></p>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="loader-wrap">
      <div class="loader-spinner"></div>
    </div>

    <!-- Super Families List -->
    <div v-else class="family-grid">
      <div 
        v-for="data in info" 
        :key="data.id" 
        class="family-card super-family-card"
        :class="{ 'card-active': curFamily === data._id }"
        @click="showAuth(data.surname, data.title, data.celeb, data._id, data.contact)"
      >
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="super-icon">
              <span>⚡</span>
            </div>
            <div class="lock-status" :class="data.celeb ? 'status-unlocked' : 'status-locked'">
              <span class="status-icon">{{ data.celeb ? '🔓' : '🔒' }}</span>
            </div>
          </div>
          
          <h3 class="family-title">
            {{ data.title }}
            <span class="premium-check">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 5.09L19.41 4.59L20.84 8.76L24 12L20.84 15.24L19.41 19.41L15.09 18.91L12 22L8.91 18.91L4.59 19.41L3.16 15.24L0 12L3.16 8.76L4.59 4.59L8.91 5.09L12 2Z" fill="#FBBF24"/>
                <path d="M10 15.5L6.5 12L7.91 10.59L10 12.67L16.09 6.58L17.5 8L10 15.5Z" fill="#1F2937"/>
              </svg>
            </span>
          </h3>
          <p class="family-surname">Surname: <span>{{ data.surname }}</span></p>
          
          <div class="badge-wrap">
            <span class="badge-icon">🏅</span>
            <span>Super Family</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="hasNext && info.length !== 0" class="load-more-wrap">
      <button 
        type="button" 
        @click="loadMore" 
        class="btn-load-more" 
        :class="{ 'is-loading': loadingMore }"
      >
        <span v-if="!loadingMore">Load More Super Families &darr;</span>
        <div v-else class="loader-spinner-small"></div>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ProdData from "@/data.js";

export default {
  name: "SuperFamilies",
  data() {
    return {
      loading: true,
      loadingMore: false,
      nextPage: 0,
      hasNext: true,
      info: [],
      curFamily: null,
    };
  },
  methods: {
    showAuth(surname, title, isCeleb, family_id, contact) {
      this.$parent.showAuth(surname, title, isCeleb, family_id, contact);
    },
    getAllList(page) {
      let url = `${ProdData.getHostURL()}/meta?type=3`;
      if (page) {
        url += `?page=${page}`;
      }
      axios
        .get(url)
        .then((response) => {
          this.info = this.info.concat(response.data.list);
          this.curFamily = response.data.cur_family;
          this.nextPage = response.data.next_page;
          this.hasNext = response.data.has_next;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
          this.loadingMore = false;
        });
    },
    loadMore() {
      this.loadingMore = true;
      this.getAllList(this.nextPage);
    },
  },
  mounted() {
    this.getAllList();
  },
};
</script>

<style scoped>
.list-wrapper {
  width: 100%;
}

.info-banner {
  display: flex;
  gap: 16px;
  background: rgba(138, 79, 247, 0.08);
  border: 1px solid rgba(138, 79, 247, 0.2);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  text-align: left;
}

.banner-icon {
  font-size: 24px;
  background: rgba(138, 79, 247, 0.15);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.banner-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.banner-text {
  margin: 0 0 4px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.banner-contact {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.banner-link {
  color: #a78bfa;
  text-decoration: none;
}

.banner-link:hover {
  text-decoration: underline;
}

.loader-wrap {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(138, 79, 247, 0.2);
  border-top-color: #8a4ff7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loader-spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.family-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.family-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.family-card.super-family-card {
  border: 1px solid rgba(251, 191, 36, 0.4);
  box-shadow: 0 4px 20px rgba(251, 191, 36, 0.08);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.1) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.family-card.super-family-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(251, 191, 36, 0.8);
  box-shadow: 0 12px 30px rgba(251, 191, 36, 0.15);
}

.family-card:hover .card-glow {
  opacity: 1;
}

.card-active {
  background: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.5);
  box-shadow: 0 0 0 1px rgba(251, 191, 36, 0.5) inset;
}

.card-content {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.super-icon {
  width: 44px;
  height: 44px;
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.lock-status {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.status-unlocked {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-locked {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.family-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}

.premium-check {
  display: flex;
  align-items: center;
  justify-content: center;
}

.family-surname {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 24px;
  flex: 1;
}

.badge-wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.3);
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
  color: #fbbf24;
  width: fit-content;
}

.badge-icon {
  font-size: 14px;
}

.load-more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.btn-load-more {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
}

.btn-load-more:hover:not(.is-loading) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}
</style>