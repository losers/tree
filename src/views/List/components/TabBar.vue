<template>
  <div class="tab-bar">
    <nav class="tabs" :style="{ width: $device.mobile ? '90%' : '400px' }">
      <div
        class="selector theme-primary-bgdark"
        :style="{
          left: activeItem.offsetLeft + 'px',
          width: activeItem.offsetWidth + 'px',
        }"
      ></div>
      <router-link to="" class="active"
        ><i class="icofont-people"></i>All</router-link
      >
      <router-link to="#demo"
        ><i class="icofont-light-bulb"></i
        >Demo</router-link
      >
      <router-link to="#super"
        ><i class="icofont-thunder-light"></i>Super</router-link
      >
    </nav>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeItem: {
        offsetLeft: 0,
        offsetWidth: 0,
      },
      activeWidth: 0,
    };
  },
  methods: {
    tabSelected() {
      this.activeItem = document.querySelector(".router-link-exact-active");
    },
  },
  mounted() {
    this.activeItem = document.querySelector(".router-link-exact-active");
    document
      .querySelector(".tabs")
      .addEventListener("click", this.tabSelected, false);
  },
};
</script>
<style scoped>
.icofont-light-bulb {
  font-size: 18px;
}
.tab-bar {
  position: sticky;
  top: 0;
  z-index: 10;
}
.tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -65px;
  font-size: 15px;
  padding: 0px;
  list-style: none;
  background: #fff;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  position: relative;
}

.tabs .router-link-active {
  text-decoration: none;
  display: inline-block;
  position: relative;
  z-index: 1;
  transition-duration: 0.6s;
}
a {
  padding: 10px 20px;
  color: #777;
}

.tabs .router-link-exact-active {
  color: white;
}

.tabs .router-link-active i {
  margin-right: 5px;
}

.tabs .selector {
  height: 100%;
  display: inline-block;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 1;
  border-radius: 50px;
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>