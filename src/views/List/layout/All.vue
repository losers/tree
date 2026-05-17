<template>
  <div class="list-wrapper">
    <!-- Loader -->
    <div v-if="loading" class="loader-wrap">
      <div class="loader-spinner"></div>
    </div>

    <!-- All Families List -->
    <div v-else class="family-grid">
      <div 
        v-for="data in info" 
        :key="data.id" 
        class="family-card"
        :class="{ 'card-active': curFamily === data._id }"
        @click="showAuth(data.surname, data.title, data.celeb, data._id, data.contact)"
      >
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="shield-icon">
              <span v-if="data.b_coins && data.b_coins > 0">👑</span>
              <span v-else>🛡️</span>
            </div>
            
            <div class="lock-status" :class="data.celeb ? 'status-unlocked' : 'status-locked'">
              <span class="status-icon">{{ data.celeb ? '🔓' : '🔒' }}</span>
            </div>
          </div>
          
          <h3 class="family-title">{{ data.title }}</h3>
          <p class="family-surname">Surname: <span>{{ data.surname }}</span></p>
          
          <div class="member-count">
            <span class="member-icon">👥</span>
            <span>Members</span>
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
        <span v-if="!loadingMore">Load More Families &darr;</span>
        <div v-else class="loader-spinner-small"></div>
      </button>
    </div>

    <!-- Auth Modal Component would be rendered by parent -->
  </div>
</template>

<script>
import axios from "axios";
import ProdData from "@/data.js";

export default {
  name: "AllFamiliesList",
  props: {
    searchOverride: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      info: [],
      curFamily: {},
      totalFamilies: "",
      nextPage: {},
      hasNext: {},
      loading: true,
      loadingMore: false,
    };
  },
  watch: {
    searchOverride(newVal) {
      this.search(newVal);
    }
  },
  methods: {
    getAllList(page) {
      let url = `${ProdData.getHostURL()}/meta`;
      if (page) {
        url += `?page=${page}`;
      }
      axios
        .get(url)
        .then((response) => {
          this.info = this.info.concat(response.data.list);
          this.curFamily = response.data.cur_family;
          this.totalFamilies = response.data.total_families;
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
    search(text) {
      if (text) {
        this.loading = true;
        axios
          .get(ProdData.getHostURL() + "/meta/search?text=" + text)
          .then((response) => {
            this.info = response.data.list;
            this.curFamily = response.data.cur_family;
            this.hasNext = false; // Usually search results don't paginate the same way
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.info = [];
        this.loading = true;
        this.getAllList();
      }
    },
    showAuth(surname, title, isCeleb, family_id, contact) {
      this.$parent.showAuth(surname, title, isCeleb, family_id, contact);
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

.card-active {
  background: rgba(79, 142, 247, 0.08);
  border-color: rgba(79, 142, 247, 0.5);
  box-shadow: 0 0 0 1px rgba(79, 142, 247, 0.5) inset;
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

.shield-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
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
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.family-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}

.family-surname {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 24px;
  flex: 1;
}

.family-surname span {
  color: #7eb3ff;
  font-weight: 500;
}

.member-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  width: fit-content;
}

.member-icon {
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

@media (max-width: 768px) {
  .family-grid {
    grid-template-columns: 1fr;
  }
}
</style>