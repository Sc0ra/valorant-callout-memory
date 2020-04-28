<template>
  <div class="wrapper">
    <div class="level is-mobile">
      <div class="level-item success-count">
        <h2 class="title is-2">
          {{ successCount }}
        </h2>
      </div>
      <div class="level-item">
        <h2
          v-if="toGuess.length > 0"
          class="title is-2"
        >
          {{ toGuess[0] }}
        </h2>
        <span
          v-else
          class="icon is-large retry"
          @click="onRetry"
        >
          <i class="fas fa-redo fa-2x"></i>
        </span>
      </div>
      <div class="level-item failure-count">
        <h2 class="title is-2">
          {{ failureCount }}
        </h2>
      </div>
    </div>
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
            v-for="(pin, id) in pins"
            ref="pins"
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
            @click="onClick(pin, id)"
            @touchstart="onClick(pin, id)"
          />
        </v-layer>
      </v-stage>
    </div>
    <div
      v-if="displayHelp"
      class="message"
    >
      <div class="message-header">
        <p>Rules</p>
        <button
          class="delete has-background-dark"
          @click="onCloseHelp"
        />
      </div>
      <div class="message-body has-background-dark has-text-white content">
        <ul class="has-text-left">
          <li>
            Click on the location of the callouts
          </li>
          <li>
            Check where you were wrong at the end of the game
          </li>
        </ul>
      </div>
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
    pins: Vue & { getNode: () => Konva.Shape}[];
  }

  @Getter('getMap', { namespace: 'maps' })
  getMap!: (mapSlug: string) => Map;

  get map() {
    return this.getMap(this.mapSlug);
  }

  timer = 0;

  displayHelp = true;

  toGuess: string[] = [];

  numberToGuess = 10;

  successCount = 0;

  failureCount = 0;

  mapSize = { width: 0, height: 0 };

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

  get pinNodes() {
    return this.$refs.pins.map((pin) => pin.getNode());
  }

  onClick(place: Place, placeId: number) {
    const pin = this.pinNodes[placeId];
    const anim = new Konva.Animation((frame) => {
      if (frame) {
        const scale = 0.7 * Math.sin((frame.time * 2 * Math.PI) / 800) + 1;
        pin.scale({ x: scale, y: scale });
      }
    }, pin.getLayer());
    if (place.callout === this.toGuess[0]) {
      this.successCount += 1;
      pin.fill('#24e8ad');
      anim.start();
      setTimeout(() => {
        anim.stop();
        pin.fill('whitesmoke');
        pin.draw();
      }, 400);
    } else {
      this.failureCount += 1;
      pin.fill('#ff4655');
      anim.start();
      setTimeout(() => {
        anim.stop();
        pin.fill('whitesmoke');
        pin.draw();
      }, 400);
    }
    this.toGuess = this.toGuess.slice(1);
  }

  onCloseHelp() {
    this.displayHelp = false;
    this.$nextTick(() => this.resizeCanvas());
  }

  onRetry() {
    this.failureCount = 0;
    this.successCount = 0;
    this.toGuess = this.shuffle(this.map.places.map((p) => p.callout))
      .slice(0, this.numberToGuess);
  }

  @Watch('map', { immediate: true })
  onMapChange() {
    if (this.map) {
      const image = new Image();
      image.src = `${process.env.BASE_URL}${this.map.mapLayout}`;
      image.onload = () => {
        this.image = image;
      };
      this.toGuess = this.shuffle(this.map.places.map((p) => p.callout))
        .slice(0, this.numberToGuess);
      if (this.$refs.wrapper) {
        this.resizeCanvas();
      }
    }
  }

  resizeCanvas() {
    if (this.$refs.wrapper.clientWidth >= this.$refs.wrapper.clientHeight) {
      this.mapSize = {
        height: (this.$refs.wrapper.clientHeight * 0.95),
        width: this.$refs.wrapper.clientHeight * 0.95 * this.map.mapRatio,
      };
    } else {
      this.mapSize = {
        width: this.$refs.wrapper.clientWidth,
        height: this.$refs.wrapper.clientWidth / this.map.mapRatio,
      };
    }
  }

  mounted() {
    if (this.map) {
      this.resizeCanvas();
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
  .success-count {
    max-width: 150px;
    text-align: left;
    padding: 1rem;
    background-color: $green;
    clip-path: polygon(0 0, 100% 0%, 75% 100%, 0% 90%);
  }
  .failure-count {
    max-width: 150px;
    text-align: left;
    padding: 1rem;
    background-color: $red;
    clip-path: polygon(0 0, 100% 0%, 100% 90%, 25% 100%);
  }
  .retry {
    cursor: pointer;
  }
  .message {
    margin: 1rem;
  }
</style>
