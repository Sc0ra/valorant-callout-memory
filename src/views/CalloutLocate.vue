<template>
  <div class="wrapper">
    <div class="top-container">
      <div class="success-count">
        <h2 class="title is-2">
          {{ successCount }}
        </h2>
      </div>
      <div class="center-item">
        <game-timer v-model="timer" :isRunning="isRunning" />
        <template v-if="!isRunning">
          <button
            v-if="toGuess.length > 0"
            class="button is-primary is-medium"
            @click="isRunning = true"
          >
            Start
          </button>
          <button
            v-else
            class="button is-primary is-medium"
            @click="onRetry"
          >
            Retry
          </button>
        </template>
        <h2
          v-if="isRunning && toGuess.length > 0"
          class="title is-2"
        >
          {{ toGuess[0] }}
        </h2>
      </div>
      <div class="failure-count">
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
          <game-map
            :width="mapSize.width"
            :height="mapSize.height"
            :src="map.mapLayout"
          />
        </v-layer>
        <v-layer>
          <game-pin
            v-for="place in map.places"
            :x="place.x * mapSize.width"
            :y="place.y * mapSize.height"
            :key="place.callout"
            :is-active="isRunning"
            :is-answer="place.callout === toGuess[0]"
            @mouseenter="pinHovered = true"
            @mouseleave="pinHovered = false"
            @click="onPinClick(place.callout === toGuess[0])"
          />
        </v-layer>
      </v-stage>
    </div>
    <transition
      name="slide-fade"
      @after-leave="resizeCanvas"
    >
      <div
        v-if="displayHelp"
        class="message"
      >
        <div class="message-header">
          <p>Rules</p>
          <button
            class="delete has-background-dark"
            @click="displayHelp = false"
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
    </transition>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import { Getter } from 'vuex-class';

import Konva from 'konva';

import GameTimer from '@/components/GameTimer.vue';
import GamePin from '@/components/GamePin.vue';
import GameMap from '@/components/GameMap.vue';

import { Map } from '@/store/maps/types';

@Component({
  components: {
    GameTimer,
    GamePin,
    GameMap,
  },
})
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

  timer = 0;

  isRunning = false;

  displayHelp = true;

  toGuess: string[] = [];

  numberToGuess = 10;

  successCount = 0;

  failureCount = 0;

  mapSize = { width: 0, height: 0 };

  pinHovered = false;

  image: HTMLImageElement | null = null;

  onPinClick(isAnswer: boolean) {
    if (isAnswer) {
      this.successCount += 1;
    } else {
      this.failureCount += 1;
    }
    this.toGuess = this.toGuess.slice(1);
    if (this.toGuess.length === 0) {
      this.isRunning = false;
    }
  }

  onRetry() {
    this.failureCount = 0;
    this.successCount = 0;
    this.timer = 0;
    this.setToGuess();
  }

  @Watch('map', { immediate: true })
  onMapChange() {
    if (this.map && this.$refs.wrapper) {
      this.setToGuess();
      this.resizeCanvas();
    }
  }

  resizeCanvas() {
    if (this.$refs.wrapper.clientWidth >= this.$refs.wrapper.clientHeight) {
      this.mapSize = {
        height: (this.$refs.wrapper.clientHeight * 0.98),
        width: this.$refs.wrapper.clientHeight * 0.98 * this.map.mapRatio,
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

  setToGuess() {
    const shuffled = [...this.map.places.map((p) => p.callout)];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, this.numberToGuess);
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
    width: 150px;
    max-width: 20%;
    text-align: center;
    padding: 1rem;
    background-color: $green;
    clip-path: polygon(0 0, 100% 0%, 75% 100%, 0% 90%);
  }
  .failure-count {
    width: 150px;
    max-width: 20%;
    text-align: center;
    padding: 1rem;
    background-color: $red;
    clip-path: polygon(0 0, 100% 0%, 100% 90%, 25% 100%);
  }
  .retry {
    cursor: pointer;
  }
  .message {
    margin: 0;
    margin: 1rem;
  }
  .center-item {
    padding: .5rem 0 1rem 0;
    .button {
      margin-top: -1rem;
      margin-bottom: -0.5rem;
    }
  }
  .top-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateY(100px);
    opacity: 0;
  }
</style>
