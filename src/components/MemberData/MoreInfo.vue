<template>
  <center style="padding-bottom: 30px">
    <div class="info-cards-container" style="width: 100%; max-width: 400px; margin: 0 auto;">
      
      <div class="info-card" v-if="data.mobile">
        <div class="icon-wrapper" style="background: rgba(253, 203, 110, 0.15); color: #fdcb6e;">
          <i class="icofont-smart-phone"></i>
        </div>
        <span class="info-text">{{ data.mobile }}</span>
      </div>

      <div class="info-card" v-if="data.dob">
        <div class="icon-wrapper" style="background: rgba(0, 184, 148, 0.15); color: #00b894;">
          <i class="icofont-baby"></i>
        </div>
        <span class="info-text"><span style="opacity: 0.6; margin-right: 6px;">Birth:</span>{{ data.dob }}</span>
      </div>

      <div class="info-card" v-if="data.died_on">
        <div class="icon-wrapper" style="background: rgba(99, 110, 114, 0.15); color: #b2bec3;">
          <i class="icofont-sad"></i>
        </div>
        <span class="info-text"><span style="opacity: 0.6; margin-right: 6px;">Death:</span>{{ data.died_on }}</span>
      </div>

      <div class="info-card" v-if="data.email">
        <div class="icon-wrapper" style="background: rgba(232, 67, 147, 0.15); color: #e84393;">
          <i class="icofont-mail"></i>
        </div>
        <span class="info-text" style="word-break: break-all;">{{ data.email }}</span>
      </div>

      <div class="info-card" v-if="data.address">
        <div class="icon-wrapper" style="background: rgba(178, 190, 195, 0.15); color: #dfe6e9;">
          <i class="icofont-ui-map"></i>
        </div>
        <span class="info-text">{{ data.address }}</span>
      </div>

      <div class="info-card" v-if="data.country">
        <div class="icon-wrapper" style="background: rgba(108, 92, 231, 0.15); color: #6c5ce7;">
          <i class="icofont-google-map"></i>
        </div>
        <span class="info-text">{{ data.country }}</span>
      </div>

      <div class="info-card" v-if="data.description">
        <div class="icon-wrapper" style="background: rgba(214, 48, 49, 0.15); color: #ff7675;">
          <i class="icofont-ui-note"></i>
        </div>
        <span class="info-text description">{{ data.description }}</span>
      </div>

      <!-- Social Media Links -->
      <div class="social-links-container" v-if="data.fb || data.insta || data.twitter || data.site">
        <a :href="data.fb" v-if="data.fb" class="social-btn fb-btn" target="_blank">
          <i class="icofont-facebook"></i>
        </a>
        <a :href="data.insta" v-if="data.insta" class="social-btn insta-btn" target="_blank">
          <i class="icofont-instagram"></i>
        </a>
        <a :href="data.twitter" v-if="data.twitter" class="social-btn twitter-btn" target="_blank">
          <i class="icofont-twitter"></i>
        </a>
        <a :href="data.site" v-if="data.site" class="social-btn site-btn" target="_blank">
          <i class="icofont-web"></i>
        </a>
      </div>
    </div>
    <router-link
      :to="{ name: 'PersonTimeline', params: { member: id } }"
      class="btn btn-default"
      >View Timeline</router-link
    ><br />
    <!-- <router-link :to="{name:'Profile', params:{member:id}}">See Profile</router-link> -->
  </center>
</template>

<style scoped>
.icofont-baby {
  font-size: 20px;
}
.btn-default {
  border: 1px solid #4f8ef7;
  color: white;
  border-radius: 12px;
  padding: 8px 16px;
  background: rgba(15, 17, 35, 0.6);
  transition: all 0.3s ease;
}
.btn-default:hover {
  background: rgba(79, 142, 247, 0.2);
  box-shadow: 0 0 10px rgba(79, 142, 247, 0.4);
}
.description {
  display: -webkit-box;
  margin: 0 !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: auto;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Modern Styles matching MemberData */
.info-cards-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 10px;
  margin-bottom: 24px;
}

.info-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px 16px;
  transition: transform 0.3s ease, background 0.3s ease;
  backdrop-filter: blur(10px);
  text-align: left;
}

.info-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  margin-right: 16px;
  font-size: 20px;
  flex-shrink: 0;
}

.info-text {
  color: #fff;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
  flex: 1;
}

/* Social Buttons */
.social-links-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.social-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 24px;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  text-decoration: none;
}

.fb-btn:hover { background: #1877f2; box-shadow: 0 0 15px rgba(24, 119, 242, 0.5); transform: translateY(-3px); }
.insta-btn:hover { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%); box-shadow: 0 0 15px rgba(214, 36, 159, 0.5); transform: translateY(-3px); }
.twitter-btn:hover { background: #1da1f2; box-shadow: 0 0 15px rgba(29, 161, 242, 0.5); transform: translateY(-3px); }
.site-btn:hover { background: #a78bfa; box-shadow: 0 0 15px rgba(167, 139, 250, 0.5); transform: translateY(-3px); }

</style>

<script>
export default {
  name: "MoreInfo",
  props: ["id", "data"],
};
</script>