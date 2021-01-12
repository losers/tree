<template>
  <div>
    <!-- Top Navigation Bar -->
    <div
      class="navbar"
      :style="{
        'margin-left': !$device.mobile ? (isCollapsed ? '25px' : '150px') : '0',
      }"
    >
      <!-- Drawer Icon for Mobile -->
      <div class="drawer-icon" v-if="$device.mobile && !title.isClkd">
        <side-drawer></side-drawer>
      </div>

      <!-- Main Title -->
      <div v-if="!title.isClkd" class="title" @click="titleClk">
        {{ storeTitle }}
      </div>

      <!-- Input Box -->
      <div v-else>
        <i class="icofont-close-line" @click="title.isClkd = false"></i>
        <input
          v-model="title.input"
          class="titleInput"
          :style="{ width: $device.mobile ? '70%' : '' }"
          autofocus
        />
        <i
          class="icofont-tick-mark"
          v-if="!title.isUpdating"
          @click="title.isUpdating = true"
        ></i>
        <div
          v-else
          class="spinner-border spinner-border-sm"
          style="width: 1rem; height: 1rem; color: green"
        ></div>
      </div>
    </div>

    <!-- Laptop Top Side Navigation Bar -->
    <div v-if="!$device.mobile">
      <SidebarMenu
        :menu="menu"
        :theme="'white-theme'"
        @toggle-collapse="onToggleCollapse"
        :collapsed="true"
        :width="'300px'"
        style="box-shadow: 1px 0px 4px 0px rgba(135, 135, 135, 1)"
      >
        <span slot="toggle-icon"
          ><i class="icofont-arrow-left"></i><i class="icofont-arrow-right"></i
        ></span>
      </SidebarMenu>

      <router-view
        style="
          transition: all 200ms linear;
          padding-top: 100px;
          padding-bottom: 50px;
        "
        :style="{ 'margin-left': isCollapsed ? '50px' : '300px' }"
      ></router-view>
    </div>

    <!-- Mobile Top Navigation Bar -->
    <div v-else>
      <router-view style="padding-top: 100px"></router-view>
    </div>
  </div>
</template>

<script>
import Store from "../store/index";
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import SideDrawer from "@/components/t-party/SideDrawer";

export default {
  mounted() {
    Store.dispatch("treeSetup", this.$route.params.id).then(function () {});

    window.onscroll = function () {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        //Scrolls Down
        document.querySelector(".navbar").classList.add("add-border");
        document.querySelector(".navbar").style.padding = "10px";
      } else {
        document.querySelector(".navbar").classList.remove("add-border");
        document.querySelector(".navbar").style.padding = "20px";
      }
    };
  },
  computed: {
    storeTitle: {
      get() {
        return Store.state.title;
      },
    },
  },
  components: {
    SidebarMenu,
    SideDrawer,
  },
  data() {
    return {
      isCollapsed: true,
      title: {
        isClkd: false,
        isUpdating: false,
        input: "",
      },
      menu: [
        {
          header: true,
          title: "Main Navigation",
          hiddenOnCollapse: true,
        },
        {
          href: "/",
          title: "Bloodline Families",
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
          icon: "icofont-newsvine",
        },
        {
          href: `/${this.$route.params.id}/events`,
          title: "Events",
          icon: "icofont-ui-calendar",
        },
        {
          href: `/${this.$route.params.id}/subtree`,
          title: "Subtree",
          icon: "icofont-site-map",
        },
        {
          href: `/${this.$route.params.id}/timeline`,
          title: "Timeline",
          icon: "icofont-sand-clock",
        },
        {
          href: `/${this.$route.params.id}/records`,
          title: "Records",
          icon: "icofont-listine-dots",
        },
        {
          href: `/${this.$route.params.id}/settings`,
          title: "Settings",
          icon: "icofont-gear",
        },
      ],
    };
  },

  methods: {
    onToggleCollapse(collapsed) {
      this.isCollapsed = collapsed;
    },
    titleClk() {
      this.title.isClkd = true;
      this.title.input = `${this.storeTitle}`;
    },
  },
};
</script>

<style scoped>
.title {
  width: 80%;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 35px;
  font-size: 25px;
  text-align: center;
}
.navbar {
  background-color: white;
  padding: 20px;
  color: indianred;
  position: fixed;
  width: 100%;
  z-index: 100;
  transition: all 200ms linear;
  display: flex;
  justify-content: center;
}
.add-border {
  box-shadow: 0px 1px 2px 1px rgb(235, 235, 235);
  padding: 10px;
}

.drawer-icon {
  float: left;
  font-size: 20px;
}
.titleInput {
  padding: 5px;
  color: indianred;
  border-radius: 5px;
  border: solid indianred 0.5px;
  text-align: center;
  margin: -6px 20px;
  font-size: 25px;
}
.titleInput:focus {
  outline: none !important;
  border: solid indianred 0.5px !important;
}
.icofont-close-line {
  font-size: 25px;
}
.icofont-tick-mark {
  color: green;
  font-size: 20px;
}
</style>