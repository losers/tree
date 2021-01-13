<template>
  <div>
    <div class="menu">
      <div class="drawer row">
        <div class="app-menu">
          <ul class="menu-links">
            <router-link
              :to="{
                name: 'MainTree',
                params: { id: $route.params.id },
              }"
              ><li><i class="icofont-tree"></i>Main Tree</li></router-link
            >
            <router-link
              :to="{
                name: 'RelationFinder',
              }"
              ><li><i class="icofont-search-2"></i>Relation Finder</li>
            </router-link>

            <router-link :to="{ name: 'PartialTree' }">
              <li><i class="icofont-newsvine"></i>Partial Tree</li></router-link
            >

            <router-link :to="{ name: 'Events' }"
              ><li><i class="icofont-ui-calendar"></i>Events</li></router-link
            >

            <router-link :to="{ name: 'Subtree' }">
              <li><i class="icofont-site-map"></i>Subtrees</li></router-link
            >

            <router-link :to="{ name: 'Timeline' }"
              ><li><i class="icofont-sand-clock"></i>Timeline</li></router-link
            >

            <router-link :to="{ name: 'Records' }"
              ><li><i class="icofont-listine-dots"></i>Records</li></router-link
            >

            <router-link :to="{ name: 'Settings' }"
              ><li><i class="icofont-gear"></i>Settings</li></router-link
            >
          </ul>
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
      document.querySelector("ul").classList.add("animateMe");

      console.log("done");
    },
    closeMenu() {
      document.querySelector(".drawer").classList.remove("drawer-trasform");
      document.querySelector(".menu").classList.remove("fadeMe");
      document.querySelector("ul").classList.remove("animateMe");
    },
  },
  mounted() {
    document
      .querySelector(".menu-icon")
      .addEventListener("click", this.openMenu, false);
    document
      .querySelector(".menu-links")
      .addEventListener("click", this.closeMenu, false);
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
.router-link-exact-active {
  font-weight: bold;
  color: red;
}
a {
  color: rgba(0, 0, 0, 0.7);
  font-size: 15px;
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
  height: 100%;
  overflow: scroll;
}
.bg-menu {
  width: 30%;
  height: 100%;
}

ul {
  margin-top: 25px;
  transform: translateX(-200%);
  transition: all 700ms linear;
  padding: 0;
}

li {
  position: relative;
  display: block;
  margin-bottom: 5px;
  padding: 10px;
  text-align: center;
  border-bottom: solid rgb(204, 204, 204) 1px;
  display: flex;
  justify-content: start;
  align-items: center;
  padding-left: 15px;
}
i {
  padding: 10px;
}
.animateMe {
  transform: translateX(0);
}
</style>