<template>
  <div class="mx-auto col-12">
    <button
      @click="addMember(0)"
      class="col-10 btn btn-warning mb-3"
      v-show="!data.parent_id"
    >
      + Add Parent
    </button>

    <button @click="addMember(1)" class="col-10 btn btn-success mb-3">
      + Add Child
    </button>

    <button
      v-show="!data.is_mate"
      @click="addMember('gender')"
      class="col-10 btn btn-primary mb-3"
    >
      + Add {{ data.gender == "1" ? "Wife" : "Husband" }}
    </button>

    <button @click="deleteSwipe" class="btn btn-danger col-10 mb-3">
      <i class="icofont-ui-delete"></i> Delete
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vloading: false,
      loading: false,
      key: "",
      retry: false,
    };
  },
  props: ["data", "hasMate"],
  methods: {
    addMember(num) {
      this.$emit("actionsAddMember", num);
    },
    deleteSwipe() {
      this.$emit("actionsDeleteSwipe");
    },
  },
};
</script>