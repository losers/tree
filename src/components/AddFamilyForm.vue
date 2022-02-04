<template>
  <div class="FormData p-5">
    <h3 class="mb-4">
      <span>Creating a Family Tree</span>
      <span class="close-btn" v-if="!$device.mobile" @click="goBack">x</span>
      <span v-if="surname" class="ml-1">for {{ surname }}</span>
    </h3>

    <transition name="fade" mode="out-in">
      <!-- Displays for editing and Creating Meta Data -->
      <form v-on:submit.prevent="sendData">
        <section>
          <div class="form-inline row">
            <label
              for="title"
              class="col"
              style="justify-content: left"
              v-if="!$device.mobile"
              >{{ $t("display_title") }} :</label
            >
            <input
              type="text"
              class="form-control col-sm-7"
              id="title"
              :placeholder="$t('display_title')"
              required
              v-model="title"
            />
          </div>
          <div class="form-inline row">
            <label
              for="nickname"
              class="col"
              style="justify-content: left"
              v-if="!$device.mobile"
              >{{ $t("surname") }} :</label
            >
            <input
              v-model="surname"
              type="text"
              class="form-control col-sm-7"
              id="surname"
              :placeholder="$t('enter') + ' ' + $t('surname')"
              @input="makeSmall"
              required
            />
          </div>
          <div class="form-inline row">
            <label
              for="pin"
              class="col"
              style="justify-content: left"
              v-if="!$device.mobile"
              >Create PIN :</label
            >
            <input
              v-model="pin"
              type="number"
              class="form-control col-sm-7"
              id="pin"
              placeholder="Create 4 digit PIN"
              onkeypress="if(this.value.length==4) return false;"
              max="9999"
              :style="{ '-webkit-text-security': isPinHide ? 'disc' : '' }"
              required
            />
            <button
              type="button"
              class="btn btn-outline-secondary pin-btn"
              @click="isPinHide = !isPinHide"
            >
              <i :class="isPinHide ? 'icofont-eye-blocked' : 'icofont-eye'"></i>
            </button>
          </div>
          <div v-if="pin == '1234' || pin == '0000'" class="mt-3 text-warning">
            <div class="mb-2">Warning: Pin can be easily guessed.</div>
          </div>

          <!-- Optional Header -->
          <hr class="mt-5 mb-3" style="background-color: white" />
          <p style="margin-top: -29px">
            <center>
              <span
                style="background-color: white; padding: 20px; color: #969696"
                >{{ $t("optional") + " " + $t("contact_details") }}</span
              >
            </center>
          </p>
          <div style="font-size: 12px; color: rgb(160, 160, 160)">
            This helps your relatives to contact you.
          </div>
          <div class="form-inline row">
            <label
              for="name"
              class="col"
              style="justify-content: left"
              v-if="!$device.mobile"
              >{{ $t("your_name") }} :</label
            >
            <input
              v-model="contact.name"
              type="text"
              class="form-control col-sm-7"
              id="name"
              :placeholder="$t('your_name')"
            />
          </div>

          <div class="form-inline row">
            <label
              for="email"
              class="col"
              style="justify-content: left"
              v-if="!$device.mobile"
              >{{ $t("your_email") }} :</label
            >
            <input
              v-model="contact.email"
              type="email"
              class="form-control col-sm-7"
              id="email"
              :placeholder="$t('your_email')"
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
              <button
                type="submit"
                class="btn btn-success"
                :disabled="pin.length != 4 || loading || pin == view_pin"
              >
                <span
                  class="spinner-border spinner-border-sm"
                  v-show="loading"
                  style="margin-right: 8px"
                ></span>
                <span>{{ $t("create") }}</span>
              </button>

              <button
                type="button"
                class="btn btn-default ml-3"
                @click="goBack"
              >
                {{ $t("cancel") }}
              </button>
            </div>
          </div>
          <div v-if="errored" class="mt-3 text-danger">
            <div class="mb-2">
              {{ $t("surname") }} {{ surname }}, already exists
            </div>
          </div>
        </section>
      </form>

      <!-- On creating a family tree -->
      <!-- <div v-else-if="created">
        <div style="margin-bottom:20px">
          <center>
            <Tick></Tick>
          </center>
          <center>
            <h1>Success!</h1>
            <span style="font-size: 20px;">Let's Start Adding members to your family tree.</span>
          </center>
        </div>
        <center>
          <button class="btn btn-success" @click="goFamily">Start</button>
        </center>
      </div>-->
    </transition>
  </div>
</template>

<script>
import Axios from "axios";
import ProdData from "../data.js";

export default {
  name: "AddFamilyForm",
  data() {
    return {
      surname: null,
      title: null,
      created: false,
      errored: null,
      loading: false,
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

  methods: {
    sendData() {
      this.loading = true;

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
    },
    goBack() {
      this.$emit("close");
    },
    goFamily() {
      this.$emit("close");
      this.$router.push({ name: "MainTree", params: { id: this.surname } });
    },
    makeSmall() {
      this.surname = this.surname.toLowerCase();
      this.surname = this.surname.split(" ").join("");
      this.surname = this.surname.replace(
        /[\\~`!@#$%^&*()+=/{}[\];:'"<>.?]/g,
        ""
      ); //accepts , - _ character
    },
  },
};
</script>

<style scoped>
.pin-btn {
  position: absolute;
  right: 45px;
  border: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
input {
  margin: 10px;
}

.close-btn {
  float: right;
  color: red;
  font-weight: bolder;
  font-size: 27px;
  margin-top: -31px;
  margin-right: -18px;
  cursor: pointer;
}
</style>