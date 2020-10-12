<template>
  <div>
    <table class="table table-borderless table-hover table-data">
      <tbody class="text-left" style="color:black">
        <tr v-if="data.mobile">
          <td style="border-left:3px solid yellow;">
            <i class="icofont-smart-phone"></i>
            {{data.mobile}}
          </td>
        </tr>
        <tr v-if="data.dob">
          <td style="border-left:3px solid brown;">
            <i class="icofont-ui-calendar"></i>
            {{data.dob}}
          </td>
        </tr>
      </tbody>
    </table>
    <router-link :to="{name:'TimelinePerson', params:{member:id}}">View Timeline</router-link><br>
    <!-- <router-link :to="{name:'Profile', params:{member:id}}">See Profile</router-link> -->
  </div>
</template>

<script>
export default {
  name: "MoreInfo",
  props: ["id", "data"]
};
</script>