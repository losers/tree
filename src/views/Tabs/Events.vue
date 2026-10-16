<template>
  <div class="events-container" :class="isDark ? 'theme-dark' : 'theme-light'">
    <!-- Simple Top Bar -->
    <div class="top-bar">
      <div class="title-area">
        <h2 class="title font-weight-bold">Events</h2>
        <span class="date-text">{{ date.display }}</span>
      </div>

      <!-- Simple Dropdown on the Top Right -->
      <div class="dropdown-area">
        <select v-model="selectedFilter" class="filter-select">
          <option value="today">Today</option>
          <option value="current">Current Month ({{ currentMonth.name }})</option>
          <option value="past">Last Month ({{ lastMonth.name }})</option>
          <option value="future">Next Month ({{ nextMonth.name }})</option>
          <option value="all">All 3 Months</option>
        </select>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div class="loading-box" v-if="loading">
      <div class="spinner-border spinner-border-sm"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredEvents.length === 0">
      <center class="glass-card mt-5 p-5 empty-box">
        <img
          src="@/assets/events/empty_events.png"
          height="130"
          class="empty-img"
          alt="No Events"
        />
        <h4 class="mt-4 font-weight-bold empty-title">No Events Found</h4>
        <p class="empty-subtitle">
          There are no events recorded for {{ filterLabel }}.
        </p>
      </center>
    </div>

    <!-- Direct Grid of Event Cards -->
    <div class="row events-grid-row mt-4" v-else>
      <div
        class="col-12 col-sm-6 col-lg-4 event-col"
        v-for="(event, index) in filteredEvents"
        :key="event._id ? (event._id + '-' + index) : index"
        :style="{ '--i': index }"
      >
        <div
          class="event-card-modern"
          :class="[getCardClass(event), { 'card-is-today': event.is_today }]"
        >
          <!-- Top Illustrated Event Scene Banner (Relevant Visual Images & Icons) -->
          <div class="card-scene-banner" :class="'scene-' + getCategorySlug(event)">
            <!-- 1. BIRTHDAY SCENE: Floating Balloons, Streamers & Party Twinkles -->
            <svg class="banner-svg" viewBox="0 0 360 115" preserveAspectRatio="none" v-if="event.type == 1">
              <defs>
                <linearGradient id="bdayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#0284c7" stop-opacity="0.38" />
                  <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.22" />
                  <stop offset="100%" stop-color="#ec4899" stop-opacity="0.32" />
                </linearGradient>
                <radialGradient id="balloon1" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stop-color="#67e8f9" />
                  <stop offset="100%" stop-color="#0284c7" />
                </radialGradient>
                <radialGradient id="balloon2" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stop-color="#f472b6" />
                  <stop offset="100%" stop-color="#db2777" />
                </radialGradient>
                <radialGradient id="balloon3" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stop-color="#fde047" />
                  <stop offset="100%" stop-color="#d97706" />
                </radialGradient>
              </defs>
              <rect width="360" height="115" fill="url(#bdayGrad)" />
              <path d="M0,90 Q90,115 180,95 T360,100 L360,115 L0,115 Z" class="svg-wave-bottom" />
              
              <!-- Floating Balloons -->
              <g class="anim-balloon-1">
                <ellipse cx="44" cy="40" rx="14" ry="17" fill="url(#balloon1)" />
                <polygon points="44,57 41,61 47,61" fill="#0284c7" />
                <path d="M44,61 Q48,78 42,95" stroke="rgba(255,255,255,0.35)" fill="none" stroke-width="1.2" />
              </g>
              <g class="anim-balloon-2">
                <ellipse cx="68" cy="32" rx="12" ry="15" fill="url(#balloon2)" />
                <polygon points="68,47 65,51 71,51" fill="#db2777" />
                <path d="M68,51 Q63,68 70,92" stroke="rgba(255,255,255,0.35)" fill="none" stroke-width="1.2" />
              </g>
              <g class="anim-balloon-3">
                <ellipse cx="28" cy="46" rx="10" ry="13" fill="url(#balloon3)" />
                <polygon points="28,59 25,63 31,63" fill="#d97706" />
                <path d="M28,63 Q33,76 27,95" stroke="rgba(255,255,255,0.35)" fill="none" stroke-width="1.2" />
              </g>

              <!-- Confetti Ribbons & Twinkles -->
              <g class="anim-confetti">
                <path d="M315,15 Q330,32 318,48 T328,78" stroke="#f472b6" fill="none" stroke-width="2.5" stroke-linecap="round" opacity="0.8" />
                <path d="M338,12 Q322,28 332,44 T324,72" stroke="#38bdf8" fill="none" stroke-width="2" stroke-linecap="round" opacity="0.8" />
                <circle cx="285" cy="22" r="3" fill="#fbbf24" class="anim-sparkle-1" />
                <circle cx="342" cy="42" r="2.5" fill="#38bdf8" class="anim-sparkle-2" />
                <circle cx="295" cy="62" r="3" fill="#f472b6" class="anim-sparkle-3" />
                <polygon points="120,24 122,29 127,29 123,32 125,37 120,34 115,37 117,32 113,29 118,29" fill="#fef08a" opacity="0.8" class="anim-sparkle-1" />
                <polygon points="245,28 247,33 252,33 248,36 250,41 245,38 240,41 242,36 238,33 243,33" fill="#38bdf8" opacity="0.75" class="anim-sparkle-2" />
              </g>
            </svg>

            <!-- 2. MEMORIAL SCENE: Glowing Candles & Ethereal Peaceful Aura -->
            <svg class="banner-svg" viewBox="0 0 360 115" preserveAspectRatio="none" v-else-if="event.type == 2">
              <defs>
                <linearGradient id="memorialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#4c1d95" stop-opacity="0.5" />
                  <stop offset="50%" stop-color="#7c3aed" stop-opacity="0.3" />
                  <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.5" />
                </linearGradient>
                <radialGradient id="candleAura" cx="50%" cy="40%" r="55%">
                  <stop offset="0%" stop-color="#fef08a" stop-opacity="0.95" />
                  <stop offset="45%" stop-color="#f59e0b" stop-opacity="0.5" />
                  <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
                </radialGradient>
                <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stop-color="#ef4444" />
                  <stop offset="50%" stop-color="#f59e0b" />
                  <stop offset="100%" stop-color="#fef08a" />
                </linearGradient>
              </defs>
              <rect width="360" height="115" fill="url(#memorialGrad)" />
              <path d="M0,90 Q90,115 180,95 T360,100 L360,115 L0,115 Z" class="svg-wave-bottom" />

              <!-- Left Candle -->
              <g class="anim-candle-1">
                <circle cx="48" cy="40" r="22" fill="url(#candleAura)" class="anim-flame-aura" />
                <rect x="42" y="55" width="12" height="38" rx="3" fill="#e2e8f0" opacity="0.9" />
                <line x1="48" y1="55" x2="48" y2="49" stroke="#475569" stroke-width="1.5" />
                <path d="M48,34 Q53,44 48,49 Q43,44 48,34 Z" fill="url(#flameGrad)" class="anim-flame" />
              </g>

              <!-- Right Candle -->
              <g class="anim-candle-2">
                <circle cx="312" cy="42" r="20" fill="url(#candleAura)" class="anim-flame-aura" />
                <rect x="306" y="58" width="12" height="35" rx="3" fill="#e2e8f0" opacity="0.85" />
                <line x1="312" y1="58" x2="312" y2="52" stroke="#475569" stroke-width="1.5" />
                <path d="M312,38 Q317,47 312,52 Q307,47 312,38 Z" fill="url(#flameGrad)" class="anim-flame-delay" />
              </g>

              <!-- Ethereal Lotus Motif & Peace Stars -->
              <g class="anim-peace-stars">
                <circle cx="100" cy="30" r="2" fill="#f8fafc" opacity="0.8" class="anim-sparkle-1" />
                <circle cx="260" cy="26" r="2.2" fill="#f8fafc" opacity="0.8" class="anim-sparkle-2" />
                <circle cx="140" cy="52" r="1.5" fill="#c084fc" opacity="0.7" class="anim-sparkle-3" />
                <path d="M180,26 C174,18 170,32 180,40 C190,32 186,18 180,26 Z" fill="rgba(192, 132, 252, 0.35)" stroke="rgba(192, 132, 252, 0.7)" stroke-width="1" class="anim-flame" />
              </g>
            </svg>

            <!-- 3. MILESTONE SCENE: Golden Laurels & Constellations -->
            <svg class="banner-svg" viewBox="0 0 360 115" preserveAspectRatio="none" v-else>
              <defs>
                <linearGradient id="milestoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#b45309" stop-opacity="0.38" />
                  <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.32" />
                </linearGradient>
                <radialGradient id="starBurst" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9" />
                  <stop offset="100%" stop-color="#fbbf24" stop-opacity="0" />
                </radialGradient>
              </defs>
              <rect width="360" height="115" fill="url(#milestoneGrad)" />
              <path d="M0,90 Q90,115 180,95 T360,100 L360,115 L0,115 Z" class="svg-wave-bottom" />

              <!-- Left Star Cluster -->
              <g class="anim-milestone-left">
                <circle cx="46" cy="40" r="20" fill="url(#starBurst)" class="anim-flame-aura" />
                <polygon points="46,26 49,35 58,35 51,41 54,50 46,44 38,50 41,41 34,35 43,35" fill="#fbbf24" />
                <circle cx="22" cy="55" r="2.5" fill="#fde68a" class="anim-sparkle-1" />
              </g>

              <!-- Right Shooting Star -->
              <g class="anim-milestone-right">
                <circle cx="314" cy="38" r="18" fill="url(#starBurst)" class="anim-flame-aura" />
                <polygon points="314,26 317,34 325,34 319,39 321,47 314,42 307,47 309,39 303,34 311,34" fill="#fbbf24" />
                <path d="M338,20 L298,52" stroke="rgba(251, 191, 36, 0.45)" stroke-width="1.5" stroke-dasharray="2 3" />
                <circle cx="338" cy="20" r="2.5" fill="#fef08a" class="anim-sparkle-2" />
              </g>
            </svg>

            <!-- Floating Top Badges (Category & Relative Date) -->
            <div class="card-header-bar">
              <div class="category-badge" :class="'cat-' + getCategorySlug(event)">
                <i :class="getCategoryIcon(event.type)"></i>
                <span>{{ getCategoryTitle(event.type) }}</span>
              </div>

              <div class="date-badge-wrap">
                <span class="badge-pill-today" v-if="event.is_today">
                  <span class="pulse-beacon"></span> TODAY 🎉
                </span>
                <span class="badge-pill-relative" :class="{ 'is-upcoming': isUpcoming(event) }" v-else>
                  <i class="icofont-wall-clock mr-1" v-if="isUpcoming(event)"></i>
                  {{ getRelativeDays(event) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card Body Content -->
          <div class="card-main-content">
            <!-- Modern Avatar with Glowing Halo & Category Glyph -->
            <div
              class="avatar-container"
              @click="openMember(event)"
              title="Click to view profile"
            >
              <div class="avatar-ring">
                <img
                  :src="'data:image/png;base64, ' + store.state.images[event._id]"
                  v-if="store.state.images && store.state.images[event._id]"
                  :alt="event.name"
                />
                <img src="@/assets/dp.png" v-else alt="Member" />
              </div>

              <!-- Animated Micro-Glyph Badge -->
              <div class="avatar-glyph" :class="'glyph-' + getCategorySlug(event)">
                <i :class="getCategoryGlyph(event.type)"></i>
              </div>
            </div>

            <!-- Person Name -->
            <h4
              class="member-name font-weight-bold"
              :title="event.name"
              @click="openMember(event)"
            >
              {{ event.name }}
            </h4>

            <!-- Category Specific Theme Tag -->
            <div class="event-theme-tag" :class="'tag-' + getCategorySlug(event)">
              <i class="icofont-birthday-cake mr-1" v-if="event.type == 1"></i>
              <i class="icofont-candle mr-1" v-else-if="event.type == 2"></i>
              <i class="icofont-badge mr-1" v-else></i>
              <span>{{ getThemeTagText(event.type) }}</span>
            </div>

            <!-- Category Specific Highlight Content -->
            <!-- 1. BIRTHDAY -->
            <div class="event-highlight-box" v-if="event.type == 1">
              <div class="anniversary-pill anniv-bday">
                <i class="icofont-gift mr-1"></i>
                <span class="anniv-number">
                  {{ getAnniversaryNumber(event.dob || event.date) }}
                </span>
                <span class="anniv-label">Birth Anniversary</span>
              </div>
              <div class="event-date-subtext">
                <i class="icofont-calendar mr-1 text-primary"></i>
                Born on {{ formatEventDateFull(event) }}
              </div>
            </div>

            <!-- 2. MEMORIAL -->
            <div class="event-highlight-box" v-else-if="event.type == 2">
              <div class="anniversary-pill anniv-memorial">
                <i class="icofont-candle mr-1"></i>
                <span class="anniv-number">
                  {{ getAnniversaryNumber(event.died_on || event.date) }}
                </span>
                <span class="anniv-label">Memorial Remembrance</span>
              </div>
              <div class="event-date-subtext">
                <i class="icofont-clock-time mr-1 text-purple"></i>
                Departed on {{ formatEventDateFull(event) }}
              </div>
            </div>

            <!-- 3. MILESTONE / TIMELINE -->
            <div class="event-highlight-box milestone-box" v-else>
              <div class="milestone-headline font-weight-bold" :title="event.title">
                <i class="icofont-star-alt-1 mr-1 text-warning"></i>
                {{ event.title }}
              </div>
              <p class="milestone-snippet" v-if="event.content" :title="event.content">
                {{ event.content }}
              </p>
              <div class="event-date-subtext">
                <i class="icofont-badge mr-1 text-warning"></i>
                Recorded on {{ formatEventDateFull(event) }}
              </div>
            </div>

            <!-- Card Bottom Actions -->
            <div class="card-actions-row">
              <button
                class="btn-action-view"
                @click="openMember(event)"
                title="View full person profile"
              >
                <i class="icofont-user-alt-4 mr-1"></i>
                <span>View Profile</span>
              </button>

              <router-link
                v-if="event.type == 3"
                :to="{
                  name: 'PersonTimeline',
                  params: { id: $route.params.id, member: event._id },
                }"
                class="btn-action-timeline ml-2"
                title="View in Timeline"
              >
                <i class="icofont-sand-clock"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Person Profile View Drawer (on same page) -->
    <MemberData
      v-if="selectedMemberId"
      :key="selectedMemberId"
      :member-id="selectedMemberId"
      @close="selectedMemberId = null"
    />
  </div>
</template>

<script>
import ProdData from "@/data.js";
import axios from "axios";
import moment from "moment";
import { getNormalDisplayDate, getAPIFormat } from "@/util/helper";
import Store from "@/store/index";
import MemberData from "@/components/MemberData/MemberData.vue";

export default {
  name: "Events",
  components: {
    MemberData
  },
  data() {
    return {
      date: {
        display: getNormalDisplayDate(),
        api: getAPIFormat()
      },
      loading: true,
      store: {},
      selectedMemberId: null,
      events: [],
      selectedFilter: "today", // Default: Today
      lastMonth: this.getMonthMeta(-1),
      currentMonth: this.getMonthMeta(0),
      nextMonth: this.getMonthMeta(1)
    };
  },
  filters: {
    anivCalc(value) {
      if (!value) return 1;
      let eventYear = moment(value).year();
      let currentYear = moment().year();
      let diff = currentYear - eventYear;
      return diff > 0 ? diff : 1;
    }
  },
  computed: {
    isDark() {
      return (Store.state.theme || "dark") === "dark";
    },
    filterLabel() {
      if (this.selectedFilter === "today") return "today";
      if (this.selectedFilter === "current") return this.currentMonth.name;
      if (this.selectedFilter === "past") return this.lastMonth.name;
      if (this.selectedFilter === "future") return this.nextMonth.name;
      return "these months";
    },
    filteredEvents() {
      let list = [];
      if (this.selectedFilter === "today") {
        list = this.events.filter(e => e.is_today);
      } else if (this.selectedFilter === "current") {
        list = this.events.filter(e => e.period === "current");
      } else if (this.selectedFilter === "past") {
        list = this.events.filter(e => e.period === "past");
      } else if (this.selectedFilter === "future") {
        list = this.events.filter(e => e.period === "future");
      } else {
        // 'all'
        list = [...this.events];
      }

      // Sort: Today's events first, then chronological by day
      return list.sort((a, b) => {
        if (a.is_today && !b.is_today) return -1;
        if (!a.is_today && b.is_today) return 1;
        return (a.event_day || 0) - (b.event_day || 0);
      });
    }
  },
  methods: {
    getMonthMeta(offset) {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() + offset);
      return {
        number: d.getMonth() + 1,
        name: monthNames[d.getMonth()],
        year: d.getFullYear()
      };
    },

    formatDateChip(event) {
      const shortMonths = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const m = event.event_month ? shortMonths[event.event_month - 1] : "";
      const d = event.event_day || "";
      const suffix = this.getOrdinal(d);
      return `${m} ${d}${suffix}`;
    },

    getOrdinal(n) {
      if (!n) return "th";
      let s = ["th", "st", "nd", "rd"];
      let v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0] || "th";
    },

    openMember(event) {
      if (!event || !event._id) return;
      this.selectedMemberId = event._id;
    },

    getCardClass(event) {
      if (event.type === 1) return "card-type-bday";
      if (event.type === 2) return "card-type-memorial";
      return "card-type-milestone";
    },

    getCategorySlug(event) {
      if (event.type === 1) return "bday";
      if (event.type === 2) return "memorial";
      return "milestone";
    },

    getCategoryTitle(type) {
      if (type === 1) return "Birthday";
      if (type === 2) return "Memorial";
      return "Milestone";
    },

    getCategoryIcon(type) {
      if (type === 1) return "icofont-birthday-cake";
      if (type === 2) return "icofont-candle";
      return "icofont-badge";
    },

    getCategoryGlyph(type) {
      if (type === 1) return "icofont-gift";
      if (type === 2) return "icofont-candle";
      return "icofont-star-alt-1";
    },

    getThemeTagText(type) {
      if (type === 1) return "Birthday Celebration";
      if (type === 2) return "In Loving Memory";
      return "Family Milestone";
    },

    getAnniversaryNumber(dateStr) {
      if (!dateStr) return "1st";
      const eventYear = moment(dateStr).year();
      const currentYear = moment().year();
      const diff = currentYear - eventYear;
      const num = diff > 0 ? diff : 1;
      return `${num}${this.getOrdinal(num)}`;
    },

    formatEventDateFull(event) {
      const shortMonths = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const m = event.event_month ? shortMonths[event.event_month - 1] : "";
      const d = event.event_day || "";
      const suffix = this.getOrdinal(d);

      const dateStr = event.dob || event.died_on || event.date;
      let year = "";
      if (dateStr && moment(dateStr).isValid()) {
        year = moment(dateStr).year();
      }

      if (d && m && year) return `${d}${suffix} ${m} ${year}`;
      if (d && m) return `${d}${suffix} ${m}`;
      return `${m} ${year}`.trim();
    },

    getRelativeDays(event) {
      if (event.is_today) return "Today";
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let year = today.getFullYear();
      if (event.period === "past" && today.getMonth() === 0 && event.event_month === 12) {
        year -= 1;
      } else if (event.period === "future" && today.getMonth() === 11 && event.event_month === 1) {
        year += 1;
      }

      const targetDate = new Date(year, event.event_month - 1, event.event_day);
      targetDate.setHours(0, 0, 0, 0);

      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
      if (diffDays === -1) return "Yesterday";
      if (diffDays > 1 && diffDays <= 30) return `In ${diffDays} days`;
      if (diffDays < -1 && diffDays >= -30) return `${Math.abs(diffDays)} days ago`;

      return this.formatDateChip(event);
    },

    isUpcoming(event) {
      if (event.is_today) return false;
      if (event.period === "future") return true;
      if (event.period === "current") {
        const today = new Date().getDate();
        return (event.event_day || 0) > today;
      }
      return false;
    },

    normalizeEvents(rawEvents) {
      const today = new Date();
      const currentDay = today.getDate();
      const currentMonthNum = today.getMonth() + 1;
      const lastMonthNum = this.lastMonth.number;
      const nextMonthNum = this.nextMonth.number;

      return (rawEvents || []).map(item => {
        let event = { ...item };
        let eventDay = event.event_day || event.dob_d || event.dod_d || event.d;
        let eventMonth = event.event_month || event.dob_m || event.dod_m || event.m;

        if (!eventDay || !eventMonth) {
          const dateStr = event.dob || event.died_on || event.date;
          if (dateStr) {
            const parts = dateStr.split("-");
            if (parts.length >= 3) {
              eventMonth = parseInt(parts[1]);
              eventDay = parseInt(parts[2]);
            }
          }
        }

        event.event_day = eventDay || 1;
        event.event_month = eventMonth || currentMonthNum;
        event.is_today = (event.event_day === currentDay && event.event_month === currentMonthNum);

        if (event.event_month === currentMonthNum) {
          event.period = "current";
        } else if (event.event_month === lastMonthNum) {
          event.period = "past";
        } else if (event.event_month === nextMonthNum) {
          event.period = "future";
        } else {
          event.period = "current";
        }

        return event;
      });
    }
  },
  mounted() {
    this.store = Store;
    const surname = this.$route.params.id || "";
    const eventsUrl = `${ProdData.getHostURL()}/events/?date=${this.date.api}&surname=${surname}&range=3months`;

    axios
      .get(eventsUrl)
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          this.events = this.normalizeEvents(data);
        } else {
          this.events = [];
        }
      })
      .catch(err => {
        console.error("Error fetching events:", err);
        this.events = [];
      })
      .finally(() => {
        this.loading = false;
      });
  }
};
</script>

