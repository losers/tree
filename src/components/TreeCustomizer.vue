<template>
  <div class="customizer-overlay" v-if="isOpen">
    <!-- Backdrop -->
    <div class="customizer-backdrop" @click="close"></div>

    <!-- Clean Single Screen Panel -->
    <div class="customizer-card" :class="{ 'mobile-card': $device && $device.mobile }">
      <!-- Header -->
      <div class="card-header">
        <h4 class="card-title">Customize Tree</h4>
        <button class="btn-close" @click="close" title="Close">
          <i class="icofont-close-line"></i>
        </button>
      </div>

      <!-- Settings Body (3 Logical Sections) -->
      <div class="card-body">

        <!-- ============================================================
             SECTION 1: NODE BOX STYLE
             ============================================================ -->
        <div class="setting-section">
          <div class="section-heading">
            <i class="icofont-ui-browser heading-icon"></i>
            <span>Box Style</span>
          </div>

          <!-- Wrap in Box Toggle -->
          <div class="switch-row">
            <div>
              <div class="switch-title">Wrap in Card Box</div>
              <div class="switch-desc">Enclose members inside structured card boxes</div>
            </div>
            <label class="toggle-switch">
              <input
                type="checkbox"
                :checked="customization.hasBox"
                @change="updateProperty('hasBox', $event.target.checked)"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- When Box is Turned On: Orientation, Box Radius, and Box Border Style -->
          <transition name="fade">
            <div v-if="customization.hasBox" class="box-subsettings mt-3">
              <!-- Orientation Selection (Vertical vs Horizontal) -->
              <label class="section-label">Orientation</label>
              <div class="btn-toggle-pair">
                <button
                  type="button"
                  class="toggle-choice-btn"
                  :class="{ active: customization.boxOrientation === 'vertical' }"
                  @click="updateProperty('boxOrientation', 'vertical')"
                >
                  <i class="icofont-navigation-menu mr-1"></i>
                  Vertical (Stacked)
                </button>
                <button
                  type="button"
                  class="toggle-choice-btn"
                  :class="{ active: customization.boxOrientation === 'horizontal' }"
                  @click="updateProperty('boxOrientation', 'horizontal')"
                >
                  <i class="icofont-curved-right mr-1"></i>
                  Horizontal (Side)
                </button>
              </div>

              <!-- Box Border Radius -->
              <div class="section-row mt-3">
                <label class="section-label">Box Radius</label>
                <span class="val-badge">{{ customization.boxRadius }}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="28"
                step="2"
                :value="customization.boxRadius"
                @input="updateProperty('boxRadius', Number($event.target.value))"
                class="clean-slider"
              />

              <!-- Box Border Style -->
              <label class="section-label mt-3">Box Border Style</label>
              <div class="pill-group">
                <button
                  v-for="b in borderStyles"
                  :key="'box-' + b.id"
                  class="pill-btn"
                  :class="{ active: customization.boxBorderStyle === b.id }"
                  @click="updateProperty('boxBorderStyle', b.id)"
                >
                  {{ b.label }}
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- ============================================================
             SECTION 2: IMAGE STYLE
             ============================================================ -->
        <div class="setting-section">
          <div class="section-heading">
            <i class="icofont-image heading-icon"></i>
            <span>Image Style</span>
          </div>

          <!-- Photo Size -->
          <div class="section-row">
            <label class="section-label">Photo Size</label>
            <span class="val-badge">{{ customization.photoSize }}px</span>
          </div>
          <input
            type="range"
            min="44"
            max="100"
            step="4"
            :value="customization.photoSize"
            @input="updateProperty('photoSize', Number($event.target.value))"
            class="clean-slider"
          />

          <!-- Image Border Radius (Always visible) -->
          <div class="section-row mt-3">
            <label class="section-label">Image Border Radius</label>
            <span class="val-badge">{{ customization.photoRadius }}% ({{ imageRadiusLabel }})</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            :value="customization.photoRadius"
            @input="updateProperty('photoRadius', Number($event.target.value))"
            class="clean-slider"
          />

          <!-- Image Border Style -->
          <label class="section-label mt-3">Image Border Style</label>
          <div class="pill-group">
            <button
              v-for="b in borderStyles"
              :key="'img-' + b.id"
              class="pill-btn"
              :class="{ active: customization.imageBorderStyle === b.id }"
              @click="updateProperty('imageBorderStyle', b.id)"
            >
              {{ b.label }}
            </button>
          </div>
        </div>

        <!-- ============================================================
             SECTION 3: CANVAS SETTINGS
             ============================================================ -->
        <div class="setting-section">
          <div class="section-heading">
            <i class="icofont-paint-brush heading-icon"></i>
            <span>Canvas Settings</span>
          </div>

          <!-- Background Detailing -->
          <label class="section-label">Background Detailing</label>
          <div class="pill-group">
            <button
              v-for="d in bgDetailings"
              :key="d.id"
              class="pill-btn"
              :class="{ active: customization.bgDetailing === d.id }"
              @click="updateProperty('bgDetailing', d.id)"
            >
              {{ d.label }}
            </button>
          </div>

          <!-- Canvas Decorative Frame -->
          <label class="section-label mt-3">Decorative Frame</label>
          <div class="pill-group">
            <button
              v-for="f in canvasFrames"
              :key="f.id"
              class="pill-btn"
              :class="{ active: customization.canvasFrame === f.id }"
              @click="updateProperty('canvasFrame', f.id)"
            >
              {{ f.label }}
            </button>
          </div>

          <!-- Tree Spacing: Horizontal -->
          <div class="section-row mt-3">
            <label class="section-label">Node Spacing (Horizontal)</label>
            <span class="val-badge">{{ customization.nodeHGap }}px</span>
          </div>
          <input
            type="range"
            min="8"
            max="40"
            step="2"
            :value="customization.nodeHGap"
            @input="updateProperty('nodeHGap', Number($event.target.value))"
            class="clean-slider"
          />

          <!-- Tree Spacing: Vertical -->
          <div class="section-row mt-3">
            <label class="section-label">Level Spacing (Vertical)</label>
            <span class="val-badge">{{ customization.nodeVGap }}px</span>
          </div>
          <input
            type="range"
            min="30"
            max="80"
            step="5"
            :value="customization.nodeVGap"
            @input="updateProperty('nodeVGap', Number($event.target.value))"
            class="clean-slider"
          />

          <!-- Background Ambient Animation -->
          <div class="switch-row mt-3">
            <div>
              <div class="switch-title">Ambient Background Glow</div>
              <div class="switch-desc">Soft, floating atmospheric light</div>
            </div>
            <label class="toggle-switch">
              <input
                type="checkbox"
                :checked="customization.bgAnimation"
                @change="updateProperty('bgAnimation', $event.target.checked)"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="card-footer">
        <button class="footer-btn btn-reset" @click="resetDefaults">
          Reset to Default
        </button>
        <button class="footer-btn btn-done" @click="close">
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BORDER_STYLES,
  BG_DETAILINGS,
  CANVAS_FRAMES,
  computeCardStyle,
} from "@/util/treeThemes";

