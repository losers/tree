<template>
  <div class="h-100">
    <!-- Page Loader -->
    <div
      v-if="!isMounted"
      class="h-100 d-flex justify-content-center align-items-center"
    >
      <div
        class="spinner-border spinner-border-sm"
        style="width: 2.5rem; height: 2.5rem; color: indianred"
      ></div>
    </div>

    <div
      v-else
      class="pb-3"
      :style="{ margin: $device.mobile ? '10px' : '0 100px' }"
    >
      <!-- Donations Main Card -->
      <div class="theme-gery-bg row donation-card">
        <!-- Donations BG Image -->
        <div class="col-sm-12 col-md-6 p-5" v-if="!$device.mobile">
          <img src="@/assets/donate-bg.jpg" width="100%" />
        </div>

        <!-- Donations Right Side Content -->
        <div class="col-sm-12 col-md-6">
          <!-- Donation Box -->
          <div class="donation-box mt-3 p-3">
            <center
              class="theme-primary-color"
              style="font-size: 20px; font-weight: bold"
            >
              <i class="icofont-gift"></i> Donation Box
            </center>
            <div class="row m-3 align-items-center">
              <div class="col-5 theme-primary-color">
                <span>Amount ( {{ country.currency.symbol }} )</span>
              </div>
              <input
                class="col-7 form-control amount-input-box theme-primary-color"
                placeholder="Enter Amount"
                type="text"
                v-model="amount"
              />
            </div>

            <!-- Donate Btn -->
            <!-- <touch-ripple
            @click.native="initiatePaymentGateway()"
          > -->
            <div class="donation-btn theme-primary-bg">
              <center>
                <i class="icofont-ui-love mr-1" style="color: indianred"></i>
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
                <div class="card-body p-3">
                  <p class="theme-primary-color">
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
                <div class="card-body p-3 theme-primary-color">Bloodline Coins</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Donations Main History Card -->
      <div
        v-if="transactions.length > 0"
        class="col-12 mt-5 mb-5 donations-history-box"
      >
        <i class="text-muted ml-3"
          >Total Donations : <strong>{{ transactions.length }}</strong></i
        >

        <!-- Donation Transactions lV2 box -->
        <div class="d-flex history-carousel-box col-12" style="overflow: auto">
          <div
            v-for="transaction in transactions"
            :key="transaction['_id']"
            class="col-3 p-0"
          >
            <center class="transaction-box">
              <!-- Amount -->
              <div
                style="font-size: 44px; font-weight: 600"
                class="theme-primary-color"
              >
                <!-- {{ transaction["symbol"] }} -->
                {{ country.currency.symbol
                }}{{ transaction["transactions"][0]["amount"]["total"] }}
              </div>

              <!-- User Name-->
              <div class="text-muted">
                {{
                  "  " +
                  transaction["payer"]["payer_info"]["first_name"] +
                  " " +
                  transaction["payer"]["payer_info"]["last_name"]
                }}
              </div>
              <!-- Date Time -->
              <!-- <div style="color: grey; font-size: 14px">
                <i class="icofont-ui-calendar"></i>
                {{ new Date(transaction["create_time"]).toDateString() }}
              </div> -->
            </center>
          </div>
        </div>
      </div>
    </div>
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
      transactions: [
        {
          transactions: [
            {
              amount: {
                total: "100",
              },
            },
          ],
          payer: {
            payer_info: {
              first_name: "Varun",
              last_name: "Kumar",
            },
          },
        },
        {
          transactions: [
            {
              amount: {
                total: "100",
              },
            },
          ],
          payer: {
            payer_info: {
              first_name: "Varun",
              last_name: "Kumar",
            },
          },
        },
        {
          transactions: [
            {
              amount: {
                total: "100",
              },
            },
          ],
          payer: {
            payer_info: {
              first_name: "Varun",
              last_name: "Kumar",
            },
          },
        },
        {
          transactions: [
            {
              amount: {
                total: "100",
              },
            },
          ],
          payer: {
            payer_info: {
              first_name: "Varun",
              last_name: "Kumar",
            },
          },
        },
        {
          transactions: [
            {
              amount: {
                total: "100",
              },
            },
          ],
          payer: {
            payer_info: {
              first_name: "Varun",
              last_name: "Kumar",
            },
          },
        },
      ],
      r_key: "",
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
    this.isMounted = true;
    // To Get Location Info
    // let url = `${ProdData.getHostURL()}/pay/${
    //   this.$route.params.id
    // }/donation-info`;
    // Axios.get(url)
    //   .then((data) => {
    //     this.country.country_code = data.data.loc_info.country_code;
    //     this.country.currency.code = data.data.loc_info.currency_code;
    //     this.r_key = data.data.loc_info.key;
    //     console.log(this.country.currency.code);
    //     this.country.currency.symbol =
    //       currencyToSymbolMap[this.country.currency.code];
    //     data.data.prev_transactions.forEach((transaction) => {
    //       if (transaction["state"] == "approved") {
    //         transaction.symbol =
    //           currencyToSymbolMap[
    //             transaction["transactions"][0]["amount"]["currency"]
    //           ];
    //         this.transactions.push(transaction);
    //       }
    //     });
    //     // console.log(this.transactions);
    //   })
    //   .catch((err) => console.log(err))
    //   .finally(() => {
    //     this.isMounted = true;
    //   });
  },
  methods: {
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
            ? "INR" //Change Here - 1
            : this.country.currency.code;
        let url = `${ProdData.getHostURL()}/pay/${this.$route.params.id}`;
        Axios.post(url, payload)
          .then((data) => {
            if (this.country.currency.code === "INR") {
              //Change Here - 2
              var orderId = data.data.id;
              var options = {
                key: this.r_key,
                currency: "INR",
                name: "BloodLine",
                description: "Water the Family tree to Grow",
                image: "https://bloodline.ga/lib/images/logo.png",
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
.donation-card {
  box-shadow: 0px 0px 5px 0px rgb(226 226 226);
  border-radius: 21px;
}
.amount-input-box {
  border-radius: 12px;
  box-shadow: 0 0px 3px 0 #eb9797;
  border: none;
  text-align: center;
}
.amount-input-box:active {
  border: none;
  color: #eb9797;
}
.card-header {
  background-color: white;
  border-radius: 20px;
}
.btn.focus,
.btn:focus {
  box-shadow: none;
}
.collapse {
  background-color: white;
  margin-top: -20px;
  padding-top: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
.donations-history-box {
  padding: 20px 40px;
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