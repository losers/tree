<template>
  <center>
    <div class="col-10 mt-5">
      <h3>Select a Language</h3>
      <div
        class="d-flex"
        v-for="language in languagesList"
        :key="language.value"
      >
        <input
          class="col-1"
          type="radio"
          name="language"
          v-model="selectedLanguage"
          :value="language.value"
          id="male"
          required
        />

        <p for="male" class="ml-2" style="color: black">
          {{ language.name }}
        </p>
      </div>
      <div class="row justify-content-between mt-5 mb-3">
        <button class="btn btn-success" @click="activateLanguage">
          Switch
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
      selectedLanguage: "",
    };
  },
  mounted() {
    // get active language
    this.selectedLanguage = localStorage.getItem("locale") ?? "en";
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