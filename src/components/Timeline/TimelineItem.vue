<template>
  <section class="timeline-item">
    <div class="item" @mouseover="over" @mouseleave="leave">
      <!-- Glowing Timeline Dot with Halo -->
      <div class="dot-wrapper">
        <span
          :style="getBackgroundColour(itemTimeline.color)"
          class="dot glow-dot"
          :class="{
            'dot-bday': isBirthday,
            'dot-demise': isDemise,
            'dot-anniv': isWedding
          }"
        />
        <div class="dot-halo" :class="eventTypeBadge.haloClass"></div>
      </div>

      <!-- Modern Glass Event Card -->
      <div
        class="item-content-card"
        :class="[
          eventTypeBadge.cardClass,
          { 'card-interactive': !itemTimeline.fixed }
        ]"
      >
        <!-- Card Top Bar: Date, Badge, Edit -->
        <div class="card-top-row">
          <div class="card-date-badge">
            <i class="icofont-calendar mr-1"></i>
            <span>{{ getFormattedDate(itemTimeline) }}</span>
          </div>

          <div class="card-meta-tags">
            <span class="event-type-pill" :class="eventTypeBadge.pillClass">
              <i :class="eventTypeBadge.icon" class="mr-1"></i>
              <span>{{ eventTypeBadge.label }}</span>
            </span>

            <!-- Edit button for custom events -->
            <button
              class="card-edit-btn"
              @click="findme(itemTimeline)"
              v-if="!itemTimeline.fixed && !itemTimeline.shared_by && !view_only"
              title="Edit event"
              aria-label="Edit event"
            >
              <i class="icofont-ui-edit"></i>
            </button>
          </div>
        </div>

        <!-- Event Title -->
        <h4 class="title-item">
          <span v-html="itemTimeline.title"></span>
        </h4>

        <!-- Event Description -->
        <p
          class="description-item"
          v-html="itemTimeline.content"
          v-linkified:options="{ format: modifyURL }"
        />

        <!-- Shared By Info -->
        <div class="shared-by mt-3" v-if="itemTimeline.shared_by">
          <span class="key"><i class="icofont-share-alt mr-1"></i>Shared by:</span>
          <router-link
            class="value pill-badge"
            :to="{
              name: 'PersonTimeline',
              params: { member: itemTimeline.shared_by },
            }"
          >
            {{ namesMap[itemTimeline.shared_by] || 'Family Member' }}
          </router-link>
        </div>

        <!-- Sharing With Info -->
        <div
          class="sharing-with mt-3"
          v-else-if="itemTimeline.shared_with && itemTimeline.shared_with.length > 0"
        >
          <div class="key"><i class="icofont-users-alt-2 mr-1"></i>Shared with:</div>
          <div class="val-con">
            <span
              v-for="(person, index) in itemTimeline.shared_with"
              :key="index"
              class="value pill-badge"
              :title="namesMap[person]"
            >
              {{ namesMap[person] || 'Family Member' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Store from "../../store/index";
import { getAPIFormat } from "../../util/helper";

const LINK_TYPE = {
  URL: "url",
  OTHERS: "Link",
  GOOGLE_PHOTOS: "Google Photos",
  GOOGLE_DRIVE: "Google Drive",
};
let eventData;

export default {
  name: "TimelineItem",
  props: {
    itemTimeline: {
      type: Object,
      default: () => ({}),
    },
    colorDots: {
      type: String,
      default: "#4f8ef7",
    },
    dateLocale: {
      type: String,
      default: "",
    },
    namesMap: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      show: false,
      showTimelineShare: false,
    };
  },
  computed: {
    view_only() {
      return Store.state.view_only;
    },
    isBirthday() {
      const t = (this.itemTimeline.title || "").toLowerCase();
      return t.includes("birth") || t.includes("bday") || t.includes("born");
    },
    isDemise() {
      const t = (this.itemTimeline.title || "").toLowerCase();
      return t.includes("demise") || t.includes("died") || t.includes("death") || t.includes("memorial");
    },
    isWedding() {
      const t = (this.itemTimeline.title || "").toLowerCase();
      return t.includes("wedding") || t.includes("anniversary") || t.includes("marriage");
    },
    eventTypeBadge() {
      if (this.isBirthday) {
        return {
          label: "Birthday",
          icon: "icofont-birthday-cake",
          pillClass: "pill-bday",
          cardClass: "card-bday",
          haloClass: "halo-bday"
        };
      }
      if (this.isDemise) {
        return {
          label: "In Memory",
          icon: "icofont-candle",
          pillClass: "pill-demise",
          cardClass: "card-demise",
          haloClass: "halo-demise"
        };
      }
      if (this.isWedding) {
        return {
          label: "Anniversary",
          icon: "icofont-heart-alt",
          pillClass: "pill-anniv",
          cardClass: "card-anniv",
          haloClass: "halo-anniv"
        };
      }
      return {
        label: "Milestone",
        icon: "icofont-star-alt-1",
        pillClass: "pill-milestone",
        cardClass: "card-milestone",
        haloClass: "halo-milestone"
      };
    }
  },
  methods: {
    modifyURL(value, type) {
      if (type === LINK_TYPE.URL) {
        let url_type = LINK_TYPE.OTHERS;
        if (value.includes("photos.google")) {
          url_type = LINK_TYPE.GOOGLE_PHOTOS;
        } else if (value.includes("drive.google")) {
          url_type = LINK_TYPE.GOOGLE_DRIVE;
        }
        return url_type;
      }
      return value;
    },
    over() {
      this.show = true;
    },
    leave() {
      this.show = false;
    },
    findme(data) {
      let shared = [];
      if (this.itemTimeline.shared_with) {
        for (let i = 0; i < this.itemTimeline.shared_with.length; i++) {
          shared.push({
            label: this.namesMap[this.itemTimeline.shared_with[i]],
            value: this.itemTimeline.shared_with[i],
          });
        }
      }
      eventData = data;
      eventData.date = getAPIFormat(eventData.date);
      this.$root.$emit("edit-timeline", eventData, shared);
    },
    getBackgroundColour(color) {
      if (this.isBirthday) return "background: linear-gradient(135deg, #ec4899, #f59e0b)";
      if (this.isDemise) return "background: linear-gradient(135deg, #f59e0b, #d97706)";
      if (this.isWedding) return "background: linear-gradient(135deg, #f43f5e, #ec4899)";
      return color ? `background:${color}` : `background:${this.colorDots}`;
    },
    getFormattedDate(item) {
      if (!item || !item.date) return "";
      const d = item.date instanceof Date ? item.date : new Date(item.date);
      if (isNaN(d.getTime())) return String(item.date);
      const locale = this.dateLocale || navigator.language;
      const nameMonth = d.toLocaleDateString(locale, { month: "short" });
      const day = d.getDate();
      return `${day} ${nameMonth}`;
    },
  },
};
</script>

<style scoped>
.timeline-item .item {
  border-left: 2px solid rgba(79, 142, 247, 0.3);
  padding: 0 0 36px 24px;
  position: relative;
  width: 100%;
  word-break: break-word;
  transition: border-color 0.3s ease;
}

.timeline-item .item:hover {
  border-left-color: #60a5fa;
}

/* Timeline Dot */
.dot-wrapper {
  position: absolute;
  left: -9px;
  top: 8px;
  width: 16px;
  height: 16px;
}

.timeline-item .dot {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid #0a0d1a;
  background: #3b82f6;
  transition: all 0.25s ease;
  position: relative;
  z-index: 2;
}

.dot-halo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(79, 142, 247, 0.3);
  filter: blur(4px);
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 1;
}

