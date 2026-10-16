<template>
  <div
    class="theme-toggle-container"
    :class="[
      { 'is-collapsed': isCollapsed },
      { 'is-dark': isDark },
      { 'is-light': !isDark }
    ]"
    @click="toggleTheme"
    :title="isCollapsed ? (isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme') : ''"
  >
    <!-- Collapsed Tooltip -->
    <div v-if="isCollapsed" class="theme-collapsed-tooltip">
      <span class="tooltip-text">{{ isDark ? 'Light Theme' : 'Dark Theme' }}</span>
      <span class="tooltip-shortcut">✦</span>
    </div>

    <!-- Toggle Action Button Content -->
    <div class="theme-toggle-btn">
      <!-- Animated Celestial Orb -->
      <div class="celestial-orb" :class="{ 'spin-anim': isAnimating }">
        <!-- Sun Rays -->
        <svg class="sun-rays-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="3" stroke-width="2.5" stroke-linecap="round" />
          <line x1="12" y1="21" x2="12" y2="23" stroke-width="2.5" stroke-linecap="round" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke-width="2.5" stroke-linecap="round" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke-width="2.5" stroke-linecap="round" />
          <line x1="1" y1="12" x2="3" y2="12" stroke-width="2.5" stroke-linecap="round" />
          <line x1="21" y1="12" x2="23" y2="12" stroke-width="2.5" stroke-linecap="round" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke-width="2.5" stroke-linecap="round" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke-width="2.5" stroke-linecap="round" />
        </svg>

        <!-- Moon / Sun Central Core -->
        <svg class="celestial-core-svg" viewBox="0 0 24 24">
          <mask id="celestial-mask">
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <circle class="mask-moon-bite" cx="19" cy="5" r="7" fill="black" />
          </mask>
          <circle
            class="core-circle"
            cx="12"
            cy="12"
            r="8"
            mask="url(#celestial-mask)"
          />
        </svg>

        <!-- Twinkling stars for dark mode -->
        <div class="night-stars">
          <span class="star star-1">✦</span>
          <span class="star star-2">·</span>
          <span class="star star-3">✦</span>
        </div>
      </div>

      <!-- Expanded State Details -->
      <transition name="fade">
        <div v-if="!isCollapsed" class="theme-text-block">
          <span class="theme-label">Theme</span>
          <span class="theme-status">
            {{ isDark ? 'Dark Mode' : 'Light Mode' }}
          </span>
        </div>
      </transition>

      <!-- Animated Switch Track for Expanded State -->
      <transition name="fade">
        <div v-if="!isCollapsed" class="theme-track">
          <div class="theme-track-glow"></div>
          <div class="theme-thumb">
            <span class="thumb-icon">{{ isDark ? '🌙' : '☀️' }}</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Store from "@/store/index";

