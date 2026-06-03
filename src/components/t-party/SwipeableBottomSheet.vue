<template>
  <div class="wrapper" :data-open="state === 'open' ? 1 : 0">
    <div class="bg" @click="()=>{setState('close');}"></div>
    <div
      ref="card"
      class="card"
      :data-state="isMove ? 'move' : state"
      :style="{ transform: `translateY(${isMove ? y : calcY()}px)` }"
    >
      <div class="pan-area" ref="pan">
        <div class="bar" ref="bar"></div>
      </div>
      <div class="contents">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Hammer from "hammerjs";

export default {
  props: {
    openY: {
      type: Number,
      default: 0.1,
    },
    defaultState: {
      type: String,
      default: "close",
    },
  },
  data() {
    return {
      mc: null,
      y: 0,
      startY: 0,
      isMove: false,
      state: this.defaultState,
      rect: {},
    };
  },
  mounted() {
    window.onresize = () => {
      this.rect = this.$refs.card.getBoundingClientRect();
    };
    this.rect = this.$refs.card.getBoundingClientRect();

    this.mc = new Hammer(this.$refs.pan);
    this.mc.get("pan").set({ direction: Hammer.DIRECTION_ALL });

    this.mc.on("panstart", (evt) => {
      this.isMove = true;
      this.startY = evt.center.y;
      this.startTop = this.calcY();
    });

    this.mc.on("panmove panup pandown", (evt) => {
      let newY = this.startTop + evt.deltaY;
      // Optionally prevent dragging too high
      if (newY < 50) newY = 50; 
      this.y = newY;
    });

    this.mc.on("panend", (evt) => {
      this.isMove = false;
      // evt.deltaY gives the total distance moved
      if (evt.deltaY > 100) {
        this.state = "close";
        setTimeout(() => {
          this.$emit("close");
        }, 300);
      } else {
        // Snap back to open if they didn't drag far enough down
        this.state = "open";
      }
    });
  },
  beforeDestroy() {
    this.mc.destroy();
    window.onresize = null;
  },
  methods: {
    calcY() {
      switch (this.state) {
        case "close":
          return this.rect.height;
        case "open":
          return this.rect.height * this.openY + 50;
        default:
          return this.y;
      }
    },
    setState(state) {
      this.state = state;

      if (state == "close") {
        setTimeout(() => {
          this.$emit("close");
        }, 300);
      }
    },
  },
};
</script>

<style scoped>
.wrapper[data-open="1"] {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
}

.wrapper[data-open="1"] .bg {
  display: block;
  transition: all 0.3s;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.card {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  background: #0a0b18;
  border-radius: 24px 24px 0 0;
  border-top: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.4);
  left: 0;
  will-change: transform;
}

.card[data-state="open"],
.card[data-state="close"] {
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.card[data-state="close"] {
  box-shadow: none;
}

.bar {
  width: 48px;
  height: 6px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 auto;
  cursor: pointer;
}

.pan-area {
  padding: 12px 0;
}

.contents {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  height: calc(100% - 42px);
  box-sizing: border-box;
}
</style>