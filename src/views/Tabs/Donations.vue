<template>
  <div class="h-100">
    <!-- Page Loader -->
    <div
      key="loader"
      v-if="!isMounted"
      class="h-100 d-flex justify-content-center align-items-center"
    >
      <div
        class="spinner-border spinner-border-sm"
        style="width: 2.5rem; height: 2.5rem; color: indianred"
      ></div>
    </div>
    <transition name="fade">
      <div
        key="data"
        v-if="isMounted"
        class="pb-3"
        :style="{ margin: $device.mobile ? '10px' : '0 100px' }"
      >
        <!-- Donations Main Card -->
        <div class="theme-gery-bg row m-0 donation-card">
          <!-- Donations BG Image -->
          <div class="col-sm-12 col-md-6 p-4" v-if="!$device.mobile">
            <img src="@/assets/donations_her.png" width="80%" />
          </div>

          <!-- Donations Right Side Content -->
          <div
            class="col-sm-12 col-md-6"
            :class="{ 'p-2': $device.mobile }"
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
              align-items: center;
            "
          >
            <!-- Donation Box -->
            <div class="donation-box p-3">
              <center
                class="theme-primary-color"
                style="font-size: 20px; font-weight: bold"
              >
                <i class="icofont-gift"></i> Donation Box
              </center>
              <div class="row m-3 align-items-center">
                <div v-if="!$device.mobile" class="col-3 theme-primary-color">
                  <span>Amount: </span>
                </div>
                <div class="col-sm-12 col-md-9 input-group align-items-center">
                  <select
                    class="form-control select-currency col-4"
                    data-role="select-dropdown"
                  >
                    <option :value="country.currency.code" selected>
                      {{ currencyToSymbolMap[country.currency.code] }}
                    </option>
                    <option
                      v-for="cur in supportedCurrencies"
                      :key="cur"
                      :value="cur"
                    >
                      {{ currencyToSymbolMap[cur] }}
                    </option>
                  </select>
                  <input
                    class="
                      form-control
                      amount-input-box
                      theme-primary-color
                      col-8
                    "
                    placeholder="Enter Amount"
                    type="number"
                    v-model="amount"
                  />
                </div>
              </div>

              <!-- Donate Btn -->
              <div
                @click="initiatePaymentGateway()"
                class="donation-btn theme-primary-bgdark"
              >
                <center>
                  <i class="icofont-ui-love mr-1"></i>
                  <strong> Donate Now </strong>
                  <span
                    v-if="isTransacting"
                    class="spinner-border spinner-border-sm ml-2"
                    style="
                      width: 1rem;
                      height: 1rem;
                      color: white;
                      right: 10px;
                      bottom: 10px;
                    "
                  ></span>
                </center>
              </div>
            </div>
            <div style="max-width: 50%" :class="{ 'mt-4': $device.mobile }">
              <img src="@/assets/cards.png" />
              <img src="@/assets/powered_by_paypal.png" />
            </div>
          </div>
        </div>

        <!-- Donations Main History Card -->
        <div
          v-if="transactions.length > 0"
          class="col-12 mt-5 mb-5 donations-history-box"
          :style="{
            padding: $device.mobile ? '10px' : '20px 40px',
          }"
        >
          <i class="text-muted ml-3"
            >Total Donations : <strong>{{ transactions.length }}</strong></i
          >

          <!-- Donation Transactions lV2 box -->
          <div class="d-flex align-items-center history-carousel-box col-12">
            <div v-if="!$device.mobile" class="col-1">
              <i
                class="icofont-rounded-left theme-primary-bg"
                onClick="(function(){document.getElementById('histories').scrollLeft -= 200})();"
              ></i>
            </div>
            <div class="col-sm-12 col-md-10 d-flex" id="histories">
              <div
                v-for="transaction in transactions"
                :key="transaction['_id']"
                class="col-sm-12 col-md-3 p-0"
              >
                <center class="transaction-box">
                  <!-- Amount -->
                  <div class="theme-primary-color">
                    <span style="font-size: 20px" class="font-weight-bold">
                      {{ currencyToSymbolMap[transaction.currency] }}</span
                    >
                    <span style="font-size: 25px" class="font-weight-bold"
                      >{{ transaction.amount }}
                    </span>
                  </div>

                  <!-- User Name-->
                  <div class="text-muted transaction-username">
                    {{ transaction.name }}
                  </div>
                </center>
              </div>
            </div>
            <div v-if="!$device.mobile" class="col-1">
              <i
                class="icofont-rounded-right theme-primary-bg"
                onClick="(function(){document.getElementById('histories').scrollLeft += 200})();"
              ></i>
            </div>
          </div>
        </div>

        <div class="mt-4 mb-4 theme-gery-bg p-5" v-else>
          <h3>
            <span class="text-muted mr-3" :style="{}">
              {{
                $device.mobile
                  ? "Donate and Unlock "
                  : "Make a Donation and Unlock this"
              }}
            </span>
            <span class="award-bg theme-primary-bgdark">
              <i class="icofont-badge h5"></i>
            </span>
          </h3>
        </div>
        <!-- <div
          :style="{
            'border-radius': '20px',
            margin: $device.mobile ? '20px' : '30px 100px',
          }"
          v-else
        >
        
          <div class="clickable-box">
            <i
              class="icofont-unlocked rounded-lg"
              :class="{
                'bigscreen-lock': !$device.mobile,
                'mobile-lock': $device.mobile,
              }"
              data-toggle="tooltip"
              title="UnLocked"
            ></i>

              <span
                class="title"
                :style="{ 'font-size': $device.mobile ? '25px' : '35px' }"
              >
                Title
              </span>
            <p class="surname">Surname : Surname</p>
          </div>
        </div> -->

        <!-- F.A.Q s -->
        <div
          class="theme-gery-bg p-3"
          :class="{ 'pl-5': !$device.mobile, 'pl-4': $device.mobile }"
        >
          <h5 class="mt-3 text-muted">F.A.Q s</h5>
          <div id="accordion">
            <!-- Card 1 -->
            <div class="mb-1">
              <!-- Card 1 Btn -->
              <button
                class="btn p-0 collapsed w-100 text-left"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                <div
                  class="card-header font-weight-bold theme-primary-color"
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
                <div class="card-body p-0 text-muted">
                  Bloodline work on Donations. Donating families will become
                  <strong>Super Families.</strong>
                </div>
              </div>
            </div>

            <!-- Card 2 -->
            <div>
              <!-- Card 2 Btn -->
              <button
                class="btn p-0 collapsed w-100 text-left"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                <div
                  class="card-header font-weight-bold theme-primary-color"
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
                <div class="card-body p-0 text-muted">
                  As a token of gratitude, we credit
                  <strong>B - Coins</strong> for each donation you made. More
                  <strong>B - Coins</strong> for each donation you made. More
                  coins, more the family go up
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Axios from "axios";
import ProdData from "@/data.js";
import currencyToSymbolMap from "currency-symbol-map/map";

