<template>
  <div class="content">
    <span class="close-btn" @click="goBack">x</span>
    <center class="tip-header">
      <img src="@/assets/tip.jpg" alt="Tip for family tree" width="50" />
      <p class="tip">Quick Info</p>
    </center>
    <div class="matter">
      Bloodline is 
      <span class="indian-red">Free</span> Forever. If you like our work please support us by donating.
      <div class="extra">We run this website completly on donations.</div>
    </div>
    <div class="actions">
        <button @click="checkFunc" class="btn btn-success">
            Donate
            <i class="icofont-heart-alt"></i>
        </button>
        <button @click="goBack" class="btn btn-default">Ignore it</button>
    </div>
  </div>
</template>

<style scoped>
.icofont-heart-alt{
    color: red;
}
.extra {
  font-size: 12px;
  color: grey;
  margin-top: 20px;
}
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
import Store from "@/store/index";
import {Promotional} from "@/util/constants";

export default {
  name: "DonationPromo",
  methods: {
    goBack() {
      Store.commit("setPromo", Promotional.Donation.Name);
      this.$emit("close");
    },
    checkFunc() {
      this.goBack();
      this.$router.push({ name: "Donations" });
    }
  }
};
</script>