.timeline-item .item:hover .dot {
  transform: scale(1.25);
  box-shadow: 0 0 16px rgba(79, 142, 247, 0.8);
}
.timeline-item .item:hover .dot-halo {
  opacity: 1;
}

.dot-bday { background: linear-gradient(135deg, #ec4899, #f59e0b) !important; }
.dot-demise { background: linear-gradient(135deg, #f59e0b, #d97706) !important; }
.dot-anniv { background: linear-gradient(135deg, #f43f5e, #ec4899) !important; }

/* Content Card */
.timeline-item .item-content-card {
  background: rgba(15, 20, 36, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 20px 22px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-top: -6px;
  position: relative;
  overflow: hidden;
  text-align: left;
}

.timeline-item .item:hover .item-content-card {
  transform: translateY(-3px);
  background: rgba(18, 24, 44, 0.85);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.16);
}

/* Card Theming */
.card-bday {
  border-left: 3px solid #ec4899 !important;
}
.card-demise {
  border-left: 3px solid #f59e0b !important;
}
.card-anniv {
  border-left: 3px solid #f43f5e !important;
}
.card-milestone {
  border-left: 3px solid #60a5fa !important;
}

/* Card Top Row */
.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  text-align: left;
}

.card-date-badge {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
}

.card-meta-tags {
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-type-pill {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pill-bday {
  background: rgba(236, 72, 153, 0.18);
  border: 1px solid rgba(236, 72, 153, 0.35);
  color: #f472b6;
}

.pill-demise {
  background: rgba(245, 158, 11, 0.18);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
}

.pill-anniv {
  background: rgba(244, 63, 94, 0.18);
  border: 1px solid rgba(244, 63, 94, 0.35);
  color: #fb7185;
}

.pill-milestone {
  background: rgba(59, 130, 246, 0.18);
  border: 1px solid rgba(59, 130, 246, 0.35);
  color: #60a5fa;
}

.card-edit-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  border-radius: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.card-edit-btn:hover {
  background: rgba(79, 142, 247, 0.2);
  color: #60a5fa;
  border-color: #60a5fa;
  transform: scale(1.1);
}

/* Title & Description */
.timeline-item .title-item {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.2px;
  text-align: left;
}

.timeline-item .description-item {
  font-size: 14.5px;
  line-height: 1.6;
  color: #cbd5e1;
  margin: 0;
  white-space: pre-line;
  text-align: left;
}

.timeline-item .description-item a {
  color: #818cf8 !important;
  text-decoration: underline;
  font-weight: 600;
}

/* Shared badges */
.sharing-with,
.shared-by {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.sharing-with .key,
.shared-by .key {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
}

.val-con {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.pill-badge {
  padding: 3px 10px;
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.2), rgba(167, 139, 250, 0.2));
  border: 1px solid rgba(79, 142, 247, 0.35);
  border-radius: 99px;
  color: #e2e8f0 !important;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.pill-badge:hover {
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.35), rgba(167, 139, 250, 0.35));
  border-color: #a78bfa;
  transform: translateY(-1px);
}
</style>