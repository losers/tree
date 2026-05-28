<template>
  <div class="auth-container">
    <div class="modal-header">
      <div>
        <h3 class="modal-title">Unlock Family Tree</h3>
        <span class="subtitle">{{ payload.title }}</span>
      </div>
      <button class="btn-close" v-if="!$device.mobile" @click="goBack">&times;</button>
    </div>

    <form v-on:submit.prevent="validate" @keyup.enter.prevent="validate" class="modal-body">
      
      <transition name="fade">
        <div v-if="retry" class="error-box shake-anim mb-3">
          <span class="error-icon">🛑</span> Invalid PIN. Please try again.
        </div>
      </transition>

      <div class="form-group">
        <label class="modern-label">Enter PIN to Unlock</label>
        <div class="input-group-modern">
          <input
            v-model="key"
            :type="isPinHide ? 'password' : 'text'"
            class="modern-input flex-grow"
            placeholder="4 Digit PIN"
            onkeypress="if(this.value.length==4) return false;"
            max="9999"
            required
            autofocus
          />
          <button
            type="button"
            class="btn-icon"
            @click="isPinHide = !isPinHide"
            tabindex="-1"
          >
            <i :class="isPinHide ? 'icofont-eye-blocked' : 'icofont-eye'"></i>
          </button>
        </div>
      </div>

      <div v-if="payload.contact && (payload.contact.name || payload.contact.email)" class="contact-box mt-4">
        <div class="contact-header">
          <span class="contact-icon">📞</span> Contact Details
        </div>
        <div class="contact-body">
          <div class="contact-item" v-if="payload.contact.name">
            <span class="contact-label">Name:</span>
            <span class="contact-value">{{ payload.contact.name }}</span>
          </div>
          <div class="contact-item" v-if="payload.contact.email">
            <span class="contact-label">Email:</span>
            <a :href="'mailto:' + payload.contact.email" class="contact-link">{{ payload.contact.email }}</a>
          </div>
        </div>
      </div>

      <div class="modal-actions mt-4">
        <button type="button" class="btn-ghost" @click="goBack">Cancel</button>
        <button
          type="submit"
          class="btn-primary-filled"
          :disabled="vloading || key.length !== 4"
        >
          <span class="spinner-border spinner-border-sm mr-2" v-show="vloading"></span>
          {{ retry ? "Retry PIN" : "Unlock Tree" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import ProdData from "@/data.js";
import Store from "@/store/index";
import axios from "axios";

export default {
  name: "AuthForm",
  props: ["payload"],
  data() {
    return {
      key: "",
      retry: false,
      vloading: false,
      isPinHide: true,
    };
  },
  methods: {
    goBack() {
      this.$emit("close");
    },
    validate() {
      if (this.key.length == 4) {
        this.vloading = true;
        this.retry = false;
        localStorage.pinner = true;
        let sessionUrl = ProdData.getHostURL() + "/sessions/";
        let params = {};
        params.pin = this.key;
        params.surname = this.payload.surname;
        axios
          .post(sessionUrl, params)
          .then(() => {
            this.hasCookie = true;
            this.vloading = false;
            // Cache validated surname so list page skips PIN on next visit
            try {
              const cached = JSON.parse(localStorage.getItem("bl_pin_cache") || "[]");
              if (!cached.includes(params.surname)) {
                cached.push(params.surname);
                localStorage.setItem("bl_pin_cache", JSON.stringify(cached));
              }
            } catch { /* ignore */ }
            let sessData = {};
            sessData.status = true;
            sessData.surname = params.surname;
            location.href = `/app/${sessData.surname}`;
            Store.commit("setSession", sessData);
            this.goBack();
          })
          .catch(() => {
            this.retry = true;
          })
          .finally(() => {
            this.vloading = false;
          });
      }
    },
  },
};
</script>

<style scoped>
/* Typography & Layout */
.auth-container {
  padding: 24px;
  font-family: 'Inter', sans-serif;
  color: #fff;
}

.modal-header {
  position: relative;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0;
  color: #fff;
}

.subtitle {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: #a78bfa;
  margin-top: 6px;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #fff;
}

/* Forms */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modern-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.3px;
}

.modern-input {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 14px 16px;
  color: #fff;
  font-size: 16px;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  font-family: inherit;
  width: 100%;
}

.modern-input:focus {
  outline: none;
  border-color: rgba(79, 142, 247, 0.5);
  background: rgba(79, 142, 247, 0.05);
  box-shadow: 0 0 0 4px rgba(79, 142, 247, 0.1);
}

.modern-input::placeholder {
  color: rgba(255,255,255,0.3);
  letter-spacing: normal;
}

.input-group-modern {
  position: relative;
  display: flex;
  align-items: center;
}

.flex-grow {
  flex: 1;
  padding-right: 48px; /* space for icon */
}

.btn-icon {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

/* Contact Box */
.contact-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
}

.contact-header {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  font-size: 14px;
}

.contact-label {
  color: rgba(255, 255, 255, 0.5);
  width: 60px;
}

.contact-value {
  color: #fff;
  font-weight: 500;
}

.contact-link {
  color: #7eb3ff;
  text-decoration: none;
  font-weight: 500;
}

.contact-link:hover {
  text-decoration: underline;
}

/* Warnings and Errors */
.error-box {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 14px 16px;
  color: #fca5a5;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Buttons */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
}

.btn-ghost {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: 14px;
  font-weight: 600;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s;
}

.btn-ghost:hover {
  background: rgba(255,255,255,0.05);
  color: #fff;
}

.btn-primary-filled {
  background: linear-gradient(135deg, #4f8ef7 0%, #a78bfa 100%);
  border: none;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(79, 142, 247, 0.3);
  display: flex;
  align-items: center;
}

.btn-primary-filled:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 142, 247, 0.4);
}

.btn-primary-filled:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.shake-anim {
  animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .auth-container {
    padding: 20px 16px;
  }
  
  .modal-actions {
    flex-direction: column-reverse;
    gap: 12px;
    align-items: stretch;
  }
  
  .btn-primary-filled, .btn-ghost {
    justify-content: center;
    width: 100%;
  }
}
</style>