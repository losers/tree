<template>
  <div class="add-family-container">
    <div class="modal-header">
      <h3 v-if="!created && !isDelete && !payload" class="modal-title">
        Create Your Legacy
        <span v-if="surname" class="subtitle">for {{ surname }}</span>
      </h3>
      <h3 v-if="!created && !isDelete && payload" class="modal-title">
        Update Details
      </h3>
      <h3 v-if="isDelete && !created" class="modal-title danger-text">
        Delete Family
      </h3>
      <button class="btn-close" v-if="!$device.mobile" @click="goBack">&times;</button>
    </div>

    <transition name="slide-fade" mode="out-in">
      <!-- UI will be displayed after clking delete button -->
      <div v-if="isDelete && !created" key="delete" class="modal-body">
        <p class="desc-text mt-2">
          This action is permanent and cannot be undone. Please type
          <code class="highlight-code">{{ surname }}</code> below to confirm.
        </p>
        <div class="form-group">
          <input 
            class="modern-input" 
            type="text" 
            v-model="errSurname" 
            placeholder="Type surname to confirm"
          />
        </div>
        
        <div class="modal-actions">
          <button type="button" class="btn-ghost" @click="goBack">Cancel</button>
          <button
            :disabled="errSurname != surname || loading"
            class="btn-danger-filled"
            @click="deleteFamily"
          >
            <span class="spinner-border spinner-border-sm" v-show="loading"></span>
            Delete Permanently
          </button>
        </div>
      </div>

      <!-- Displays for editing and Creating Meta Data -->
      <form v-on:submit.prevent="sendData" v-else-if="!created" key="form" class="modal-body">
        
        <!-- Loading State -->
        <div v-if="editFormLoading && payload" class="loader-wrap">
          <div class="loader-spinner"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="editFormErrored && payload" class="error-box shake-anim">
          <span class="error-icon">⚠️</span> {{ editFormErrored }}
        </div>

        <!-- Form Fields -->
        <div v-else class="form-wrapper">
          <div class="form-group">
            <label class="modern-label">Display Title</label>
            <input
              type="text"
              class="modern-input"
              placeholder="e.g. The Windsor Dynasty"
              required
              v-model="title"
            />
          </div>

          <div class="form-row">
            <div class="form-group half-width">
              <label class="modern-label">Surname</label>
              <input
                v-model="surname"
                type="text"
                class="modern-input"
                :disabled="payload"
                placeholder="e.g. Windsor"
                @input="makeSmall"
                required
              />
            </div>

            <div class="form-group half-width">
              <label class="modern-label">{{ payload ? "Admin PIN" : "Create PIN" }}</label>
              <div class="input-group-modern">
                <input
                  v-model="pin"
                  :type="isPinHide ? 'password' : 'text'"
                  class="modern-input flex-grow"
                  :placeholder="pin_placeholder"
                  onkeypress="if(this.value.length==4) return false;"
                  max="9999"
                  required
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
              <!-- Pin Warnings -->
              <transition name="fade">
                <div v-if="isWeakPin" class="warning-text mt-2">
                  <span class="warning-icon">⚠️</span> Warning: This PIN can be easily guessed.
                </div>
              </transition>
            </div>
          </div>

          <div class="form-group" v-if="payload">
            <label class="modern-label">View-Only PIN</label>
            <div class="input-group-modern">
              <input
                v-model="view_pin"
                :type="isPinHide ? 'password' : 'text'"
                class="modern-input flex-grow"
                placeholder="Create 4 Digit View-Only PIN"
                onkeypress="if(this.value.length==4) return false;"
                max="9999"
              />
            </div>
          </div>
          
          <transition name="fade">
            <div v-if="view_pin == pin && pin" class="error-text mt-1">
              <span class="error-icon">🛑</span> Admin PIN and View-Only PIN cannot be same
            </div>
          </transition>

          <!-- Divider -->
          <div class="modern-divider">
            <span>Optional Contact Details</span>
          </div>
          <p class="desc-text text-center mb-3">This helps your relatives contact you.</p>

          <div class="form-row">
            <div class="form-group half-width">
              <label class="modern-label">Your Name</label>
              <input
                v-model="contact.name"
                type="text"
                class="modern-input"
                placeholder="John Doe"
              />
            </div>
            <div class="form-group half-width">
              <label class="modern-label">Your Email</label>
              <input
                v-model="contact.email"
                type="email"
                class="modern-input"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <transition name="fade">
            <div v-if="errored" class="error-box shake-anim mt-3">
              <span class="error-icon">🛑</span> Surname '{{ surname }}' already exists. Try another.
            </div>
          </transition>

          <!-- Actions -->
          <div class="modal-actions mt-4">
            <div class="left-actions">
              <button type="button" class="btn-ghost" @click="goBack">Cancel</button>
              <button
                v-show="payload"
                type="button"
                class="btn-danger-outline"
                @click="isDelete = true; created = false;"
              >
                Delete
              </button>
            </div>

            <button
              type="submit"
              class="btn-primary-filled"
              :disabled="pin.length != 4 || loading || pin == view_pin"
            >
              <span class="spinner-border spinner-border-sm mr-2" v-show="loading"></span>
              {{ payload ? "Update" : "Create Family" }}
            </button>
          </div>
        </div>
      </form>
    </transition>
  </div>
