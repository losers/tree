<template>
  <div>
    <section v-if="form.error">
      <center>
        <img
          src="@/assets/no-data.png"
          style="height: 140px; margin-top: 70px"
        />
        <h4 style="color: black; margin-top: 30px">
          You dont have access buddy
        </h4>
      </center>
    </section>
    <section v-else>
      <div
        v-if="form.loading"
        style="
          font-size: 20px;
          justify-content: center;
          display: flex;
          margin-top: 60px;
          color: indianred;
        "
      >
        <center>
          <div
            class="spinner-border spinner-border-sm"
            style="width: 5rem; height: 5rem"
          ></div>
        </center>
      </div>

      <!-- Settings Body -->
      <transition name="fade">
        <div
          v-if="!form.loading"
          class="glass-card mt-4 mb-5"
          :style="{ padding: $device.mobile ? '30px 20px' : '40px 100px' }"
        >
          <p style="float: right; color: rgba(255,255,255,0.6);">
            <strong>Created On :</strong>
            {{ new Date(data.created_at).toDateString() }}
          </p>
          <h3 style="color: #4f8ef7; font-weight: 600;">General Settings</h3>
          <h6 class="mb-4" style="color: rgba(255,255,255,0.7); font-style: italic;">With great power comes great responsibility... don't mess up the family matrix.</h6>
          <form v-on:submit.prevent="updateSettings">
            <div class="form-inline row mb-3">
              <label
                class="col-12 col-sm-4 col-md-3 form-label"
                style="justify-content: left; white-space: nowrap;"
                v-if="!$device.mobile"
                >Display Title :</label
              >
              <input
                type="text"
                class="form-control col-12 col-sm-8 col-md-9 dark-input"
                id="title"
                placeholder="Display Title"
                required
                v-model="data.title"
              />
            </div>
            <div class="form-inline row mb-3">
              <label
                for="nickname"
                class="col-12 col-sm-4 col-md-3 form-label"
                style="justify-content: left; white-space: nowrap;"
                v-if="!$device.mobile"
                >Surname :</label
              >
              <input
                v-model="data.surname"
                type="text"
                class="form-control col-12 col-sm-8 col-md-9 dark-input"
                disabled
                required
              />
            </div>
            <div class="form-inline row mb-3">
              <label
                for="pin"
                class="col-12 col-sm-4 col-md-3 form-label"
                style="justify-content: left; white-space: nowrap;"
                v-if="!$device.mobile"
                >Admin PIN :</label
              >
              <div class="col-12 col-sm-8 col-md-9 input-group p-0">
                <input
                  v-model="data.pin"
                  type="number"
                  class="form-control dark-input"
                  id="pin"
                  placeholder="Update 4 digit Admin PIN"
                  onkeypress="if(this.value.length==4) return false;"
                  max="9999"
                  :style="{
                    '-webkit-text-security': isPinHide.admin ? 'disc' : '',
                  }"
                  required
                />
                <div class="input-group-append">
                  <button
                    type="button"
                    class="btn dark-input-btn"
                    @click="isPinHide.admin = !isPinHide.admin"
                  >
                    <i
                      :class="
                        isPinHide.admin ? 'icofont-eye-blocked' : 'icofont-eye'
                      "
                    ></i>
                  </button>
                </div>
              </div>
            </div>
            <div
              v-if="data.pin == '1234' || data.pin == '0000'"
              class="mt-3 text-warning"
            >
              <div class="mb-2">Admin pin can be easily guessed.</div>
            </div>
            <div class="form-inline row mb-3">
              <label
                for="view-pin"
                class="col-12 col-sm-4 col-md-3 form-label"
                style="justify-content: left; white-space: nowrap;"
                v-if="!$device.mobile"
                >View-Only PIN :</label
              >
              <div class="col-12 col-sm-8 col-md-9 input-group p-0">
                <input
                  v-model="data.view_pin"
                  type="number"
                  class="form-control dark-input"
                  id="view-pin"
                  placeholder="Create 4 Digit View-Only PIN"
                  onkeypress="if(this.value.length==4) return false;"
                  max="9999"
                  :style="{
                    '-webkit-text-security': isPinHide.view ? 'disc' : '',
                  }"
                />
                <div class="input-group-append">
                  <button
                    type="button"
                    class="btn dark-input-btn"
                    @click="isPinHide.view = !isPinHide.view"
                  >
                    <i
                      :class="
                        isPinHide.view ? 'icofont-eye-blocked' : 'icofont-eye'
                      "
                    ></i>
                  </button>
                </div>
              </div>
            </div>
            <div
              v-if="data.view_pin == data.pin && data.pin"
              class="mt-3 text-danger"
            >
              <div class="mb-2">Admin PIN and View-Only PIN cannot be same</div>
            </div>

            <!-- Family Share Link (View-Only) -->
            <div class="mt-4 pt-3 border-top-dark">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <label class="form-label m-0" style="font-weight: 600; color: #4f8ef7; font-size: 16px;">
                  <i class="icofont-share mr-1"></i> Family Share Link
                </label>
                <button
                  v-if="share.token && !share.showConfirmDelete"
                  type="button"
                  class="btn-revoke-text"
                  @click="share.showConfirmDelete = true"
                >
                  <i class="icofont-trash mr-1"></i> Revoke Link
                </button>
              </div>

              <p class="text-muted mb-3" style="font-size: 13.5px;">
                Anyone with this link gets instant view-only access without a PIN.
              </p>

              <!-- Loading Indicator -->
              <div v-if="share.loading" class="text-center py-2">
                <div class="spinner-border spinner-border-sm" style="color: #4f8ef7;"></div>
              </div>

              <!-- Active Share Link -->
              <div v-else-if="share.token">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control dark-input"
                    style="font-family: monospace; font-size: 13.5px;"
                    :value="shareUrl"
                    readonly
                    @click="$event.target.select()"
                  />
                  <div class="input-group-append">
                    <button
                      type="button"
                      class="btn copy-share-btn"
                      @click="copyShareLink"
                    >
                      <i :class="share.copied ? 'icofont-check text-success' : 'icofont-ui-copy'"></i>
                      <span class="ml-1">{{ share.copied ? 'Copied' : 'Copy' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Revoke Confirmation (Inline, Minimal) -->
                <div v-if="share.showConfirmDelete" class="revoke-inline-bar mt-2 d-flex align-items-center justify-content-between p-2 flex-wrap gap-2">
                  <span class="text-danger" style="font-size: 13px;">
                    Revoke this link immediately?
                  </span>
                  <div>
                    <button
                      type="button"
                      class="btn btn-danger btn-sm py-1 px-3 mr-2"
                      :disabled="share.isDeleting"
                      @click="deleteShareLink"
                      style="border-radius: 8px; font-size: 12px;"
                    >
                      <span v-if="share.isDeleting" class="spinner-border spinner-border-sm mr-1"></span>
                      Yes, Revoke
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary btn-sm py-1 px-2"
                      :disabled="share.isDeleting"
                      @click="share.showConfirmDelete = false"
                      style="border-radius: 8px; font-size: 12px;"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <!-- Empty State: One-click button -->
              <div v-else>
                <button
                  type="button"
                  class="btn-generate-simple"
                  @click="generateShareLink"
                  :disabled="share.isGenerating"
                >
                  <span v-if="share.isGenerating" class="spinner-border spinner-border-sm mr-2"></span>
                  <i v-else class="icofont-link mr-2"></i> Create Share Link
                </button>
              </div>

              <!-- Error Alert -->
              <div v-if="share.error" class="text-danger mt-2" style="font-size: 13px;">
                <i class="icofont-warning mr-1"></i> {{ share.error }}
              </div>
            </div>

            <h4 class="contact-details" style="color: #4f8ef7; font-weight: 600;">
              Contact Details
              <span>(optional)</span>
            </h4>
            <div class="form-inline row mb-3">
              <label
                for="name"
                class="col-12 col-sm-4 col-md-3 form-label"
                style="justify-content: left; white-space: nowrap;"
                v-if="!$device.mobile"
                >Your Name :</label
              >
              <input
                type="text"
                class="form-control col-12 col-sm-8 col-md-9 dark-input"
                id="name"
                v-model="data.contact.name"
                placeholder="Your Name"
              />
            </div>

            <div class="form-inline row mb-3">
              <label
                for="email"
                class="col-12 col-sm-4 col-md-3 form-label"
                style="justify-content: left; white-space: nowrap;"
                v-if="!$device.mobile"
                >Your Email :</label
              >
              <input
                type="email"
                class="form-control col-12 col-sm-8 col-md-9 dark-input"
                id="email"
                v-model="data.contact.email"
                placeholder="Your Email"
              />
            </div>
            <div
              style="
                display: flex;
                margin-top: 40px;
                justify-content: center;
              "
            >
              <div>
                <!-- data.pin.length != 4 || -->
                <button
                  type="submit"
                  class="my-btn"
                  :disabled="
                    form.isUpdating ||
                    data.pin == data.view_pin ||
                    data.pin.length != 4
                  "
                >
                  <span
                    class="spinner-border spinner-border-sm"
                    v-show="form.isUpdating"
                    style="margin-right: 8px"
                  ></span>
                  <i class="icofont-save mr-2"></i> Update Settings
                </button>
              </div>
            </div>
            <div v-if="form.error" class="mt-3 text-danger">
              <div class="mb-2">Error : {{ form.error }}</div>
            </div>
          </form>
          <h3 style="color: #ff4757; margin-top: 60px; font-weight: 600;">Danger Zone</h3>
          <div class="danger-zone p-4 mt-3">
            <h4 style="color: #ff4757; font-weight: 600;">Thanos snap this family out of existence</h4>
            <h6 class="mt-3 mb-4" style="color: rgba(255,255,255,0.8); line-height: 1.6;">
              Please enter
              <code style="background: rgba(255, 71, 87, 0.2); color: #ff4757; padding: 4px 8px; border-radius: 4px;">{{ this.$route.params.id }}</code> below to
              turn everything to dust permanently.
            </h6>
            <input
              class="form-control input-lg dark-input"
              type="text"
              v-model="deleteSurname"
              placeholder="Enter family surname to confirm"
            />
            <button
              :disabled="
                deleteSurname != this.$route.params.id || deletingFamily
              "
              class="my-btn-danger mt-4 w-100"
              @click="deleteFamily"
            >
              <span
                class="spinner-border spinner-border-sm"
                v-show="deletingFamily"
                style="margin-right: 8px"
              ></span
              ><i class="icofont-trash mr-2"></i> Delete Permanently
            </button>
          </div>

          <div class="mt-5 text-center" style="color: rgba(255,255,255,0.6);">
            Any Trouble ? 
            <a href="mailto:hello@bloodline.app" style="color: #4f8ef7; font-weight: bold; margin-left: 5px;">hello@bloodline.app</a>
          </div>
        </div>
      </transition>
    </section>
  </div>
</template>

<script>
import Axios from "axios";
import ProdData from "@/data.js";
import Store from "@/store/index";

export default {
  data() {
    return {
      form: {
        error: false,
        loading: true,
        isUpdating: false,
      },
      data: {
        contact: {},
        pin: "",
      },
      isPinHide: {
        admin: true,
        view: true,
      },
      deletingFamily: false,
      deleteSurname: "",
      share: {
        token: null,
        createdAt: null,
        loading: false,
        isGenerating: false,
        isDeleting: false,
        copied: false,
        error: null,
        showConfirmDelete: false,
      },
    };
  },
  computed: {
    shareUrl() {
      if (!this.share.token) return "";
      const origin = window.location.origin;
      const surname = this.$route.params.id || this.data.surname;
      return `${origin}/app/share/${surname}/${this.share.token}`;
    },
  },
  mounted() {
    Axios.get(ProdData.getHostURL() + "/meta/get/" + this.$route.params.id)
      .then((data) => {
        this.data = data.data;
        if (!this.data.contact) {
          this.data.contact = {};
        }
      })
      .catch((err) => (this.form.error = err))
      .finally(() => (this.form.loading = false));

    this.fetchShareInfo();
  },
  methods: {
    fetchShareInfo() {
      this.share.loading = true;
      Axios.get(ProdData.getHostURL() + "/share/" + this.$route.params.id + "/info")
        .then((res) => {
          if (res.data) {
            this.share.token = res.data.share_token || null;
            this.share.createdAt = res.data.share_created_at || null;
          }
        })
        .catch((err) => {
          console.log("Could not load share info:", err);
        })
        .finally(() => {
          this.share.loading = false;
        });
    },
    generateShareLink() {
      this.share.isGenerating = true;
      this.share.error = null;
      Axios.post(ProdData.getHostURL() + "/share/" + this.$route.params.id + "/generate")
        .then((res) => {
          if (res.data && res.data.success) {
            this.share.token = res.data.share_token;
            this.share.createdAt = res.data.share_created_at;
            this.share.showConfirmDelete = false;
          }
        })
        .catch((err) => {
          this.share.error =
            (err.response && err.response.data && err.response.data.message) ||
            "Failed to generate share link";
        })
        .finally(() => {
          this.share.isGenerating = false;
        });
    },
    deleteShareLink() {
      this.share.isDeleting = true;
      this.share.error = null;
      Axios.delete(ProdData.getHostURL() + "/share/" + this.$route.params.id)
        .then((res) => {
          if (res.data && res.data.success) {
            this.share.token = null;
            this.share.createdAt = null;
            this.share.showConfirmDelete = false;
          }
        })
        .catch((err) => {
          this.share.error =
            (err.response && err.response.data && err.response.data.message) ||
            "Failed to revoke share link";
        })
        .finally(() => {
          this.share.isDeleting = false;
        });
    },
    copyShareLink() {
      if (!this.shareUrl) return;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(this.shareUrl).then(() => {
          this.share.copied = true;
          setTimeout(() => (this.share.copied = false), 2500);
        });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = this.shareUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          this.share.copied = true;
          setTimeout(() => (this.share.copied = false), 2500);
        } catch (e) {
          console.error(e);
        }
        document.body.removeChild(textArea);
      }
    },
    formatShareDate(val) {
      if (!val) return "";
      try {
        const d = new Date(val);
        return d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (e) {
        return val;
      }
    },
    updateSettings() {
      this.form.isUpdating = true;
      Axios.put(ProdData.getHostURL() + "/meta/update", {
        title: this.data.title,
        _id: this.data._id,
        created_at: this.data.created_at,
        pin: this.data.pin,
        view_pin: this.data.view_pin,
        contact: this.data.contact,
      })
        .then(() => {
          if (Store.state.title != this.data.title) {
            Store.dispatch("setTitle", this.data.title);
          }
        })
        .catch((err) => (this.form.error = err))
        .finally(() => (this.form.isUpdating = false));
    },
    deleteFamily() {
      this.deletingFamily = true;
      Axios.delete(ProdData.getHostURL() + "/meta", {
        data: { surname: this.$route.params.id },
      })
        .then((data) => console.log(data))
        .catch((err) => console.log(err))
        .finally(() => {
          this.$router.push({ name: "Home" });
        });
    },
  },
};
</script>

<style scoped>
.glass-card {
  background: rgba(15, 17, 35, 0.65);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  color: white;
  margin: 0 auto;
  max-width: 800px;
}
.contact-details {
  margin-top: 50px;
  display: flex;
  align-items: center;
}
.contact-details span {
  margin-left: 10px;
  font-size: 15px;
  color: rgba(255,255,255,0.4);
}
.danger-zone {
  background-color: rgba(255, 71, 87, 0.05);
  border: 2px solid rgba(255, 71, 87, 0.3);
  border-radius: 16px;
  animation: pulse-danger 3s infinite;
  box-shadow: 0 0 20px rgba(255, 71, 87, 0.1);
}

@keyframes pulse-danger {
  0% { border-color: rgba(255, 71, 87, 0.3); box-shadow: 0 0 20px rgba(255, 71, 87, 0.1); }
  50% { border-color: rgba(255, 71, 87, 0.6); box-shadow: 0 0 30px rgba(255, 71, 87, 0.2); }
  100% { border-color: rgba(255, 71, 87, 0.3); box-shadow: 0 0 20px rgba(255, 71, 87, 0.1); }
}

.form-inline {
  margin-top: 20px;
}
.form-label {
  color: rgba(255,255,255,0.8);
  font-weight: 500;
}
.dark-input {
  background: rgba(0,0,0,0.2) !important;
  border: 1px solid rgba(79, 142, 247, 0.3) !important;
  color: #fff !important;
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}
.dark-input:focus {
  border-color: #4f8ef7 !important;
  box-shadow: 0 0 10px rgba(79, 142, 247, 0.4) !important;
  outline: none;
}
.dark-input:disabled {
  background: rgba(255,255,255,0.05) !important;
  color: rgba(255,255,255,0.5) !important;
  cursor: not-allowed;
  border-color: rgba(255,255,255,0.1) !important;
}
.dark-input::placeholder {
  color: rgba(255,255,255,0.3);
}
.dark-input-btn {
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(79, 142, 247, 0.3);
  border-left: none;
  color: #4f8ef7;
  border-radius: 0 12px 12px 0;
  transition: all 0.3s ease;
}
.dark-input-btn:hover {
  background: rgba(79, 142, 247, 0.1);
  color: #fff;
}
.dark-input:focus + .input-group-append .dark-input-btn {
  border-color: #4f8ef7;
  box-shadow: 2px 0 10px rgba(79, 142, 247, 0.4);
}

.my-btn {
  background: linear-gradient(135deg, #4f8ef7, #a78bfa) !important;
  border: none !important;
  padding: 12px 32px !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -4px 0 rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  color: #fff !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  display: inline-block;
}
.my-btn:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.05) !important;
  box-shadow: 0 16px 40px rgba(79, 142, 247, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -4px 0 rgba(0, 0, 0, 0.25) !important;
}
.my-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.my-btn-danger {
  background: linear-gradient(135deg, #ff4757, #ff6b81) !important;
  border: none !important;
  padding: 12px 32px !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(255, 71, 87, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -4px 0 rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  color: #fff !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  display: inline-block;
}
.my-btn-danger:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.02) !important;
  box-shadow: 0 16px 40px rgba(255, 71, 87, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -4px 0 rgba(0, 0, 0, 0.25) !important;
}
.my-btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Family Share Link Styling */
.border-top-dark {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.btn-revoke-text {
  background: none;
  border: none;
  color: #ff4757;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}
.btn-revoke-text:hover {
  color: #ff6b81;
  text-decoration: underline;
}
.copy-share-btn {
  background: linear-gradient(135deg, #4f8ef7, #a78bfa);
  color: #fff;
  border: none;
  font-weight: 600;
  padding: 0 18px;
  border-radius: 0 12px 12px 0;
  transition: all 0.25s ease;
}
.copy-share-btn:hover {
  opacity: 0.9;
  color: #fff;
}
.revoke-inline-bar {
  background: rgba(255, 71, 87, 0.08);
  border: 1px solid rgba(255, 71, 87, 0.25);
  border-radius: 10px;
}
.btn-generate-simple {
  background: rgba(79, 142, 247, 0.15);
  color: #4f8ef7;
  border: 1px solid rgba(79, 142, 247, 0.35);
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s ease;
  cursor: pointer;
}
.btn-generate-simple:hover:not(:disabled) {
  background: rgba(79, 142, 247, 0.25);
  color: #fff;
  border-color: #4f8ef7;
}
.btn-generate-simple:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>