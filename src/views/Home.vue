<template>
  <div>
    <section v-if="errored">
      <p>{{errored}}</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        
        <!-- Adding Family Alert Box -->
        <button @click="callMe =! callMe">Click Me</button>
        <AddFamily v-if="callMe"></AddFamily>

        <!-- List of Available Families -->
        <h1>Welcome to Losers Family</h1>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="goo">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          </svg>

          <span class="button--bubble__container">
            <a href="#campaign" class="button button--bubble">Hover me</a>
            <span class="button--bubble__effect-container">
              <span class="circle top-left"></span>
              <span class="circle top-left"></span>
              <span class="circle top-left"></span>

              <span class="button effect-button"></span>

              <span class="circle bottom-right"></span>
              <span class="circle bottom-right"></span>
              <span class="circle bottom-right"></span>
            </span>
          </span>
        </div>
        <div v-for="data in info" :key="data.id">
          <div class="container jumbotron">
            <ul>
              <li>
                <router-link :to="{name:'MainTree', params:{id:data.surname}}">{{data.title}}</router-link>
              </li>
              <li>Surname : {{data.surname}}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Surname Tree -->
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import AddFamily from "../modals/AddFamily";
export default {
  data() {
    return {
      info: null,
      loading: true,
      errored: false,
      callMe: false
    };
  },
  components: {
    AddFamily
  },
  methods: {
    addFamily() {
      console.log("adding family");
    }
  },
  mounted() {
    axios
      .get("http://localhost:5000/meta")
      .then(response => {
        this.info = response.data;
      })
      .catch(error => {
        this.errored = error;
        console.log(error);
      })
      .finally(() => (this.loading = false));
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

div {
  display: block;
  height: 100%;
  -webkit-animation: hue-rotate 10s linear infinite;
  animation: hue-rotate 10s linear infinite;
}

.button {
  -webkit-font-smoothing: antialiased;
  background-color: #222;
  border: none;
  color: #fff;
  display: inline-block;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  font-weight: 100;
  text-decoration: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  letter-spacing: 1px;
  color: white;
  padding: 20px 40px;
  text-transform: uppercase;
  -webkit-transition: all 0.1s ease-out;
  transition: all 0.1s ease-out;
}
.button:hover {
  background-color: #90feb5;
  color: #fff;
}
.button:active {
  -webkit-transform: scale(0.95);
  transform: scale(0.95);
}
.button--bubble {
  position: relative;
  z-index: 2;
  color: white;
  background: none;
}
.button--bubble:hover {
  background: none;
}
.button--bubble:hover + .button--bubble__effect-container .circle {
  background: #44fd82;
}
.button--bubble:hover + .button--bubble__effect-container .button {
  background: #44fd82;
}
.button--bubble:active + .button--bubble__effect-container {
  -webkit-transform: scale(0.95);
  transform: scale(0.95);
}
.button--bubble__container {
  position: relative;
  display: inline-block;
}
.button--bubble__container .effect-button {
  position: absolute;
  width: 50%;
  height: 25%;
  top: 50%;
  left: 25%;
  z-index: 1;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  background: #222;
  -webkit-transition: background 0.1s ease-out;
  transition: background 0.1s ease-out;
}

.button--bubble__effect-container {
  position: absolute;
  display: block;
  width: 200%;
  height: 400%;
  top: -150%;
  left: -50%;
  -webkit-filter: url("#goo");
  filter: url("#goo");
  -webkit-transition: all 0.1s ease-out;
  transition: all 0.1s ease-out;
  pointer-events: none;
}
.button--bubble__effect-container .circle {
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 15px;
  background: #222;
  -webkit-transition: background 0.1s ease-out;
  transition: background 0.1s ease-out;
}
.button--bubble__effect-container .circle.top-left {
  top: 40%;
  left: 27%;
}
.button--bubble__effect-container .circle.bottom-right {
  bottom: 40%;
  right: 27%;
}

.goo {
  position: absolute;
  visibility: hidden;
  width: 1px;
  height: 1px;
}

html,
body {
  width: 100%;
  height: 100%;
  text-align: center;
}

.button--bubble__container {
  top: 50%;
  margin-top: -25px;
}

@-webkit-keyframes hue-rotate {
  from {
    -webkit-filter: hue-rotate(0);
    -moz-filter: hue-rotate(0);
    -ms-filter: hue-rotate(0);
    filter: hue-rotate(0);
  }
  to {
    -webkit-filter: hue-rotate(360deg);
    -moz-filter: hue-rotate(360deg);
    -ms-filter: hue-rotate(360deg);
    filter: hue-rotate(360deg);
  }
}

@keyframes hue-rotate {
  from {
    -webkit-filter: hue-rotate(0);
    -moz-filter: hue-rotate(0);
    -ms-filter: hue-rotate(0);
    filter: hue-rotate(0);
  }
  to {
    -webkit-filter: hue-rotate(360deg);
    -moz-filter: hue-rotate(360deg);
    -ms-filter: hue-rotate(360deg);
    filter: hue-rotate(360deg);
  }
}
</style>