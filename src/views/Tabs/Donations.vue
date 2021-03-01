<template>
  <div>
    <div
      class="donation-card row"
      :style="{ margin: $device.mobile ? '10px' : '0 100px' }"
    >
      <img
        src="@/assets/donate-hands.png"
        class="col-sm-12 col-md-6"
        width="70%"
      />
      <div class="col-sm-12 col-md-6">
        <div v-if="isMounted" class="d-flex flex-column h-100">
          <!-- No Donations Found -->
          <div v-if="transactions.length == 0">
            <center class="mt-3">
              <h3 style="color: indianred">
                Bloodline<strong> Donations</strong>
              </h3>
            </center>
            <!-- <div
              style="
                background-position: 0px 0px;
                background-size: 20px 20px;
                height: 60px;
                width: 100%;
                background-image: radial-gradient(red 12%, white 5%);
              "
            ></div> -->
            <!-- Think of giving not as a duty but as a privilege with a great love -->
            <p class="donation-msg" style="font-weight: bold">
              It's not just a donation, It's all about making a difference
            </p>
            <p>
              <strong style="color: red">Bloodline</strong> work on Donations.
              We have crazy gifts for all donators like you.
            </p>
          </div>

          <!-- Donations Found -->
          <div v-else>
            <div class="d-flex mt-3 justify-content-around align-items-center">
              <h4 class="text-muted">Family Donations :</h4>
              <h1>{{ transactions.length }}</h1>
            </div>

            <!-- Donation Transactions -->
            <div class="d-flex" style="overflow: auto">
              <div
                v-for="transaction in transactions"
                :key="transaction['_id']"
                class="col-9 p-0"
              >
                <center class="transaction-box">
                  <!-- Amount -->
                  <div style="font-size: 30px; color: indianred">
                    {{ transaction["symbol"] }}
                    <strong>
                      {{
                        transaction["transactions"][0]["amount"]["total"]
                      }}</strong
                    >
                  </div>
                  <!-- User -->
                  <div class="m-2">
                    <i class="icofont-ui-user" style="color: grey"></i>
                    <strong>
                      {{
                        "  " +
                        transaction["payer"]["payer_info"]["first_name"] +
                        " " +
                        transaction["payer"]["payer_info"]["last_name"]
                      }}</strong
                    >
                  </div>
                  <!-- Date Time -->
                  <div style="color: grey; font-size: 14px">
                    <i class="icofont-ui-calendar"></i>
                    {{ new Date(transaction["create_time"]).toDateString() }}
                  </div>
                </center>
              </div>
            </div>
          </div>

          <!-- Donation Box -->
          <div class="donation-box mt-auto mb-3 p-3 bd-highlight">
            <center style="font-size: 20px; font-weight: bold">
              <i class="icofont-gift"></i> Donation Box
            </center>
            <div class="row m-3">
              <div class="col-2" style="font-size: 25px">
                {{ country.currency.symbol }}
              </div>
              <input
                class="col-9 form-control"
                placeholder="Enter Amount"
                type="text"
                v-model="amount"
              />
            </div>
            <touch-ripple
              @click.native="initiatePaymentGateway()"
              :speed="1.1"
              class="w-100"
              color="indianred"
            >
              <div class="donation-btn">
                <center>
                  <i class="icofont-ui-love" style="color: red"></i>
                  <strong> Donate Now </strong>
                </center>
              </div>
              <div
                v-if="isTransacting"
                class="spinner-border spinner-border-sm"
                style="
                  width: 1rem;
                  height: 1rem;
                  color: red;
                  position: absolute;
                  right: 10px;
                  bottom: 10px;
                "
              ></div>
            </touch-ripple>
          </div>
        </div>
        <div
          v-else
          style="height: 100%; width: 100%"
          class="d-flex justify-content-center align-items-center"
        >
          <div
            class="spinner-border spinner-border-sm"
            style="width: 2.5rem; height: 2.5rem; color: indianred"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { touchRipple } from "vue-touch-ripple";
import Axios from "axios";
import ProdData from "@/data.js";
import currencyToSymbolMap from "currency-symbol-map/map";

export default {
  components: {
    touchRipple,
  },
  data() {
    return {
      amount: 10,
      isMounted: false,
      isTransacting: false,
      transactions: [],
      country: {
        country_code: null,
        currency: {
          code: null,
          symbol: null,
        },
      },
    };
  },
  mounted() {
    // To Get Location Info

    let url = `${ProdData.getHostURL()}/pay/${
      this.$route.params.id
    }/donation-info`;
    Axios.get(url)
      .then((data) => {
        this.country.country_code = data.data.loc_info.country_code;
        this.country.currency.code = data.data.loc_info.currency_code;
        this.country.currency.symbol =
          currencyToSymbolMap[this.country.currency.code];
        data.data.prev_transactions.forEach((transaction) => {
          if (transaction["state"] == "approved") {
            transaction.symbol =
              currencyToSymbolMap[
                transaction["transactions"][0]["amount"]["currency"]
              ];
            this.transactions.push(transaction);
          }
        });
        // console.log(this.transactions);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        this.isMounted = true;
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
      this.isTransacting = true;
      if (this.amount > 0) {
        this.isTransacting = true;
        payload.amount = this.amount;
        payload.currency =
          this.country.currency.code === "INR"
            ? "CAD"
            : this.country.currency.code;
        console.log(payload);
        let url = `${ProdData.getHostURL()}/pay/${this.$route.params.id}`;
        Axios.post(url, payload)
          .then((data) => {
            window.open(data.data.url, "_self");
          })
          .catch((err) => console.log(err))
          .finally(() => (this.isTransacting = false));
      }
    },
  },
};
</script>

<style scoped>
.donation-card {
  box-shadow: 0px 0px 5px 0px rgb(226 226 226);
  border-radius: 10px;
  height: 98%;
}
.donation-msg {
  margin-top: 20px;
  color: red;
  border-radius: 20px;
  padding: 20px;
  border: solid rgb(216, 216, 216) 1px;
  box-shadow: 1px 1px 2px 0px rgb(181 181 181);
}
.transaction-box {
  padding: 10px;
  margin: 10px;
  border: solid #e4e4e4 1px;
  border-radius: 10px;
}
.donation-box {
  background-color: #99201c;
  background-image: linear-gradient(90deg, #99201c 0%, #f56545 74%);
  color: white;
  border-radius: 10px;
}
.donation-btn {
  border-radius: 5px;
  width: 100%;
  background-color: white;
  color: rgb(255, 0, 0);
  padding: 6px;

  box-shadow: 2px 2px 5px 1px rgb(177 177 177);
}
</style>