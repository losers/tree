<template>
  <div class="tree-titlebar">
    <a :href="'/app'">
      <i class="icofont-arrow-left"></i> Back
    </a>
    <div class="tree-title">
      {{meta.title}}
      <span v-show="is_session && !this.$device.mobile">
        <i class="icofont-edit ml-2" @click="editmeta" style="font-size:20px;cursor: pointer;"></i>
      </span>
    </div>
    <div v-show="!this.$device.mobile">
      <router-link
        :to="{name:'Analytics'}"
        style="display: flex;align-items: center;margin-right: 5px;"
      >
        <i class="icofont-gear" style="font-size: 21px;margin-right: 8px;"></i>
        Analytics
      </router-link>
    </div>
  </div>
</template>

<script>
import AddFamily from "./AddFamilyForm";

export default {
  props: ["meta", "is_session"],
  methods: {
    editmeta() {
      this.$modal.show(
        AddFamily,
        {
          metadata: this.meta
        },
        {
          height: "auto",
          draggable: true,
          clickToClose: false,
          scrollable: true
        }
      );
    }
  }
};
</script>

<style scoped>
.tree-titlebar {
  position: fixed;
  width: 100%;
  z-index: 10;
  box-shadow: -1px 3px 20px -10px rgba(163, 163, 163, 0.75);
  padding: 5px!important;
  background-color: white;
  display: flex;
  align-items: center;
}
.tree-title {
  font-size: 30px;
  color: black;
  font-weight: bold;
  flex: 1;
}
</style>