<style scoped>
.events-container {
  min-height: 100vh;
  padding: 0 16px;
}

/* ================= Clean Top Bar ================= */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 6px 18px 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.theme-light .top-bar {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.title-area {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 26px;
  color: #4f8ef7;
}

.theme-light .title {
  color: #2563eb;
}

.date-text {
  font-size: 14px;
  color: #a78bfa;
}

.theme-light .date-text {
  color: #7c3aed;
}

/* ================= Top Right Dropdown ================= */
.filter-select {
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: all 0.25s ease;
}

.theme-dark .filter-select {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f1f5f9;
}

.theme-dark .filter-select:hover,
.theme-dark .filter-select:focus {
  background: rgba(255, 255, 255, 0.12);
  border-color: #4f8ef7;
}

.theme-dark .filter-select option {
  background: #0f1123;
  color: #f1f5f9;
}

.theme-light .filter-select {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.theme-light .filter-select:hover,
.theme-light .filter-select:focus {
  border-color: #2563eb;
}

.theme-light .filter-select option {
  background: #ffffff;
  color: #1e293b;
}

/* ================= Modern Event Cards Grid ================= */
.events-grid-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -12px;
  padding-bottom: 60px;
}

.event-col {
  padding: 14px 12px;
}

/* Base Modern Card */
.event-card-modern {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  animation: cardFadeUp 0.5s ease both;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  min-height: 380px;
}

@keyframes cardFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Theme Dark Card Base */
.theme-dark .event-card-modern {
  background: rgba(15, 17, 35, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
  color: #f8fafc;
}

/* Theme Light Card Base */
.theme-light .event-card-modern {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
  color: #1e293b;
}

/* Card Hover Elevation & Dynamic Aura */
.event-card-modern:hover {
  transform: translateY(-8px);
}

.theme-dark .card-type-bday:hover {
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.5), 0 0 30px rgba(56, 189, 248, 0.25);
  border-color: rgba(56, 189, 248, 0.4);
}

.theme-dark .card-type-memorial:hover {
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.5), 0 0 30px rgba(168, 85, 247, 0.25);
  border-color: rgba(168, 85, 247, 0.4);
}

