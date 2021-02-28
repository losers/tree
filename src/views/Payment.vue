<template>
  <center>
    <div v-show="isProcessing">
      <h2>Payment is processing...</h2>
      <img src="../assets/pay-processing.png" height="200px" /><br />
      <div
        class="spinner-border"
        style="height: 50px; width: 50px; color: black; margin-top: 80px"
        role="status"
      ></div>
    </div>

    <!-- Payment Success UI -->
    <div v-show="!isProcessing" class="success-box mt-5">
      <h2 class="text-success">Payment Success</h2>
      <img src="../assets/pay-success.jpg" height="250px" /><br />
      <div class="col-4 msg">
        <span style="color: red"> 43 </span>
        <img src="../assets/b-coin.svg" height="20px" /> coins added to your
        family
      </div>
      <div class="goto-btn btn btn-success mt-3">Go to My Family</div>
    </div>
    <button @click="animation" class="mt-5">success</button>
  </center>
</template>

<script>
import bomb from "../call-confetti";
export default {
  data() {
    return {
      isProcessing: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.isProcessing = false;
      bomb.realistic();
      setTimeout(() => {
        document.querySelector(".success-box").style.transform = "scale(1.1)";
      }, 100);
    }, 3000);
  },
  methods: {
    animation() {
      bomb.realistic();
      this.image = "../assets/pay-success.png";
    },
  },
};
</script>

<style scoped>
.msg {
  background: rgb(207, 207, 207);
  border-radius: 10px;
  padding: 20px;
}
.success-box {
  transition: 1s all;
}
.goto-btn {
}
</style>