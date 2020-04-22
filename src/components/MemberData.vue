<template>
  <div>
    <router-view></router-view>
    <Drawer @close="toggle" align="right" :closeable="true">
      <div v-if="open">
        <div class="nodeData">
          <h1>{{name}}</h1>
          <br />
          <!-- <img :src="nodeData.image_url" width="250px" height="250px" /> -->
          <br />
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
            <button @click="addMember(0)">Add Child</button>
            <button @click="addMember(1)">Add Mate</button>
          </table>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
import Drawer from "vue-simple-drawer";

export default {
  name: "MemberData",
  components: {
    Drawer
  },
  data() {
    return {
      open: null,
      name: this.$route.params.member,
      type: this.$route.params.type
    };
  },
  mounted() {
    this.$root.$on("canceled", () => {
      // your code goes here
      this.open = true;
    });
    if (this.type === undefined) {
      this.open = true;
    }
    console.log(this.type);
  },
  methods: {
    toggle() {
      if (this.type === undefined) {
        this.open = false;
        this.$router.go(-1);
      }
    },
    addMember(num) {
      this.addingData = true;
      this.open = false;
      this.$router.push({ name: "AddMember", params: { type: num } });
    }
  }
};
</script>