.theme-dark .card-type-milestone:hover {
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.25);
  border-color: rgba(245, 158, 11, 0.4);
}

.theme-light .card-type-bday:hover {
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
  border-color: rgba(37, 99, 235, 0.3);
}

.theme-light .card-type-memorial:hover {
  box-shadow: 0 20px 40px rgba(124, 58, 237, 0.15);
  border-color: rgba(124, 58, 237, 0.3);
}

.theme-light .card-type-milestone:hover {
  box-shadow: 0 20px 40px rgba(217, 119, 6, 0.15);
  border-color: rgba(217, 119, 6, 0.3);
}

/* Today Special Card Treatment */
.card-is-today {
  border: 2px solid #f59e0b !important;
  box-shadow: 0 0 35px rgba(245, 158, 11, 0.35) !important;
}

/* ================= Top Illustrated Scene Banner ================= */
.card-scene-banner {
  position: relative;
  width: 100%;
  height: 115px;
  overflow: hidden;
  z-index: 1;
}

.banner-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.svg-wave-bottom {
  fill: rgba(15, 17, 35, 0.75);
  transition: fill 0.3s ease;
}

.theme-light .svg-wave-bottom {
  fill: rgba(255, 255, 255, 0.95);
}

/* SVG Scene Micro-Animations */
.anim-balloon-1 {
  transform-origin: 44px 95px;
  animation: balloonSway 3.6s ease-in-out infinite alternate;
}

