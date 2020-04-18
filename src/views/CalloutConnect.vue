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

  @Getter('getMap', { namespace: 'maps' })
  getMap!: (mapSlug: string) => Map;

  get map() {
    return this.getMap(this.mapSlug);
  }

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

  get tagsLayer() {
    return (this.$refs.tags as Vue & { getNode: () => Konva.Layer }).getNode();
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
</style>
