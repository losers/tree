<template>
  <div class="tabbar-wrap">
    <nav class="tabs-glass">
      <router-link to="" class="tab-item" exact-active-class="tab-active">
        <span class="tab-icon">👥</span>
        <span class="tab-label">All</span>
      </router-link>
      <router-link to="#demo" class="tab-item" :class="{ 'tab-active': $route.hash === '#demo' }">
        <span class="tab-icon">💡</span>
        <span class="tab-label">Demo</span>
      </router-link>
      <router-link to="#super" class="tab-item" :class="{ 'tab-active': $route.hash === '#super' }">
        <span class="tab-icon">⚡</span>
        <span class="tab-label">Super</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "TabBar",
};
</script>

<style scoped>
.tabbar-wrap {
  display: flex;
  justify-content: center;
  padding: 24px 0 0;
}

.tabs-glass {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50px;
  padding: 6px;
  backdrop-filter: blur(20px);
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 24px;
  border-radius: 50px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.2px;
  user-select: none;
}

.tab-item:hover {
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.06);
  text-decoration: none;
}

.tab-active {
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.3) 0%, rgba(138, 79, 247, 0.25) 100%);
  border: 1px solid rgba(79, 142, 247, 0.35);
  color: #fff !important;
  text-decoration: none !important;
  box-shadow: 0 4px 20px rgba(79, 142, 247, 0.2);
}

.tab-icon {
  font-size: 15px;
  line-height: 1;
}

.tab-label {
  letter-spacing: 0.3px;
}
</style>