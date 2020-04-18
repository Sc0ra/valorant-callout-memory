<template>
  <div :class="{'drag-hovered': dragHovered}">
    <v-stage
      v-if="map"
      :config="stageConfig"
      ref="stage"
    >
      <v-layer ref="map">
        <v-image :config="{
          image: image,
          width: mapSize.width,
          height: mapSize.height,
          x: mapTopLeftPosition.x,
          y: mapTopLeftPosition.y,
        }"
        />
      </v-layer>
      <v-layer ref="pins">
        <v-circle
          v-for="pin in pins"
          :key="pin.callout"
          :config="{
            fill: 'whitesmoke',
            x: pin.x,
            y: pin.y,
            radius: 5,
          }"
          @mouseenter="dragHovered = true"
          @mouseleave="dragHovered = false"
          @click="onClick(pin)"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import { Getter } from 'vuex-class';

import Konva from 'konva';

import { Map, Place } from '@/store/maps/types';

@Component({})
export default class CalloutLocate extends Vue {
  @Prop({
    required: true,
    type: String,
  })
  mapSlug!: string;

  @Getter('getMap', { namespace: 'maps' })
  getMap!: (mapSlug: string) => Map;

  get map() {
    return this.getMap(this.mapSlug);
  }

  toGuess = 'Long A';

  stageConfig = {
    width: window.innerWidth,
    height: window.innerHeight - 56, // Navbar height
  };

  dragHovered = false;

  image: HTMLImageElement | null = null;

  get mapTopLeftPosition() {
    return this.map && {
      x: (window.innerWidth - this.mapSize.width) / 2,
      y: 56,
    };
  }

  get mapSize() {
    return (window.innerHeight >= 900 && window.innerWidth >= 900)
      ? { width: this.map.width, height: this.map.height }
      : { width: window.innerWidth * 0.9, height: window.innerWidth * 0.9 };
  }

  get pins() {
    return this.map && this.map.places.map((place) => ({
      ...place,
      x: this.mapTopLeftPosition.x + place.x * this.mapSize.width,
      y: this.mapTopLeftPosition.y + place.y * this.mapSize.height,
    }));
  }

  get stage() {
    return (this.$refs.stage as Vue & { getStage: () => Konva.Stage }).getStage();
  }

  onClick(place: Place) {
    if (place.callout === this.toGuess) {
      console.log('success');
    } else {
      console.log('failure');
    }
  }

  @Watch('map', { immediate: true })
  onMapChange() {
    if (this.map) {
      const image = new Image();
      image.src = `${process.env.BASE_URL}${this.map.mapLayout}`;
      image.onload = () => {
        this.image = image;
      };
    }
  }

  shuffle = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
</script>

<style lang="scss" scoped>
  .drag-hovered {
    cursor: pointer;
  }
</style>
