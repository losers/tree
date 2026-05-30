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
        :class="{
          'card-active': curFamily === data._id,
          'family-card--super': data.b_coins && data.b_coins > 0
        }"
        @click="showAuth(data.surname, data.title, data.celeb, data._id, data.contact)"
      >
        <!-- Gold shimmer line (super only) -->
        <div v-if="data.b_coins && data.b_coins > 0" class="super-top-line"></div>

        <!-- Hover glow layer -->
        <div class="card-glow"></div>

        <div class="card-content">
          <!-- Title row: lock icon + name + verified badge -->
          <div class="title-row">
            <span
              class="lock-pill"
              :class="data.celeb ? 'lock-open' : 'lock-closed'"
            >{{ data.celeb ? '🔓' : '🔒' }}</span>

            <h3 class="family-title">
              {{ data.title }}
              <span
                v-if="data.b_coins && data.b_coins > 0"
                class="verified-badge"
                title="Super Family"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1L14.39 3.56L17.72 2.45L18.94 5.74L22.29 6.8L21.35 10.18L23.51 12.76L21.35 15.34L22.29 18.72L18.94 19.78L17.72 23.07L14.39 21.96L12 24.52L9.61 21.96L6.28 23.07L5.06 19.78L1.71 18.72L2.65 15.34L0.49 12.76L2.65 10.18L1.71 6.8L5.06 5.74L6.28 2.45L9.61 3.56L12 1Z" fill="url(#g1)"/>
                  <path d="M8 12.5L10.5 15L16 9.5" stroke="#1a0e00" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="24" y2="24">
                      <stop offset="0%" stop-color="#FDE68A"/>
                      <stop offset="50%" stop-color="#FBBF24"/>
                      <stop offset="100%" stop-color="#D97706"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h3>
          </div>

          <!-- Surname -->
          <p class="family-surname">
            <span :class="data.b_coins && data.b_coins > 0 ? 'surname-gold' : 'surname-blue'">{{ data.surname }}</span>
          </p>
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
        <span v-if="!loadingMore">Load More &darr;</span>
        <div v-else class="loader-spinner-small"></div>
      </button>
    </div>
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
          this.$emit('total-families-loaded', this.totalFamilies);
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
            this.hasNext = false;
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
      // Active family (user's own) — redirect directly, no PIN needed
      if (family_id && family_id === this.curFamily) {
        location.href = `/app/${surname}`;
        return;
      }
      this.$parent.showAuth(surname, title, isCeleb, family_id, contact);
    },
  },
  mounted() {
    this.getAllList();
  },
};
</script>

<style scoped>
.list-wrapper { width: 100%; }

/* ===== LOADER ===== */
.loader-wrap {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}
.loader-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(79, 142, 247, 0.15);
  border-top-color: #4f8ef7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
.loader-spinner-small {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.15);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== GRID ===== */
.family-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* ===== BASE CARD ===== */
.family-card {
  position: relative;
  background: rgba(255,255,255, 0.03);
  border: 1px solid rgba(255,255,255, 0.08);
  border-radius: 18px;
  padding: 24px 22px;
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1),
              box-shadow 0.35s ease,
              border-color 0.3s ease,
              background 0.3s ease;
  overflow: hidden;
}

.family-card:hover {
  transform: translateY(-4px);
  background: rgba(255,255,255, 0.05);
  border-color: rgba(79, 142, 247, 0.35);
  box-shadow: 0 14px 36px rgba(0,0,0, 0.45);
}

.family-card:hover .card-glow { opacity: 1; }

/* Active (current family) */
.card-active:not(.family-card--super) {
  border-color: rgba(79, 142, 247, 0.55);
  box-shadow: 0 0 0 1px rgba(79, 142, 247, 0.4) inset;
}

/* Hover glow layer */
.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(79,142,247,0.12) 0%, transparent 65%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

/* ===== SUPER CARD ===== */
.family-card--super {
  background: linear-gradient(145deg, rgba(38,26,5,0.88), rgba(18,12,2,0.92), rgba(38,26,5,0.88));
  border-color: rgba(251,191,36, 0.38);
  box-shadow: 0 4px 20px rgba(251,191,36, 0.07), 0 1px 0 rgba(251,191,36,0.16) inset;
}
.family-card--super .card-glow {
  background: radial-gradient(circle at 50% 0%, rgba(251,191,36,0.13) 0%, transparent 65%);
}
.family-card--super:hover {
  background: linear-gradient(145deg, rgba(48,33,7,0.92), rgba(24,16,3,0.96), rgba(48,33,7,0.92));
  border-color: rgba(251,191,36, 0.75);
  box-shadow: 0 18px 48px rgba(251,191,36, 0.16), 0 6px 20px rgba(0,0,0,0.5), 0 1px 0 rgba(251,191,36,0.3) inset;
  transform: translateY(-5px);
}
.family-card--super.card-active {
  border-color: rgba(251,191,36, 0.8);
  box-shadow: 0 0 0 2px rgba(251,191,36,0.2), 0 10px 32px rgba(251,191,36,0.14);
}

/* Gold shimmer top line (super) */
.super-top-line {
  position: absolute;
  top: 0; left: 12px; right: 12px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FBBF24, #FDE68A, #FBBF24, transparent);
  border-radius: 0 0 2px 2px;
  animation: lineGlow 2.5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes lineGlow {
  0%,100% { opacity: 0.45; }
  50%      { opacity: 1; }
}

/* ===== CARD CONTENT ===== */
.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ===== TITLE ROW ===== */
.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ===== LOCK PILL ===== */
.lock-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  font-size: 13px;
  flex-shrink: 0;
  transition: transform 0.25s ease;
}
.lock-closed {
  background: rgba(239,68,68, 0.12);
  border: 1px solid rgba(239,68,68, 0.25);
}
.lock-open {
  background: rgba(34,197,94, 0.12);
  border: 1px solid rgba(34,197,94, 0.25);
}
.family-card:hover .lock-pill { transform: scale(1.08); }

/* ===== FAMILY TITLE ===== */
.family-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.3px;
  line-height: 1.25;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

/* ===== VERIFIED BADGE ===== */
.verified-badge {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  filter: drop-shadow(0 0 4px rgba(251,191,36,0.5));
  transition: filter 0.3s ease, transform 0.3s ease;
}
.family-card--super:hover .verified-badge {
  filter: drop-shadow(0 0 8px rgba(251,191,36,0.85));
  transform: scale(1.12);
}

/* ===== SURNAME ===== */
.family-surname {
  font-size: 13px;
  color: rgba(255,255,255, 0.38);
  margin: 0;
  padding-left: 40px; /* align under title, past lock pill */
}
.surname-blue {
  color: #6ba3f5;
  font-weight: 500;
}
.surname-gold {
  background: linear-gradient(90deg, #FBBF24, #FDE68A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

/* ===== LOAD MORE ===== */
.load-more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 36px;
}
.btn-load-more {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.7);
  padding: 10px 28px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  min-width: 160px;
  font-family: inherit;
}
.btn-load-more:hover:not(.is-loading) {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.25);
  color: #fff;
}

@media (max-width: 768px) {
  .family-grid { grid-template-columns: 1fr; }
}
</style>