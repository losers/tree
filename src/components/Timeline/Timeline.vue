<template>
  <section class="timeline">
    <div v-if="hasItems" class="wrapper-timeline">
      <!-- <transition-group name="list" tag="p"> -->
      <div
        v-for="(timelineContent, timelineIndex) in dataTimeline"
        :key="timelineIndex"
        :class="wrapperItemClass(timelineIndex)"
      >
        <div class="section-year">
          <p v-if="hasYear(timelineContent)" class="year">{{ getYear(timelineContent) }}</p>
        </div>
        <TimelineItem
          :item-timeline="timelineContent"
          :item-index="timelineIndex"
          :date-locale="dateLocale"
          :color-dots="colorDots"
          :namesMap="namesMap"
        />
      </div>
      <!-- </transition-group> -->
    </div>
    <p v-else>{{ messageWhenNoItems }}</p>
  </section>
</template>

<script>
import TimelineItem from "./TimelineItem.vue";

export default {
  name: "Timeline",
  components: {
    TimelineItem
  },
  props: {
    timelineItems: {
      type: Array
    },
    messageWhenNoItems: {
      type: String,
      default: ""
    },
    colorDots: {
      type: String,
      default: "#2da1bf"
    },
    uniqueTimeline: {
      type: Boolean,
      default: false
    },
    uniqueYear: {
      type: Boolean,
      default: false
    },
    order: {
      type: String,
      default: ""
    },
    dateLocale: {
      type: String,
      default: ""
    },
    namesMap: {}
  },
  computed: {
    hasItems() {
      return this.timelineItems.length;
    },
    dataTimeline() {
      if (this.order === "desc")
        return this.orderItems(this.timelineItems, "desc");
      if (this.order === "asc")
        return this.orderItems(this.timelineItems, "asc");
      return this.timelineItems;
    }
  },

  methods: {
    wrapperItemClass(timelineIndex) {
      const isSameYearPreviousAndCurrent = this.checkYearTimelineItem(
        timelineIndex
      );
      const isUniqueYear =
        this.uniqueYear &&
        isSameYearPreviousAndCurrent &&
        this.order !== undefined;
      return {
        "wrapper-item": true,
        "unique-timeline": this.uniqueTimeline || isUniqueYear
      };
    },
    checkYearTimelineItem(timelineIndex) {
      const previousItem = this.dataTimeline[timelineIndex - 1];
      const nextItem = this.dataTimeline[timelineIndex + 1];
      const currentItem = this.dataTimeline[timelineIndex];
      if (!previousItem || !nextItem) {
        return false;
      }
      const fullPreviousYear = this.getYear(previousItem);
      const fullNextYear = this.getYear(nextItem);
      const fullCurrentYear = this.getYear(currentItem);
      return (
        (fullPreviousYear === fullCurrentYear &&
          fullCurrentYear === fullNextYear) ||
        fullCurrentYear === fullNextYear
      );
    },
    getYear(date) {
      return new Date(date.date).getFullYear();
    },
    hasYear(dataTimeline) {
      return dataTimeline && dataTimeline.date != undefined;
    },
    getTimelineItemsAssembled(items) {
      const itemsGroupByYear = [];
      items.forEach(item => {
        item.date = new Date(item.date);
        const fullTime = item.date.getTime();
        if (itemsGroupByYear[fullTime]) {
          return itemsGroupByYear[fullTime].push(item);
        }
        itemsGroupByYear[fullTime] = [item];
      });
      return itemsGroupByYear;
    },
    orderItems(items, typeOrder) {
      const itemsGrouped = this.getTimelineItemsAssembled(items);
      const keysItemsGrouped = Object.keys(itemsGrouped);
      const timeItemsOrdered = keysItemsGrouped.sort((a, b) => {
        if (typeOrder === "desc") {
          return b - a;
        }
        return a - b;
      });
      return timeItemsOrdered.map(timeItem => itemsGrouped[timeItem]).flat();
    }
  }
};
</script>

<style scoped>
.timeline {
  text-align: left;
  width: 100%;
  max-width: 500px;
}
.timeline .wrapper-timeline {
  position: relative;
}
.timeline .wrapper-item {
  display: grid;
  grid-template-columns: 100px 1fr;
}
.timeline .wrapper-item .section-year {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 15px;
  font-weight: bold;
  font-size: 18px;
}
.timeline .wrapper-item .section-year .year {
  margin: 0;
}
.timeline .wrapper-item.unique-timeline {
  margin-bottom: 0;
}

/* .list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translate(0px);
} */
</style>
