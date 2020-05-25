<template>
  <section class="timeline-item">
    <div class="item" @mouseover="over" @mouseleave="leave">
      <span :style="getBackgroundColour(itemTimeline.color)" class="dot" />
      <h3 class="date-item">{{ getFormattedDate(itemTimeline) }}</h3>
      <i
        class="icofont-ui-edit float-right"
        @click="findme(itemTimeline)"
        v-show="show && !itemTimeline.fixed"
        style="font-size:25px"
      ></i>
      <h4 class="title-item" v-html="itemTimeline.title" />
      <p class="description-item mb-5" v-html="itemTimeline.content" v-linkified />
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
    }
  },
  data() {
    return {
      show: false
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
  margin: 0;
  padding: 5px 0;
  font-size: 15px;
  font-weight: 500;
}
.timeline-item .description-item {
  white-space: pre-line;
  white-space: pre-wrap;
  font-weight: 100;
  margin: 0;
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
</style>