<template>
  <div>
    <router-view></router-view>
    <Drawer @close="toggle" align="right" :closeable="true">
      <div v-if="open" class="draw">
        <section v-if="errored">
          <p>{{errored}}</p>
        </section>
        <section v-else>
          <div v-if="loading">Loading...</div>
          <div v-else>
            <!-- <img :src="nodeData.image_url" width="250px" height="250px" /> -->
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
              <span v-if="!$route.query.hasMate">
                <button @click="addMember(1)">Add Mate</button>
              </span>
              <button @click="deleteMe" class="btn btn-danger">Delete</button>
            </table>
          </div>
        </section>
      </div>
    </Drawer>
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
    };
  },
  mounted() {
    axios
      .get("http://localhost:5000/tree/" + this.surname + "/person/" + this.id)
      .then(data => {
        this.data = data.data;
      })
      .catch(err => {
        this.errored = err;
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
      if (!this.$route.params.type) {
        this.open = false;
        this.$router.push({
          name: "MainTree",
          params: { id: this.$route.params.id }
        });
      }
    },
    addMember(num) {
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