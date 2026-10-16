<template>
  <div class="share-access-page" :class="isDark ? 'theme-dark' : 'theme-light'">
    <div class="glow-bg"></div>

    <div class="share-card glass-card">
      <!-- Loading State -->
      <div class="state-container" v-if="loading">
        <div class="loader-visual">
          <div class="outer-pulse-ring"></div>
          <div class="center-icon-badge">
            <i class="icofont-tree"></i>
          </div>
        </div>
        <h3 class="font-weight-bold mt-4 mb-2">Connecting to Family Tree...</h3>
        <p class="text-muted subtitle">
          Validating your unique view-only invite link.
        </p>
      </div>

      <!-- Error State -->
      <div class="state-container" v-else-if="error">
        <div class="error-visual">
          <div class="error-badge">
            <i class="icofont-link-broken"></i>
          </div>
        </div>
        <h3 class="font-weight-bold mt-4 mb-2 text-danger">Invalid or Expired Link</h3>
        <p class="text-muted subtitle mb-4">
          {{ errorMessage || "This unique view-only link has been removed or revoked by the family administrator." }}
        </p>

        <div class="action-buttons d-flex justify-content-center flex-wrap gap-2">
          <button class="btn btn-outline-primary mr-2" @click="goToHome">
            <i class="icofont-home mr-1"></i> All Families
          </button>
          <button class="btn btn-primary" v-if="targetSurname" @click="goToTree">
            <i class="icofont-key mr-1"></i> Enter PIN Instead
          </button>
        </div>
      </div>

      <!-- Success Redirecting State -->
      <div class="state-container" v-else>
        <div class="success-visual">
          <div class="success-badge">
            <i class="icofont-check"></i>
          </div>
        </div>
        <h3 class="font-weight-bold mt-4 mb-2 text-success">Access Granted!</h3>
        <p class="text-muted subtitle">
          Opening <strong>{{ familyTitle || targetSurname }}</strong> in view-only mode...
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import ProdData from "@/data.js";
import Store from "@/store/index";

export default {
  name: "ShareAccess",
  data() {
    return {
      loading: true,
      error: false,
      errorMessage: "",
      targetSurname: "",
      familyTitle: ""
    };
  },
  computed: {
    isDark() {
      return (Store.state.theme || "dark") === "dark";
    }
  },
  methods: {
    goToHome() {
      this.$router.push({ name: "Home" });
    },
    goToTree() {
      if (this.targetSurname) {
        this.$router.push({ name: "Tree", params: { id: this.targetSurname } });
      } else {
        this.goToHome();
      }
    },
    async redeemShareLink() {
      const token = this.$route.params.token;
      if (this.$route.params.surname) {
        this.targetSurname = this.$route.params.surname;
      }
      if (!token) {
        this.loading = false;
        this.error = true;
        this.errorMessage = "No share token provided in the link.";
        return;
      }

      try {
        const url = `${ProdData.getHostURL()}/share/access/${token}`;
        const res = await Axios.get(url);

        if (res.data && res.data.success && res.data.surname) {
          this.targetSurname = res.data.surname;
          this.familyTitle = res.data.title || res.data.surname;

          // Commit view-only session to Vuex store
          Store.commit("setSession", {
            status: true,
            surname: res.data.surname,
            view_only: true
          });

          // Redirect to tree view smoothly after quick feedback
          setTimeout(() => {
            this.$router.replace({
              name: "Tree",
              params: { id: res.data.surname }
            });
          }, 600);
        } else {
          this.error = true;
          this.errorMessage = (res.data && res.data.message) || "Could not validate share link.";
        }
      } catch (err) {
        console.error("Error accessing share link:", err);
        this.error = true;
        if (err.response && err.response.data && err.response.data.message) {
          this.errorMessage = err.response.data.message;
        } else {
          this.errorMessage = "This unique share link has expired or was revoked by the family admin.";
        }
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.redeemShareLink();
  }
};
</script>

<style scoped>
.share-access-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.theme-dark {
  background: #0b0d19;
  color: #f8fafc;
}

.theme-light {
  background: #f1f5f9;
  color: #1e293b;
}

.glow-bg {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(79, 142, 247, 0.18) 0%, rgba(167, 139, 250, 0.08) 50%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.share-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 460px;
  padding: 48px 32px;
  border-radius: 28px;
  text-align: center;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  animation: cardFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes cardFadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.theme-dark .glass-card {
  background: rgba(15, 17, 35, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
}

.theme-light .glass-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
}

.subtitle {
  font-size: 14.5px;
  line-height: 1.5;
}

/* Loader Visual */
.loader-visual {
  position: relative;
  width: 90px;
  height: 90px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.outer-pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(79, 142, 247, 0.4);
  animation: pulseRing 1.8s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
}

@keyframes pulseRing {
  0% { transform: scale(0.85); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 0.3; }
  100% { transform: scale(0.85); opacity: 0.8; }
}

.center-icon-badge {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f8ef7, #a78bfa);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 0 24px rgba(79, 142, 247, 0.5);
  z-index: 2;
}

/* Error Visual */
.error-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 2px solid rgba(239, 68, 68, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

/* Success Visual */
.success-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 2px solid rgba(16, 185, 129, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.action-buttons button {
  padding: 8px 18px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13.5px;
  transition: all 0.25s ease;
}
</style>
