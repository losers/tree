<template>
  <div>
    <div class="menu" @click.self="closeMenu">
      <div class="drawer" @click.self="closeMenu">
        <div class="app-menu">
          <ul class="menu-links" @click="closeMenu">
            <div class="bloodline-title">BLOODLINE</div>
            <router-link
              :to="{
                name: 'Home',
              }"
              class="menu-item-link"
              ><li>
                <i class="icofont-arrow-left drawer-icons"></i>All Families
              </li></router-link
            >
            <router-link
              :to="{
                name: 'MainTree',
                params: { id: $route.params.id },
              }"
              class="menu-item-link"
              ><li>
                <i class="icofont-tree drawer-icons"></i>Main Tree
              </li></router-link
            >
            <router-link
              :to="{
                name: 'RelationFinder',
              }"
              class="menu-item-link"
              ><li>
                <i class="icofont-search-2 drawer-icons"></i>Relation Finder
              </li>
            </router-link>

            <router-link :to="{ name: 'PartialTree' }" class="menu-item-link">
              <li>
                <i class="icofont-newsvine drawer-icons"></i>Partial Tree
              </li></router-link
            >

            <router-link :to="{ name: 'Events' }" class="menu-item-link"
              ><li>
                <i class="icofont-ui-calendar drawer-icons"></i>Events
              </li></router-link
            >

            <router-link :to="{ name: 'FamilyTimeline' }" class="menu-item-link"
              ><li><i class="icofont-sand-clock drawer-icons"></i>Family Timeline</li></router-link
            >

            <router-link :to="{ name: 'Quiz' }" class="menu-item-link"
              ><li><i class="icofont-brain drawer-icons"></i>Family Quiz</li></router-link
            >

            <router-link :to="{ name: 'Donations' }" class="menu-item-link"
              ><li>
                <i class="icofont-ui-love text-danger drawer-icons"></i
                >Donations
              </li></router-link
            >

            <router-link :to="{ name: 'Settings' }" v-if="isEditable" class="menu-item-link"
              ><li>
                <i class="icofont-gear drawer-icons"></i>Settings
              </li></router-link
            >
          </ul>
        </div>
        <div class="bg-menu" @click="closeMenu">
          <button class="drawer-close-circle" aria-label="Close menu">
            <i class="icofont-close-line"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="menu-icon" @click="openMenu"><i class="icofont-navigation-menu"></i></div>
  </div>
</template>

<script>
import Store from "@/store/index";

export default {
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    openMenu() {
      this.isOpen = true;
      const drawer = this.menuEl ? this.menuEl.querySelector(".drawer") : document.querySelector(".drawer");
      const menu = this.menuEl || document.querySelector(".menu");
      if (drawer) drawer.classList.add("drawer-trasform");
      if (menu) {
        menu.classList.add("fadeMe");
        menu.style.pointerEvents = "auto";
      }
    },
    closeMenu() {
      this.isOpen = false;
      const drawer = this.menuEl ? this.menuEl.querySelector(".drawer") : document.querySelector(".drawer");
      const menu = this.menuEl || document.querySelector(".menu");
      if (drawer) drawer.classList.remove("drawer-trasform");
      if (menu) {
        menu.classList.remove("fadeMe");
        menu.style.pointerEvents = "none";
      }
    },
  },
  mounted() {
    const menuEl = this.$el.querySelector(".menu");
    if (menuEl) {
      this.menuEl = menuEl;
      document.body.appendChild(menuEl);
    }
  },
  beforeDestroy() {
    if (this.menuEl && this.menuEl.parentNode === document.body) {
      document.body.removeChild(this.menuEl);
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
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 200;
}
.menu.fadeMe {
  opacity: 1;
  background-color: rgba(5, 8, 18, 0.65);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.drawer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  transform: translateX(-100%);
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  margin: 0;
}
.drawer.drawer-trasform {
  pointer-events: auto;
  transform: translateX(0) !important;
}

.app-menu {
  background: rgba(15, 17, 35, 0.88);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  width: 78%;
  max-width: 320px;
  height: 100%;
  box-shadow: 12px 0 50px rgba(0, 0, 0, 0.6);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.bg-menu {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.drawer-close-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin: 18px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.drawer-close-circle:active {
  transform: scale(0.92);
  background: rgba(255, 255, 255, 0.2);
}

.bloodline-title {
  color: #a78bfa;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin: 28px 20px 14px;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  opacity: 0;
  transform: translateX(-18px);
  transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}
.drawer-trasform .bloodline-title {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.04s;
}

ul.menu-links {
  padding: 0;
  margin: 0;
  list-style: none;
}

.menu-item-link {
  color: rgba(255, 255, 255, 0.88);
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  text-decoration: none !important;
  display: block;
}

li {
  position: relative;
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 13px 18px;
  margin: 5px 12px;
  border-radius: 14px;
  opacity: 0;
  transform: translateX(-24px);
  transition: opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1), transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease, box-shadow 0.2s ease;
  will-change: transform, opacity;
}

/* Staggered left-to-right cascades when drawer opens */
.drawer-trasform li {
  opacity: 1;
  transform: translateX(0);
}

.drawer-trasform a.menu-item-link:nth-of-type(1) li { transition-delay: 0.07s; }
.drawer-trasform a.menu-item-link:nth-of-type(2) li { transition-delay: 0.11s; }
.drawer-trasform a.menu-item-link:nth-of-type(3) li { transition-delay: 0.15s; }
.drawer-trasform a.menu-item-link:nth-of-type(4) li { transition-delay: 0.19s; }
.drawer-trasform a.menu-item-link:nth-of-type(5) li { transition-delay: 0.23s; }
.drawer-trasform a.menu-item-link:nth-of-type(6) li { transition-delay: 0.27s; }
.drawer-trasform a.menu-item-link:nth-of-type(7) li { transition-delay: 0.31s; }
.drawer-trasform a.menu-item-link:nth-of-type(8) li { transition-delay: 0.35s; }

/* When closed, snap back immediately with 0 delay so next open is clean */
.drawer:not(.drawer-trasform) li,
.drawer:not(.drawer-trasform) .bloodline-title {
  transition-duration: 0.1s !important;
  transition-delay: 0s !important;
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
  margin-right: 14px;
  font-size: 20px;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
}

li:hover,
li:active {
  background: linear-gradient(90deg, rgba(79, 142, 247, 0.15), transparent);
  color: #fff;
}
li:hover .drawer-icons,
li:active .drawer-icons {
  color: #4f8ef7;
  transform: scale(1.15) rotate(4deg);
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.icofont-navigation-menu {
  font-size: 24px;
}
</style>