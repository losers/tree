<template>
  <vuetable
    ref="vuetable"
    api-url="https://vuetable.ratiw.net/api/users"
    :fields="[
      { name: 'name', title: 'Full Name', sortField: 'name' },
      ,
      'nickname',
      'email',
      'gender',
    ]"
    :per-page="10"
  ></vuetable>
</template>

<script>
import Vuetable from "vuetable-2";

export default {
  components: {
    Vuetable,
  },
};
</script>