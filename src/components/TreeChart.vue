<template>
  <table v-if="treeData.name" class="puppy-tree">
    <tr>
      <td
        :colspan="treeData.children ? treeData.children.length * 2 : 1"
        :class="{
          parentLevel: treeData.children,
          extend: treeData.children && treeData.extend,
        }"
      >
        <center>
          <div
            :class="{ node: true, hasMate: treeData.mate }"
            class="tree-node-group"
          >
            <div v-if="treeData.way_point_node" class="crown-man">
              <!-- <i class="icofont-crown"></i> -->
            </div>

            <!-- Main Member -->
            <div
              :class="['person', `person-${cardStyle}`, { 'is-waypoint': treeData.way_point_node }]"
              @click="$emit('click-node', { data: treeData, isMate: false })"
            >
              <!-- 1. FADE BOX -->
              <div v-if="cardStyle === 'fade-box'" class="card-box fade-box-inner" :class="[boxBorderClass, { 'avat-exit': treeData.way_point_node }]">
                <div class="fade-photo-wrap" :class="imageBorderClass">
                  <img :src="getImgUrl(treeData.image_url)" alt="Bloodline User" class="fade-photo-img" />
                  <div class="photo-fade-mask"></div>
                </div>
                <div class="fade-box-content">
                  <div class="name fade-name">{{ treeData.name }}</div>
                </div>
                <i class="icofont-long-arrow-left object" v-if="treeData.way_point_node"></i>
              </div>

              <!-- 2. SIDE FADE BOX -->
              <div v-else-if="cardStyle === 'side-box'" class="card-box side-box-inner" :class="[boxBorderClass, { 'avat-exit': treeData.way_point_node }]">
                <div class="side-photo-wrap" :class="imageBorderClass">
                  <img :src="getImgUrl(treeData.image_url)" alt="Bloodline User" class="side-photo-img" />
                  <div class="side-photo-fade-mask"></div>
                </div>
                <div class="side-box-content">
                  <div class="name side-name">{{ treeData.name }}</div>
                </div>
                <i class="icofont-long-arrow-left object" v-if="treeData.way_point_node"></i>
              </div>

              <!-- 3. FRAME BOX -->
              <div v-else-if="cardStyle === 'frame-box'" class="card-box frame-box-inner" :class="[boxBorderClass, { 'avat-exit': treeData.way_point_node }]">
                <div class="frame-photo-wrap" :class="imageBorderClass">
                  <img :src="getImgUrl(treeData.image_url)" alt="Bloodline User" class="frame-photo-img" />
                </div>
                <div class="frame-name-badge">
                  <div class="name frame-name">{{ treeData.name }}</div>
                </div>
                <i class="icofont-long-arrow-left object" v-if="treeData.way_point_node"></i>
              </div>

              <!-- 4. CLASSIC (Original) -->
              <div v-else class="classic-node-inner">
                <div class="avat" :class="[imageBorderClass, { 'avat-exit': treeData.way_point_node }]">
                  <img :src="getImgUrl(treeData.image_url)" alt="Bloodline User" />
                </div>
                <div class="name">{{ treeData.name }}</div>
                <i class="icofont-long-arrow-left object" v-if="treeData.way_point_node"></i>
              </div>
            </div>

            <!-- Mate / Spouse -->
            <div v-if="treeData.mate" class="mates-group">
              <div
                :class="['person', 'mate', `person-${cardStyle}`]"
                @click="
                  $emit('click-node', {
                    data: treeData.mate[index],
                    isMate: true,
                  })
                "
                v-for="(mate, index) in treeData.mate"
                :key="index"
              >
                <!-- 1. FADE BOX (Mate) -->
                <div v-if="cardStyle === 'fade-box'" class="card-box fade-box-inner mate-box" :class="boxBorderClass">
                  <div class="fade-photo-wrap" :class="imageBorderClass">
                    <img :src="getImgUrl(mate.image_url)" alt="Bloodline User" class="fade-photo-img" />
                    <div class="photo-fade-mask"></div>
                  </div>
                  <div class="fade-box-content">
                    <div class="name fade-name">{{ mate.name }}</div>
                  </div>
                </div>

                <!-- 2. SIDE FADE BOX (Mate) -->
                <div v-else-if="cardStyle === 'side-box'" class="card-box side-box-inner mate-box" :class="boxBorderClass">
                  <div class="side-photo-wrap" :class="imageBorderClass">
                    <img :src="getImgUrl(mate.image_url)" alt="Bloodline User" class="side-photo-img" />
                    <div class="side-photo-fade-mask"></div>
                  </div>
                  <div class="side-box-content">
                    <div class="name side-name">{{ mate.name }}</div>
                  </div>
                </div>

                <!-- 3. FRAME BOX (Mate) -->
                <div v-else-if="cardStyle === 'frame-box'" class="card-box frame-box-inner mate-box" :class="boxBorderClass">
                  <div class="frame-photo-wrap" :class="imageBorderClass">
                    <img :src="getImgUrl(mate.image_url)" alt="Bloodline User" class="frame-photo-img" />
                  </div>
                  <div class="frame-name-badge">
                    <div class="name frame-name">{{ mate.name }}</div>
                  </div>
                </div>

                <!-- 4. CLASSIC (Mate) -->
                <div v-else class="classic-node-inner">
                  <div class="avat green-circle" :class="imageBorderClass">
                    <img :src="getImgUrl(mate.image_url)" alt="Bloodline User" />
                  </div>
                  <div class="name">{{ mate.name }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="extend_handle" v-if="treeData.children" @click="toggleExtend(treeData)"></div>
        </center>
      </td>
    </tr>
    <tr v-if="treeData.children && treeData.extend">
      <td
        v-for="(children, index) in treeData.children"
        :key="index"
        colspan="2"
        class="childLevel"
      >
        <center>
          <TreeChart
            :key="cardStyle + '_' + imageBorderClass + '_' + boxBorderClass"
            :json="children"
            :images="img"
            @click-node="$emit('click-node', $event)"
          />
        </center>
      </td>
    </tr>
  </table>
</template>

<script>
var images1 = {};
export default {
  name: "TreeChart",
  props: ["json", "images"],

  data() {
    return {
      treeData: {},
      num: 1,
      img: this.images
    };
  },
  computed: {
    cardStyle() {
      const c = this.$store && this.$store.state.treeCustomization;
      if (!c || !c.hasBox) return "classic";
      return c.boxOrientation === "horizontal" ? "side-box" : "fade-box";
    },
    imageBorderClass() {
      const style =
        (this.$store &&
          this.$store.state.treeCustomization &&
          this.$store.state.treeCustomization.imageBorderStyle) ||
        "glow";
      return `img-border-${style}`;
    },
    boxBorderClass() {
      const style =
        (this.$store &&
          this.$store.state.treeCustomization &&
          this.$store.state.treeCustomization.boxBorderStyle) ||
        "clean";
      return `box-border-${style}`;
    },
  },
  watch: {
    json: {
      handler: function(Props) {
        let extendKey = jsonData => {
          if (images1.all) {
            jsonData.image_url = images1.all[jsonData.id];
            if (jsonData.mate) {
              for (let mate of jsonData.mate) {
                mate.image_url = images1.all[mate.id];
              }
            }
          }
          jsonData.extend =
            jsonData.extend === void 0 ? true : !!jsonData.extend;
          if (Array.isArray(jsonData.children)) {
            jsonData.children.forEach(c => {
              extendKey(c);
            });
          }
          return jsonData;
        };
        if (Props) {
          if (!images1.all) {
            images1.all = this.images;
          }
          this.treeData = extendKey(Props);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getImgUrl(imageUrl) {
      if (imageUrl) {
        if (imageUrl.startsWith("data:") || imageUrl.startsWith("http")) {
          return imageUrl;
        }
        return "data:image/png;base64, " + imageUrl;
      }
      return require("@/assets/dp.png");
    },
    toggleExtend: function(treeData) {
      treeData.extend = !treeData.extend;
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
.icofont-long-arrow-left {
  color: indianred !important;
  font-size: 40px;
  top: -89px;
  margin-left: -150px;
}
.object {
  animation: MoveUpDown 1s linear infinite;
  position: relative;
  color: rgb(132, 129, 129);
}
@keyframes MoveUpDown {
  0%,
  100% {
    left: -5px;
  }
  50% {
    left: 0px;
  }
}
.avat-exit {
  width: 5em !important;
  height: 5em !important;
  box-shadow: 0px 2px 35px -5px rgba(224, 103, 103, 1) !important;
}
.crown-man {
  transform: rotate(-50deg);
  margin-left: -88px;
  font-size: 40px;
  position: absolute;
  z-index: 10;
  margin-top: -30px;
  color: indianred;
}
.red-circle {
  border: 3px solid red !important;
}
.green-circle {
  border: 2px solid var(--tree-accent-color, rgba(244, 114, 182, 0.8));
}
table {
  border-collapse: separate !important;
  border-spacing: 0 !important;
  margin: 0 auto !important;
  width: auto !important;
}
td {
  position: relative;
  vertical-align: top;
  padding: 0 var(--tree-node-h-gap, 18px) var(--tree-node-v-gap, 50px) var(--tree-node-h-gap, 18px);
  text-align: center;
}

.extend_handle {
  position: absolute;
  left: 50%;
  bottom: 20px;
  width: 22px;
  height: 22px;
  margin-left: 5px;
  transform: translate3d(-15px, 0, 0);
  cursor: pointer;
  z-index: 5;
}
.extend_handle:before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: var(--tree-connector-width, 2px) solid;
  border-color: var(--tree-connector-color, rgba(79, 142, 247, 0.6)) var(--tree-connector-color, rgba(79, 142, 247, 0.6)) transparent transparent;
  transform: rotateZ(135deg);
  transform-origin: 50% 50% 0;
  transition: all ease 300ms;
  filter: var(--tree-connector-glow, drop-shadow(0 0 4px rgba(79, 142, 247, 0.8)));
}
.extend_handle:hover:before {
  border-color: var(--tree-accent-color, #a78bfa) var(--tree-accent-color, #a78bfa) transparent transparent;
}
.extend .extend_handle:before {
  transform: rotateZ(-45deg);
}

.extend::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 15px;
  height: 15px;
  border-left: var(--tree-connector-width, 2px) solid var(--tree-connector-color, rgba(79, 142, 247, 0.6));
  transform: translate3d(-1px, 0, 0);
  filter: var(--tree-connector-glow, drop-shadow(0 0 4px rgba(79, 142, 247, 0.8)));
}

.childLevel::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 100%;
  height: 15px;
  border-left: var(--tree-connector-width, 2px) solid var(--tree-connector-color, rgba(79, 142, 247, 0.6));
  transform: translate3d(-1px, 0, 0);
  filter: var(--tree-connector-glow, drop-shadow(0 0 4px rgba(79, 142, 247, 0.8)));
}
.childLevel::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: -15px;
  border-top: var(--tree-connector-width, 2px) solid var(--tree-connector-color, rgba(79, 142, 247, 0.6));
  filter: var(--tree-connector-glow, drop-shadow(0 0 4px rgba(79, 142, 247, 0.8)));
}
.childLevel:first-child:before,
.childLevel:last-child:before {
  display: none;
}
.childLevel:first-child:after {
  left: 50%;
  height: 15px;
  border: var(--tree-connector-width, 2px) solid;
  border-color: var(--tree-connector-color, rgba(79, 142, 247, 0.6)) transparent transparent var(--tree-connector-color, rgba(79, 142, 247, 0.6));
  border-radius: 12px 0 0 0;
  transform: translate3d(1px, 0, 0);
}
.childLevel:last-child:after {
  right: 50%;
  height: 15px;
  border: var(--tree-connector-width, 2px) solid;
  border-color: var(--tree-connector-color, rgba(79, 142, 247, 0.6)) var(--tree-connector-color, rgba(79, 142, 247, 0.6)) transparent transparent;
  border-radius: 0 12px 0 0;
  transform: translate3d(-1px, 0, 0);
}
.childLevel:first-child.childLevel:last-child::after {
  left: auto;
  border-radius: 0;
  border-color: transparent var(--tree-connector-color, rgba(79, 142, 247, 0.6)) transparent transparent;
  transform: translate3d(1px, 0, 0);
}

.node {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: flex-start;
  width: auto;
  box-sizing: border-box;
  text-align: center;
}

.mates-group {
  display: inline-flex;
  align-items: flex-start;
  margin-left: var(--tree-mate-gap, 20px);
  gap: var(--tree-mate-gap, 20px);
}

.person {
  position: relative;
  display: inline-block;
  z-index: 2;
  width: var(--tree-card-width, 100px);
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}
.person:hover {
  transform: translateY(-8px) scale(1.04);
  z-index: 10;
}

/* ==========================================================================
   CARD BOX STYLES (NO SQUARE OUTLINE AROUND CIRCLE)
   ========================================================================== */
.card-box {
  background: var(--tree-card-bg, rgba(15, 17, 35, 0.96));
  border-radius: var(--tree-box-radius, 14px);
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
}

/* All Photo Wrappers strictly follow --tree-photo-radius without extra outer borders */
.fade-photo-wrap,
.side-photo-wrap,
.frame-photo-wrap,
.avat {
  border-radius: var(--tree-photo-radius, 50%) !important;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

/* 1. Fade Box */
.fade-box-inner {
  padding-top: 10px;
  padding-bottom: 10px;
}
.fade-photo-wrap {
  width: var(--tree-photo-size, 64px);
  height: var(--tree-photo-size, 64px);
  margin: 0 auto 6px;
  background: rgba(0, 0, 0, 0.25);
}
.fade-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: inherit;
}
.photo-fade-mask {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(to bottom, transparent 35%, var(--tree-card-bg, rgba(15, 17, 35, 0.95)) 100%);
  pointer-events: none;
}
.fade-box-content {
  width: 100%;
  text-align: center;
  z-index: 2;
  padding: 0 4px;
}
.fade-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--tree-text-color, #ffffff) !important;
  text-shadow: var(--tree-text-shadow, 0 2px 4px rgba(0, 0, 0, 0.6));
  line-height: 1.3;
  margin: 0;
  white-space: normal;
  word-break: break-word;
  max-width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 2. Side Box */
.side-box-inner {
  flex-direction: row;
  padding: 8px 12px;
  gap: 10px;
  text-align: left;
}
.side-photo-wrap {
  width: var(--tree-photo-size, 54px);
  height: var(--tree-photo-size, 54px);
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.25);
}
.side-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: inherit;
}
.side-photo-fade-mask {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(to right, transparent 35%, var(--tree-card-bg, rgba(15, 17, 35, 0.95)) 100%);
  pointer-events: none;
}
.side-box-content {
  flex: 1;
  min-width: 0;
}
.side-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--tree-text-color, #ffffff) !important;
  text-shadow: var(--tree-text-shadow, 0 2px 4px rgba(0, 0, 0, 0.6));
  line-height: 1.3;
  white-space: normal;
  word-break: break-word;
}

/* 3. Frame Box */
.frame-box-inner {
  padding: 10px;
}
.frame-photo-wrap {
  width: var(--tree-photo-size, 64px);
  height: var(--tree-photo-size, 64px);
  margin-bottom: 6px;
  background: rgba(0, 0, 0, 0.25);
}
.frame-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: inherit;
}
.frame-name-badge {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 3px 8px;
  width: 100%;
}
.frame-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--tree-text-color, #ffffff) !important;
  line-height: 1.3;
}

