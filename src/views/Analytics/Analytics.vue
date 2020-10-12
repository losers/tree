<template>
  <div style="height: 100%">
    <!-- App Bar -->
    <div class="titlebar">
      <router-link :to="{ name: 'Tree' }" style="color: #007bff">
        <i class="icofont-arrow-left"></i>
        Back
      </router-link>
      <b class="title">Crazy Analytics</b>
      <i></i>
    </div>

    <!-- Body -->
    <div style="display: flex; width: 100%; height: 100%">
      <!-- Finders list -->
      <div class="col-2 finders pl-0 pr-0" v-if="!$device.mobile">
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

        <!-- Mobile Bottom Button -->
        <div
          v-if="$device.mobile"
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
            style="color: red; border: solid 1px red; background: white"
            class="btn form-control"
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
  clip-path: polygon(0% 0%, 75% 0%, 85% 50%, 75% 100%, 0% 100%);
  background: linear-gradient(
    90deg,
    indianred 0%,
    rgba(201, 0, 0, 1) 73%
  );
  box-shadow: 10px 10px 21px -9px rgba(255, 0, 0, 1);
}
.hr {
  height: 0.1px;
  background-color: grey;
}
.router-link-active {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 30px;
  color: indianred;
  font-weight: bold;
}
</style>