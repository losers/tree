<template>
  <div style="height: 100%" class="selections-wrapper bloodline-app">
    <!-- Top Navigation Bar -->
    <div class="navbar" :class="[{ 'updating-navbar': title.isClkd }, { 'navbar-hidden': isModalActive }]">
      <div class="navbar-animated-border"></div>

      <!-- Back Btn for Subtree -->
      <div
        v-if="$device.mobile && $route.params.subtree_id && !title.isClkd"
        class="back-btn"
      >
        <router-link
          :to="{ name: 'MainTree', params: { id: $route.params.id } }"
          ><i class="icofont-arrow-left"></i>Home</router-link
        >
      </div>

      <!-- Drawer Icon for Mobile -->
      <div class="drawer-icon" v-else-if="$device.mobile && !title.isClkd">
        <side-drawer></side-drawer>
      </div>

      <!-- Main Title -->
      <div v-if="!title.isClkd" class="title cursor" @click="titleClk">
        <div class="title-text title-gradient">
          {{ storeTitle }}
        </div>
      </div>

      <!-- Title Update Input Box -->
      <div v-else class="title" style="display: grid; grid-template-columns: 40px 1fr 40px; align-items: center; width: 100%; padding: 0 20px;">
        <!-- Cross Icon -->
        <i class="icofont-close-line cursor" @click="title.isClkd = false" style="color: #ff4757; justify-self: start;"></i>

        <!-- Input Box -->
        <input
          v-model="title.input"
          class="titleInput"
          style="width: 100%;"
          autofocus
        />

        <!-- Ticker Icon -->
        <i
          class="icofont-check cursor"
          v-if="!title.isUpdating"
          @click="titleUpdate"
          style="color: #2ed573; justify-self: end;"
        ></i>

        <!-- Loader Circular -->
        <div
          v-else
          class="spinner-border spinner-border-sm"
          style="width: 1rem; height: 1rem; color: #2ed573; justify-self: end;"
        ></div>
      </div>
    </div>

    <!-- Laptop Top Side Navigation Bar -->
    <div v-if="!$device.mobile" class="h-100">
      <SidebarMenu
        :menu="menu"
        :theme="'black-theme'"
        @toggle-collapse="onToggleCollapse"
        :width="'300px'"
        style="box-shadow: 2px 0px 10px 0px rgba(135, 135, 135, 1)"
      >
        <span slot="toggle-icon"
          ><i class="icofont-arrow-left"></i><i class="icofont-arrow-right"></i
        ></span>
      </SidebarMenu>

      <router-view
        style="
          transition: all 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
          padding-top: 100px;
          padding-bottom: 50px;
        "
        :style="{ 'margin-left': isCollapsed ? '107px' : '340px' }"
      ></router-view>
    </div>

    <!-- Mobile Router View -->
    <router-view v-else style="padding-top: 100px" class="h100"></router-view>
  </div>
</template>

<script>
import Store from "@/store/index";
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import SideDrawer from "@/components/t-party/SideDrawer";
import Axios from "axios";
import ProdData from "../data";

