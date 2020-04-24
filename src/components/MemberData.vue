<template>
  <div>
    <section v-if="errored">
      <p>{{errored}}</p>
    </section>

    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <router-view></router-view>
        <Drawer @close="toggle" align="right" :closeable="true">
          <div v-if="open">
            <div class="nodeData">
              <!-- <h1>{{name}}</h1> -->
              <br />
              <!-- <img :src="nodeData.image_url" width="250px" height="250px" /> -->
              <br />
              {{data}}
              <table class="table table-borderless table-hover mt-5 table-data">
                <tbody>
                  <tr>
                    <td>9515792944</td>
                  </tr>
                  <tr>
                    <td>varunkumarmedam@gmail.com</td>
                  </tr>
                  <tr>
                    <td>Super Saiyan Dev in Medam Family</td>
                  </tr>
                </tbody>
                <button @click="addMember(2)">Add Child</button>
                <span v-if="!(data.is_mate || $route.query.hasMate)">
                  <button @click="addMember(1)">Add Mate</button>
                </span>
                <button @click="deleteMe">Delete</button>
              </table>
            </div>
          </div>
        </Drawer>
      </div>
    </section>
  </div>
</template>

<script>
import Drawer from "vue-simple-drawer";
import axios from "axios";

export default {
  name: "MemberData",
  components: {
    Drawer
  },
  data() {
    return {
      loading: true,
      data: null,
      errored: false,
      open: null,
      surname: this.$route.params.id,
      id: this.$route.params.member,
      type: this.$route.params.type
      // parent_id
    };
  },
  mounted() {
    axios
      .get("http://localhost:5000/tree/" + this.surname + "/person/" + this.id)
      .then(data => {
        this.data = data.data;
        console.log(data.data);
      })
      .catch(err => {
        this.errored = err;
        console.log("Error : " + err);
      })
      .finally(() => {
        this.loading = false;
      });
    this.$root.$on("canceled", () => {
      this.open = true;
    });
    if (this.type === undefined) {
      this.open = true;
    }
  },
  methods: {
    toggle() {
      console.log("toggles");
      console.log(this.$route.params.type);
      if (!this.$route.params.type) {
        console.log(this.type);
        this.open = false;
        // this.$router.go(-1);
        this.$router.push({
          name: "MainTree",
          params: { id: this.$route.params.id }
        });
      }
    },
    addMember(num) {
      this.addingData = true;
      this.open = false;
      this.$router.push({
        name: "AddMember",
        params: { type: num },
        query: {
          parent_id: this.data.is_mate ? this.data.parent_id : this.data._id
        }
      });
    },
    deleteMe() {
      axios
        .delete(
          "http://localhost:5000/tree/" + this.surname + "/person/" + this.id
        )
        .then(data => console.log(`Deleted : ${data}`))
        .catch(err => console.log("Error : " + err));
    }
  }
};
</script>