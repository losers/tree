<template>
  <div>
    <div class="menu">
      <div class="drawer row">
        <div class="app-menu">
          <span>Hello World</span>
          <br />
          <router-link
            :to="{
              name: 'MainTree',
              params: { id: $route.params.id },
            }"
          >
            Main Tree
          </router-link>
          <br />
          <router-link
            :to="{
              name: 'RelationFinder',
            }"
          >
            Relation Finder
          </router-link>
        </div>
        <div class="bg-menu">
          <i
            style="font-size: 50px; color: white"
            class="icofont-close-line"
          ></i>
        </div>
      </div>
    </div>
    <div class="menu-icon"><i class="icofont-navigation-menu"></i></div>
  </div>
</template>


<script>
export default {
  methods: {
    openMenu() {
      document.querySelector(".drawer").classList.add("drawer-trasform");
      document.querySelector(".menu").classList.add("fadeMe");
    },
    closeMenu() {
      document.querySelector(".drawer").classList.remove("drawer-trasform");
      document.querySelector(".menu").classList.remove("fadeMe");
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
  margin: 0;
  transition: all 200ms linear;
}
.fadeMe {
  background-color: rgba(0, 0, 0, 0.3);
}
.drawer {
  width: 100%;
  height: 100%;
  transform: translateX(-203%);
  transition: all 500ms linear;
  margin: 0;
}
.drawer-trasform {
  pointer-events: auto;
  transform: translateX(0) !important;
}
.app-menu {
  background-color: #fff;
  width: 70%;
  height: 100%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}
.bg-menu {
  width: 30%;
  height: 100%;
}
</style>