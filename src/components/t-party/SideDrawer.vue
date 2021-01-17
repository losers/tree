<template>
  <div>
    <div class="menu">
      <div class="drawer row">
        <div class="app-menu">
          <ul class="menu-links">
            <div style="color: grey" class="bloodline-title">BLOODLINE</div>
            <router-link
              :to="{
                name: 'Home',
              }"
              ><li>
                <i class="icofont-arrow-left drawer-icons"></i>All Families
              </li></router-link
            >
            <router-link
              :to="{
                name: 'MainTree',
                params: { id: $route.params.id },
              }"
              ><li>
                <i class="icofont-tree drawer-icons"></i>Main Tree
              </li></router-link
            >
            <router-link
              :to="{
                name: 'RelationFinder',
              }"
              ><li>
                <i class="icofont-search-2 drawer-icons"></i>Relation Finder
              </li>
            </router-link>

            <router-link :to="{ name: 'PartialTree' }">
              <li>
                <i class="icofont-newsvine drawer-icons"></i>Partial Tree
              </li></router-link
            >

            <router-link :to="{ name: 'Events' }"
              ><li>
                <i class="icofont-ui-calendar drawer-icons"></i>Events
              </li></router-link
            >

            <!-- <router-link :to="{ name: 'Subtree' }">
              <li><i class="icofont-site-map"></i>Subtrees</li></router-link
            > -->

            <!-- <router-link :to="{ name: 'Timeline' }"
              ><li><i class="icofont-sand-clock"></i>Timeline</li></router-link
            > -->

            <!-- <router-link :to="{ name: 'Records' }"
              ><li><i class="icofont-listine-dots"></i>Records</li></router-link
            > -->

            <router-link
              :to="{ name: 'Settings' }"
              v-if="!viewOnly"
              ><li>
                <i class="icofont-gear drawer-icons"></i>Settings
              </li></router-link
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
import Store from "@/store/index";

export default {
  methods: {
    openMenu() {
      document.querySelector(".drawer").classList.add("drawer-trasform");
      document.querySelector(".menu").classList.add("fadeMe");
      document.querySelector("ul").classList.add("animateMe");
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
  computed: {
    viewOnly: {
      get() {
        return Store.state.view_only;
      },
    },
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
.bloodline-title {
  color: grey;
  font-size: 18px;
  margin: 15px 20px;
}
.router-link-exact-active li {
  border-left: solid red 5px;
  background-color: black;
}
.drawer-icons {
  border-radius: 5px;
  background-color: black;
  margin-right: 15px;
  font-size: 20px;
}
a {
  color: white;
  font-size: 18px;
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
  background-color: #2a2a2e;
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
.icofont-navigation-menu {
  font-size: 30px;
}
ul {
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