/* 4. Classic Node (Original) */
.classic-node-inner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.classic-node-inner .avat {
  display: block;
  width: var(--tree-photo-size, 64px);
  height: var(--tree-photo-size, 64px);
  margin: auto;
  background: rgba(15, 17, 35, 0.8);
}
.classic-node-inner .avat img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: inherit;
}
.classic-node-inner .name {
  min-height: 2em;
  line-height: 1.3em;
  padding-top: 6px;
  width: 100%;
  color: var(--tree-text-color, #fff);
  font-weight: 700;
  text-shadow: var(--tree-text-shadow, 0 2px 4px rgba(0, 0, 0, 0.6));
  font-size: 13px;
  word-break: break-word;
}

/* ==========================================================================
   IMAGE BORDER STYLES (Adapts to round or square seamlessly)
   ========================================================================== */
.img-border-glow {
  border: 2px solid #4f8ef7 !important;
  box-shadow: 0 0 12px rgba(79, 142, 247, 0.65) !important;
}
.img-border-clean {
  border: 1.5px solid rgba(255, 255, 255, 0.45) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
}
.img-border-gold {
  border: 2px solid #f59e0b !important;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.45) !important;
}
.img-border-double {
  border: 3.5px double rgba(167, 139, 250, 0.95) !important;
  box-shadow: 0 0 8px rgba(167, 139, 250, 0.3) !important;
}
.img-border-dashed {
  border: 2px dashed rgba(79, 142, 247, 0.85) !important;
  box-shadow: 0 0 8px rgba(79, 142, 247, 0.25) !important;
}
.img-border-none {
  border: none !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
}

/* ==========================================================================
   BOX BORDER STYLES (Applies to outer card-box)
   ========================================================================== */
.box-border-glow {
  border: 1.5px solid #4f8ef7 !important;
  box-shadow: 0 0 18px rgba(79, 142, 247, 0.35), 0 4px 16px rgba(0, 0, 0, 0.5) !important;
}
.box-border-clean {
  border: 1.5px solid rgba(255, 255, 255, 0.14) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45) !important;
}
.box-border-gold {
  border: 1.5px solid #f59e0b !important;
  box-shadow: 0 0 14px rgba(245, 158, 11, 0.3), 0 8px 24px rgba(0, 0, 0, 0.45) !important;
}
.box-border-double {
  border: 3.5px double rgba(167, 139, 250, 0.7) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45) !important;
}
.box-border-dashed {
  border: 1.5px dashed rgba(79, 142, 247, 0.6) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45) !important;
}
.box-border-none {
  border: none !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35) !important;
}

/* Mate connector line */
.node.hasMate::after {
  content: "";
  position: absolute;
  left: 20%;
  right: 20%;
  top: var(--tree-mate-line-top, 35px);
  border-top: var(--tree-connector-width, 2px) solid var(--tree-connector-color, rgba(79, 142, 247, 0.6));
  z-index: 1;
  filter: var(--tree-connector-glow, drop-shadow(0 0 4px rgba(79, 142, 247, 0.8)));
}

/* Landscape */
.landscape {
  transform: translate(-100%, 0) rotate(-90deg);
  transform-origin: 100% 0;
}
.landscape .node {
  text-align: left;
  height: 8em;
  width: 8em;
}
.landscape .person {
  position: relative;
  transform: rotate(90deg);
  padding-left: 4.5em;
  height: 4em;
  top: 4em;
  left: -1em;
}
.landscape .person .avat {
  position: absolute;
  left: 0;
}
.landscape .person .name {
  height: 4em;
  line-height: 4em;
}
</style>