.anim-balloon-2 {
  transform-origin: 68px 92px;
  animation: balloonSway 4.2s ease-in-out infinite alternate-reverse;
}

.anim-balloon-3 {
  transform-origin: 28px 95px;
  animation: balloonSway 3.8s ease-in-out infinite alternate;
}

@keyframes balloonSway {
  0% { transform: rotate(-6deg); }
  100% { transform: rotate(6deg); }
}

.anim-flame {
  transform-origin: center bottom;
  animation: flameDance 1.8s ease-in-out infinite alternate;
}

.anim-flame-delay {
  transform-origin: center bottom;
  animation: flameDance 2.1s ease-in-out 0.4s infinite alternate;
}

@keyframes flameDance {
  0% { transform: scale(1) skewX(-1.5deg); }
  30% { transform: scale(1.08, 0.93) skewX(2deg); }
  60% { transform: scale(0.95, 1.05) skewX(-2deg); }
  100% { transform: scale(1) skewX(0); }
}

.anim-flame-aura {
  animation: auraPulse 2.4s ease-in-out infinite alternate;
}

@keyframes auraPulse {
  0% { opacity: 0.65; transform: scale(0.92); }
  100% { opacity: 1; transform: scale(1.12); }
}

.anim-sparkle-1 { animation: sparkle 2s ease-in-out infinite alternate; }
.anim-sparkle-2 { animation: sparkle 2.6s ease-in-out 0.4s infinite alternate; }
.anim-sparkle-3 { animation: sparkle 1.9s ease-in-out 0.8s infinite alternate; }