export default {
  data() {
    return {
      amount: 10,
      view_only: "",
      isMounted: false,
      isTransacting: false,
      transactions: [],
      r_key: "",
      supportedCurrencies: ProdData.supportedCurrencies,
      currencyToSymbolMap,
      country: {
        country_code: null,
        currency: {
          code: null,
          symbol: currencyToSymbolMap["INR"],
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
        this.country.currency.code = this.getValidCurrencyCode(
          data.data.loc_info.currency_code
        );
        console.log(this.country.currency.code);
        this.r_key = data.data.loc_info.key;
        this.country.currency.symbol =
          currencyToSymbolMap[this.country.currency.code];
        this.transactions = data.data.prev_transactions;
      })
      .catch((err) => console.log(err))
      .finally(() => {
        this.isMounted = true;
      });
  },
  methods: {
    getValidCurrencyCode(currencyCode) {
      //Change Here For Country Change
      // return currencyCode?"CAD":"CAD";
      let acceptedCurrencies = new Set(ProdData.supportedCurrencies);
      return acceptedCurrencies.has(currencyCode) ? currencyCode : "USD";
    },
    razorVerifyPayment(response) {
      this.$router.push({
        name: "Payment",
        query: {
          paymentId: response.razorpay_payment_id,
          PayerID: response.razorpay_order_id,
          currency: "INR",
          signature: response.razorpay_signature,
        },
      });
    },
    initiatePaymentGateway() {
      //Create Profile
      // let url1 = `${ProdData.getHostURL()}/pay/${
      //   this.$route.params.id
      // }/profile`;
      // Axios.post(url1, {})
      //   .then((data) => {
      //     console.log(data);
      //   })
      //   .catch((err) => console.log(err))
      //   .finally(() => console.log("daskna"));

      let payload = {};
      this.isTransacting = true;
      if (this.amount > 0) {
        this.isTransacting = true;
        payload.amount = this.amount;
        payload.currency = this.country.currency.code;
        let url = `${ProdData.getHostURL()}/pay/${this.$route.params.id}`;
        Axios.post(url, payload)
          .then((data) => {
            if (this.country.currency.code === "INR") {
              var orderId = data.data.id;
              var options = {
                key: this.r_key,
                currency: "INR",
                name: "BloodLine",
                description: "Water the Family tree to Grow",
                image: "https://bloodline.app/lib/images/logo.png",
                order_id: orderId,
                handler: (response) => {
                  this.razorVerifyPayment(response);
                },
                theme: {
                  color: "#227254",
                },
              };

              var rzp1 = new window.Razorpay(options);
              rzp1.open();
            } else {
              window.open(data.data.url, "_self");
            }
          })
          .catch((err) => console.log(err))
          .finally(() => (this.isTransacting = false));
      }
    },
  },
};
</script>

<style scoped>
/* .bigscreen-lock {
  color: white;
  font-size: 25px;
  background: #6a6a6a;
  padding: 10px;
  float: left;
  left: 25px;
  box-shadow: 0px 5px 18px -12px rgb(0 0 0 / 75%);
}

.surname {
  font-size: 20px;
  font-weight: bold;
  color: #a4a4a4;
}
.clickable-box {
  padding: 20px;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
  word-break: break-word;
  box-shadow: 0px 0px 18px -12px rgb(0 0 0 / 75%);
  background: white;
  text-align: center;
} */
.donation-card {
  box-shadow: 0px 0px 5px 0px rgb(226 226 226);
  border-radius: 21px;
}
.select-currency {
  border: none;
  box-shadow: 0 0 3px 0 #eb9797;
  color: #eb9797;
  border-radius: 15px 0px 0px 15px;
  padding-left: 20px;
}
.amount-input-box {
  border-radius: 12px;
  box-shadow: 0 0 3px 0 #eb9797;
  border: none;
  text-align: center;
}
.amount-input-box:active {
  border: none;
  color: #eb9797;
}
.transaction-username {
  width: 90%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.card-header {
  background-color: transparent;
  border-bottom: none;
  border-radius: 20px;
  color: #7979e8;
  text-decoration: underline;
  padding: 4px;
}

.btn.focus,
.btn:focus {
  box-shadow: none;
}
.donations-history-box {
  border-radius: 21px;
  background-color: #f6f6f6;
}
.history-carousel-box {
  border-radius: 20px;
  padding: 10px;
  margin-top: 15px;
  background-color: white;
}
.transaction-box {
  margin: 10px;
  border-radius: 10px;
  border-radius: 11px;
  padding: 10px;
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
}
.icofont-rounded-left,
.icofont-rounded-right {
  border-radius: 50%;
  color: white;
  padding: 5px;
  font-size: 30px;
}
#histories {
  overflow: auto;
  scroll-behavior: smooth;
}
#histories::-webkit-scrollbar {
  display: none;
}

.donation-box {
  color: white;
  border-radius: 21px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: white;
}
.donation-btn {
  width: 100%;
  padding: 10px 32px;
  border-radius: 19px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
}
</style>