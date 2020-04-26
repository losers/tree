<template>
  <div id="app">
    <div v-if="swiped">
      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
      </svg>
    </div>
    <div v-else>
      <SwipeButton ref="swipeButton" class="swipe-button" @actionConfirmed="onActionConfirmed" />
    </div>
    <button @click="close" class="btn btn-danger">Cancel</button>
  </div>
</template>

<script>
import SwipeButton from "vue-swipe-button";
import "vue-swipe-button/dist/swipeButton.css";
import axios from "axios";

export default {
  name: "DeleteMember",
  components: {
    SwipeButton
  },
  data() {
    return {
      swiped: false
    };
  },
  methods: {
    onActionConfirmed() {
      setTimeout(() => {
        this.$refs.swipeButton.reset();
        this.deleteMe();
      }, 1000);
      console.log("deleted");
    },
    close() {
      this.$emit("close");
      this.$router.push({
        name: "MemberData",
        params: this.$route.params.member
      });
      this.$root.$emit("canceled", this.id);
    },
    deleteMe() {
      axios
        .delete(
          "http://localhost:5000/tree/" +
            this.$route.params.id +
            "/person/" +
            this.$route.params.member
        )
        .then(data => console.log(`Deleted : ${data}`))
        .catch(err => console.log("Error : " + err))
        .finally(() => {
          this.$emit("jst-close");
          this.$router.push({
            name: "MainTree",
            params: { id: this.$route.params.id }
          });
          this.$root.$emit("update-tree", "new tree data");
        });
    }
  }
};
</script>

<style scoped>
.swipe-button {
  width: 500px;
  background-color: #17255a;
  border: 1px solid #17255a;
}
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #7ac142;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  margin: 10% auto;
  box-shadow: inset 0px 0px 0px #7ac142;
  animation: fill 0.4s ease-in-out 0.4s forwards,
    scale 0.3s ease-in-out 0.9s both;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes scale {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}
@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #7ac142;
  }
}
</style>