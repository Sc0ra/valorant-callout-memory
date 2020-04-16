<template>
  <div id="app">
    <navbar />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Navbar from '@/components/Navbar.vue';

@Component({
  components: {
    Navbar,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import '@/styles/bulma-theme.scss';

#app {
  text-align: center;
  color: #ece8e1;
}
</style>
