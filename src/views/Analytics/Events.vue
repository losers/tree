<template>
  <div>
    <center>
      <h4 style="opacity:0.5" class="mb-3">Today,</h4>
      <h1 class="pl-2">Feb 14</h1>
    </center>
    <div class="notification row" v-for="event in events" :key="event.name">
      <img
        :src="event.type==1?require('@/assets/confetti.jpg'):event.type==2?require('@/assets/hearts.png'):require('@/assets/logo.png')"
        height="50px"
        class="col-xs-3 col-sm-1"
      />
      <img
        src="https://w0.pngwave.com/png/358/473/computer-icons-user-profile-person-png-clip-art.png"
        height="100px"
        class="col-xs-3 col-sm-2"
      />
      <img
        src="https://w0.pngwave.com/png/358/473/computer-icons-user-profile-person-png-clip-art.png"
        height="100px"
        class="col-xs-3 col-sm-2"
        v-if="event.mate"
      />
      <img
        v-if="$device.mobile"
        :src="event.name=='Birthday'?require('@/assets/confetti.jpg'):event.name=='Marriage Day'?require('@/assets/hearts.png'):require('@/assets/logo.png')"
        height="50px"
        class="col-xs-3 col-sm-1"
      />
      <div :class="event.type==2?'col-sm-6 col-xs-12':'col-sm-8 col-xs-12'">
        <h4>
          {{event.user.name}}
          <span v-if="event.mate">, {{event.mate.name}}</span>
        </h4>
        <h2>{{event.name}}</h2>
        <h6 style="opacity:0.5">{{event.info}}</h6>
      </div>
      <img
        v-if="!$device.mobile"
        :src="event.name=='Birthday'?require('@/assets/confetti.jpg'):event.name=='Marriage Day'?require('@/assets/hearts.png'):require('@/assets/logo.png')"
        height="50px"
        class="col-xs-3 col-sm-1"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      events: [
        {
          name: "Birthday",
          type:1,
          user: {
            name: "Zeus",
            image: "url",
            id: "1234",
          },
          info: "Turned to 50 today",
        },
        {
          name: "Marriage Day",
          type:2,
          user: {
            name: "Zeus",
            image: "url",
            id: "1234",
          },
          mate: {
            name: "mateoo",
            image: "url",
            id: "1234",
          },
          info: "10 years of Married Life",
        },
      ],
    };
  },
};
</script>

<style scoped>
.notification {
  border-radius: 50px;
  margin: 30px;
  padding: 30px;
  -webkit-box-shadow: 9px 10px 16px -9px rgba(0, 0, 0, 0.42);
  -moz-box-shadow: 9px 10px 16px -9px rgba(0, 0, 0, 0.42);
  box-shadow: 9px 10px 16px -9px rgba(0, 0, 0, 0.42);
}
</style>