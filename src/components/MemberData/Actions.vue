<template>
  <div class="actions-wrapper">
    <div v-if="hasCookie && !viewOnly" class="actions-list">
      <!-- Add Child -->
      <div class="action-card action-child" @click="addMember(1)">
        <div class="action-icon icon-child">
          <i class="icofont-baby"></i>
        </div>
        <div class="action-details">
          <div class="action-title">+ Add Child</div>
          <div class="action-sub">Add son or daughter</div>
        </div>
        <i class="icofont-rounded-right action-arrow"></i>
      </div>

      <!-- Add Spouse (Wife / Husband) -->
      <div
        v-if="!data.is_mate"
        class="action-card action-spouse"
        @click="addMember('gender')"
      >
        <div class="action-icon icon-spouse">
          <i class="icofont-heart-alt"></i>
        </div>
        <div class="action-details">
          <div class="action-title">+ Add {{ data.gender == '1' ? 'Wife' : 'Husband' }}</div>
          <div class="action-sub">Link partner / spouse</div>
        </div>
        <i class="icofont-rounded-right action-arrow"></i>
      </div>

      <!-- Add Parent -->
      <div
        v-if="!data.parent_id || (data.is_mate && !data.linked_tree)"
        class="action-card action-parent"
        @click="addMember(0)"
      >
        <div class="action-icon icon-parent">
          <i class="icofont-users-alt-2"></i>
        </div>
        <div class="action-details">
          <div class="action-title">+ Add Parent</div>
          <div class="action-sub">Link father or mother branch</div>
        </div>
        <i class="icofont-rounded-right action-arrow"></i>
      </div>

      <!-- View Parent Tree (Subtree) -->
      <div
        v-if="data.linked_tree"
        class="action-card action-subtree"
        @click="goToSubTree()"
      >
        <div class="action-icon icon-subtree">
          <i class="icofont-tree"></i>
        </div>
        <div class="action-details">
          <div class="action-title">View Parent Tree</div>
          <div class="action-sub">Explore connected lineage tree</div>
        </div>
        <i class="icofont-external-link action-arrow"></i>
      </div>

      <!-- Swap Siblings -->
      <div
        v-if="!data.is_mate && data.parent_id"
        class="action-card action-swap"
        @click="reArrange"
      >
        <div class="action-icon icon-swap">
          <i class="icofont-exchange"></i>
        </div>
        <div class="action-details">
          <div class="action-title">Swap Siblings</div>
          <div class="action-sub">Reorder sibling display sequence</div>
        </div>
        <i class="icofont-rounded-right action-arrow"></i>
      </div>

      <!-- Delete Member (Danger Zone) -->
      <div class="action-card action-delete" @click="deleteSwipe">
        <div class="action-icon icon-delete">
          <i class="icofont-ui-delete"></i>
        </div>
        <div class="action-details">
          <div class="action-title text-danger">Delete Member</div>
          <div class="action-sub text-muted">Remove {{ data.short_name }} from the tree</div>
        </div>
        <i class="icofont-trash action-arrow text-danger"></i>
      </div>
    </div>

    <!-- Unlock Admin PIN (when not authenticated as admin) -->
    <div v-else class="admin-unlock-card">
      <!-- Subtree button if available -->
      <div
        v-if="data.linked_tree"
        class="action-card action-subtree mb-3"
        @click="goToSubTree()"
      >
        <div class="action-icon icon-subtree">
          <i class="icofont-tree"></i>
        </div>
        <div class="action-details">
          <div class="action-title">View Parent Tree</div>
          <div class="action-sub">Explore connected lineage tree</div>
        </div>
        <i class="icofont-external-link action-arrow"></i>
      </div>

      <div class="unlock-inner p-4 text-center">
        <div class="lock-icon-circle mb-3">
          <i class="icofont-lock"></i>
        </div>
        <h5 class="font-weight-bold mb-1" style="color: #fff; font-size: 16px;">Admin Authentication</h5>
        <p class="text-muted mb-3" style="font-size: 13px;">
          Enter 4-digit Admin PIN to edit members and family relations.
        </p>

        <div class="pin-input-group mb-3">
          <input
            class="form-control text-center admin-pin-input"
            placeholder="• • • •"
            v-model="key"
            onkeypress="if(this.value.length==4) return false;"
            type="password"
            maxlength="4"
          />
        </div>

        <button
          v-show="key.length == 4"
          @click="validate"
          class="my-btn w-100"
          :disabled="vloading"
        >
          <span class="spinner-border spinner-border-sm mr-1" v-show="vloading"></span>
          {{ retry ? "Retry PIN" : "Unlock Admin Actions" }}
        </button>

        <div v-if="retry" class="text-danger mt-2" style="font-size: 12.5px;">
          <i class="icofont-warning-alt mr-1"></i> Incorrect Admin PIN. Please try again.
        </div>
      </div>
    </div>
  </div>
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
.actions-wrapper {
  padding: 0 4px;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(12px);
  user-select: none;
}

.action-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(79, 142, 247, 0.35);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.action-card:active {
  transform: scale(0.98);
}

.action-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.action-card:hover .action-icon {
  transform: scale(1.08);
}

.icon-child {
  background: rgba(46, 213, 115, 0.15);
  color: #2ed573;
  border: 1px solid rgba(46, 213, 115, 0.3);
}

.icon-spouse {
  background: rgba(255, 75, 120, 0.15);
  color: #ff4b78;
  border: 1px solid rgba(255, 75, 120, 0.3);
}

.icon-parent {
  background: rgba(255, 171, 0, 0.15);
  color: #ffab00;
  border: 1px solid rgba(255, 171, 0, 0.3);
}

.icon-subtree {
  background: rgba(0, 194, 255, 0.15);
  color: #00c2ff;
  border: 1px solid rgba(0, 194, 255, 0.3);
}

.icon-swap {
  background: rgba(120, 119, 253, 0.15);
  color: #7877fd;
  border: 1px solid rgba(120, 119, 253, 0.3);
}

.icon-delete {
  background: rgba(255, 71, 87, 0.12);
  color: #ff4757;
  border: 1px solid rgba(255, 71, 87, 0.3);
}

.action-details {
  flex-grow: 1;
  text-align: left;
}

.action-title {
  color: #ffffff;
  font-size: 14.5px;
  font-weight: 600;
  line-height: 1.25;
}

.action-sub {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  margin-top: 2px;
}

.action-arrow {
  color: rgba(255, 255, 255, 0.3);
  font-size: 16px;
  transition: transform 0.25s ease, color 0.25s ease;
}

.action-card:hover .action-arrow {
  transform: translateX(3px);
  color: #ffffff;
}

/* Admin Unlock Card */
.admin-unlock-card {
  width: 100%;
}

.unlock-inner {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
}

.lock-icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(79, 142, 247, 0.15);
  color: #4f8ef7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto;
}

.admin-pin-input {
  background: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(79, 142, 247, 0.3) !important;
  color: #fff !important;
  font-size: 20px;
  letter-spacing: 6px;
  border-radius: 12px;
  padding: 10px;
  max-width: 200px;
  margin: 0 auto;
}

.admin-pin-input:focus {
  border-color: #4f8ef7 !important;
  box-shadow: 0 0 15px rgba(79, 142, 247, 0.4) !important;
}

.my-btn {
  background: linear-gradient(135deg, #4f8ef7, #a78bfa);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 12px;
  padding: 10px 20px;
  transition: all 0.25s ease;
}

.my-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 142, 247, 0.4);
}
</style>