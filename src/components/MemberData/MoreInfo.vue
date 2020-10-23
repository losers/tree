<template>
  <div style="padding-bottom: 30px">
    <table class="table table-borderless table-hover table-data">
      <tbody class="text-left" style="color: black">
        <tr v-if="data.mobile">
          <td style="border-left: 3px solid yellow">
            <i class="icofont-smart-phone"></i>
            {{ data.mobile }}
          </td>
        </tr>
        <tr v-if="data.dob">
          <td style="border-left: 3px solid green">
            <i class="icofont-baby"></i>
            Birth : {{ data.dob }}
          </td>
        </tr>
        <tr v-if="data.died_on">
          <td style="border-left: 3px solid black">
            <i class="icofont-sad"></i>
            Death : {{ data.died_on }}
          </td>
        </tr>
        <tr v-if="data.email">
          <td style="border-left: 3px solid #ff00bc">
            <i class="icofont-mail"></i>{{ data.email }}
          </td>
        </tr>
        <tr v-if="data.address">
          <td style="border-left: 3px solid grey">
            <i class="icofont-ui-map"></i>{{ data.address }}
          </td>
        </tr>
        <tr v-if="data.country">
          <td style="border-left: 3px solid indigo">
            <i class="icofont-google-map"></i>{{ data.country }}
          </td>
        </tr>
        <tr v-if="data.description">
          <td style="border-left: 3px solid indianred" class="description">
            <i class="icofont-ui-note p-2"></i>{{ data.description }}
          </td>
        </tr>
        <!-- Social Media Links -->
        <tr>
          <td class="h3" style="display: flex; justify-content: space-evenly">
            <a :href="data.fb" v-if="data.fb">
              <i class="icofont-facebook" style="color: #2929a2"></i
            ></a>
            <a :href="data.insta" v-if="data.insta">
              <i class="icofont-instagram" style="color: #e63422"></i
            ></a>
            <a :href="data.twitter" v-if="data.twitter">
              <i class="icofont-twitter" style="color: #00a4bf"></i
            ></a>
            <a :href="data.site" v-if="data.site">
              <i class="icofont-web"></i
            ></a>
          </td>
        </tr>
      </tbody>
    </table>
    <router-link
      :to="{ name: 'TimelinePerson', params: { member: id } }"
      class="btn btn-default"
      >View Timeline</router-link
    ><br />
    <!-- <router-link :to="{name:'Profile', params:{member:id}}">See Profile</router-link> -->
  </div>
</template>

<style scoped>
.icofont-baby {
  font-size: 20px;
}
.btn-default {
  border: 1px solid indianred;
}
.description {
  display: -webkit-box;
  margin: 0 !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: auto;
  text-overflow: ellipsis;
  max-width: 350px;
  margin: 10px;
}
td i {
  margin-right: 10px;
}
</style>

<script>
export default {
  name: "MoreInfo",
  props: ["id", "data"],
};
</script>