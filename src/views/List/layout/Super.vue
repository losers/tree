<template>
  <div>
    <h2>Special Families</h2>
    <div class="row col-sm-12 col-md-12 d-flex justify-content-around">
      <div class="col-sm-10 col-md-3 spl-box-outside" style="background: red">
        <div
          class="w-100 spl-box-inside d-flex justify-content-between"
          style="flex-direction: column"
        >
          <div class="">
            <i class="icofont-badge" style="color: white"></i>
            <center class="mt-3">
              <h4>Medam Mega Family</h4>
              <h6>surname: medam</h6>
            </center>
          </div>
          <div
            class="row d-flex align-items-center justify-content-between align-items-center mt-auto"
           
          >
            <div
            
            >
              Last Update: Jan 2, 2020
            </div>
            <div style="background: white; padding: 5px; border-radius: 5px">
              <abbr title="43 Bloodline Coins">
                <b style="color: red">43</b>
                <img src="@/assets/b-coin.svg" height="30px" />
              </abbr>
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-sm-10 col-md-3 spl-box-outside"
        style="background: indianred"
      >
        <i class="icofont-badge" style="color: white"></i>
        <div class="spl-box-inside">hello</div>
      </div>
      <div
        class="col-sm-10 col-md-3 spl-box-outside"
        style="background: #25248a"
      >
        <i class="icofont-badge" style="color: white"></i>
        <div class="spl-box-inside">hello</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log("xjnckdnvs");
  },
};
</script>

<style scoped>
.spl-box-outside {
  background: red;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: cover;
  padding: 2px;
  border-radius: 10px;
  transition: 0.3s all;
}
.spl-box-outside:hover {
  box-shadow: 2px 2px 10px 0px rgba(94, 94, 94, 1);
}
.icofont-badge {
  color: white;
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 18px;
}
.b-coins-section {
  position: absolute;
  bottom: 10px;
  right: 30px;
}
.spl-box-inside {
  background: white;
  height: 245px;
  width: 100%;
  border-radius: 80px 10px 10px 10px;
}
</style>