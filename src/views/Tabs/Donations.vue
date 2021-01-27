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
        <touch-ripple
          @click.native="donate()"
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

export default {
  components: {
    touchRipple,
  },
  methods: {
    donate() {
      console.log("donating satted");
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