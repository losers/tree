<template>
  <center>
    <div class="mx-auto col-12" v-if="hasCookie && !viewOnly">
      <button
        @click="addMember(0)"
        class="col-10 btn mb-3 my-action-btn glass-warning"
        v-show="!data.parent_id || (data.is_mate && !data.linked_tree)"
      >
        + Add Parent
      </button>

      <button @click="addMember(1)" class="col-10 btn mb-3 my-action-btn glass-success">
        + Add Child
      </button>

      <button
        @click="goToSubTree()"
        class="col-10 btn mb-3 my-action-btn glass-info"
        v-show="data.linked_tree"
      >
        <i class="icofont-tree p2" style="font-size: 15px"></i>
        View Parent Tree
      </button>

      <button
        v-show="!data.is_mate"
        @click="addMember('gender')"
        class="col-10 btn mb-3 my-action-btn glass-primary"
      >
        + Add {{ data.gender == "1" ? "Wife" : "Husband" }}
      </button>

      <button
        @click="reArrange"
        v-if="!data.is_mate && data.parent_id"
        class="col-10 btn mb-3 my-action-btn glass-warning"
      >
        <i class="icofont-exchange"></i> Swap Siblings
      </button>

      <button @click="deleteSwipe" class="btn col-10 mb-3 my-action-btn glass-danger">
        <i class="icofont-ui-delete"></i> Delete
      </button>
    </div>
    <div v-else>
      <span class="col-4">
        <button
          @click="goToSubTree()"
          class="col-10 btn mb-3 my-action-btn glass-info"
          v-show="data.linked_tree"
        >
          <i class="icofont-tree p2" style="font-size: 15px"></i>
          View Parent Tree
        </button>
        <input
          class="form-control input-sm dark-input"
          placeholder="Enter Admin Key to Edit"
          v-model="key"
          onkeypress="if(this.value.length==4) return false;"
          type="number"
        />
        <button
          v-show="key.length == 4"
          @click="validate"
          class="btn mt-3 my-action-btn"
          :class="{ 'glass-success': !retry, 'glass-warning': retry }"
          :disabled="vloading"
        >
          <span
            class="spinner-border spinner-border-sm"
            v-show="vloading"
          ></span>
          {{ retry ? "Retry" : "Validate" }}
        </button>
      </span>
    </div>
  </center>
</template>

<script>
import axios from "axios";
import Store from "@/store/index";
import ProdData from "@/data.js";

export default {
  data() {
    return {
      vloading: false,
      loading: false,
      key: "",
      retry: false,
      hasCookie: this.cookeyStatus,
    };
  },
  props: ["cookeyStatus", "data", "hasMate", "viewOnly"],
  methods: {
    goToSubTree() {
      this.$router.push({
        name: "Subtrees",
        params: { subtree_id: this.data.linked_tree },
      });
    },
    addMember(num) {
      this.$emit("actionsAddMember", num);
    },
    deleteSwipe() {
      this.$emit("actionsDeleteSwipe");
    },
    reArrange() {
      this.$emit("actionsReArrange");
    },
    validate() {
      this.vloading = true;
      let sessionUrl = ProdData.getHostURL() + "/sessions/";
      let params = {};
      params.pin = this.key;
      params.surname = this.$route.params.id;
      axios
        .post(sessionUrl, params)
        .then((data) => {
          data = data.data;
          console.log(data);
          this.hasCookie = true;
          this.vloading = false;
          let sessData = {};
          sessData.status = true;
          sessData.surname = params.surname;
          if (data.view_only) {
            this.retry = true;
            sessData.view_only = true;
          } else {
            sessData.view_only = false;
          }
          Store.commit("setSession", sessData);
          this.$emit("keyTrue");
        })
        .catch(() => {
          this.retry = true;
        })
        .finally(() => {
          this.vloading = false;
        });
    },
  },
};
</script>

<style scoped>
.my-action-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
  border-radius: 14px !important;
  padding: 12px 20px !important;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.5px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  overflow: hidden;
  z-index: 1;
}

.my-action-btn::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: all 0.5s ease;
  z-index: -1;
}

.my-action-btn:hover {
  transform: translateY(-3px) scale(1.02);
  letter-spacing: 1px;
}

.my-action-btn:hover::before {
  left: 100%;
}

.glass-primary { border-left: 4px solid #4f8ef7 !important; }
.glass-primary:hover { background: rgba(79, 142, 247, 0.15) !important; box-shadow: 0 8px 20px rgba(79, 142, 247, 0.4) !important; border-color: rgba(79, 142, 247, 0.8) !important; }

.glass-success { border-left: 4px solid #2ed573 !important; }
.glass-success:hover { background: rgba(46, 213, 115, 0.15) !important; box-shadow: 0 8px 20px rgba(46, 213, 115, 0.4) !important; border-color: rgba(46, 213, 115, 0.8) !important; }

.glass-warning { border-left: 4px solid #ffa502 !important; }
.glass-warning:hover { background: rgba(255, 165, 2, 0.15) !important; box-shadow: 0 8px 20px rgba(255, 165, 2, 0.4) !important; border-color: rgba(255, 165, 2, 0.8) !important; }

.glass-danger { border-left: 4px solid #ff4757 !important; }
.glass-danger:hover { background: rgba(255, 71, 87, 0.15) !important; box-shadow: 0 8px 20px rgba(255, 71, 87, 0.4) !important; border-color: rgba(255, 71, 87, 0.8) !important; }

.glass-info { border-left: 4px solid #00a8ff !important; }
.glass-info:hover { background: rgba(0, 168, 255, 0.15) !important; box-shadow: 0 8px 20px rgba(0, 168, 255, 0.4) !important; border-color: rgba(0, 168, 255, 0.8) !important; }

.dark-input {
  background: rgba(15, 17, 35, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  border-radius: 12px;
  padding: 10px;
}
.dark-input:focus {
  border-color: #4f8ef7 !important;
  box-shadow: 0 0 15px rgba(79, 142, 247, 0.4) !important;
}
</style>