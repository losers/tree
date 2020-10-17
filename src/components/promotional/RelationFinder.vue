<template>
  <div class="content">
    <span class="close-btn" @click="goBack">x</span>
    <center class="tip-header">
      <img src="@/assets/tip.jpg" alt="Tip for family tree" width="50" />
      <p class="tip">Quick Tip</p>
    </center>
    <div class="matter">
      By using
      <span class="indian-red">Relation Finder</span> you can find Relation between any 2 persons in the entire tree.
    </div>
    <div class="actions">
      <button @click="checkFunc" class="btn btn-success">Check it out</button>
      <button @click="goBack" class="btn btn-default">Ignore it</button>
    </div>
  </div>
</template>

<style scoped>
.icofont-gear {
  color: dodgerblue;
}
.close-btn {
  float: right;
  color: red;
  font-weight: bolder;
  font-size: 27px;
  margin-top: -31px;
  margin-right: -18px;
  cursor: pointer;
}
.btn-default {
  border: 1px solid black;
}
.actions {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
}
.matter {
  text-align: center;
}
.indian-red {
  color: indianred;
  font-weight: bold;
}
.content {
  padding: 30px;
}
.tip-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}
.tip {
  font-size: 22px;
  margin: 0px !important;
}
</style>

<script>
import Store from "../../store/index";
export default {
  name: "RelationFinder",
  methods: {
    goBack() {
      Store.commit("setPromo", 1);
      this.$emit("close");
    },
    checkFunc() {
      this.goBack();
      Store.dispatch("setStepNumber", 3);
      this.$router.push({ name: "Analytics" });
    }
  }
};
</script>