export default {
  mounted() {
    Store.dispatch("treeSetup", this.$route.params.id).then(function () {});
    window.onscroll = function () {
      try {
        if (
          document.body.scrollTop > 80 ||
          document.documentElement.scrollTop > 80
        ) {
          //Scrolls Down
          document.querySelector(".navbar").classList.add("add-border");
          document.querySelector(".navbar").style.padding = "10px 0";
        } else {
          document.querySelector(".navbar").classList.remove("add-border");
          document.querySelector(".navbar").style.padding = "20px 5px";
        }
      } catch (error) {
        console.log();
      }
    };
  },
  computed: {
    storeTitle: {
      get() {
        if (!this.$route.params.subtree_id) {
          return Store.state.title;
        } else {
          return Store.state.subtree_meta.title
            ? Store.state.subtree_meta.title
            : `${Store.state.sub_member_data.short_name}'s Tree`;
        }
      },
    },
    subtreeTitle: {
      get() {
        return Store.state.subtree;
      },
    },
    isEditable: {
      get() {
        return Store.getters.getIsEditable;
      },
    },
    isModalActive() {
      const name = this.$route.name;
      return name === 'MemberData' || name === 'SubMemberData';
    }
  },
  components: {
    SidebarMenu,
    SideDrawer,
  },
  data() {
    return {
      isCollapsed: false,
      title: {
        isClkd: false,
        isUpdating: false,
        input: "",
      },
      subTitle: {
        isClkd: false,
        isUpdating: false,
        input: "",
      },
      menu: [
        {
          header: true,
          title: "Bloodline",
          hiddenOnCollapse: true,
        },
        {
          href: "/",
          title: "All Families",
          icon: "icofont-arrow-left",
        },
        {
          href: `/${this.$route.params.id}`,
          title: "Main Tree",
          icon: "icofont-tree",
        },
        {
          href: `/${this.$route.params.id}/relation-finder`,
          title: "Relation Finder",
          icon: "icofont-search-2",
        },
        {
          href: `/${this.$route.params.id}/partial-tree`,
          title: "Partial Tree",
          icon: "icofont-site-map",
        },
        {
          href: `/${this.$route.params.id}/events`,
          title: "Events",
          icon: "icofont-ui-calendar",
        },
        // {
        //   href: `/${this.$route.params.id}/subtree`,
        //   title: "Subtree",
        //   icon: "icofont-site-map",
        // },
        // {
        //   href: `/${this.$route.params.id}/timeline`,
        //   title: "Timeline",
        //   icon: "icofont-sand-clock",
        // },
        // {
        //   href: `/${this.$route.params.id}/records`,
        //   title: "Records",
        //   icon: "icofont-listine-dots",
        // },
        {
          href: `/${this.$route.params.id}/donations`,
          title: "Donations",
          icon: "icofont-ui-love text-danger",
        },
        {
          href: `/${this.$route.params.id}/settings`,
          title: "Settings",
          icon: "icofont-gear",
          // disabled: !Store.state.is_session,
          // badge: {
          //   class: !this.isEditable ? "icofont-lock" : "",
          // },
        },
      ],
    };
  },

  methods: {
    titleUpdate() {
      this.title.isUpdating = true;
      let url = `${ProdData.getHostURL()}/meta/${
        this.$route.params.id
      }/update-title`;
      let params = {
        title: this.title.input,
      };
      if (this.$route.params.subtree_id) {
        params.subtree_id = this.$route.params.subtree_id;
      }
      Axios.put(url, params)
        .then((data) => {
          this.toggleTitleClick();
          data = data.data;
          if (!this.$route.params.subtree_id) {
            Store.dispatch("setTitle", data);
          } else {
            Store.state.subtree_meta.title = data;
          }
        })
        .catch((err) => console.log(err))
        .finally(() => (this.title.isUpdating = false));
    },
    onToggleCollapse(collapsed) {
      this.isCollapsed = collapsed;
    },
    toggleTitleClick() {
      this.title.isClkd = !this.title.isClkd;
    },
    titleClk() {
      if (this.isEditable) {
        this.title.isClkd = true;
        this.title.input = `${this.storeTitle}`;
      }
    },
  },
};
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
.title {
  width: 80%;
  height: 48px;
  font-size: 25px;
  text-align: center;
  display: flex;
  align-items: center;
}
.title-text {
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;
  white-space: nowrap;
}
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(15, 17, 35, 0.65);
  backdrop-filter: blur(24px);
  border-radius: 50px;
  height: 64px;
  color: #fff;
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 800px;
  z-index: 50;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
.navbar-hidden {
  z-index: 0 !important;
}
.add-border {
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  background: rgba(10, 12, 25, 0.85);
}

.drawer-icon {
  float: left;
  font-size: 20px;
}
.titleInput {
  padding: 5px 10px;
  background: transparent;
  border: none;
  color: #fff;
  text-align: center;
  font-size: 22px;
  font-family: 'Inter', sans-serif;
  width: 100%;
}
.titleInput:focus {
  outline: none !important;
}
.icofont-close-line {
  font-size: 25px;
  font-weight: bold;
}

.icofont-check {
  color: green;
  font-size: 30px;
}

