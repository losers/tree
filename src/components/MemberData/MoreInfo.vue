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
            <i class="icofont-baby"></i>
            Birth : {{data.dob}}
          </td>
        </tr>
        <tr v-if="data.died_on">
          <td style="border-left:3px solid indianred;">
            <i class="icofont-sad"></i>
            Demise : {{data.died_on}}
          </td>
        </tr>
      </tbody>
    </table>
    <router-link :to="{name:'TimelinePerson', params:{member:id}}" class="btn btn-default">View Timeline</router-link><br>
    <!-- <router-link :to="{name:'Profile', params:{member:id}}">See Profile</router-link> -->
  </div>
</template>

<style scoped>
.icofont-baby{
  font-size: 20px;
}
.btn-default{
  border: 1px solid black;
}
</style>

<script>
export default {
  name: "MoreInfo",
  props: ["name", "id", "data"]
};
</script>