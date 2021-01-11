<template>
  <div>
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
      <div
        class="navbar"
        :style="{ 'margin-left': isCollapsed ? '0' : '150px' }"
      >
        hello World
      </div>
      <router-view
        style="transition: all 200ms linear"
        :style="{ 'margin-left': isCollapsed ? '50px' : '300px' }"
      ></router-view>
    </div>
    <div v-else>
      <div class="navbar">
        <div class="drawer-icon"><side-drawer></side-drawer></div>
        hello World
      </div>
      <router-view></router-view>
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
  components: {
    SidebarMenu,
    SideDrawer,
  },
  data() {
    return {
      isCollapsed: true,
      menu: [
        {
          header: true,
          title: "Main Navigation",
          hiddenOnCollapse: true,
        },
        {
          href: "/",
          title: "Bloodline",
          icon: "fa fa-chart-area",
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
      console.log(this.isCollapsed);
    },
  },
};
</script>

<style scoped>
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

.drawer-icon{
  float:left;
  font-size: 20px;
}
</style>