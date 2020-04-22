<template>
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
          <!-- <button @click="showAlert">Update Data</button> -->
        </table>
      </div>
    </div>
  </Drawer>
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
      open: true,
      name: this.$route.params.member
    };
  },
  mounted() {
    console.log(this.name);
  },
  methods: {
    toggle() {
      this.$router.go(-1);
    }
  }
};
</script>