<template>
  <div>
    <div
      class="donation-body row"
      :style="{ margin: $device.mobile ? '10px' : '0 100px' }"
    >
      <img
        src="@/assets/donate-hands.png"
        class="col-sm-12 col-md-6"
        style="border-radius: 20px; margin: auto; width: 70%;"
        width="70%"
      />
      <div class="col-sm-12 col-md-6">
        <!-- <p>
          Think of giving not as a duty but as a privilege with a great love
        </p> -->
        <p>It's not just a donation, It's about making a difference.</p>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-evenly;
          "
        >
          <h4>Your Family Donations :</h4>
          <h1>0</h1>
        </div>
        
        {{country.currency.symbol}} <input type="text" v-model="amount"/> 
        
        <touch-ripple
          @click.native="initiatePaymentGateway()"
          :speed="1.1"
          style="
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0;
            margin-left: -15px;
            border: solid 15px transparent;
          "
        >
          <div
            style="
              width: 100%;
              background-color: #99201c;
              background-image: linear-gradient(90deg, #99201c 0%, #f56545 74%);
              color: white;
              padding: 10px;
            "
          >
            <center>
              <i class="icofont-ui-love" style="color: white"></i> Donate
            </center>
          </div>
        </touch-ripple>
      </div>
    </div>
  </div>
</template>

<script>
import { touchRipple } from "vue-touch-ripple";
import Axios from "axios";
import ProdData from "@/data.js";
import currencyToSymbolMap from 'currency-symbol-map/map'

export default {
  components: {
    touchRipple,
  },
  data(){
    return {
      amount: 10,
      country: {
        country_code: null,
        currency: {
          code: null,
          symbol: null
        }
      }
    }
  },
  mounted(){
      // To Get Location Info
      
      let url = `${ProdData.getHostURL()}/pay/${this.$route.params.id}/donation-info`;
      Axios.get(url)
      .then(data => {
          this.country.country_code = data.data.loc_info.country_code;
          this.country.currency.code = data.data.loc_info.currency_code;
          this.country.currency.symbol = currencyToSymbolMap[this.country.currency.code];
      })
      .catch(err => console.log(err))
      .finally(() => {
         
      });
  },
  methods: {
    initiatePaymentGateway() {
      //Create Profile
      // let url1 = `${ProdData.getHostURL()}/pay/${this.$route.params.id}/profile`;
      // Axios.post(url1, {})
      //   .then(data => {
      //     console.log(data);
      //   })
      //   .catch(err => console.log(err))
      //   .finally(() => console.log("daskna"));

      let payload = {};
      payload.amount = this.amount;
      payload.currency = this.country.currency.code === "INR"?"CAD":this.country.currency.code;
      console.log(payload);
      let url = `${ProdData.getHostURL()}/pay/${this.$route.params.id}`;
      Axios.post(url, payload)
        .then(data => {
          window.open(data.data.url, "_self");
        })
        .catch(err => console.log(err))
        .finally(() => console.log("daskna"));
    },
  },
};
</script>

<style scoped>
.donation-body {
  box-shadow: 0px 0px 5px 0px rgb(226 226 226);
  border-radius: 10px;
  height: 98%;
}
</style>