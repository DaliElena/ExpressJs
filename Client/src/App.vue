<template>
  <div id="app">
    <div class="page">
      <header></header>
      <router-view />
      <footer></footer>
    </div>
  </div>
</template>

<script>

export default {
  components: {},

  data() {
    return {};
  },

  computed: {},

  watch: {},

  created() {
  },

  mounted() {
  },

  methods: {},
};
</script>

<style lang="scss">
@import "~@/assets/reset.css";

.page {
  height: 100%;
}

html {
  height: 100%;
}

#app {
  height: 100%;
}
</style>




