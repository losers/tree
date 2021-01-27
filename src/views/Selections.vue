<template>
  <div style="height: 100%">
    <!-- Top Navigation Bar -->
    <div
      class="navbar"
      :style="{
        'margin-left': !$device.mobile ? (isCollapsed ? '25px' : '150px') : '0',
      }"
    >
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
      <div v-if="!title.isClkd" class="title" @click="titleClk">
        <div class="title-text">
          {{ storeTitle }}
        </div>
        <!-- <i class="icofont-ui-user-group" style="font-size: 30px"></i>101 -->
      </div>

      <!-- Title Update Input Box -->
      <div v-else>
        <!-- Cross Icon -->
        <i class="icofont-close-line cursor" @click="title.isClkd = false"></i>

        <!-- Input Box -->
        <input
          v-model="title.input"
          class="titleInput"
          :style="{ width: $device.mobile ? '70%' : '' }"
          autofocus
        />

        <!-- Ticker Icon -->
        <i
          class="icofont-check cursor"
          v-if="!title.isUpdating"
          @click="titleUpdate"
        ></i>

        <!-- Loader Circular -->
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
          transition: all 200ms linear;
          padding-top: 100px;
          padding-bottom: 50px;
        "
        :style="{ 'margin-left': isCollapsed ? '50px' : '300px' }"
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
  height: 35px;
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
  background-color: white;
  padding: 20px 5px;
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
  color: indianred !important;
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
</style>