@keyframes sparkle {
  0% { opacity: 0.3; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1.25); }
}

.anim-milestone-left {
  animation: starFloat 3s ease-in-out infinite alternate;
}

.anim-milestone-right {
  animation: starFloat 3.5s ease-in-out 0.5s infinite alternate;
}

@keyframes starFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-3px); }
}

/* Card Header Bar (Badges over the scene banner) */
.card-header-bar {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px 0 14px;
}

/* Category Badge */
.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.cat-bday {
  background: rgba(2, 132, 199, 0.35);
  color: #e0f2fe;
  border: 1px solid rgba(56, 189, 248, 0.4);
}

.cat-memorial {
  background: rgba(124, 58, 237, 0.35);
  color: #f3e8ff;
  border: 1px solid rgba(192, 132, 252, 0.4);
}

.cat-milestone {
  background: rgba(180, 83, 9, 0.35);
  color: #fef3c7;
  border: 1px solid rgba(251, 191, 36, 0.4);
}

.theme-light .cat-bday {
  background: rgba(255, 255, 255, 0.85);
  color: #0369a1;
  border-color: #7dd3fc;
}

.theme-light .cat-memorial {
  background: rgba(255, 255, 255, 0.85);
  color: #6b21a8;
  border-color: #d8b4fe;
}

