<template>
  <div class="bloodline-app">
    <section v-if="errored">
      <p class="error-msg">{{ errored }}</p>
    </section>
    <section v-else>

      <!-- ===== NAVBAR ===== -->
      <nav class="navbar-glass">
        <div class="nav-brand">
          <span class="brand-icon">🧬</span>
          <span class="brand-name">Bloodline</span>
        </div>
        <button class="btn-create-nav" @click="addFamilyBtn">
          <span class="btn-plus">+</span> Create Your Family
        </button>
      </nav>

      <!-- ===== HERO SECTION ===== -->
      <div class="hero-section">
        <!-- Animated particle canvas background -->
        <div class="hero-bg">
          <vue-particles
            class="particles-canvas"
            color="#4f8ef7"
            :particleOpacity="0.6"
            :particlesNumber="60"
            shapeType="circle"
            :particleSize="3"
            linesColor="#4f8ef7"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.3"
            :linesDistance="160"
            :moveSpeed="2"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
          ></vue-particles>
          <!-- Gradient overlays -->
          <div class="hero-glow hero-glow-1"></div>
          <div class="hero-glow hero-glow-2"></div>
        </div>

        <!-- Hero Content -->
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Discover Your Ancestry
          </div>
          <h1 class="hero-title">
            <span class="title-white">Discover Your</span><br />
            <span class="title-gradient">Ancestry</span>
          </h1>
          <p class="hero-subtitle">
            Connect with your roots and preserve your family legacy in our<br />
            exclusive, high-end lineage directory.
          </p>

          <!-- Search Bar -->
          <div class="hero-search-wrap">
            <form class="hero-search-form" @submit.prevent="handleSearch">
              <span class="search-icon">🔍</span>
              <input
                v-model="searchQuery"
                type="text"
                class="hero-search-input"
                placeholder="Search lineages, surnames, or ancestors..."
              />
              <button type="submit" class="search-submit-btn">⌘K</button>
            </form>
          </div>
        </div>
      </div>

      <!-- ===== FAMILIES SECTION ===== -->
      <div class="families-section">
        <div class="families-container">
          <!-- Tab Bar -->
          <TabBar style="margin-bottom: 32px;"></TabBar>

          <!-- Conditional Family Lists -->
          <div v-if="!$route.hash">
            <AllFamilies :search-override="searchQuery"></AllFamilies>
          </div>
          <div v-else-if="$route.hash === '#demo'">
            <DemoFamilies></DemoFamilies>
          </div>
          <div v-else-if="$route.hash === '#super'">
            <SuperFamilies></SuperFamilies>
          </div>
        </div>
      </div>

      <!-- ===== CTA SECTION ===== -->
      <div class="cta-section">
        <div class="cta-card">
          <div class="cta-icon-wrap">
            <span class="cta-icon">👨‍👩‍👧‍👦</span>
          </div>
          <h2 class="cta-title">
            Start Your Own <span class="cta-accent">Legacy</span>
          </h2>
          <p class="cta-desc">
            Join thousands of families worldwide who have chosen Bloodline to<br />
            safeguard their historical records and heritage.
          </p>
          <button class="btn-cta-main" @click="addFamilyBtn">
            Begin Your Family Tree &rarr;
          </button>
        </div>
      </div>

      <!-- ===== FOOTER ===== -->
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-brand">
            <span class="brand-icon">🧬</span>
            <span class="brand-name">Bloodline</span>
          </div>
          <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support Center</a>
          </div>
          <p class="footer-copy">© 2025 Bloodline. Excellence in Ancestry.</p>
        </div>
      </footer>

      <!-- ===== MODALS ===== -->
      <!-- 1. Create a Tree -->
      <DualPage
        :reference="0"
        v-if="showModal"
        v-on:closed="showModal = false"
      ></DualPage>

      <!-- 2. Auth PIN -->
      <DualPage
        :payload="authPayload"
        :reference="5"
        v-if="showAuthBox"
        v-on:closed="showAuthBox = false"
      ></DualPage>

      <!-- 3. Mobile Help -->
      <DualPage
        :payload="{}"
        :reference="6"
        v-if="helper.show"
        v-on:closed="helper.show = false"
      ></DualPage>

      <!-- Mobile Help FAB -->
      <button
        class="help-fab"
        v-if="$device.mobile"
        @click="helperFunc"
      >💬</button>

    </section>
  </div>
</template>

<script>
import DualPage from "@/modals/DualPage";
import TabBar from "./components/TabBar";
import SuperFamilies from "./layout/Super";
import DemoFamilies from "./layout/Demo";
import AllFamilies from "./layout/All";