export default {
  name: "ThemeToggle",
  props: {
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isAnimating: false,
    };
  },
  computed: {
    theme() {
      return Store.state.theme || "dark";
    },
    isDark() {
      return this.theme === "dark";
    },
  },
  mounted() {
    this.applyTheme(this.theme);
  },
  methods: {
    toggleTheme() {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 600);

      const nextTheme = this.isDark ? "light" : "dark";
      this.applyTheme(nextTheme);
      this.$emit("theme-changed", nextTheme);
    },
    applyTheme(theme) {
      Store.commit("setTheme", theme);
      try {
        localStorage.setItem("bloodline-theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
        if (theme === "light") {
          document.body.classList.add("theme-light");
          document.body.classList.remove("theme-dark");
        } else {
          document.body.classList.add("theme-dark");
          document.body.classList.remove("theme-light");
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style scoped>
.theme-toggle-container {
  position: relative;
  margin: 12px 14px;
  user-select: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Base button styles */
.theme-toggle-btn {
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 16px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: visible;
}

.is-dark .theme-toggle-btn {
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.is-light .theme-toggle-btn {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.theme-toggle-btn:hover {
  transform: translateY(-2px);
}

.is-dark .theme-toggle-btn:hover {
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(79, 142, 247, 0.3);
  box-shadow: 0 8px 25px rgba(79, 142, 247, 0.2);
}

.is-light .theme-toggle-btn:hover {
  background: #ffffff;
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.18);
}

/* Collapsed state styling */
.is-collapsed {
  margin: 10px auto;
  display: flex;
  justify-content: center;
}

.is-collapsed .theme-toggle-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  justify-content: center;
  border-radius: 12px;
}

/* Celestial Orb */
.celestial-orb {
  position: relative;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.spin-anim {
  animation: orbRotate 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes orbRotate {
  0% { transform: scale(0.8) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
  100% { transform: scale(1) rotate(360deg); }
}

/* Sun Rays SVG */
.sun-rays-svg {
  position: absolute;
  width: 26px;
  height: 26px;
  color: #f59e0b;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.is-dark .sun-rays-svg {
  opacity: 0;
  transform: scale(0) rotate(-90deg);
}

.is-light .sun-rays-svg {
  opacity: 1;
  transform: scale(1) rotate(0deg);
  animation: sunRaysPulse 4s infinite linear;
}

@keyframes sunRaysPulse {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Celestial Core SVG */
.celestial-core-svg {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 2;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.core-circle {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.is-dark .core-circle {
  fill: #818cf8;
  filter: drop-shadow(0 0 6px rgba(129, 140, 248, 0.6));
}

.is-light .core-circle {
  fill: #f59e0b;
  filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.6));
}

.mask-moon-bite {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.is-dark .mask-moon-bite {
  cx: 17;
  cy: 7;
  r: 7;
}

.is-light .mask-moon-bite {
  cx: 30;
  cy: -6;
  r: 7;
}

/* Night Stars */
.night-stars {
  position: absolute;
  inset: -6px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.is-dark .night-stars {
  opacity: 1;
}

.star {
  position: absolute;
  color: #c7d2fe;
  font-size: 8px;
  line-height: 1;
}

.star-1 {
  top: 0px;
  right: 0px;
  animation: starTwinkle 2s infinite ease-in-out;
}

.star-2 {
  bottom: 2px;
  left: 2px;
  font-size: 10px;
  animation: starTwinkle 2.5s infinite ease-in-out 0.5s;
}

.star-3 {
  top: 14px;
  right: -2px;
  font-size: 6px;
  animation: starTwinkle 1.8s infinite ease-in-out 1s;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.7); }
  50% { opacity: 1; transform: scale(1.3); }
}

/* Expanded Text Block */
.theme-text-block {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  flex: 1;
  text-align: left;
}

.theme-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.is-dark .theme-label {
  color: #64748b;
}

.is-light .theme-label {
  color: #94a3b8;
}

.theme-status {
  font-size: 13px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: color 0.3s ease;
}

.is-dark .theme-status {
  color: #f1f5f9;
}

.is-light .theme-status {
  color: #0f172a;
}

/* Animated Switch Track */
.theme-track {
  width: 44px;
  height: 24px;
  border-radius: 20px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 2px;
  transition: all 0.4s ease;
}

.is-dark .theme-track {
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  border: 1px solid rgba(129, 140, 248, 0.3);
}

.is-light .theme-track {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.theme-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.is-dark .theme-thumb {
  transform: translateX(0px);
  background: #6366f1;
}

.is-light .theme-thumb {
  transform: translateX(20px);
  background: #f59e0b;
}

.thumb-icon {
  line-height: 1;
}

/* Collapsed Floating Tooltip */
.theme-collapsed-tooltip {
  position: absolute;
  left: 80px;
  top: 50%;
  transform: translateY(-50%) translateX(6px);
  opacity: 0;
  visibility: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 12px;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 1000;
}

.is-dark .theme-collapsed-tooltip {
  background: rgba(15, 17, 35, 0.95);
  backdrop-filter: blur(24px);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.is-light .theme-collapsed-tooltip {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(24px);
  color: #0f172a;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.is-collapsed:hover .theme-collapsed-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0px);
}

.tooltip-shortcut {
  font-size: 10px;
  color: #a78bfa;
}

.is-light .tooltip-shortcut {
  color: #f59e0b;
}

/* Fade transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