.theme-light .cat-milestone {
  background: rgba(255, 255, 255, 0.85);
  color: #92400e;
  border-color: #fcd34d;
}

/* Date / Relative Time Badge */
.date-badge-wrap {
  display: flex;
  align-items: center;
}

.badge-pill-relative {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
  backdrop-filter: blur(10px);
  background: rgba(15, 17, 35, 0.5);
  color: #f1f5f9;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}

.badge-pill-relative.is-upcoming {
  background: rgba(14, 165, 233, 0.3);
  color: #bae6fd;
  border-color: rgba(56, 189, 248, 0.45);
}

.theme-light .badge-pill-relative {
  background: rgba(255, 255, 255, 0.85);
  color: #334155;
  border-color: rgba(0, 0, 0, 0.12);
}

.theme-light .badge-pill-relative.is-upcoming {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #bfdbfe;
}

/* Pulsing TODAY Badge */
.badge-pill-today {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 800;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #ffffff;
  box-shadow: 0 0 16px rgba(245, 158, 11, 0.7);
  letter-spacing: 0.6px;
}

.pulse-beacon {
  width: 7px;
  height: 7px;
  background: #ffffff;
  border-radius: 50%;
  animation: beaconPulse 1.2s infinite ease-in-out;
}

@keyframes beaconPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.4;
  }
}

