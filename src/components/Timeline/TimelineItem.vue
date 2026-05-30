<template>
  <section
    class="timeline-item"
  >
    <div class="item" @mouseover="over" @mouseleave="leave">
      <!-- Dot UI -->
      <span :style="getBackgroundColour(itemTimeline.color)" class="dot glow-dot" />

      <div class="item-content-card" :class="{ 'glass-event': itemTimeline.fixed || itemTimeline.shared_by }">
        <!-- Item Date -->
        <h3 class="date-item">{{ getFormattedDate(itemTimeline) }}</h3>

        <!-- Edit button -->
        <i
          class="icofont-ui-edit float-right edit-icon"
          @click="findme(itemTimeline)"
          v-if="!itemTimeline.fixed && !itemTimeline.shared_by && !view_only"
          style="font-size: 18px; cursor: pointer; color: #4f8ef7; transition: 0.3s;"
        ></i>

        <!-- Title name -->
        <h4 class="title-item" v-html="itemTimeline.title" />

        <!-- Item Description -->
        <p
          class="description-item"
          v-html="itemTimeline.content"
          v-linkified:options="{ format: modifyURL }"
        />

        <!-- Sharedby -->
        <div class="shared-by" v-if="itemTimeline.shared_by">
          <span class="key">Shared By :</span>
          <router-link
            class="value pill-badge"
            :to="{
              name: 'PersonTimeline',
              params: { member: itemTimeline.shared_by },
            }"
            >{{ namesMap[itemTimeline.shared_by] }}</router-link
          >
        </div>

        <!-- Sharing with -->
        <div
          class="sharing-with"
          v-else-if="
            itemTimeline.shared_with && itemTimeline.shared_with.length > 0
          "
        >
          <div class="key">Sharing With :</div>
          <div class="val-con">
            <span
              v-for="(person, index) in itemTimeline.shared_with"
              :key="index"
              class="value pill-badge"
              :title="namesMap[person]"
            >
              {{ namesMap[person] }}
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
      default: "#2da1bf",
    },
    dateLocale: {
      type: String,
      default: "",
    },
    namesMap: {},
  },
  data() {
    return {
      show: false,
      showTimelineShare: false,
    };
  },
  methods: {
    modifyURL(value, type) {
      if (type == LINK_TYPE.URL) {
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
      return color ? `background:${color}` : `background:${this.colorDots}`;
    },
    getFormattedDate(item) {
      const locale = this.dateLocale || navigator.language;
      const nameMonth = item.date.toLocaleDateString(locale, { month: "long" });
      const day = item.date.getDate();
      return `${day}, ${nameMonth}`;
    },
  },
  computed: {
    view_only: {
      get() {
        return Store.state.view_only;
      },
    },
  },
};
</script>

<style scoped>
.sharing-with {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.sharing-with .key {
  font-weight: bold;
  color: #9fa1a2;
  margin-right: 10px;
}
.sharing-with .value {
  margin: 0px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sharing-with .values {
  margin-right: 5px;
}
.sharing-with .val-con {
  margin-right: 5px;
  max-width: 500px;
  white-space: nowrap;
}
.shared-by .key {
  color: #9fa1a2;
}
.shared-by .value {
  padding: 5px;
  border: 1px solid orange;
  background: palevioletred;
  border-radius: 7px;
  color: white;
  font-weight: bold !important;
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
}
.shared-by a {
  color: white !important;
}
.timeline-item .item {
  border-left: 3px solid rgba(79, 142, 247, 0.4);
  padding: 0 0 40px 15px;
  position: relative;
  width: 100%;
  word-break: break-word;
  transition: border-color 0.3s;
}
.timeline-item .item:hover {
  border-left-color: #4f8ef7;
}
.timeline-item .item-content-card {
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-top: -10px;
}
.timeline-item .item:hover .item-content-card {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.02);
}
.glass-event {
  background: rgba(15, 17, 35, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}
.timeline-item .date-item {
  margin: 0;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 2px;
  color: #4f8ef7;
  font-weight: bold;
}
.timeline-item .title-item {
  margin: 10px 0;
  padding: 5px 0;
  font-size: 22px;
  font-weight: 500;
  color: white;
}
.timeline-item .description-item {
  white-space: pre-line;
  white-space: pre-wrap;
  font-weight: 100;
  margin: 10px 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}
.timeline-item .description-item a {
  color: #a78bfa !important;
  text-decoration: underline;
}
.timeline-item .dot {
  display: block;
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  left: -9px;
  top: 10px;
  border: 3px solid #0f1123;
  transition: all 0.3s;
}
.timeline-item .item:hover .dot {
  box-shadow: 0 0 12px #4f8ef7;
  transform: scale(1.2);
}
.pill-badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.2), rgba(167, 139, 250, 0.2));
  border: 1px solid rgba(79, 142, 247, 0.3);
  border-radius: 20px;
  color: white !important;
  font-size: 13px;
  margin: 4px;
  display: inline-block;
  transition: all 0.3s;
}
.pill-badge:hover {
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.4), rgba(167, 139, 250, 0.4));
  border-color: #a78bfa;
}
.edit-icon:hover {
  text-shadow: 0 0 8px #4f8ef7;
  transform: scale(1.1);
}
</style>