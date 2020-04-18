<template>
  <div id="app">
    <navbar />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import Navbar from '@/components/Navbar.vue';

import { MapDict } from './store/maps/types';

@Component({
  components: {
    Navbar,
  },
})
export default class App extends Vue {
  @Action('fetchMaps', { namespace: 'maps' })
  fetchMaps!: () => MapDict;

  created() {
    this.fetchMaps();
  }
}
</script>

<style lang="scss">
@import '@/styles/bulma-theme.scss';

#app {
  text-align: center;
  color: #ece8e1;
}
</style>
