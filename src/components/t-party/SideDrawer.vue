<template>
  <div>
    <div class="menu row">
      <div class="app-menu">
        <span>Hello World</span>
        <br>
        <router-link
          :to="{
            name: 'MainTree',
            params: { id: $route.params.id },
          }"
        >
          Main Tree
        </router-link>
        <br>
        <router-link
          :to="{
            name: 'RelationFinder',
          }"
        >
          Relation Finder
        </router-link>
      </div>
      <div class="bg-menu">
        <p style="font-size: 50px; color: white">
          <i class="icofont-close-line"></i>
        </p>
      </div>
    </div>
    <div class="menu-icon"><i class="icofont-navigation-menu"></i></div>
  </div>
</template>


<script>
export default {
  methods: {
    toggleClassMenu() {
      console.log("clsldkldksd");
      if (
        document.querySelector(".app-menu").classList.contains("menu--visible")
      ) {
        console.log("closing");
        document.querySelector(".bg-menu").classList.remove("bg-trasform");
        document.querySelector(".app-menu").classList.remove("menu--visible");
      } else {
        console.log("showing..");
        document.querySelector(".bg-menu").classList.add("bg-trasform");
        document.querySelector(".app-menu").classList.add("menu--visible");
      }
    },
    openMenu() {
      document.querySelector(".app-menu").classList.add("menu--visible");
      document.querySelector(".bg-menu").classList.add("bg-trasform");
    },
    closeMenu() {
      document.querySelector(".bg-menu").classList.remove("bg-trasform");
      document.querySelector(".app-menu").classList.remove("menu--visible");
    },
  },
  mounted() {
    document
      .querySelector(".menu-icon")
      .addEventListener("click", this.openMenu, false);
    document
      .querySelector(".bg-menu")
      .addEventListener("click", this.closeMenu, false);
  },
};
</script>

<style scoped>
.menu {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  margin-left: 0px;
  z-index: 100;
}

.app-menu {
  background-color: #fff;
  /* max-width: 400px; */
  width: 70%;
  height: 100%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  -webkit-transform: translateX(-203%);
  transform: translateX(-203%);
  transition: all 330ms ease-out;
}
.bg-menu {
  background-color: rgba(0, 0, 0, 0.5);
  width: 30%;
  height: 100%;
  transform: translateX(-400%);
  display: flex;
  flex-direction: column;
}
.bg-trasform {
  pointer-events: auto;
  transform: translateX(0) !important;
  /* transition: all 30ms step-end 300ms; */
  transition-delay: 330ms;
}
.menu--visible {
  -webkit-transform: none;
  pointer-events: auto;
  transform: translateX(0) !important;
  transition: all 330ms linear;
}
</style>