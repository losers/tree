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

            <router-link :to="{ name: 'Donations' }"
              ><li>
                <i class="icofont-ui-love text-danger drawer-icons"></i
                >Donations
              </li></router-link
            >

            <router-link :to="{ name: 'Settings' }" v-if="isEditable"
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
      // document.querySelector("ul").classList.add("animateMe");
    },
    closeMenu() {
      document.querySelector(".drawer").classList.remove("drawer-trasform");
      document.querySelector(".menu").classList.remove("fadeMe");
      // document.querySelector("ul").classList.remove("animateMe");
    },
  },
  mounted() {
    const menuEl = this.$el.querySelector(".menu");
    if (menuEl) {
      document.body.appendChild(menuEl);
    }
    
    // Allow time for DOM to update
    this.$nextTick(() => {
      const menuIcon = this.$el.querySelector(".menu-icon");
      if (menuIcon) {
        menuIcon.addEventListener("click", this.openMenu, false);
      }
      
      const menuLinks = document.querySelector(".menu-links");
      if (menuLinks) {
        menuLinks.addEventListener("click", this.closeMenu, false);
      }
      
      const bgMenu = document.querySelector(".bg-menu");
      if (bgMenu) {
        bgMenu.addEventListener("click", this.closeMenu, false);
      }
    });
  },
  beforeDestroy() {
    const menuEl = document.querySelector(".menu");
    if (menuEl && menuEl.parentNode === document.body) {
      document.body.removeChild(menuEl);
    }
  },
  computed: {
    isEditable: {
      get() {
        return Store.getters.getIsEditable;
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
  color: #a78bfa;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 25px 20px 15px;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
}
.router-link-exact-active li {
  background: linear-gradient(90deg, rgba(79, 142, 247, 0.25), transparent);
  border-left: 3px solid #4f8ef7;
  color: #fff;
  text-shadow: 0 0 10px rgba(79, 142, 247, 0.8);
  box-shadow: inset 20px 0 40px -20px rgba(79, 142, 247, 0.4);
}
.drawer-icons {
  background: transparent;
  color: #a78bfa;
  margin-right: 15px;
  font-size: 22px;
  transition: all 0.3s ease;
}
a {
  color: rgba(255,255,255,0.85);
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  text-decoration: none;
}
.fadeMe {
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
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
  background: rgba(15, 17, 35, 0.7);
  backdrop-filter: blur(40px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  width: 75%;
  height: 100%;
  box-shadow: 10px 0 50px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
}
.bg-menu {
  width: 30%;
  height: 100%;
}
.icofont-navigation-menu {
  font-size: 30px;
}
ul {
  /* transform: translateX(-200%); */
  /* transition: all 700ms linear; */
  padding: 0;
}

li {
  position: relative;
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 14px 20px;
  margin: 8px 12px;
  border-radius: 14px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 0;
  transform: translateX(-20px);
}
.drawer-trasform li {
  opacity: 1;
  transform: translateX(0);
}
.drawer-trasform a:nth-child(2) li { transition-delay: 0.1s; }
.drawer-trasform a:nth-child(3) li { transition-delay: 0.15s; }
.drawer-trasform a:nth-child(4) li { transition-delay: 0.2s; }
.drawer-trasform a:nth-child(5) li { transition-delay: 0.25s; }
.drawer-trasform a:nth-child(6) li { transition-delay: 0.3s; }
.drawer-trasform a:nth-child(7) li { transition-delay: 0.35s; }
.drawer-trasform a:nth-child(8) li { transition-delay: 0.4s; }
.drawer-trasform a:nth-child(9) li { transition-delay: 0.45s; }

li:hover {
  background: linear-gradient(90deg, rgba(79, 142, 247, 0.15), transparent);
  transform: translateX(8px) !important;
  color: #fff;
  text-shadow: 0 0 8px rgba(255,255,255,0.5);
}
li:hover .drawer-icons {
  color: #4f8ef7;
  transform: scale(1.2) rotate(5deg);
}
i {
  padding: 8px;
}
</style>