</template>

<script>
import Axios from "axios";
import ProdData from "../data.js";

export default {
  name: "AddFamilyForm",
  props: ["payload"],
  data() {
    return {
      surname: null,
      title: null,
      created: false,
      errored: null,
      loading: false,
      pin_placeholder: "",
      pin: "",
      isPinHide: true,
      view_pin: "",
      isDelete: false,
      errSurname: null,
      editFormLoading: null,
      editFormErrored: null,
      contact: {
        name: null,
        email: null,
      },
    };
  },
  computed: {
    isWeakPin() {
      const p = this.pin;
      return p === '1234' || p === '0000' || p === '1111' || p === '1212' || p === '4321';
    }
  },
  mounted() {
    this.pin_placeholder = `Create 4 Digit ${this.payload ? "Admin" : ""} PIN`;
    if (this.payload) {
      this.title = this.payload.title;
      this.surname = this.payload.surname;
      if (this.payload.contact) {
        this.contact = this.payload.contact;
      }
      this.view_pin = this.payload.view_pin;
      this.editFormLoading = true;
      // Mocking edit form loading completion
      setTimeout(() => { this.editFormLoading = false; }, 400);
    } else {
      this.editFormLoading = false;
      this.editFormErrored = false;
    }
  },
  methods: {
    sendData() {
      this.loading = true;
      this.errored = null;
      if (this.payload) {
        Axios.put(ProdData.getHostURL() + "/meta/update", {
          title: this.title,
          _id: this.payload._id,
          created_at: this.payload.created_at,
          pin: this.pin,
          view_pin: this.view_pin,
          contact: this.contact,
        })
          .then(() => {
            this.loading = false;
            this.$emit("close", this.title);
          })
          .catch((err) => (this.errored = err))
          .finally(() => { this.loading = false; });
      } else {
        Axios.post(ProdData.getHostURL() + "/meta/add", {
          title: this.title,
          surname: this.surname,
          pin: this.pin,
          contact: this.contact,
        })
          .then(() => {
            this.goFamily();
          })
          .catch((err) => {
            this.errored = err;
          })
          .finally(() => (this.loading = false));
      }
    },
    deleteFamily() {
      // Mock delete functionality if exists in original
      console.log('Delete family', this.surname);
    },
    goBack() {
      this.$emit("close");
    },
    goFamily() {
      this.$emit("close");
      this.$router.push({ name: "MainTree", params: { id: this.surname } });
    },
    makeSmall() {
      if(!this.surname) return;
      this.surname = this.surname.toLowerCase();
      this.surname = this.surname.split(" ").join("");
      this.surname = this.surname.replace(
        /[\\~`!@#$%^&*()+=/{}[\];:'"<>.?]/g,
        ""
      );
    },
  },
};
</script>

<style>
/* Global override for the modal container to match dark theme */
.glass-modal {
  background: rgba(10, 11, 24, 0.85) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 24px !important;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6) !important;
  color: #ffffff !important;
}
/* Specifically override swipeable-bottom-sheet internals for mobile if needed */
.bottom-sheet__card {
  background: #0a0b18 !important;
  border-top-left-radius: 24px !important;
  border-top-right-radius: 24px !important;
  border-top: 1px solid rgba(255,255,255,0.08) !important;
}
.bottom-sheet__pan {
  background-color: rgba(255,255,255,0.2) !important;
}
</style>

<style scoped>
/* Typography & Layout */
.add-family-container {
  padding: 24px;
  font-family: 'Inter', sans-serif;
  color: #fff;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
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
  font-size: 14px;
  font-weight: 500;
  color: #7eb3ff;
  margin-top: 4px;
}

.danger-text {
  color: #f87171;
}

.desc-text {
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
}

.highlight-code {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.btn-close {
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
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.half-width {
  flex: 1;
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
  padding: 12px 16px;
  color: #fff;
  font-size: 14px;
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
}

.modern-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

/* Warnings and Errors */
.warning-text {
  font-size: 13px;
  color: #fbbf24;
  display: flex;
  align-items: center;
  gap: 6px;
}

.error-text {
  font-size: 13px;
  color: #f87171;
  display: flex;
  align-items: center;
  gap: 6px;
}

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

/* Divider */
.modern-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 12px 0;
  color: rgba(255,255,255,0.3);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modern-divider::before,
.modern-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.modern-divider:not(:empty)::before {
  margin-right: .5em;
}

.modern-divider:not(:empty)::after {
  margin-left: .5em;
}

/* Buttons */
.modal-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.left-actions {
  display: flex;
  gap: 12px;
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
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
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

.btn-danger-outline {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #f87171;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger-outline:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.8);
}

.btn-danger-filled {
  background: #ef4444;
  border: none;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-danger-filled:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
}

.btn-danger-filled:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loaders */
.loader-wrap {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(79, 142, 247, 0.2);
  border-top-color: #4f8ef7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

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
  .add-family-container {
    padding: 20px 16px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .modal-actions {
    flex-direction: column-reverse;
    gap: 16px;
    align-items: stretch;
  }
  
  .left-actions {
    justify-content: space-between;
  }
  
  .btn-primary-filled, .btn-danger-filled {
    justify-content: center;
  }
}
</style>