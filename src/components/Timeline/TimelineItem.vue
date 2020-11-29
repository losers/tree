<template>
  <section
    class="timeline-item"
    :class="{ bgfade: itemTimeline.fixed || itemTimeline.shared_by }"
  >
    <div class="item" @mouseover="over" @mouseleave="leave">
      <!-- Dot UI -->
      <span :style="getBackgroundColour(itemTimeline.color)" class="dot" />

      <!-- Item Date -->
      <h3 class="date-item">{{ getFormattedDate(itemTimeline) }}</h3>

      <!-- Edit button -->
      <i
        class="icofont-ui-edit float-right"
        @click="findme(itemTimeline)"
        v-show="
          show && !itemTimeline.fixed && !itemTimeline.shared_by && !view_only
        "
        style="font-size: 18px; cursor: pointer"
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
          class="value"
          :to="{
            name: 'TimelinePerson',
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
          <!-- <div class="values"> -->
          <p
            v-for="(person, index) in itemTimeline.shared_with"
            :key="index"
            class="value"
            :title="namesMap[person]"
          >
            {{ namesMap[person] }},
          </p>
          <!-- </div> -->
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
  margin: 15px;
  margin-top: 40px;
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
.shared-by {
  margin: 15px;
  margin-top: 40px;
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
  border-left: 5px solid #ccd5db;
  padding: 20px 0 40px 15px;
  position: relative;
  width: 100%;
  word-break: break-word;
}
.timeline-item .date-item {
  margin: 0;
  text-transform: uppercase;
  font-size: 16px;
  letter-spacing: 2px;
}
.timeline-item .title-item {
  margin: 15px;
  padding: 5px 0;
  font-size: 22px;
  font-weight: 500;
}
.timeline-item .description-item {
  white-space: pre-line;
  white-space: pre-wrap;
  font-weight: 100;
  margin: 15px;
  font-size: 16px;
}
.timeline-item .dot {
  display: block;
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  left: -10px;
  top: 26px;
}
.person {
  border: solid #eaeaea 2px;
  border-radius: 15%;
  margin-right: 10px;
  margin-left: 25px;
}

.bgfade {
  background-color: #f7f7f7;
}
</style>