/* Card Main Content */
.card-main-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 22px 20px;
  flex: 1;
  text-align: center;
}

/* Overlapping Avatar Container with Glowing Aura & Category Glyph */
.avatar-container {
  position: relative;
  width: 84px;
  height: 84px;
  margin-top: -42px;
  margin-bottom: 12px;
  cursor: pointer;
  z-index: 6;
}

.avatar-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 3.5px solid #38bdf8;
  background: #0f1123;
  box-shadow: 0 0 24px rgba(56, 189, 248, 0.5);
  transition: all 0.3s ease;
}

.card-type-memorial .avatar-ring {
  border-color: #c084fc;
  box-shadow: 0 0 24px rgba(192, 132, 252, 0.5);
}

.card-type-milestone .avatar-ring {
  border-color: #f59e0b;
  box-shadow: 0 0 24px rgba(245, 158, 11, 0.5);
}

.card-is-today .avatar-ring {
  border-color: #f59e0b !important;
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.8) !important;
}

.avatar-ring img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.event-card-modern:hover .avatar-ring img {
  transform: scale(1.08);
}

.avatar-glyph {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: white;
  border: 2.5px solid #0f1123;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  animation: glyphBounce 3s infinite ease-in-out;
}

.theme-light .avatar-glyph {
  border-color: #ffffff;
}

