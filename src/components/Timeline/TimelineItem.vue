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
        style="font-size:25px"
      ></i>

      <!-- Title name -->
      <h4 class="title-item" v-html="itemTimeline.title" />

      <!-- Item Description -->
      <p class="description-item mb-2" v-html="itemTimeline.content" v-linkified />

      <!-- Sharedby -->
      <p class="person p-1" v-if="itemTimeline.shared_by">Shared By :{{namesMap[itemTimeline.shared_by]}}</p>

      <!-- Sharing with -->
      <div class="row" v-else-if="itemTimeline.shared_with">
        Sharing With :
        <div v-for="(person, index) in itemTimeline.shared_with" :key="index">
          <p class="person p-1">{{namesMap[person]}}</p>
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
.timeline-item .item {
  border-left: 5px solid #ccd5db;
  padding: 20px 0 20px 15px;
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
  font-size: 15px;
  font-weight: 500;
}
.timeline-item .description-item {
  white-space: pre-line;
  white-space: pre-wrap;
  font-weight: 100;
  margin: 15px;
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