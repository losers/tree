<template>
  <div>
    <section v-if="form.error">
      <center>
        <img
          src="@/assets/no-data.png"
          style="height: 140px; margin-top: 70px"
        />
        <h4 style="color: black; margin-top: 30px">You dont have access buddy</h4>
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
      <div
        v-else
        :style="{ padding: $device.mobile ? '0 50px 50px 50px' : '0 200px' }"
      >
        <p style="float: right">
          <strong>Created On :</strong>
          {{ new Date(data.created_at).toDateString() }}
        </p>
        <h4>General Settings</h4>
        <form v-on:submit.prevent="updateSettings">
          <div class="form-inline row">
            <label
              class="col"
              style="justify-content: left"
              v-if="!$device.mobile"
              >Display Title :</label
            >
            <input
              type="text"
              class="form-control col-sm-9"
              id="title"
              placeholder="Display Title"
              required
              v-model="data.title"
            />
          </div>
          <div class="form-inline row">
            <label
              for="nickname"
              class="col"
              style="justify-content: left"
              v-if="!$device.mobile"
              >Surname :</label
            >
            <input
              v-model="data.surname"
              type="text"
              class="form-control col-sm-9"
              disabled
              required
            />
          </div>
          <div class="form-inline row">
            <label
              for="pin"
              class="col"
              style="justify-content: left"
              v-if="!$device.mobile"
              >Admin PIN :</label
            >
            <input
              v-model="data.pin"
              type="number"
              class="form-control col-sm-9"
              id="pin"
              placeholder="Update 4 digit Admin PIN"
              onkeypress="if(this.value.length==4) return false;"
              required
            />
          </div>
          <div
            v-if="data.pin == '1234' || data.pin == '0000'"
            class="mt-3 text-warning"
          >
            <div class="mb-2">Admin pin can be easily guessed.</div>
          </div>
          <div class="form-inline row">
            <label
              for="view-pin"
              class="col"
              style="justify-content: left"
              v-if="!$device.mobile"
              >View-Only PIN :</label
            >
            <input
              v-model="data.view_pin"
              type="number"
              class="form-control col-sm-9"
              id="view-pin"
              placeholder="Create 4 Digit View-Only PIN"
              onkeypress="if(this.value.length==4) return false;"
            />
          </div>
          <div
            v-if="data.view_pin == data.pin && data.pin"
            class="mt-3 text-danger"
          >
            <div class="mb-2">Admin PIN and View-Only PIN cannot be same</div>
          </div>
          <h4 class="contact-details">
            Contact Details <span>(optional)</span>
          </h4>
          <div class="form-inline row">
            <label
              for="name"
              class="col"
              style="justify-content: left"
              v-if="!$device.mobile"
              >Your Name :</label
            >
            <input
              type="text"
              class="form-control col-sm-9"
              id="name"
              v-model="data.contact.name"
              placeholder="Your Name"
            />
          </div>

          <div class="form-inline row">
            <label
              for="email"
              class="col"
              style="justify-content: left"
              v-if="!$device.mobile"
              >Your Email :</label
            >
            <input
              type="email"
              class="form-control col-sm-9"
              id="email"
              v-model="data.contact.email"
              placeholder="Your Email"
            />
          </div>
          <div
            style="
              display: flex;
              margin-top: 30px;
              justify-content: space-between;
            "
          >
            <div>
              <!-- data.pin.length != 4 || -->
              <button
                type="submit"
                class="btn btn-success"
                :disabled="form.isUpdating || data.pin == data.view_pin || data.pin.length != 4"
              >
                <span
                  class="spinner-border spinner-border-sm"
                  v-show="form.isUpdating"
                  style="margin-right: 8px"
                ></span>
                Update
              </button>
            </div>
          </div>
          <div v-if="form.error" class="mt-3 text-danger">
            <div class="mb-2">Error : {{ form.error }}</div>
          </div>
        </form>
        <h4 style="color: red; margin-top: 40px">Danger Zone</h4>
        <div class="danger-zone">
          <h5>Delete Family Permanently</h5>
          <h6 class="mt-3">
            Please enter
            <code>{{ this.$route.params.id }}</code> in the input box to delete
            this family tree permanently.
          </h6>
          <input
            class="form-control input-lg"
            type="text"
            v-model="deleteSurname"
          />
          <button
            :disabled="deleteSurname != this.$route.params.id || deletingFamily"
            class="btn btn-danger mt-3"
            @click="deleteFamily"
          >
            <span
              class="spinner-border spinner-border-sm"
              v-show="deletingFamily"
              style="margin-right: 8px"
            ></span
            >Delete Permanently
          </button>
        </div>

        <div class="mt-5">
          Any Trouble ?
          <a href="mailto:bloodline.helpline@gmail.com"
            >bloodline.helpline@gmail.com</a
          >
        </div>
      </div>
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
      deletingFamily: false,
      deleteSurname: "",
    };
  },
  mounted() {
    Axios.get(ProdData.getHostURL() + "/meta/get/" + this.$route.params.id)
      .then((data) => {
        this.data = data.data;
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
.contact-details {
  margin-top: 70px;
  display: flex;
  align-items: center;
}
.contact-details span {
  margin-left: 10px;
  font-size: 15px;
  color: grey;
}
.danger-zone {
  background-color: rgba(255, 191, 191, 0.2);
  border: solid #ffb6b6 1px;
  border-radius: 10px;
  padding: 20px;
}

.form-inline {
  margin-top: 20px;
}
</style>