export default {
  data() {
    return {
      errored: false,
      showModal: false,
      curFamily: "",
      showAuthBox: false,
      authPayload: {},
      helper: { show: false },
      notificationsIcon: false,
      searchQuery: "",
    };
  },
  components: {
    DualPage,
    TabBar,
    SuperFamilies,
    DemoFamilies,
    AllFamilies,
  },
  methods: {
    handleSearch() {
      // Trigger search in AllFamilies if on All tab (via prop)
    },
    showAuth(surname, title, isCeleb, family_id, contact) {
      this.authPayload = { surname, title, isCeleb, family_id, contact };
      this.showAuthBox = true;
    },
    addFamilyBtn() {
      if (navigator.cookieEnabled) {
        this.showModal = true;
      } else {
        alert("Please enable cookies to Start creating a family");
      }
    },
    helperFunc() {
      try {
        print.postMessage("teddy");
      } catch (e) {
        this.helper.show = true;
      }
    },
    showNotifications() {
      try {
        print.postMessage("notifications");
      } catch (error) {
        console.log();
      }
    },
    toggleBodyClass(addRemoveClass, className) {
      const el = document.body;
      if (addRemoveClass === "addClass") {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },
  },
  destroyed() {
    this.toggleBodyClass("removeClass");
  },
  mounted() {
    this.toggleBodyClass("addClass");
    try {
      print.postMessage("show Notifications");
      this.notificationsIcon = true;
    } catch (error) {
      // silent
    }
  },
};
</script>

<style>
/* ===== GLOBAL RESET & FONTS ===== */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* {
  box-sizing: border-box;
}

.bloodline-app {
  font-family: 'Inter', sans-serif;
  background: #05060f;
  min-height: 100vh;
  color: #fff;
  overflow-x: hidden;
}

/* ===== NAVBAR ===== */
.navbar-glass {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: rgba(5, 6, 15, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  font-size: 22px;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: #fff;
}

.btn-create-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: rgba(79, 142, 247, 0.15);
  border: 1px solid rgba(79, 142, 247, 0.4);
  border-radius: 50px;
  color: #7eb3ff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'Inter', sans-serif;
}

.btn-create-nav:hover {
  background: rgba(79, 142, 247, 0.3);
  border-color: rgba(79, 142, 247, 0.7);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(79, 142, 247, 0.2);
}

.btn-plus {
  font-size: 16px;
}

/* ===== HERO ===== */
.hero-section {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-top: 80px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(30, 50, 110, 0.7) 0%, #05060f 70%);
}

.particles-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  height: 100%;
  width: 100%;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.hero-glow-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(79, 142, 247, 0.25) 0%, transparent 70%);
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
}

.hero-glow-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(138, 79, 247, 0.2) 0%, transparent 70%);
  bottom: -50px;
  right: 10%;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 60px 24px 80px;
  max-width: 700px;
  animation: heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(79, 142, 247, 0.12);
  border: 1px solid rgba(79, 142, 247, 0.3);
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
  color: #7eb3ff;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4f8ef7;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
}

.hero-title {
  font-size: clamp(40px, 7vw, 72px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -2px;
  margin: 0 0 20px;
}

.title-white {
  color: #fff;
}

.title-gradient {
  background: linear-gradient(135deg, #4f8ef7 0%, #a78bfa 50%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease-in-out infinite alternate;
}

@keyframes gradientShift {
  from { filter: hue-rotate(0deg); }
  to   { filter: hue-rotate(30deg); }
}

.hero-subtitle {
  font-size: 16px;
  color: rgba(255,255,255,0.55);
  line-height: 1.7;
  margin-bottom: 36px;
}

/* ===== HERO SEARCH ===== */
.hero-search-wrap {
  max-width: 520px;
  margin: 0 auto;
}

.hero-search-form {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 12px 16px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.hero-search-form:focus-within {
  border-color: rgba(79, 142, 247, 0.5);
  background: rgba(79, 142, 247, 0.08);
  box-shadow: 0 0 0 4px rgba(79, 142, 247, 0.1);
}

.search-icon {
  font-size: 16px;
  opacity: 0.6;
}

.hero-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
}

.hero-search-input::placeholder {
  color: rgba(255,255,255,0.35);
}

.search-submit-btn {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 4px 10px;
  color: rgba(255,255,255,0.5);
  font-size: 12px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s;
}

.search-submit-btn:hover {
  background: rgba(79, 142, 247, 0.2);
  border-color: rgba(79, 142, 247, 0.4);
  color: #7eb3ff;
}

/* ===== FAMILIES SECTION ===== */
.families-section {
  background: #0a0b18;
  min-height: 400px;
  padding: 0 0 60px;
}

.families-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ===== CTA SECTION ===== */
.cta-section {
  padding: 80px 24px;
  background: #05060f;
  display: flex;
  justify-content: center;
}

.cta-card {
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.08) 0%, rgba(138, 79, 247, 0.08) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 28px;
  padding: 60px 40px;
  max-width: 700px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(79, 142, 247, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.cta-icon-wrap {
  width: 72px;
  height: 72px;
  background: rgba(79, 142, 247, 0.15);
  border: 1px solid rgba(79, 142, 247, 0.3);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28px;
  font-size: 32px;
}

.cta-title {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 16px;
  color: #fff;
}

.cta-accent {
  background: linear-gradient(135deg, #4f8ef7, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-desc {
  font-size: 15px;
  color: rgba(255,255,255,0.5);
  line-height: 1.7;
  margin-bottom: 36px;
}

.btn-cta-main {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 36px;
  background: rgba(79, 142, 247, 0.15);
  border: 1px solid rgba(79, 142, 247, 0.4);
  border-radius: 14px;
  color: #7eb3ff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
}

.btn-cta-main:hover {
  background: rgba(79, 142, 247, 0.3);
  border-color: rgba(79, 142, 247, 0.7);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(79, 142, 247, 0.25);
}

/* ===== FOOTER ===== */
.site-footer {
  background: #05060f;
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 28px 40px;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: rgba(255,255,255,0.8);
}

.footer-copy {
  color: rgba(255,255,255,0.3);
  font-size: 12px;
  margin: 0;
}

/* ===== MOBILE HELP FAB ===== */
.help-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f8ef7, #a78bfa);
  border: none;
  font-size: 22px;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 8px 24px rgba(79, 142, 247, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

.help-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(79, 142, 247, 0.55);
}

.error-msg {
  color: #f87171;
  text-align: center;
  padding: 40px;
}

/* ===== MOBILE ===== */
@media (max-width: 640px) {
  .navbar-glass {
    padding: 14px 20px;
  }
  .btn-create-nav {
    font-size: 12px;
    padding: 8px 14px;
  }
  .hero-subtitle br { display: none; }
  .cta-desc br { display: none; }
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
  .footer-copy { order: 10; }
}
</style>
