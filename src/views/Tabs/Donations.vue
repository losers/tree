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
        <div class="glass-card row m-0 p-4">
          <!-- Donations BG Image -->
          <div class="col-sm-12 col-md-6 p-4" v-if="!$device.mobile">
            <img src="@/assets/donations_her.png" width="80%" style="filter: drop-shadow(0 0 30px rgba(167, 139, 250, 0.3));" />
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
            <div class="glass-card-inner p-4 w-100">
              <center
                style="font-size: 20px; font-weight: bold; color: #a78bfa;"
              >
                <i class="icofont-gift mr-2"></i> Feed the Hamsters (Donation Box)
              </center>
              <div class="row m-3 align-items-center">
                <div v-if="!$device.mobile" class="col-3" style="color: #4f8ef7; font-weight: 600;">
                  <span>Amount: </span>
                </div>
                <div class="col-sm-12 col-md-9 input-group align-items-center">
                  <select
                    class="form-control select-currency col-5"
                    data-role="select-dropdown"
                    v-model="country.currency.code"
                  >
                    <option :value="country.currency.code" selected>
                      {{ country.currency.code }} (
                      {{ currencyToSymbolMap[country.currency.code] }} )
                    </option>
                    <option
                      v-for="cur in supportedCurrencies"
                      :key="cur"
                      :value="cur"
                    >
                      {{ cur }} ( {{ currencyToSymbolMap[cur] }} )
                    </option>
                  </select>
                  <input
                    class="
                      form-control
                      amount-input-box
                      col-7
                    "
                    placeholder="Enter Amount"
                    type="number"
                    v-model="amount"
                    onkeypress="return event.charCode != 45"
                    min="1"
                  />
                </div>
              </div>

              <!-- Donate Btn -->
              <div
                @click="initiatePaymentGateway()"
                class="my-btn text-center mt-3 cursor"
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
          class="col-12 mt-5 mb-5 glass-card"
          :style="{
            padding: $device.mobile ? '20px' : '30px 40px',
          }"
        >
          <i class="ml-3" style="color: #a78bfa; font-size: 18px;"
            >Total Donations : <strong>{{ transactions.length }}</strong></i
          >

          <!-- Donation Transactions lV2 box -->
          <div class="d-flex align-items-center history-carousel-box col-12 glass-card-inner mt-3">
            <div v-if="!$device.mobile" class="col-1">
              <i
                class="icofont-rounded-left nav-arrow cursor"
                onClick="(function(){document.getElementById('histories').scrollLeft -= 200})();"
              ></i>
            </div>
            <div class="col-sm-12 col-md-10 d-flex" id="histories">
              <div
                v-for="transaction in transactions"
                :key="transaction['_id']"
                class="col-sm-12 col-md-3 p-0"
              >
                <center class="transaction-box glass-card-solid">
                  <!-- Amount -->
                  <div style="color: #4f8ef7;">
                    <span style="font-size: 20px" class="font-weight-bold">
                      {{ currencyToSymbolMap[transaction.currency] }}</span
                    >
                    <span style="font-size: 25px" class="font-weight-bold"
                      >{{ transaction.amount }}
                    </span>
                  </div>

                  <!-- User Name-->
                  <div class="transaction-username mt-2" style="color: white; font-weight: 600;">
                    {{ transaction.name }}
                  </div>

                  <p
                    class="mt-3 my-btn-outline-small cursor"
                    v-if="!$device.mobile"
                    @click="
                      () => {
                        $modal.show('showInfo');
                        transactionIns = transaction;
                      }
                    "
                  >
                    View Details
                  </p>
                </center>
              </div>
            </div>
            <div v-if="!$device.mobile" class="col-1">
              <i
                class="icofont-rounded-right nav-arrow cursor"
                onClick="(function(){document.getElementById('histories').scrollLeft += 200})();"
              ></i>
            </div>
          </div>
        </div>

        <div class="mt-5 mb-4 glass-card p-5 tc-center" v-else>
          <h3>
            <span class="award-bg" style="color: #4f8ef7;">
              <i class="icofont-badge h3"></i>
            </span>
            <span class="mr-3" style="color: rgba(255,255,255,0.8);">
              {{
                $device.mobile
                  ? "Bribe the dev and Unlock Badge"
                  : "Be the first to bribe the developer and unlock the Super Family Badge!"
              }}
            </span>
          </h3>
        </div>

        <!-- F.A.Q s -->
        <div
          class="glass-card mt-5 p-4"
          :class="{ 'pl-5': !$device.mobile, 'pl-4': $device.mobile }"
        >
          <h4 class="mb-4" style="color: #a78bfa;">Frequently Asked Questions</h4>
          <div id="accordion">
            <!-- Card 1 -->
            <div class="mb-3 glass-card-solid">
              <!-- Card 1 Btn -->
              <button
                class="btn p-0 collapsed w-100 text-left"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                <div
                  class="card-header font-weight-bold faq-header"
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
                <div class="card-body faq-body">
                  Bloodline follows a policy of No-ADS, No Premium Plans.<br />
                  Donations is the only source of revenue to run this website.
                  If you like our work, please support us by donating.
                </div>
              </div>
            </div>

            <!-- Card 2 -->
            <div class="mb-3 glass-card-solid">
              <!-- Card 2 Btn -->
              <button
                class="btn p-0 collapsed w-100 text-left"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                <div
                  class="card-header font-weight-bold faq-header"
                  id="headingTwo"
                >
                  What is the minimum amount to unlock 'Super Family Badge' ?
                </div>
              </button>

              <!-- Card 2 Body -->
              <div
                id="collapseTwo"
                class="collapse"
                aria-labelledby="headingTwo"
                data-parent="#accordion"
              >
                <div class="card-body faq-body">
                  There is no minimum limit to unlock Super Family Badge. As a
                  token of gratitude for donation we honor your family with
                  badge.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <modal name="showInfo" :draggable="true" height="auto" :styles="modalStyles">
      <div class="p-4" style="background: rgba(15, 17, 35, 0.95); color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; height: 100%;">
        <h4 class="text-center mb-4" style="color: #4f8ef7;">Transaction Details</h4>
        <!-- Username -->
        <div class="m-3 p-3 glass-card-solid">
          <i class="icofont-ui-user mr-3" style="color: #a78bfa;"></i>
          <span style="font-size: 18px; font-weight: 600;">{{ transactionIns.name }}</span>
        </div>
        <div class="m-3 p-3 glass-card-solid">
          <span style="font-size: 20px; color: #4f8ef7;" class="font-weight-bold mr-2">
            {{ currencyToSymbolMap[transactionIns.currency] }}</span
          >
          <span style="font-size: 28px" class="font-weight-bold"
            >{{ transactionIns.amount }}
          </span>
        </div>
        <div class="m-3 p-3 glass-card-solid text-muted" style="color: rgba(255,255,255,0.6) !important;">
          <i class="icofont-clock-time mr-2"></i> Aug 08, 2021
        </div>
      </div>
    </modal>
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
      transactionIns: {},
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
      modalStyles: 'background: transparent; box-shadow: none;'
    };
  },
  mounted() {
    // To Get Location Info
    let url = `${ProdData.getHostURL()}/pay/${
      this.$route.params.id
    }/donation-info`;
    Axios.get(url)
      .then((data) => {
        this.country.currency.code = this.getValidCurrencyCode(
          data.data.loc_info.currency_code
        );
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
    validateAmount() {
      // this.amount = this.amount.con;
    },
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
    showMoreInfo() {
      console.log("sdsfdsf");
      this.$modal.show(
        "example",
        {
          payload: "adsadasd",
        },
        {
          height: "auto",
          draggable: true,
          clickToClose: true,
          scrollable: true,
        },
        {}
      );
    },
  },
};
</script>

<style scoped>
.tc-center {
  text-align: center;
}
.glass-card {
  background: rgba(15, 17, 35, 0.65);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  color: white;
}
.glass-card-inner {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
}
.glass-card-solid {
  background: rgba(25, 27, 45, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}
.select-currency {
  background: rgba(0,0,0,0.2) !important;
  border: 1px solid rgba(79, 142, 247, 0.3) !important;
  color: #fff !important;
  border-radius: 12px 0px 0px 12px;
  font-size: 0.9em;
  height: 44px;
  padding: 0;
  text-align: center;
  text-align-last: center;
  -moz-text-align-last: center;
}
.select-currency:focus {
  border-color: #4f8ef7 !important;
  box-shadow: 0 0 10px rgba(79, 142, 247, 0.3) !important;
}
.select-currency option {
  background: #0f1123;
  color: white;
}
.amount-input-box {
  background: rgba(0,0,0,0.2) !important;
  border: 1px solid rgba(79, 142, 247, 0.3) !important;
  border-left: none !important;
  color: #fff !important;
  border-radius: 0 12px 12px 0;
  height: 44px;
  text-align: center;
  font-size: 1.1em;
}
.amount-input-box:focus {
  border-color: #4f8ef7 !important;
  box-shadow: 0 0 10px rgba(79, 142, 247, 0.3) !important;
  outline: none;
}
.amount-input-box::placeholder {
  color: rgba(255,255,255,0.4);
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
  border-radius: 12px;
  padding: 15px 20px;
}
.faq-header {
  color: #4f8ef7;
  font-size: 18px;
  transition: all 0.3s ease;
}
.faq-header:hover {
  color: #a78bfa;
}
.faq-body {
  padding: 0 20px 20px 20px;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
}

.btn.focus,
.btn:focus {
  box-shadow: none;
}

.transaction-box {
  margin: 10px;
  padding: 20px 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}
.transaction-box:hover {
  transform: translateY(-5px);
}
.nav-arrow {
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  color: white;
  padding: 10px;
  font-size: 24px;
  transition: all 0.3s ease;
}
.nav-arrow:hover {
  background: #4f8ef7;
  box-shadow: 0 0 15px rgba(79, 142, 247, 0.5);
}
#histories {
  overflow: auto;
  scroll-behavior: smooth;
}
#histories::-webkit-scrollbar {
  display: none;
}

.my-btn {
  background: linear-gradient(135deg, #4f8ef7, #a78bfa) !important;
  border: none !important;
  padding: 12px 32px !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -4px 0 rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  color: #fff !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  display: inline-block;
}
.my-btn:hover {
  transform: translateY(-4px) scale(1.05) !important;
  box-shadow: 0 16px 40px rgba(79, 142, 247, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -4px 0 rgba(0, 0, 0, 0.25) !important;
}
.my-btn-outline-small {
  background: transparent;
  border: 1px solid #4f8ef7;
  padding: 6px 12px;
  border-radius: 6px;
  color: #4f8ef7;
  font-size: 14px;
  transition: all 0.3s ease;
  display: inline-block;
}
.my-btn-outline-small:hover {
  background: rgba(79, 142, 247, 0.1);
  box-shadow: 0 0 10px rgba(79, 142, 247, 0.3);
}
</style>