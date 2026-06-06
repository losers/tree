<template>
  <div class="list-wrapper">

    <!-- ===== ROYAL BANNER ===== -->
    <div class="royal-banner">
      <div class="royal-banner-bg"></div>
      <div class="royal-banner-inner">
        <div class="royal-banner-left">
          <div class="royal-crown-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M2 19h20v2H2v-2zm0-4l4-8 4 4 4-8 4 8 2-4v8H2v-8l2 4z" fill="url(#crownGrad)"/>
              <defs>
                <linearGradient id="crownGrad" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stop-color="#FDE68A"/>
                  <stop offset="100%" stop-color="#D97706"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="royal-banner-text">
            <h4 class="royal-banner-title">Super Families</h4>
            <p class="royal-banner-sub">Families who actively use Bloodline automatically earn this elite Super Family status.</p>
          </div>
        </div>
        <a href="mailto:bloodline.helpline@gmail.com" class="royal-cta-btn">
          <span>✦</span> Learn More
        </a>
      </div>
    </div>

    <!-- ===== LOADER ===== -->
    <div v-if="loading" class="loader-wrap">
      <div class="gold-spinner">
        <div class="gold-spinner-ring"></div>
        <span class="gold-spinner-crown">♛</span>
      </div>
    </div>

    <!-- ===== SUPER FAMILIES GRID ===== -->
    <div v-else class="family-grid">
      <div
        v-for="data in info"
        :key="data.id"
        class="super-card"
        :class="{ 'card-active': curFamily === data._id }"
        @click="showAuth(data.surname, data.title, data.celeb, data._id, data.contact)"
      >
        <!-- Gold shimmer top line -->
        <div class="super-top-line"></div>

        <!-- Hover glow -->
        <div class="card-gold-glow"></div>

        <!-- Corner ornaments -->
        <div class="ornament ornament-tl">❧</div>
        <div class="ornament ornament-br">❧</div>

        <div class="card-content">
          <!-- Title row: lock pill + name + gold verified badge -->
          <div class="title-row">
            <span
              class="lock-pill"
              :class="data.celeb ? 'lock-open' : 'lock-closed'"
            >{{ data.celeb ? '🔓' : '🔒' }}</span>

            <h3 class="family-title">
              {{ data.title }}
              <span class="verified-badge" title="Super Family">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1L14.39 3.56L17.72 2.45L18.94 5.74L22.29 6.8L21.35 10.18L23.51 12.76L21.35 15.34L22.29 18.72L18.94 19.78L17.72 23.07L14.39 21.96L12 24.52L9.61 21.96L6.28 23.07L5.06 19.78L1.71 18.72L2.65 15.34L0.49 12.76L2.65 10.18L1.71 6.8L5.06 5.74L6.28 2.45L9.61 3.56L12 1Z" fill="url(#g2)"/>
                  <path d="M8 12.5L10.5 15L16 9.5" stroke="#1a0e00" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="24" y2="24">
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
            <span class="surname-gold">{{ data.surname }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- ===== LOAD MORE ===== -->
    <div v-if="hasNext && info.length !== 0" class="load-more-wrap">
      <button
        type="button"
        @click="loadMore"
        class="btn-load-more"
        :class="{ 'is-loading': loadingMore }"
      >
        <span v-if="!loadingMore">Load More ↓</span>
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
      // Active family (user's own) — redirect directly, no PIN needed
      if (family_id && family_id === this.curFamily) {
        location.href = `/app/${surname}`;
        return;
      }
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
.list-wrapper { width: 100%; }

/* ===== ROYAL BANNER ===== */
.royal-banner {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 32px;
  border: 1px solid rgba(251, 191, 36, 0.3);
  box-shadow: 0 0 32px rgba(251, 191, 36, 0.06), inset 0 1px 0 rgba(251, 191, 36, 0.12);
}
.royal-banner-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(251,191,36,0.09) 0%, rgba(120,53,15,0.10) 50%, rgba(251,191,36,0.05) 100%);
}
.royal-banner-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 22px;
  flex-wrap: wrap;
}
.royal-banner-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.royal-crown-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.08));
  border: 1px solid rgba(251,191,36,0.35);
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.royal-banner-title {
  margin: 0 0 3px;
  font-size: 15px;
  font-weight: 700;
  background: linear-gradient(90deg, #FBBF24, #FDE68A, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.royal-banner-sub {
  margin: 0;
  color: rgba(255,255,255,0.5);
  font-size: 13px;
}
.royal-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  background: rgba(251,191,36,0.12);
  border: 1px solid rgba(251,191,36,0.4);
  border-radius: 50px;
  color: #FBBF24;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.25s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.royal-cta-btn:hover {
  background: rgba(251,191,36,0.22);
  border-color: rgba(251,191,36,0.75);
  box-shadow: 0 4px 16px rgba(251,191,36,0.18);
  transform: translateY(-1px);
}

