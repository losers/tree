<template>
  <div class="FormData p-5">
    <h3 v-if="!created&&!isDelete">
      <span>{{metadata?"Updating":"Creating"}} a Family Tree</span>
      <span class="close-btn" @click="goBack">x</span>
      <span v-if="surname" class="ml-1"> for {{surname}}</span>
    </h3>

    <transition name="fade" mode="out-in">
      <!-- UI will be displayed after clking delete button -->
      <div v-if="isDelete&&!created">
        <h3>
          Delete Family Permanently
          <span class="close-btn" @click="goBack">x</span>
        </h3>
        <h6 class="mt-3">
          Please enter
          <code>{{surname}}</code> in the input box to delete this family tree permanently
        </h6>
        <input class="form-control input-sm" type="text" v-model="errSurname" />
        <button :disabled="errSurname != surname" class="btn btn-danger" @click="deleteFamily">
          <span
            class="spinner-border spinner-border-sm"
            v-show="loading"
            style="margin-right: 8px;"
          ></span>Delete Permanently
        </button>
      </div>

      <!-- Displays for editing and Creating Meta Data -->
      <form v-on:submit.prevent="sendData" v-else-if="!created">
        <section v-if="editFormErrored&&metadata">{{editFormErrored}}</section>
        <section v-else>
          <span v-if="editFormLoading&&metadata">loading...</span>
          <span else>
            <div class="form-inline row">
              <label class="col" style="justify-content:left">Display Title :</label>
              <input
                type="text"
                class="form-control col-sm-8"
                id="title"
                placeholder="Display Title"
                required
                v-model="title"
              />
            </div>
            <div class="form-inline row">
              <label for="nickname" class="col" style="justify-content:left">Surname :</label>
              <input
                v-model="surname"
                type="text"
                class="form-control col-sm-8"
                id="surname"
                :disabled="metadata"
                placeholder="Enter Surname"
                @input="makeSmall"
                required
              />
            </div>
            <div class="form-inline row">
              <label for="pin" class="col" style="justify-content:left">PIN :</label>
              <input
                v-model="pin"
                type="number"
                class="form-control col-sm-8"
                id="pin"
                placeholder="Enter 4 Digit PIN"
                onkeypress="if(this.value.length==4) return false;"
                required
              />
            </div>
            <div class="row col-12" style="margin-top: 30px;">
              <button type="submit" class="btn btn-success">
                <span
                  class="spinner-border spinner-border-sm"
                  v-show="loading"
                  style="margin-right: 8px;"
                ></span>
                <span>{{metadata?"Update":"Create"}}</span>
              </button>
              <button
                type="button"
                v-show="metadata"
                class="ml-3 btn btn-danger"
                @click="isDelete=true;created=false;"
              >Delete Family</button>
            </div>
          </span>
        </section>
      </form>

      <!-- On creating a family tree -->
      <div v-else-if="created">
        <div style="margin-bottom:20px">
          <center>
            <Tick></Tick>
          </center>
          <center>
            <h1>Success!</h1>
            <span
              style="font-size: 20px;"
            >Family tree is created. Start Adding members to your family tree.</span>
          </center>
        </div>
        <center>
          <button class="btn btn-success" @click="goFamily">Go..</button>
        </center>
      </div>
      <div v-else-if="errored">Error Code : {{errored}}</div>
    </transition>
  </div>
</template>

<script>
import Axios from "axios";
import Tick from "./small/tick.vue";

export default {
  name: "AddFamilyForm",
  components: {
    Tick
  },
  props: ["metadata"],
  data() {
    return {
      surname: null,
      title: null,
      created: false,
      errored: false,
      loading: false,
      pin: "",
      isDelete: false,
      errSurname: null,
      editFormLoading: null,
      editFormErrored: null
    };
  },
  mounted() {
    console.log("created");
    if (this.metadata) {
      this.title = this.metadata.title;
      this.surname = this.metadata.surname;
      this.editFormLoading = true;
      Axios.get("http://localhost:5000/meta/get/" + this.metadata._id)
        .then(data => {
          console.log(data);
          this.pin = data.data.pin;
        })
        .catch(err => (this.editFormErrored = err))
        .finally(() => (this.editFormLoading = false));
    } else {
      this.editFormLoading = false;
      this.editFormErrored = false;
    }
  },
  methods: {
    sendData() {
      this.loading = true;
      if (this.metadata) {
        Axios.put("http://localhost:5000/meta/update", {
          title: this.title,
          _id: this.metadata._id,
          created_at: this.metadata.created_at,
          pin: this.pin
        })
          .catch(err => (this.errored = err))
          .finally(() => {
            this.loading = false;
            this.$emit("close");
          });
      } else {
        Axios.post("http://localhost:5000/meta/add", {
          title: this.title,
          surname: this.surname,
          pin: this.pin
        })
          .then(data => {
            this.created = true;
            console.log(data);
          })
          .catch(function(err) {
            this.errored = err;
            console.log(err.response);
          })
          .finally(() => (this.loading = false));
      }
    },
    deleteFamily() {
      this.loading = true;
      Axios.delete("http://localhost:5000/meta", {
        data: { surname: this.errSurname }
      })
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(() => {
          this.goBack();
          this.$router.push({ name: "Home" });
        });
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
    }
  }
};
</script>

<style scoped>
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