<template>
  <div style="height: 100%">
    <!-- App Bar -->
    <div class="titlebar">
      <router-link
        :to="{ name: 'Tree' }"
        class="float-left mt-2 ml-1"
        style="color: #007bff"
      >
        <i class="icofont-arrow-left"></i>
        Back
      </router-link>
      <center>
        <p class="title">Crazy Analytics</p>
      </center>
    </div>

    <!-- Body -->
    <div style="display: flex; width: 100%; height: 100%">
      <!-- Finders list -->
      <div class="col-2 finders pl-0" v-if="!$device.mobile">
        <router-link :to="{ name: 'RelationFinder' }" class="alyt">
          <div class="item">
            <i class="icofont-search-2" style="margin-right: 10px"></i>Relation
            Finder
          </div>
        </router-link>
        <router-link :to="{ name: 'Subtree' }" class="alyt">
          <div class="item">
            <i
              class="icofont-tree"
              style="margin-right: 10px; font-size: 19px"
            ></i>
            Subtree
          </div>
        </router-link>
      </div>

      <!-- Relations Data -->
      <div
        class="col-sm-12 col-md-10"
        style="
          padding-top: 100px;
          padding-top: 90px;
          height: 100%;
          overflow: auto;
        "
      >
        <router-view></router-view>
        <div
          v-if="$device.mobile"
          class="dropup"
          style="
            width: 100%;
            position: fixed;
            bottom: 0;
            padding: 15px;
            left: 0;
            z-index: 10;
          "
        >
          <select
            v-model="selector"
            class="btn btn-success dropup form-control"
          >
            <option value="RelationFinder" selected>Relation Finder</option>
            <option value="Subtree">Subtree</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selector: this.$route.name,
    };
  },
  watch: {
    selector: {
      handler: function (val) {
        this.$router.push({
          name: val,
        });
      },
    },
  },
};
</script>

<style scoped>
.alyt {
  color: black;
}
.finders {
  padding-top: 50px;
  overflow: auto;
  height: 100%;
}
.finders .item {
  padding: 20px;
}
.finders .router-link-exact-active .item {
  /* background-image: url("../../assets/iconmonstr-arrow-49.svg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left; */
  color: white !important;
  clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
background: linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(201,0,0,1) 73%);
}
.hr {
  height: 0.1px;
  background-color: grey;
}
.router-link-active {
  color: #007bff;
  font-weight: bold;
}
.titlebar {
  position: fixed;
  width: 100%;
  z-index: 100;
  box-shadow: -1px 3px 20px -10px rgba(163, 163, 163, 0.75);
  padding: 5px;
  background-color: white;
  height: 50px;
}
.title {
  font-size: 30px;
  color: red;
  font-weight: bold;
}
</style>