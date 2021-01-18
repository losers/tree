<template>
  <center>
    <div class="col-10">
      <h3>Members</h3>
      <draggable
        class="list-group"
        tag="ul"
        v-model="list"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <li
            class="list-group-item"
            v-for="element in list"
            :key="element.order"
          >
            {{ element.name }}
          </li>
        </transition-group>
      </draggable>
      <div class="row justify-content-between mt-5">
        <button class="btn btn-success" v-on:click="finalList">Final</button>
        <button @click="close" class="btn btn-danger" type="button">
          Cancel
        </button>
      </div>
    </div>
  </center>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },
  data() {
    return {
      list: [
        {
          name: "Member 1",
          order: 1,
        },
        {
          name: "Member 2",
          order: 2,
        },
        {
          name: "Member 3",
          order: 3,
        },
        {
          name: "Member 4",
          order: 4,
        },

        {
          name: "Member 5",
          order: 5,
        },
      ],
      drag: false,
    };
  },
  methods: {
    finalList() {
      console.log(this.list);
    },
    close() {
      this.$emit("close");
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
};
</script>

<style scoped>
div {
  color: black;
}
.ghost {
  opacity: 0.5;
  background: #caeeff;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>