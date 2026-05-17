<template>
  <div class="list-wrapper">
    <!-- Info Banner -->
    <div class="info-banner">
      <div class="banner-icon">💡</div>
      <div class="banner-content">
        <h4 class="banner-title">How to create a Demo Family?</h4>
        <ol class="banner-list">
          <li>Create a normal family tree.</li>
          <li>Email surname to <a href="mailto:hello@bloodline.app" class="banner-link">hello@bloodline.app</a> along with your details.</li>
        </ol>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="loader-wrap">
      <div class="loader-spinner"></div>
    </div>

    <!-- Demo Families List -->
    <div v-else class="family-grid">
      <div 
        v-for="data in info" 
        :key="data.id" 
        class="family-card"
        @click="goto(data.surname)"
      >
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="demo-icon">
              <span>🗂️</span>
            </div>
            <div class="lock-status status-unlocked">
              <span class="status-icon">🔓</span>
            </div>
          </div>
          
          <h3 class="family-title">{{ data.title }}</h3>
          
          <div v-if="data.contras" class="contributors-wrap">
            <span class="contri-label">Contributors:</span>
            <div class="contri-list">
              <span v-for="(contra, i) in data.contras" :key="i" class="contri-item">
                <a :href="contra.link" @click.stop target="_blank">{{ contra.name }}</a><span v-if="i < data.contras.length - 1">,</span>
              </span>
            </div>
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
        <span v-if="!loadingMore">Load More Demo Families &darr;</span>
        <div v-else class="loader-spinner-small"></div>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ProdData from "@/data.js";

export default {
  name: "DemoFamilies",
  data() {
    return {
      loading: true,
      loadingMore: false,
      nextPage: 0,
      hasNext: true,
      info: [],
    };
  },
  methods: {
    goto(surname) {
      location.href = `/app/${surname}`;
    },
    getAllList(page) {
      let url = `${ProdData.getHostURL()}/meta?type=2`;
      if (page) {
        url += `?page=${page}`;
      }
      axios
        .get(url)
        .then((response) => {
          this.info = this.info.concat(response.data.list);
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
  background: rgba(79, 142, 247, 0.08);
  border: 1px solid rgba(79, 142, 247, 0.2);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  text-align: left;
}

.banner-icon {
  font-size: 24px;
  background: rgba(79, 142, 247, 0.15);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.banner-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.banner-list {
  margin: 0;
  padding-left: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.6;
}

.banner-link {
  color: #7eb3ff;
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
  border: 3px solid rgba(79, 142, 247, 0.2);
  border-top-color: #4f8ef7;
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

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(circle at 50% 0%, rgba(79, 142, 247, 0.15) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.family-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(79, 142, 247, 0.3);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.family-card:hover .card-glow {
  opacity: 1;
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

.demo-icon {
  width: 44px;
  height: 44px;
  background: rgba(79, 142, 247, 0.1);
  border: 1px solid rgba(79, 142, 247, 0.2);
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

.family-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 24px;
  letter-spacing: -0.5px;
  flex: 1;
}

.contributors-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 12px;
}

.contri-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contri-list {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.contri-item a {
  color: #7eb3ff;
  text-decoration: none;
}

.contri-item a:hover {
  text-decoration: underline;
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