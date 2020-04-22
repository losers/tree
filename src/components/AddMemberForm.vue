<template>
  <div class="FormData p-5">
    <h3>Adding Data to {{textData}} ,</h3>
    <form :target="formDataValues" method="post">
      <div class="form-inline">
        <label>Add :</label>
        <select class="form-control form-control col-sm-6" style="margin-left:20px" id="type">
          <option value="children">Children</option>
          <option value="mate">Mate</option>
        </select>
      </div>
      <div class="form-inline">
        <label for="nickname">Nick Name :</label>
        <input
          type="text"
          class="form-control"
          id="nickname"
          placeholder="Enter Nick Name"
          required
        />
      </div>
      <small id="nickname" class="form-text text-muted">Nick Name will be shown in Family Tree</small>
      <div class="form-inline">
        <label for="name">Name :</label>
        <input type="text" class="form-control" id="name" placeholder="Enter Name" required />
      </div>
      <div class="form-inline">
        <label for="mobile">Mobile :</label>
        <input type="tel" class="form-control" id="mobile" placeholder="Mobile Number" />
      </div>
      <!-- Gender Selection -->
      <div class="form-inline">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="gender" id="male" value="m" checked />
          <label class="form-check-label ml-2" for="male">Male</label>
        </div>
        <div class="form-check">
          <input class="form-check-input ml-5" type="radio" name="gender" id="female" value="f" />
          <label class="form-check-label ml-2" for="female">Female</label>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "AddMemberForm",
  data() {
    return {
      textData: this.text
    };
  },
  props: ["text"],
  mounted() {
    console.log(this.textData);
  },
  methods: {
    formDataValues() {}
  }
};
</script>

<style scoped>
label {
  size: 22px;
  font-weight: bold;
  margin: 15px 0;
}
input {
  margin-left: 20px;
}
</style>