export default {
  name: "TreeCustomizer",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      borderStyles: BORDER_STYLES,
      bgDetailings: BG_DETAILINGS,
      canvasFrames: CANVAS_FRAMES,
    };
  },
  computed: {
    customization() {
      return this.$store.state.treeCustomization;
    },
    imageRadiusLabel() {
      const r = Number(this.customization.photoRadius);
      if (r >= 45) return "Circle";
      if (r <= 5) return "Square";
      return "Rounded";
    },
  },
  methods: {
    updateProperty(key, value) {
      const updated = { ...this.customization, [key]: value };
      if (key === "hasBox" || key === "boxOrientation") {
        updated.cardStyle = computeCardStyle(updated.hasBox, updated.boxOrientation);
      }
      this.$store.commit("setTreeCustomization", updated);
      this.$store.dispatch("updateTreeCustomization", updated);
    },
    resetDefaults() {
      this.$store.commit("resetTreeCustomization");
      this.$store.dispatch("resetTreeCustomization");
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.customizer-overlay {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  justify-content: flex-end;
  pointer-events: auto;
}

.customizer-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
}

.customizer-card {
  position: relative;
  width: 360px;
  max-width: 92vw;
  height: 100%;
  background: #0f121d;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 35px rgba(0, 0, 0, 0.55);
  color: #fff;
  z-index: 2;
  animation: slideRight 0.25s ease-out;
}

.customizer-card.mobile-card {
  width: 100%;
  max-width: 100vw;
  height: auto;
  max-height: 85vh;
  margin-top: auto;
  border-left: none;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px 20px 0 0;
  animation: slideUp 0.25s ease-out;
}

@keyframes slideRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* Header */
.card-header {
  padding: 16px 20px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.3px;
}

.btn-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Body */
.card-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.setting-section {
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.setting-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

/* Section Heading */
.section-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.4px;
  margin-bottom: 12px;
}

.heading-icon {
  font-size: 15px;
  color: #4f8ef7;
}

.section-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 6px;
}

.section-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.section-row .section-label {
  margin-bottom: 0;
}

.val-badge {
  font-size: 11px;
  font-weight: 700;
  color: #4f8ef7;
  background: rgba(79, 142, 247, 0.15);
  padding: 2px 7px;
  border-radius: 5px;
}

/* Toggle choice pair */
.btn-toggle-pair {
  display: flex;
  gap: 8px;
}

.toggle-choice-btn {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-choice-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.toggle-choice-btn.active {
  background: rgba(79, 142, 247, 0.2);
  border-color: #4f8ef7;
  color: #60a5fa;
  box-shadow: 0 0 10px rgba(79, 142, 247, 0.25);
}

.box-subsettings {
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Pill Group for Border Styles & Detailing */
.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.pill-btn {
  padding: 5px 11px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.pill-btn.active {
  background: #4f8ef7;
  color: #fff;
  border-color: #4f8ef7;
  box-shadow: 0 2px 8px rgba(79, 142, 247, 0.4);
}

/* Range Sliders */
.clean-slider {
  width: 100%;
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.15);
  outline: none;
  cursor: pointer;
  accent-color: #4f8ef7;
  margin: 6px 0 0;
}

/* Switch Rows */
.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
}

.switch-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.switch-desc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 1px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.18);
  transition: 0.25s;
  border-radius: 22px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.25s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background: #4f8ef7;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(18px);
}

/* Footer */
.card-footer {
  padding: 14px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
}

.footer-btn {
  flex: 1;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-reset {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
}

.btn-reset:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.btn-done {
  background: #4f8ef7;
  color: #fff;
  box-shadow: 0 4px 14px rgba(79, 142, 247, 0.35);
}

.btn-done:hover {
  background: #3b82f6;
  transform: translateY(-1px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
