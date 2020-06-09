<template>
  <section class="timeline-item">
    <div class="item" @mouseover="over" @mouseleave="leave">
      <!-- Dot UI -->
      <span :style="getBackgroundColour(itemTimeline.color)" class="dot" />

      <!-- Item Date -->
      <h3 class="date-item">{{ getFormattedDate(itemTimeline) }}</h3>

      <!-- Edit button -->
      <i
        class="icofont-ui-edit float-right"
        @click="findme(itemTimeline)"
        v-show="show && !itemTimeline.fixed && !itemTimeline.shared_by"
        style="font-size:18px;cursor: pointer;"
      ></i>

      <!-- Title name -->
      <h4 class="title-item" v-html="itemTimeline.title" />

      <!-- Item Description -->
      <p class="description-item" v-html="itemTimeline.content" v-linkified />

      <!-- Sharedby -->
      <p class="shared-by" v-if="itemTimeline.shared_by">
        <span class="key">Shared By :</span>
        <span class="value">{{namesMap[itemTimeline.shared_by]}}</span>
      </p>

      <!-- Sharing with -->
      <div class="sharing-with" v-else-if="itemTimeline.shared_with">
        <div class="key">Sharing With :</div>
        <div class="val-con">
          <div v-for="(person, index) in itemTimeline.shared_with" :key="index" class="values">
            <p class="value">{{namesMap[person]}},</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "TimelineItem",
  props: {
    itemTimeline: {
      type: Object,
      default: () => ({})
    },
    colorDots: {
      type: String,
      default: "#2da1bf"
    },
    dateLocale: {
      type: String,
      default: ""
    },
    namesMap: {}
  },
  data() {
    return {
      show: false,
      showTimelineShare: false
    };
  },
  methods: {
    over() {
      this.show = true;
    },
    leave() {
      this.show = false;
    },
    findme(data) {
      this.$root.$emit("edit-timeline", data);
    },
    getBackgroundColour(color) {
      return color ? `background:${color}` : `background:${this.colorDots}`;
    },
    getFormattedDate(item) {
      const locale = this.dateLocale || navigator.language;
      const nameMonth = item.date.toLocaleDateString(locale, { month: "long" });
      const day = item.date.getDate();
      return `${day}, ${nameMonth}`;
    }
  }
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
}
.sharing-with .values {
  margin-right: 5px;
}
.sharing-with .val-con {
  margin-right: 5px;
  display: flex;
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
.timeline-item .item {
  border-left: 5px solid #ccd5db;
  padding: 20px 0 40px 15px;
  position: relative;
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
</style>