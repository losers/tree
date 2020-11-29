<template>
  <div class="vue-bottom-dialog" :class="[value ? 'vue-bottom-dialog-overlay' : '']">
    <div
      v-if="value"
      class="vue-bottom-dialog-ground"
      :style="{ background: overlayColor }"
      @click="closeDialog"
    >
      <v-touch
        :style="{ width: '100%', height: '400px', background:'red' }"
        @swipedown="closeDialog"
        @pandown="onPanDown"
        @panup="onPanUp"
        @panstart="onPanStart"
        @panend="onPanEnd"
        :pan-options="{ direction: 'vertical', threshold: 1 }"
      ></v-touch>
    </div>
    <div
      class="vue-bottom-dialog-wrapper"
      :class="!drag ? 'vue-bottom-dialog-wrapper-transition' : ''"
      :style="{
        height: `${calculatedHeight}px`,
        background: backgroundColor,
        borderTopLeftRadius: topRadius,
        borderTopRightRadius: topRadius
      }"
    >
      <v-touch
        class="vue-bottom-dialog-wrapper-touch"
        @swipedown="closeDialog"
        @pandown="onPanDown"
        @panup="onPanUp"
        @panstart="onPanStart"
        @panend="onPanEnd"
        :pan-options="{ direction: 'vertical', threshold: 1 }"
        ><div
          v-if="!hideIndent"
          class="vue-bottom-dialog-wrapper-touch-indent"
          :style="{ background: indentColor }"
        ></div
      ></v-touch>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 100
    },
    backgroundColor: {
      type: String,
      default: '#757575'
    },
    indentColor: {
      type: String,
      default: '#FFF'
    },
    overlayColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.5)'
    },
    hideIndent: {
      type: Boolean,
      default: false
    },
    topRadius: {
      type: String,
      default: '20px'
    }
  },
  data: () => {
    return {
      dialog: false,
      offset: 0,
      dialogCloseInterval: null,
      drag: false
    };
  },
  created: function () {
    if (this.value) {
      this.offset = this.height;
    }
  },
  methods: {
    async closeDialog() {
      this.offset = 0;
      await Vue.nextTick();
      this.$emit('input', false);
    },
    onPanDown(event) {
      if (event.deltaY > 0) {
        this.offset = this.height - event.deltaY;
      }
    },
    onPanUp(event) {
      if (this.offset > 0 && event.deltaY > 0) {
        this.offset = this.height - event.deltaY;
      }
    },
    onPanStart() {
      this.drag = true;
    },
    onPanEnd() {
      this.drag = false;
      if (this.height / 2 < this.offset) {
        this.offset = this.height;
      } else {
        this.offset = 0;
        this.$emit('input', false);
      }
    }
  },
  watch: {
    value: function(newValue, oldValue) {
      console.log(oldValue);
      if (newValue) {
        this.offset = this.height;
      }
    }
  },
  computed: {
    calculatedHeight: function() {
      if (this.value) {
        return this.offset;
      }
      return 0;
    },
  }
};
</script>
<style scoped>
.vue-bottom-dialog {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  background: red;
}
.vue-bottom-dialog-overflow {
  overflow: hidden;
}
.vue-bottom-dialog-overlay {
  top: 0;
}
.vue-bottom-dialog-ground {
  position: fixed;
  width: 100%;
  height: 100%;
}
.vue-bottom-dialog-wrapper {
  position: absolute;
  width: 100%;
  bottom: 0;
}
.vue-bottom-dialog-wrapper-transition {
  -webkit-transition: height 0.3s ease;
  -moz-transition: height 0.3s ease;
  -ms-transition: height 0.3s ease;
  -o-transition: height 0.3s ease;
  transition: height 0.3s ease;
}
.vue-bottom-dialog-wrapper-touch {
  width: 100%;
  display: flex;
}
.vue-bottom-dialog-wrapper-touch-indent {
  width: 40px;
  height: 8px;
  border-radius: 20px;
  margin: 10px auto 10px auto;
}
</style>
