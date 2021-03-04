<template>
  <div class="h-100">
    <div
      class="donation-card row"
      v-if="isMounted"
      :style="{ margin: $device.mobile ? '10px' : '0 100px' }"
    >
      <!-- Donations BG Image -->
      <div class="col-sm-12 col-md-6 p-5" v-if="!$device.mobile">
        <img src="@/assets/donate-bg.jpg" width="100%" />
      </div>

      <!-- Donations Side Content -->
      <div class="col-sm-12 col-md-6">
        <!-- Donation Box -->
        <div class="donation-box mt-3 p-3">
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

          <!-- Donate Btn -->
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

        <!-- F.A.Q s -->
        <center class="mt-3 text-muted">
          <h5>F.A.Q s</h5>
        </center>
        <div id="accordion">
          <!-- Card 1 -->
          <div class="mb-1">
            <!-- Card 1 Btn -->
            <button
              class="btn p-0 collapsed w-100"
              data-toggle="collapse"
              data-target="#collapseOne"
              aria-expanded="false"
              aria-controls="collapseOne"
            >
              <div
                class="card-header font-weight-bold text-muted"
                id="headingOne"
              >
                Why Donate ?
              </div>
            </button>

            <!-- Card 1 Body -->
            <div
              id="collapseOne"
              class="collapse"
              aria-labelledby="headingOne"
              data-parent="#accordion"
            >
              <div class="card-body p-2">
                <p class="text-muted">
                  Bloodline work on Donations. Donating families will become
                  <strong>Super Families.</strong>
                </p>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div>
            <!-- Card 2 Btn -->
            <button
              class="btn p-0 collapsed w-100"
              data-toggle="collapse"
              data-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              <div
                class="card-header font-weight-bold text-muted"
                id="headingTwo"
              >
                What is B - Coins
              </div>
            </button>

            <!-- Card 2 Body -->
            <div
              id="collapseTwo"
              class="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordion"
            >
              <div class="card-body p-0">Bloodline Coins</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Donations Found -->
      <div v-if="transactions.length > 0" class="col-12">
        <i class="text-muted ml-3">Total Donations : <strong>{{ transactions.length }}</strong></i>

        <!-- Donation Transactions -->
        <div class="d-flex col-12" style="overflow: auto">
          <div
            v-for="transaction in transactions"
            :key="transaction['_id']"
            class="col-3 p-0"
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
    </div>
    <div v-else class="h-100 d-flex justify-content-center align-items-center">
      <div
        class="spinner-border spinner-border-sm"
        style="width: 2.5rem; height: 2.5rem; color: indianred"
      ></div>
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
      view_only: "",
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