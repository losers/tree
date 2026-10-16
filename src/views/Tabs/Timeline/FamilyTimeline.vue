<template>
  <div class="family-timeline-page" :class="isDark ? 'theme-dark' : 'theme-light'">
    <!-- Top Bar -->
    <div class="timeline-top-bar">
      <div class="top-bar-left">
        <h2 class="page-title font-weight-bold">Family Timeline</h2>
        <span class="page-subtitle">Chronicle of family milestones, births & memories</span>
      </div>

      <div class="top-bar-right d-flex align-items-center">
        <!-- Quick Stats Pill -->
        <div class="stats-chip" v-if="!loading && allEvents.length > 0">
          <span class="stats-count">{{ filteredEvents.length }}</span>
          <span class="stats-text">Events ({{ yearRangeText }})</span>
        </div>

        <!-- Download Button in Header (Quick Action) -->
        <button
          class="btn-download-quick ml-2"
          @click="downloadTimeline"
          title="Download entire family timeline as CSV"
          v-if="!loading && allEvents.length > 0"
        >
          <i class="icofont-download mr-1"></i> Export Timeline
        </button>

        <!-- Mobile Filter Toggle -->
        <button
          class="btn-filter-toggle d-lg-none ml-2"
          @click="showMobileControls = !showMobileControls"
        >
          <i class="icofont-filter mr-1"></i> Filters
        </button>
      </div>
    </div>

    <!-- Main Content Area: Center Timeline + Right Control Panel -->
    <div class="timeline-layout-container">
      <!-- ================= CENTER TIMELINE STREAM ================= -->
      <main class="timeline-center-area">
        <!-- Loading Spinner -->
        <div class="loading-state" v-if="loading">
          <div class="spinner-border spinner-border-sm text-primary"></div>
          <div class="loading-text mt-3">Loading family timeline in a single request...</div>
        </div>

        <!-- Empty State -->
        <div class="empty-state glass-card p-5" v-else-if="filteredEvents.length === 0">
          <center>
            <i class="icofont-sand-clock empty-icon"></i>
            <h4 class="font-weight-bold mt-3">No Timeline Events Found</h4>
            <p class="text-muted">
              {{ allEvents.length === 0 ? "No timeline events recorded for this family yet." : "No events match the selected filters." }}
            </p>
            <button
              class="btn-reset-filters mt-2"
              v-if="hasActiveFilterOverrides"
              @click="resetFilters"
            >
              Show All Events
            </button>
          </center>
        </div>

        <!-- The Creative Timeline Stream (Year on Left, Cards on Right) -->
        <div class="timeline-stream-wrap" v-else>
          <div
            v-for="yearGroup in groupedEvents"
            :key="yearGroup.year"
            :id="'year-group-' + yearGroup.year"
            class="year-timeline-row"
          >
            <!-- LEFT SIDE: Year Badge -->
            <div class="year-left-column">
              <div class="year-pill-sticky">
                <span class="year-text">{{ yearGroup.year }}</span>
              </div>
            </div>

            <!-- CENTER SPINE & NODES -->
            <div class="timeline-spine-track">
              <div class="spine-line"></div>
            </div>

            <!-- RIGHT SIDE: Event Cards -->
            <div class="events-cards-column">
              <div
                v-for="(event, idx) in yearGroup.events"
                :key="event.id || (yearGroup.year + '-' + idx)"
                class="timeline-card-item"
                :class="'category-' + event.category"
              >
                <!-- Glowing Node Connector on Spine -->
                <div class="spine-node" :class="'node-' + event.category">
                  <i :class="getCategoryIcon(event.category)"></i>
                </div>

                <!-- Event Card -->
                <div class="event-card glass-card">
                  <!-- Card Meta Row: Date & Category Pill -->
                  <div class="card-meta-row">
                    <span class="date-chip">
                      <i class="icofont-calendar mr-1"></i>
                      {{ formatEventDate(event) }}
                    </span>

                    <span class="category-pill" :class="'pill-' + event.category">
                      {{ getCategoryLabel(event.category) }}
                    </span>
                  </div>

                  <!-- Person Profile Row (Clicking opens person profile drawer on the same page) -->
                  <div
                    class="person-profile-row cursor"
                    @click="openPersonProfile(event)"
                    title="Click to view member profile"
                  >
                    <div class="person-dp" :class="'dp-' + event.category">
                      <img
                        :src="'data:image/png;base64, ' + store.state.images[event.person_id]"
                        v-if="store.state.images && store.state.images[event.person_id]"
                        :alt="event.name"
                      />
                      <img src="@/assets/dp.png" v-else alt="Member" />
                    </div>

                    <div class="person-info-text">
                      <div class="person-name font-weight-bold">
                        {{ event.name }}
                        <i class="icofont-external-link view-icon ml-1"></i>
                      </div>
                      <div class="person-subtext">View member profile</div>
                    </div>
                  </div>

                  <!-- Event Title & Description -->
                  <div class="event-body-text">
                    <h5 class="event-headline font-weight-bold">{{ event.title }}</h5>
                    <p class="event-desc" v-if="event.content">
                      {{ event.content }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- ================= RIGHT SIDE: CONTROL PANEL ================= -->
      <aside
        class="right-control-panel glass-panel"
        :class="{ 'mobile-visible': showMobileControls }"
      >
        <div class="panel-header d-flex justify-content-between align-items-center">
          <h5 class="panel-title font-weight-bold m-0">
            <i class="icofont-options mr-2"></i>Timeline Controls
          </h5>
          <button
            class="close-btn d-lg-none"
            @click="showMobileControls = false"
          >
            <i class="icofont-close"></i>
          </button>
        </div>

        <!-- Event Types / Checkboxes -->
        <div class="panel-section mt-4">
          <label class="control-label font-weight-bold">Event Categories</label>

          <!-- Milestone Events Checkbox (Highlighted) -->
          <label class="checkbox-row milestone-row cursor">
            <input
              type="checkbox"
              v-model="filters.milestones"
              class="hidden-check"
            />
            <span class="custom-checkbox milestone-box">
              <i class="icofont-check" v-if="filters.milestones"></i>
            </span>
            <span class="checkbox-text-wrap">
              <span class="category-name milestone-text font-weight-bold">
                <i class="icofont-badge mr-1"></i> Milestones
              </span>
              <span class="category-count milestone-count">{{ counts.milestones }}</span>
            </span>
          </label>

          <!-- Births Checkbox -->
          <label class="checkbox-row cursor">
            <input
              type="checkbox"
              v-model="filters.births"
              class="hidden-check"
            />
            <span class="custom-checkbox birth-box">
              <i class="icofont-check" v-if="filters.births"></i>
            </span>
            <span class="checkbox-text-wrap">
              <span class="category-name">
                <i class="icofont-birthday-cake mr-1 text-primary"></i> Births
              </span>
              <span class="category-count">{{ counts.births }}</span>
            </span>
          </label>

          <!-- Memorials Checkbox -->
          <label class="checkbox-row cursor">
            <input
              type="checkbox"
              v-model="filters.deaths"
              class="hidden-check"
            />
            <span class="custom-checkbox death-box">
              <i class="icofont-check" v-if="filters.deaths"></i>
            </span>
            <span class="checkbox-text-wrap">
              <span class="category-name">
                <i class="icofont-candle mr-1 text-purple"></i> Memorials
              </span>
              <span class="category-count">{{ counts.deaths }}</span>
            </span>
          </label>
        </div>

        <!-- Search Person -->
        <div class="panel-section mt-4">
          <label class="control-label font-weight-bold">Search Person</label>
          <div class="search-box-wrap">
            <i class="icofont-search-2 search-icon"></i>
            <input
              type="text"
              v-model="searchPerson"
              placeholder="Search member name..."
              class="search-input"
            />
            <i
              class="icofont-close-line clear-icon cursor"
              v-if="searchPerson"
              @click="searchPerson = ''"
            ></i>
          </div>
        </div>

        <!-- Timeline Sort Order -->
        <div class="panel-section mt-4">
          <label class="control-label font-weight-bold">Timeline Direction</label>
          <div class="sort-buttons">
            <button
              class="sort-btn"
              :class="{ 'active': sortOrder === 'asc' }"
              @click="sortOrder = 'asc'"
            >
              <i class="icofont-arrow-down mr-1"></i> Oldest First
            </button>
            <button
              class="sort-btn"
              :class="{ 'active': sortOrder === 'desc' }"
              @click="sortOrder = 'desc'"
            >
              <i class="icofont-arrow-up mr-1"></i> Newest First
            </button>
          </div>
        </div>

        <!-- Reset Filters -->
        <div class="panel-section mt-4" v-if="hasActiveFilterOverrides">
          <button class="btn-reset-filters" @click="resetFilters">
            <i class="icofont-refresh mr-1"></i> Reset All Filters
          </button>
        </div>
      </aside>
    </div>

    <!-- Existing Person Profile View Drawer (on same page) -->
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
import Store from "@/store/index";
import MemberData from "@/components/MemberData/MemberData.vue";

export default {
  name: "FamilyTimeline",
  components: {
    MemberData
  },
  data() {
    return {
      store: {},
      loading: true,
      selectedMemberId: null,
      allEvents: [],
      searchPerson: "",
      sortOrder: "asc", // "asc" (earliest first) or "desc"
      showMobileControls: false,
      filters: {
        milestones: true,
        births: true,
        deaths: true
      }
    };
  },
  computed: {
    isDark() {
      return (Store.state.theme || "dark") === "dark";
    },

    counts() {
      let milestones = 0;
      let births = 0;
      let deaths = 0;

      for (let e of this.allEvents) {
        if (e.category === "milestone") milestones++;
        else if (e.category === "birth") births++;
        else if (e.category === "death") deaths++;
      }

      return { milestones, births, deaths };
    },

    hasActiveFilterOverrides() {
      return (
        !this.filters.milestones ||
        !this.filters.births ||
        !this.filters.deaths ||
        this.searchPerson.trim() !== "" ||
        this.sortOrder !== "asc"
      );
    },

    filteredEvents() {
      const query = this.searchPerson.toLowerCase().trim();

      let list = this.allEvents.filter(event => {
        // Category filters
        if (event.category === "milestone" && !this.filters.milestones) return false;
        if (event.category === "birth" && !this.filters.births) return false;
        if (event.category === "death" && !this.filters.deaths) return false;

        // Search query
        if (query) {
          const matchName = (event.name || "").toLowerCase().includes(query);
          const matchTitle = (event.title || "").toLowerCase().includes(query);
          if (!matchName && !matchTitle) return false;
        }

        return true;
      });

      // Sort by Year & Date
      list.sort((a, b) => {
        const valA = (a.year || 0) * 10000 + (a.month || 0) * 100 + (a.day || 0);
        const valB = (b.year || 0) * 10000 + (b.month || 0) * 100 + (b.day || 0);
        return this.sortOrder === "asc" ? valA - valB : valB - valA;
      });

      return list;
    },

    groupedEvents() {
      const groups = {};
      const order = [];

      for (let event of this.filteredEvents) {
        const y = event.year || 0;
        if (!groups[y]) {
          groups[y] = [];
          order.push(y);
        }
        groups[y].push(event);
      }

      return order.map(y => ({
        year: y,
        events: groups[y]
      }));
    },

    uniqueYears() {
      const set = new Set();
      for (let e of this.filteredEvents) {
        if (e.year) set.add(e.year);
      }
      const years = Array.from(set);
      years.sort((a, b) => (this.sortOrder === "asc" ? a - b : b - a));
      return years;
    },

    yearRangeText() {
      if (this.uniqueYears.length === 0) return "";
      const min = Math.min(...this.uniqueYears);
      const max = Math.max(...this.uniqueYears);
      return min === max ? `${min}` : `${min} - ${max}`;
    }
  },
  methods: {
    resetFilters() {
      this.filters.milestones = true;
      this.filters.births = true;
      this.filters.deaths = true;
      this.searchPerson = "";
      this.sortOrder = "asc";
    },

    getCategoryIcon(cat) {
      if (cat === "milestone") return "icofont-badge";
      if (cat === "birth") return "icofont-birthday-cake";
      if (cat === "death") return "icofont-candle";
      return "icofont-star";
    },

    getCategoryLabel(cat) {
      if (cat === "milestone") return "Milestone";
      if (cat === "birth") return "Birth";
      if (cat === "death") return "Memorial";
      return "Event";
    },

    formatEventDate(event) {
      const shortMonths = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const m = event.month ? shortMonths[event.month - 1] : "";
      const d = event.day || "";
      const y = event.year || "";
      if (d && m) return `${d} ${m} ${y}`;
      if (m) return `${m} ${y}`;
      return `${y}`;
    },

    // Open existing person profile view drawer on the same page
    openPersonProfile(event) {
      if (!event || !event.person_id) return;
      this.selectedMemberId = event.person_id;
    },

    // Download the entire timeline as a CSV file
    downloadTimeline() {
      if (this.filteredEvents.length === 0) return;

      const headers = ["Year", "Date", "Category", "Person Name", "Event Title", "Details"];
      const rows = this.filteredEvents.map(e => [
        e.year || "",
        this.formatEventDate(e),
        this.getCategoryLabel(e.category),
        `"${(e.name || "").replace(/"/g, '""')}"`,
        `"${(e.title || "").replace(/"/g, '""')}"`,
        `"${(e.content || "").replace(/"/g, '""')}"`
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8,\uFEFF" +
        [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      const surname = this.$route.params.id || "family";
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${surname}-family-timeline.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // Single ultra-fast API call (no 200 person calls!)
    async fetchTimelineData() {
      this.loading = true;
      const surname = this.$route.params.id || "";

      try {
        const url = `${ProdData.getHostURL()}/tree/${surname}/family-timeline`;
        const res = await axios.get(url);
        if (Array.isArray(res.data)) {
          this.allEvents = res.data;
        } else {
          this.allEvents = [];
        }
      } catch (err) {
        console.error("Error fetching family timeline:", err);
        this.allEvents = [];
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.store = Store;
    this.fetchTimelineData();
  }
};
</script>

<style scoped>
/* ================= Page Base ================= */
.family-timeline-page {
  min-height: 100vh;
  padding: 0 16px 80px 16px;
}

/* ================= Top Bar ================= */
.timeline-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 6px 18px 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.theme-light .timeline-top-bar {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 26px;
  color: #4f8ef7;
  margin: 0;
}

.theme-light .page-title {
  color: #2563eb;
}

.page-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.theme-light .page-subtitle {
  color: #64748b;
}

.stats-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(12px);
}

.theme-dark .stats-chip {
  background: rgba(79, 142, 247, 0.12);
  border: 1px solid rgba(79, 142, 247, 0.3);
  color: #93c5fd;
}

.theme-light .stats-chip {
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.2);
  color: #1d4ed8;
}

.stats-count {
  font-weight: 800;
  color: #4f8ef7;
}

.theme-light .stats-count {
  color: #2563eb;
}

.btn-download-quick {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
}

.btn-download-quick:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.5);
}

/* ================= 2-Column Layout: Center Timeline + Right Panel ================= */
.timeline-layout-container {
  display: flex;
  gap: 28px;
  margin-top: 24px;
  position: relative;
}

/* ================= Center Timeline Area ================= */
.timeline-center-area {
  flex: 1;
  min-width: 0;
}

.timeline-stream-wrap {
  position: relative;
  padding: 10px 0;
}

/* Year Timeline Row */
.year-timeline-row {
  display: flex;
  position: relative;
  margin-bottom: 32px;
}

/* 1. LEFT COLUMN: Year Badge */
.year-left-column {
  width: 90px;
  flex-shrink: 0;
  padding-right: 14px;
  text-align: right;
}

.year-pill-sticky {
  position: sticky;
  top: 110px;
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.2), rgba(167, 139, 250, 0.2));
  border: 1px solid rgba(79, 142, 247, 0.4);
  color: #4f8ef7;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  box-shadow: 0 0 12px rgba(79, 142, 247, 0.2);
}

.theme-light .year-pill-sticky {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

/* 2. CENTER SPINE TRACK */
.timeline-spine-track {
  width: 32px;
  flex-shrink: 0;
  position: relative;
  display: flex;
  justify-content: center;
}

.spine-line {
  position: absolute;
  top: 0;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  background: rgba(79, 142, 247, 0.4);
  box-shadow: 0 0 10px rgba(79, 142, 247, 0.25);
  border-radius: 2px;
}

.theme-light .spine-line {
  background: rgba(59, 130, 246, 0.35);
  box-shadow: none;
}

.year-timeline-row:last-child .spine-line {
  bottom: 0;
}

/* 3. RIGHT COLUMN: Event Cards */
.events-cards-column {
  flex: 1;
  min-width: 0;
  padding-left: 24px;
}

.timeline-card-item {
  position: relative;
  margin-bottom: 24px;
}

/* Horizontal connector line from spine to card */
.timeline-card-item::before {
  content: "";
  position: absolute;
  left: -40px;
  top: 26px;
  width: 40px;
  height: 2px;
  background: rgba(79, 142, 247, 0.4);
  z-index: 1;
  transition: background 0.25s ease;
}

.theme-light .timeline-card-item::before {
  background: rgba(59, 130, 246, 0.35);
}

.timeline-card-item:hover::before {
  background: rgba(79, 142, 247, 0.85);
}

.theme-light .timeline-card-item:hover::before {
  background: rgba(59, 130, 246, 0.85);
}

/* Spine Node on the line (Centered directly over spine line) */
.spine-node {
  position: absolute;
  left: -40px;
  top: 26px;
  transform: translate(-50%, -50%);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  color: #ffffff;
  z-index: 5;
  border: 3px solid #0f1123;
  box-shadow: 0 0 14px rgba(79, 142, 247, 0.4);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.theme-light .spine-node {
  border-color: #f8fafc;
}

.timeline-card-item:hover .spine-node {
  transform: translate(-50%, -50%) scale(1.15);
}

.node-milestone {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 0 14px rgba(245, 158, 11, 0.7);
}

.timeline-card-item:hover .node-milestone {
  box-shadow: 0 0 22px rgba(245, 158, 11, 0.95);
}

.node-birth {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 0 14px rgba(59, 130, 246, 0.7);
}

.timeline-card-item:hover .node-birth {
  box-shadow: 0 0 22px rgba(59, 130, 246, 0.95);
}

.node-death {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 0 14px rgba(139, 92, 246, 0.7);
}

.timeline-card-item:hover .node-death {
  box-shadow: 0 0 22px rgba(139, 92, 246, 0.95);
}

/* Event Card Design */
.event-card {
  padding: 20px;
  border-radius: 18px;
  transition: all 0.25s ease;
}

.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.theme-dark .glass-card {
  background: rgba(15, 17, 35, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  color: #f1f5f9;
}

.theme-light .glass-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  color: #1e293b;
}

.event-card:hover {
  transform: translateX(4px);
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.3) !important;
}

.category-milestone .event-card {
  border-left: 3px solid #f59e0b !important;
}

.category-birth .event-card {
  border-left: 3px solid #3b82f6 !important;
}

.category-death .event-card {
  border-left: 3px solid #8b5cf6 !important;
}

/* Card Meta Row */
.card-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.date-chip {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
}

.theme-light .date-chip {
  color: #64748b;
}

.category-pill {
  font-size: 10.5px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pill-milestone {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.35);
}

.pill-birth {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.35);
}

.pill-death {
  background: rgba(139, 92, 246, 0.15);
  color: #c084fc;
  border: 1px solid rgba(139, 92, 246, 0.35);
}

/* Person Profile Row (Clickable) */
.person-profile-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.theme-light .person-profile-row {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.06);
}

