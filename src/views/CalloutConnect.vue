<template>
  <div
    ref="wrapper"
    class="wrapper"
  >
    <v-stage
      v-if="map"
      :config="{
        width: mapSize.width,
        height: mapSize.height,
      }"
      ref="stage"
      :class="{'drag-hovered': dragHovered}"
    >
      <v-layer ref="map">
        <v-image :config="{
          image: image,
          width: mapSize.width,
          height: mapSize.height,
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
        />
      </v-layer>
      <v-layer ref="tags">
        <v-group
          v-for="(place, i) in map.places"
          :key="place.callout"
          :config="{
            draggable: true,
          }"
          @mouseenter="dragHovered = true"
          @mouseleave="dragHovered = false"
          @dragend="onDragEnd(place, i)"
        >
          <v-rect :config="{
            x: 20 + i * 85,
            y: 50,
            width: 80,
            height: 30,
            fill: 'whitesmoke',
            cornerRadius: 10,
          }"
          />
          <v-text :config="{
            x: 20 + i * 85,
            y: 50,
            text: place.callout,
            fontFamily: 'Oswald',
            fontSize: 16,
            align: 'center',
            width: 80,
            height: 30,
            verticalAlign: 'middle'
          }"
          />
        </v-group>
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
export default class CalloutConnect extends Vue {
  @Prop({
    required: true,
    type: String,
  })
  mapSlug!: string;

  $refs!: {
    wrapper: HTMLDivElement;
    stage: Vue & { getStage: () => Konva.Stage };
    tags: Vue & { getNode: () => Konva.Layer };
  }

  @Getter('getMap', { namespace: 'maps' })
  getMap!: (mapSlug: string) => Map;

  get map() {
    return this.getMap(this.mapSlug);
  }

  dragHovered = false;

  image: HTMLImageElement | null = null;

  get mapSize() {
    if (this.$refs.wrapper) {
      console.log(this.$refs.wrapper.clientWidth);
      console.log(this.$refs.wrapper.clientHeight);
      if (this.$refs.wrapper.clientWidth >= this.$refs.wrapper.clientHeight) {
        return {
          height: this.$refs.wrapper.clientHeight * 0.9,
          width: (this.$refs.wrapper.clientHeight * 0.9) * this.map.mapRatio,
        };
      }
      return {
        width: this.$refs.wrapper.clientWidth * 0.9,
        height: (this.$refs.wrapper.clientWidth * 0.9) / this.map.mapRatio,
      };
    }
    return { width: 0, height: 0 };
  }

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

  get tagsLayer() {
    return this.$refs.tags.getNode();
  }

  onDragEnd(place: Place, index: number) {
    const pos = this.stage.getPointerPosition() as Konva.Vector2d;
    const shapes = this.tagsLayer.getAllIntersections(pos);
    const rect = shapes.find((shape) => shape.className === 'Rect');
    const correctPin = this.pins.find((pin) => pin.callout === place.callout);
    if (
      correctPin
      && correctPin.x >= rect.absolutePosition().x
      && correctPin.x <= rect.absolutePosition().x + rect.attrs.width
      && correctPin.y >= rect.absolutePosition().y
      && correctPin.y <= rect.absolutePosition().y + rect.attrs.height
    ) {
      shapes.forEach((shape) => {
        shape.absolutePosition({
          x: correctPin.x - 40,
          y: correctPin.y - 15,
        });
      });
      this.tagsLayer.batchDraw();
    } else {
      shapes.forEach((shape) => {
        shape.absolutePosition({
          x: 20 + index * 85,
          y: 50,
        });
      });
      this.tagsLayer.batchDraw();
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
}
</script>

<style lang="scss" scoped>
  .drag-hovered {
    cursor: pointer;
  }
  .wrapper {
    height: 100%;
  }
  .stage::v-deep .konvajs-content {
      margin: auto;
  }
</style>