.glyph-bday {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
}

.glyph-memorial {
  background: linear-gradient(135deg, #7c3aed, #c084fc);
}

.glyph-milestone {
  background: linear-gradient(135deg, #d97706, #fbbf24);
}

@keyframes glyphBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* Category Theme Tag */
.event-theme-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 12px;
  border-radius: 12px;
  font-size: 11.5px;
  font-weight: 600;
  margin-bottom: 12px;
}

.tag-bday {
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.25);
}

.tag-memorial {
  background: rgba(168, 85, 247, 0.12);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.25);
}

.tag-milestone {
  background: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.theme-light .tag-bday {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #bfdbfe;
}

.theme-light .tag-memorial {
  background: #faf5ff;
  color: #7e22ce;
  border-color: #e9d5ff;
}

.theme-light .tag-milestone {
  background: #fffbeb;
  color: #b45309;
  border-color: #fde68a;
}

/* Member Name */
.member-name {
  font-size: 18.5px;
  font-weight: 700;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  cursor: pointer;
  transition: color 0.2s ease;
}

.event-card-modern:hover .member-name {
  color: #38bdf8;
}

.card-type-memorial:hover .member-name {
  color: #c084fc;
}

.card-type-milestone:hover .member-name {
  color: #fbbf24;
}

.theme-light .member-name {
  color: #0f172a;
}

/* Event Highlight Box */
.event-highlight-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 18px;
  flex: 1;
  justify-content: center;
}

/* Anniversary Pill */
.anniversary-pill {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  padding: 6px 16px;
  border-radius: 16px;
  margin-bottom: 8px;
  backdrop-filter: blur(8px);
}

.anniv-bday {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
}

.anniv-memorial {
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.25);
}

.anniv-number {
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
}

.anniv-bday .anniv-number {
  color: #38bdf8;
}

.anniv-memorial .anniv-number {
  color: #c084fc;
}

.theme-light .anniv-bday .anniv-number {
  color: #0284c7;
}

.theme-light .anniv-memorial .anniv-number {
  color: #7c3aed;
}

.anniv-label {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.85;
}

/* Milestone text */
.milestone-headline {
  font-size: 16.5px;
  font-weight: 700;
  color: #fbbf24;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.theme-light .milestone-headline {
  color: #b45309;
}

.milestone-snippet {
  font-size: 13px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.theme-light .milestone-snippet {
  color: #475569;
}

.event-date-subtext {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-light .event-date-subtext {
  color: #64748b;
}

/* Card Actions Row */
.card-actions-row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: auto;
}

.btn-action-view {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 22px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: #f8fafc;
  transition: all 0.25s ease;
}

.card-type-bday .btn-action-view {
  border-color: rgba(56, 189, 248, 0.35);
  color: #38bdf8;
}

.card-type-bday .btn-action-view:hover {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(56, 189, 248, 0.4);
  transform: translateY(-2px);
}

.card-type-memorial .btn-action-view {
  border-color: rgba(168, 85, 247, 0.35);
  color: #c084fc;
}

.card-type-memorial .btn-action-view:hover {
  background: linear-gradient(135deg, #7c3aed, #c084fc);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4);
  transform: translateY(-2px);
}

.card-type-milestone .btn-action-view {
  border-color: rgba(245, 158, 11, 0.35);
  color: #fbbf24;
}

.card-type-milestone .btn-action-view:hover {
  background: linear-gradient(135deg, #d97706, #fbbf24);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
  transform: translateY(-2px);
}

.theme-light .btn-action-view {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #334155;
}

.btn-action-timeline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
  text-decoration: none;
  transition: all 0.25s ease;
}

.btn-action-timeline:hover {
  background: #f59e0b;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
  transform: translateY(-2px);
}

/* ================= Empty & Loader ================= */
.empty-box {
  max-width: 500px;
}

.empty-img {
  filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.4));
  opacity: 0.85;
}

.empty-title {
  color: #4f8ef7;
}

.theme-light .empty-title {
  color: #2563eb;
}

.empty-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
}

.theme-light .empty-subtitle {
  color: #64748b;
}

.loading-box {
  display: flex;
  justify-content: center;
  margin-top: 100px;
}

.spinner-border-sm {
  width: 3rem;
  height: 3rem;
  border-width: 0.25em;
  color: #4f8ef7;
}
</style>