/* ===== GOLD LOADER ===== */
.loader-wrap {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}
.gold-spinner {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gold-spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #FBBF24;
  border-right-color: rgba(251,191,36,0.35);
  animation: spin 1.2s linear infinite;
}
.gold-spinner-crown {
  font-size: 20px;
  animation: crownPulse 1.2s ease-in-out infinite;
}
@keyframes crownPulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.55; transform: scale(0.85); }
}
.loader-spinner-small {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(251,191,36,0.25);
  border-top-color: #FBBF24;
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

/* ===== SUPER CARD ===== */
.super-card {
  position: relative;
  background: linear-gradient(145deg, rgba(38,26,5,0.88), rgba(18,12,2,0.93), rgba(38,26,5,0.88));
  border: 1px solid rgba(251,191,36,0.38);
  border-radius: 18px;
  padding: 24px 22px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.25,1,0.5,1),
              box-shadow 0.35s ease,
              border-color 0.3s ease,
              background 0.3s ease;
  box-shadow: 0 4px 18px rgba(251,191,36,0.07), 0 1px 0 rgba(251,191,36,0.14) inset;
}
.super-card:hover {
  transform: translateY(-5px) scale(1.01);
  background: linear-gradient(145deg, rgba(48,33,7,0.92), rgba(24,16,3,0.96), rgba(48,33,7,0.92));
  border-color: rgba(251,191,36,0.75);
  box-shadow: 0 18px 46px rgba(251,191,36,0.15), 0 6px 20px rgba(0,0,0,0.5), 0 1px 0 rgba(251,191,36,0.28) inset;
}
.super-card:hover .card-gold-glow { opacity: 1; }
.super-card:hover .ornament { color: rgba(251,191,36,0.28); }
.super-card:hover .verified-badge {
  filter: drop-shadow(0 0 8px rgba(251,191,36,0.85));
  transform: scale(1.12);
}
.super-card:hover .lock-pill { transform: scale(1.08); }

.card-active {
  border-color: rgba(251,191,36,0.85);
  box-shadow: 0 0 0 2px rgba(251,191,36,0.2), 0 10px 32px rgba(251,191,36,0.14);
}

/* Gold shimmer top line */
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

/* Hover glow */
.card-gold-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(251,191,36,0.12) 0%, transparent 65%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

/* Corner ornaments */
.ornament {
  position: absolute;
  font-size: 14px;
  color: rgba(251,191,36,0.12);
  pointer-events: none;
  user-select: none;
  line-height: 1;
  transition: color 0.35s ease;
}
.ornament-tl { top: 10px; left: 12px; transform: rotate(180deg); }
.ornament-br { bottom: 10px; right: 12px; }

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
  background: rgba(239,68,68,0.12);
  border: 1px solid rgba(239,68,68,0.25);
}
.lock-open {
  background: rgba(34,197,94,0.12);
  border: 1px solid rgba(34,197,94,0.25);
}

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
  text-shadow: 0 1px 6px rgba(251,191,36,0.12);
}

/* ===== VERIFIED BADGE ===== */
.verified-badge {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  filter: drop-shadow(0 0 4px rgba(251,191,36,0.5));
  transition: filter 0.3s ease, transform 0.3s ease;
}

/* ===== SURNAME ===== */
.family-surname {
  font-size: 13px;
  color: rgba(255,255,255,0.35);
  margin: 0;
  padding-left: 40px; /* align under title text */
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
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.3);
  color: #FBBF24;
  padding: 10px 28px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  min-width: 160px;
  font-family: inherit;
}
.btn-load-more:hover:not(.is-loading) {
  background: rgba(251,191,36,0.16);
  border-color: rgba(251,191,36,0.65);
  box-shadow: 0 4px 18px rgba(251,191,36,0.15);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .family-grid { grid-template-columns: 1fr; }
  .royal-banner-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
}
</style>