<template>
  <div class="more-info-wrapper">
    <!-- Life Dates & Milestones Grid -->
    <div class="info-section mb-3" v-if="data.dob || data.died_on">
      <div class="section-label">
        <i class="icofont-calendar mr-1"></i> Life Dates
      </div>
      <div class="dates-grid">
        <div class="date-tile birth-tile" v-if="data.dob">
          <div class="tile-icon">
            <i class="icofont-baby"></i>
          </div>
          <div class="tile-content">
            <div class="tile-label">Born</div>
            <div class="tile-value">{{ data.dob }}</div>
          </div>
        </div>

        <div class="date-tile death-tile" v-if="data.died_on">
          <div class="tile-icon">
            <i class="icofont-candle"></i>
          </div>
          <div class="tile-content">
            <div class="tile-label">Memorial</div>
            <div class="tile-value">{{ data.died_on }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact & Location Section -->
    <div class="info-section mb-3" v-if="data.mobile || data.email || data.address || data.country">
      <div class="section-label">
        <i class="icofont-id-card mr-1"></i> Contact & Location
      </div>
      <div class="info-list">
        <!-- Phone -->
        <a :href="'tel:' + data.mobile" class="info-row-tile" v-if="data.mobile">
          <div class="row-icon icon-phone">
            <i class="icofont-smart-phone"></i>
          </div>
          <div class="row-content">
            <div class="row-label">Phone</div>
            <div class="row-value">{{ data.mobile }}</div>
          </div>
          <i class="icofont-phone row-action-icon"></i>
        </a>

        <!-- Email -->
        <a :href="'mailto:' + data.email" class="info-row-tile" v-if="data.email">
          <div class="row-icon icon-email">
            <i class="icofont-ui-email"></i>
          </div>
          <div class="row-content">
            <div class="row-label">Email</div>
            <div class="row-value">{{ data.email }}</div>
          </div>
          <i class="icofont-envelope row-action-icon"></i>
        </a>

        <!-- Location -->
        <div class="info-row-tile no-hover" v-if="data.address || data.country">
          <div class="row-icon icon-location">
            <i class="icofont-location-pin"></i>
          </div>
          <div class="row-content">
            <div class="row-label">Location</div>
            <div class="row-value">
              {{ data.address }}{{ data.address && data.country ? ', ' : '' }}{{ data.country }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bio / Notes -->
    <div class="info-section mb-3" v-if="data.description">
      <div class="section-label">
        <i class="icofont-quote-left mr-1"></i> About & Notes
      </div>
      <div class="bio-card">
        <p class="bio-text m-0">{{ data.description }}</p>
      </div>
    </div>

    <!-- Social Links -->
    <div class="info-section mb-3" v-if="data.fb || data.insta || data.twitter || data.site">
      <div class="section-label">
        <i class="icofont-share-alt mr-1"></i> Social Profiles
      </div>
      <div class="social-links-bar">
        <a :href="data.fb" v-if="data.fb" class="social-pill fb-pill" target="_blank" title="Facebook">
          <i class="icofont-facebook"></i>
        </a>
        <a :href="data.insta" v-if="data.insta" class="social-pill insta-pill" target="_blank" title="Instagram">
          <i class="icofont-instagram"></i>
        </a>
        <a :href="data.twitter" v-if="data.twitter" class="social-pill twitter-pill" target="_blank" title="Twitter">
          <i class="icofont-twitter"></i>
        </a>
        <a :href="data.site" v-if="data.site" class="social-pill site-pill" target="_blank" title="Website">
          <i class="icofont-web"></i>
        </a>
      </div>
    </div>

    <!-- Personal Timeline CTA Banner -->
    <router-link
      :to="{ name: 'PersonTimeline', params: { member: id } }"
      class="timeline-cta-banner"
    >
      <div class="timeline-cta-icon">
        <i class="icofont-sand-clock"></i>
      </div>
      <div class="timeline-cta-body">
        <div class="timeline-cta-title">Personal Timeline</div>
        <div class="timeline-cta-sub">View life events & milestones</div>
      </div>
      <i class="icofont-arrow-right timeline-cta-arrow"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "MoreInfo",
  props: ["id", "data"],
};
</script>

<style scoped>
.more-info-wrapper {
  padding: 0 4px;
}

.section-label {
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

/* Dates Grid */
.dates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.date-tile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.tile-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
}

.birth-tile .tile-icon {
  background: rgba(46, 213, 115, 0.15);
  color: #2ed573;
}

.death-tile .tile-icon {
  background: rgba(164, 176, 190, 0.15);
  color: #ced6e0;
}

.tile-content {
  text-align: left;
}

.tile-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  font-weight: 600;
}

.tile-value {
  font-size: 13.5px;
  font-weight: 600;
  color: #fff;
}

/* Info List */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row-tile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.25s ease;
  backdrop-filter: blur(10px);
}

.info-row-tile:not(.no-hover):hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(79, 142, 247, 0.35);
  transform: translateY(-2px);
}

.row-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
}

.icon-phone {
  background: rgba(255, 171, 0, 0.15);
  color: #ffab00;
}

.icon-email {
  background: rgba(255, 75, 120, 0.15);
  color: #ff4b78;
}

.icon-location {
  background: rgba(79, 142, 247, 0.15);
  color: #4f8ef7;
}

.row-content {
  flex-grow: 1;
  text-align: left;
  overflow: hidden;
}

.row-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  font-weight: 600;
}

.row-value {
  font-size: 13.5px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-action-icon {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.info-row-tile:hover .row-action-icon {
  color: #4f8ef7;
  transform: scale(1.1);
}

/* Bio Card */
.bio-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 3px solid #a78bfa;
  border-radius: 12px;
  padding: 12px 14px;
  text-align: left;
}

.bio-text {
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
  font-style: italic;
}

/* Social Links */
.social-links-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.social-pill {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
  transition: all 0.25s ease;
}

.social-pill:hover {
  transform: translateY(-3px) scale(1.08);
}

.fb-pill:hover { background: #1877f2; border-color: #1877f2; box-shadow: 0 6px 16px rgba(24, 119, 242, 0.4); }
.insta-pill:hover { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%); border-color: transparent; box-shadow: 0 6px 16px rgba(214, 36, 159, 0.4); }
.twitter-pill:hover { background: #1da1f2; border-color: #1da1f2; box-shadow: 0 6px 16px rgba(29, 161, 242, 0.4); }
.site-pill:hover { background: #a78bfa; border-color: #a78bfa; box-shadow: 0 6px 16px rgba(167, 139, 250, 0.4); }

/* Timeline CTA Banner */
.timeline-cta-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  padding: 14px 16px;
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.15), rgba(167, 139, 250, 0.15));
  border: 1px solid rgba(79, 142, 247, 0.3);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(12px);
}

.timeline-cta-banner:hover {
  transform: translateY(-2px);
  border-color: rgba(79, 142, 247, 0.6);
  box-shadow: 0 8px 24px rgba(79, 142, 247, 0.25);
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.22), rgba(167, 139, 250, 0.22));
}

.timeline-cta-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f8ef7, #a78bfa);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(79, 142, 247, 0.4);
}

.timeline-cta-body {
  flex-grow: 1;
  text-align: left;
}

.timeline-cta-title {
  color: #fff;
  font-weight: 700;
  font-size: 14.5px;
  line-height: 1.25;
}

.timeline-cta-sub {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-top: 2px;
}

.timeline-cta-arrow {
  color: #4f8ef7;
  font-size: 18px;
  transition: transform 0.25s ease;
}

.timeline-cta-banner:hover .timeline-cta-arrow {
  transform: translateX(4px);
}
</style>