.person-profile-row:hover {
  background: rgba(79, 142, 247, 0.12);
  border-color: rgba(79, 142, 247, 0.3);
}

.person-dp {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #4f8ef7;
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(79, 142, 247, 0.3);
}

.dp-milestone {
  border-color: #f59e0b;
}

.dp-death {
  border-color: #8b5cf6;
}

.person-dp img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.person-name {
  font-size: 14.5px;
  color: #f8fafc;
}

.theme-light .person-name {
  color: #0f172a;
}

.view-icon {
  font-size: 12px;
  opacity: 0.6;
}

.person-subtext {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
}

.theme-light .person-subtext {
  color: #94a3b8;
}

/* Event Details */
.event-headline {
  font-size: 16px;
  margin: 0 0 6px 0;
  color: #f1f5f9;
}

.theme-light .event-headline {
  color: #1e293b;
}

.category-milestone .event-headline {
  color: #fbbf24;
}

.theme-light .category-milestone .event-headline {
  color: #d97706;
}

.event-desc {
  font-size: 13.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.theme-light .event-desc {
  color: #475569;
}

/* ================= RIGHT CONTROL PANEL ================= */
.right-control-panel {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 90px;
  height: fit-content;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 22px;
  border-radius: 20px;
  z-index: 20;
}

.glass-panel {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.theme-dark .glass-panel {
  background: rgba(15, 17, 35, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
}

.theme-light .glass-panel {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
}

.panel-title {
  font-size: 16px;
  color: #4f8ef7;
}

.theme-light .panel-title {
  color: #2563eb;
}

.btn-download-full {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 3px 12px rgba(16, 185, 129, 0.3);
}

.btn-download-full:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 16px rgba(16, 185, 129, 0.5);
}

.control-label {
  display: block;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 10px;
}

.theme-light .control-label {
  color: #64748b;
}

/* Checkbox Rows */
.checkbox-row {
  display: flex;
  align-items: center;
  padding: 7px 8px;
  border-radius: 10px;
  margin-bottom: 5px;
  transition: all 0.2s ease;
  user-select: none;
}

.checkbox-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.theme-light .checkbox-row:hover {
  background: rgba(0, 0, 0, 0.04);
}

.hidden-check {
  display: none;
}

.custom-checkbox {
  width: 19px;
  height: 19px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 12px;
  color: white;
  transition: all 0.2s ease;
}

.milestone-box {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}

.birth-box {
  background: #3b82f6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

.death-box {
  background: #8b5cf6;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
}

.checkbox-text-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.category-name {
  font-size: 13.5px;
}

.milestone-text {
  color: #f59e0b;
}

.category-count {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.theme-light .category-count {
  background: rgba(0, 0, 0, 0.06);
  color: #475569;
}

.milestone-count {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  font-weight: 700;
}

/* Search Box */
.search-box-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.theme-light .search-icon {
  color: #94a3b8;
}

.clear-icon {
  position: absolute;
  right: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.search-input {
  width: 100%;
  padding: 8px 30px 8px 34px;
  border-radius: 10px;
  font-size: 13px;
  outline: none;
  transition: all 0.2s ease;
}

.theme-dark .search-input {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f1f5f9;
}

.theme-dark .search-input:focus {
  border-color: #4f8ef7;
  background: rgba(255, 255, 255, 0.1);
}

.theme-light .search-input {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1e293b;
}

.theme-light .search-input:focus {
  border-color: #2563eb;
}

/* Sort Buttons */
.sort-buttons {
  display: flex;
  gap: 6px;
}

.sort-btn {
  flex: 1;
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.theme-dark .sort-btn {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

.theme-dark .sort-btn.active {
  background: linear-gradient(135deg, #4f8ef7, #a78bfa);
  color: white;
  border-color: transparent;
}

.theme-light .sort-btn {
  background: rgba(0, 0, 0, 0.04);
  color: #475569;
  border-color: #cbd5e1;
}

.theme-light .sort-btn.active {
  background: #2563eb;
  color: white;
  border-color: transparent;
}

.btn-reset-filters {
  width: 100%;
  padding: 7px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: transparent;
  border: 1px dashed #4f8ef7;
  color: #4f8ef7;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reset-filters:hover {
  background: rgba(79, 142, 247, 0.1);
}

/* ================= Loader & Empty ================= */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 90px 0;
}

.loading-text {
  font-size: 14px;
  color: #a78bfa;
}

.empty-state {
  max-width: 440px;
  margin: 60px auto;
  border-radius: 20px;
}

.empty-icon {
  font-size: 46px;
  color: #4f8ef7;
}

/* ================= Responsive ================= */
@media (max-width: 991px) {
  .right-control-panel {
    position: fixed;
    top: 70px;
    right: 0;
    bottom: 0;
    width: 290px;
    max-height: 100vh;
    border-radius: 20px 0 0 20px;
    z-index: 100;
    display: none;
  }

  .right-control-panel.mobile-visible {
    display: block;
  }

  .btn-filter-toggle {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    background: linear-gradient(135deg, #4f8ef7, #a78bfa);
    color: white;
    border: none;
  }
}

@media (max-width: 600px) {
  .year-left-column {
    width: 65px;
    padding-right: 8px;
  }
  .year-pill-sticky {
    padding: 3px 8px;
    font-size: 13px;
  }
}
</style>