.back-btn {
  width: 20%;
}
a {
  color: #a78bfa !important;
  transition: color 0.3s ease;
}
a:hover {
  color: #4f8ef7 !important;
}
.subtree-titlebg {
  background-color: indianred;
  padding: 6px;
  border-radius: 10px;
  color: white;
  margin-top: 5px;
  box-shadow: 0px 3px 5px 0px rgba(255, 120, 120, 1);
}
.subtree-title {
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1 1 0%;
  white-space: nowrap;
  text-align: center;
  width: 60%;
  margin-left: 20%;
}
.subtree-members {
  float: right;
  position: relative;
  top: -30px;
  right: 10px;
}

/* Sidebar Overrides for Floating Modern Theme */
::v-deep .v-sidebar-menu {
  background: rgba(15, 17, 35, 0.65) !important;
  backdrop-filter: blur(24px) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  height: calc(100vh - 32px) !important;
  margin: 16px !important;
  border-radius: 24px !important;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05) !important;
  padding-top: 16px !important;
}
::v-deep .v-sidebar-menu.vsm_collapsed {
  width: 75px !important;
  max-width: 75px !important;
  min-width: 75px !important;
}
::v-deep .v-sidebar-menu.vsm_collapsed .vsm--list {
  width: 75px !important;
  max-width: 75px !important;
}
::v-deep .v-sidebar-menu .vsm--mobile-bg {
  background: rgba(15, 17, 35, 0.95) !important;
  backdrop-filter: blur(24px) !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
}
::v-deep .v-sidebar-menu .vsm--mobile-item {
  background: transparent !important;
}
::v-deep .v-sidebar-menu .vsm--link {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  margin: 4px 12px !important;
  border-radius: 12px !important;
  overflow: hidden;
}
::v-deep .v-sidebar-menu .vsm--link_hover {
  background: linear-gradient(90deg, rgba(79, 142, 247, 0.15), transparent) !important;
  transform: translateX(6px);
}
::v-deep .v-sidebar-menu .vsm--link_hover .vsm--icon {
  transform: scale(1.15) rotate(5deg) !important;
  color: #4f8ef7 !important;
}
::v-deep .v-sidebar-menu .vsm--link_active {
  background: linear-gradient(90deg, rgba(79, 142, 247, 0.25), transparent) !important;
  border-left: 3px solid #4f8ef7 !important;
  box-shadow: inset 20px 0 40px -20px rgba(79, 142, 247, 0.4) !important;
}
::v-deep .v-sidebar-menu .vsm--icon {
  background-color: transparent !important;
  color: #a78bfa !important;
  font-size: 20px !important;
  transition: all 0.4s ease !important;
}
::v-deep .v-sidebar-menu .vsm--title {
  font-family: 'Inter', sans-serif !important;
  font-weight: 600 !important;
  color: rgba(255,255,255,0.9) !important;
  letter-spacing: 0.3px !important;
}
::v-deep .v-sidebar-menu .vsm--header {
  color: #a78bfa !important;
  font-family: 'Inter', sans-serif !important;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 800 !important;
  font-size: 12px !important;
  margin-top: 10px !important;
}

::v-deep .v-sidebar-menu .vsm--toggle-btn {
  background: transparent !important;
  border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 0 0 24px 24px !important;
  color: #a78bfa !important;
  transition: all 0.3s ease !important;
}
::v-deep .v-sidebar-menu .vsm--toggle-btn:hover {
  background: rgba(79, 142, 247, 0.1) !important;
  color: #4f8ef7 !important;
}

.title-gradient {
  background: linear-gradient(135deg, #4f8ef7 0%, #a78bfa 50%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease-in-out infinite alternate;
}

@keyframes gradientShift {
  from { filter: hue-rotate(0deg); }
  to   { filter: hue-rotate(30deg); }
}

.navbar-animated-border {
  position: absolute;
  inset: 0;
  border-radius: 50px;
  padding: 2px;
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  overflow: hidden;
}
.navbar-animated-border::before {
  content: '';
  position: absolute;
  top: -200%;
  left: -200%;
  width: 500%;
  height: 500%;
  background: conic-gradient(transparent, transparent, transparent, #4f8ef7, #a78bfa);
  animation: rotateBorder 3s linear infinite;
}
.updating-navbar .navbar-animated-border::before {
  background: conic-gradient(transparent, transparent, transparent, #ff4757, #ffa502);
  animation: rotateBorder 2s linear infinite;
}

@keyframes rotateBorder {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>