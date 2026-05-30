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
    };
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
  },
  methods: {
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
</style>