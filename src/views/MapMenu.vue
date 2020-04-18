<template>
  <div v-if="maps" class="map-menu">
    <template v-if="gameMode='locate'">
      <h1 class="title is-1 has-text-primary">
        Locate
      </h1>
      <ul>
        <li>Find the location of the 10 given callouts</li>
        <li>Be as quick as possible</li>
      </ul>
    </template>
    <br>
    <h2 class="title is-2">
      Chose a map
    </h2>
    <div class="maps-container">
      <router-link
        v-for="map in maps"
        :key="map.mapSlug"
        :to="`${gameMode}/${map.mapSlug}`"
        tag="div"
        class="map-hero"
      >
        <img :src="`${baseUrl}${map.mapHero}`">
        <h3 class="title is-3 has-text-white image-overlay">
          {{ map.mapName }}
        </h3>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

import { Map } from '@/store/maps/types';

@Component({})
export default class MapMenu extends Vue {
  @Prop({
    required: true,
    type: String,
  })
  gameMode!: 'connect' | 'locate';

  @Getter('getMaps', { namespace: 'maps' })
  maps!: () => Map[];

  baseUrl = process.env.BASE_URL;
}
</script>

<style lang="scss" scoped>
.map-menu {
  margin-top: 1rem;
}
.maps-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 90vw;
  margin: auto;
}
.map-hero {
  position: relative;
  text-align: center;
  max-width: 30rem;
  &:hover {
    cursor: pointer;
  }
  margin-bottom: 1rem;
  img {
    border-radius: 5px;
  }
}
.image-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
