<template>
  <center>
    <div class="col-10 mt-5">
      <h4 class="mb-4">Select a Language</h4>
      <div v-for="language in languagesList" :key="language.value">
        <label class="d-flex align-items-center listLabel">
          {{ language.name }}
          <input
            class="col-1"
            type="radio"
            name="language"
            v-model="selectedLanguage"
            :value="language.value"
            id="lang"
            required
          />
          <span></span>
        </label>
      </div>
      <div class="row justify-content-between mt-5 mb-4">
        <button
          class="btn btn-success"
          @click="activateLanguage"
          :disabled="selectedLanguage == initialLanguage"
        >
          Switch
          {{
            selectedLanguage != initialLanguage
              ? "to " +
                languagesList.filter(
                  (lang) => lang.value == selectedLanguage
                )[0]["name"]
              : ""
          }}
        </button>
        <button @click="close" class="btn btn-danger" type="button">
          Cancel
        </button>
      </div>
    </div>
  </center>
</template>

<script>
export default {
  data() {
    return {
      languagesList: [
        {
          name: "English",
          value: "en",
        },
        {
          name: "Kiswahili",
          value: "sw",
        },
      ],
      initialLanguage: "",
      selectedLanguage: "",
    };
  },
  mounted() {
    // get active language
    this.initialLanguage = localStorage.getItem("locale") ?? "en";
    this.selectedLanguage = this.initialLanguage;
  },
  methods: {
    activateLanguage() {
      this.$i18n.locale = this.selectedLanguage;
      localStorage.setItem("locale", this.selectedLanguage); // save in local this works even after a refresh
      this.close();
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.listLabel {
  padding: 10px 20px;
  border: 2px solid rgb(228, 228, 228);
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;
  flex-flow: row;
  position: relative;
}

input[type="radio"] ~ span {
  display: none;
}
input[type="radio"]:checked ~ span {
  display: inline-block;
  width: 100%;
  height: 100%;
  border: 0.5px solid green;
  border-radius: 10px;
  box-shadow: 0 0 0 1px green;
  color: green !important;
  position: absolute;
  top: 0;
  left: 0;
}
input[type="radio"]:checked {
  background: green;
}
</style>