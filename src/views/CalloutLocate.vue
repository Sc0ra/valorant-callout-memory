<template>
  <div class="wrapper">
    <h2 class="title is-2">
      {{ toGuess }}
    </h2>
    <div
      ref="wrapper"
      class="stage-wrapper"
    >
      <v-stage
        v-if="map"
        :config="{
          width: mapSize.width,
          height: mapSize.height
        }"
        ref="stage"
        class="stage"
        :class="{'pointer-hover': pinHovered}"
      >
        <v-layer>
          <v-image :config="{
            image: image,
            width: mapSize.width,
            height: mapSize.height,
            x: 0,
            y: 0,
          }"
          />
        </v-layer>
        <v-layer>
          <v-circle
            v-for="pin in pins"
            :key="pin.callout"
            :config="{
              fill: 'whitesmoke',
              x: pin.x,
              y: pin.y,
              radius: 5,
              hitStrokeWidth: 10,
            }"
            @mouseenter="pinHovered = true"
            @mouseleave="pinHovered = false"
            @click="onClick(pin)"
            @touchstart="onClick(pin)"
          />
        </v-layer>
      </v-stage>
    </div>
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

  $refs!: {
    wrapper: HTMLDivElement;
    stage: Vue & { getStage: () => Konva.Stage };
  }

  @Getter('getMap', { namespace: 'maps' })
  getMap!: (mapSlug: string) => Map;

  get map() {
    return this.getMap(this.mapSlug);
  }

  toGuess = '';

  mapSize = { width: 0, height: 0 };

  mounted() {
    if (this.map) {
      if (this.$refs.wrapper.clientWidth >= this.$refs.wrapper.clientHeight) {
        this.mapSize = {
          height: this.$refs.wrapper.clientHeight * 0.9,
          width: (this.$refs.wrapper.clientHeight * 0.9) * this.map.mapRatio,
        };
      } else {
        this.mapSize = {
          width: this.$refs.wrapper.clientWidth * 0.9,
          height: (this.$refs.wrapper.clientWidth * 0.9) / this.map.mapRatio,
        };
      }
    }
  }

  pinHovered = false;

  image: HTMLImageElement | null = null;

  get pins() {
    return this.map && this.map.places.map((place) => ({
      ...place,
      x: place.x * this.mapSize.width,
      y: place.y * this.mapSize.height,
    }));
  }

  get stage() {
    return this.$refs.stage.getStage();
  }

  onClick(place: Place) {
    if (place.callout === this.toGuess) {
      const randIndex = Math.floor(Math.random() * this.map.places.length);
      this.toGuess = this.map.places[randIndex].callout;
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
      const randIndex = Math.floor(Math.random() * this.map.places.length);
      this.toGuess = this.map.places[randIndex].callout;
      if (this.$refs.wrapper) {
        if (this.$refs.wrapper.clientWidth >= this.$refs.wrapper.clientHeight) {
          this.mapSize = {
            height: this.$refs.wrapper.clientHeight * 0.9,
            width: (this.$refs.wrapper.clientHeight * 0.9) * this.map.mapRatio,
          };
        } else {
          this.mapSize = {
            width: this.$refs.wrapper.clientWidth * 0.9,
            height: (this.$refs.wrapper.clientWidth * 0.9) / this.map.mapRatio,
          };
        }
      }
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
  .wrapper {
    display: flex;
    flex-flow: column;
  }
  .stage-wrapper {
    height: 100%;
  }
  .pointer-hover {
    cursor: pointer;
  }
  .stage::v-deep .konvajs-content {
      margin: auto;
  }
</style>
