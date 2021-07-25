<template>
  <div class="con">
    <center>
      <div v-if="paymentProcessing">
        <h4>Processing your Payment</h4>
        <img src="@/assets/pay-processing.png" height="200px" /><br />
        <div
          class="spinner-border spinner-border-sm mt-4"
          style="width: 3.5rem; height: 3.5rem; color: green"
        ></div>
      </div>
      <div v-else>
        <tick></tick>
        <!-- <img src="@/assets/pay-success.jpg" height="300px" /> -->
        <h4 class="mt-4 text-success">Payment Success</h4>
        <h5 class="sub">Thank you</h5>
        <h6 class="redirect">
          You will be redirected to Bloodline. if not redirected
          <a class="click-here" @click="redirectToPage(surname)">click here.</a>
        </h6>
      </div>
    </center>
  </div>
</template>
<style scoped>
.redirect {
  margin-top: 100px;
  color: grey;
  font-size: 12px;
}

.redirect .click-here {
  color: blue;
  text-decoration: underline;
}
.sub {
  color: grey;
  font-size: 14px;
}
.con {
  padding-top: 200px;
}
</style>
<script>
import ProdData from "@/data.js";
import Axios from "axios";
import bomb from "../bomb";
import Tick from "@/components/small/tick";
export default {
  name: "Payment",
  components: { Tick },
  data() {
    return {
      surname: "",
      paymentProcessing: true,
    };
  },
  methods: {
    redirectToPage(){
        this.$router.push({
            name: "Donations",
            params: { id: this.surname },
        });
    }
  },
  mounted() {
    if (this.$route.query.paymentId && this.$route.query.PayerID) {
      let url = `${ProdData.getHostURL()}/pay/`;
      let params = {
        payment_id: this.$route.query.paymentId,
        payer_id: this.$route.query.PayerID,
      };
      if(this.$route.query.currency){ //For RazorPay Case
        params.currency = this.$route.query.currency;
        params.signature = this.$route.query.signature;
      }
      Axios.put(url, params)
        .then((data) => {
          this.surname = data.data.surname;
          setTimeout(() => {
            this.redirectToPage()
          }, 5000);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          bomb.realistic();
          this.paymentProcessing = false;
        });
    }
  },
};
</script>
