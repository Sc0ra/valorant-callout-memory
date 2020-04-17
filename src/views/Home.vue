<template>
  <div class="home" :class="{'drag-hovered': dragHovered}">
    <v-stage
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
        <v-circle :config="{
          fill: 'red',
          x: pin.x,
          y: pin.y,
          radius: 5,
        }"
        />
      </v-layer>
      <v-layer ref="tags">
        <v-group
          :config="{
            draggable: true,
          }"
          @mouseenter="dragHovered = true"
          @mouseleave="dragHovered = false"
          @dragend="onDragEnd"
        >
          <v-rect :config="{
            x: 20,
            y: 50,
            width: 80,
            height: 30,
            fill: 'whitesmoke',
            cornerRadius: 10,
          }"
          />
          <v-text :config="{
            x: 20,
            y: 50,
            text: 'Long A',
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
import { Component, Vue } from 'vue-property-decorator';
import Konva from 'konva';

@Component({})
export default class Home extends Vue {
  stageConfig = {
    width: window.innerWidth,
    height: window.innerHeight - 56,
  };

  dragHovered = false;

  image: HTMLImageElement | null = null;

  get mapTopLeftPosition() {
    return {
      x: (window.innerWidth - this.mapSize.width) / 2,
      y: 56,
    };
  }

  mapSize = (window.innerHeight >= 900 && window.innerWidth >= 900)
    ? { width: 800, height: 800 }
    : { width: window.innerWidth * 0.9, height: window.innerWidth * 0.9 };

  get pin() {
    return {
      x: this.mapTopLeftPosition.x + 0.82 * this.mapSize.width,
      y: this.mapTopLeftPosition.y + 0.6 * this.mapSize.height,
    };
  }

  get stage() {
    return (this.$refs.stage as Vue & { getStage: () => Konva.Stage }).getStage();
  }

  get tagsLayer() {
    return (this.$refs.tags as Vue & { getNode: () => Konva.Layer }).getNode();
  }

  onDragEnd() {
    const pos = this.stage.getPointerPosition() as Konva.Vector2d;
    const group = this.tagsLayer.getAllIntersections(pos);
    const rect = group.find((shape) => shape.className === 'Rect');
    if (
      this.pin.x >= rect.absolutePosition().x
      && this.pin.x <= rect.absolutePosition().x + rect.attrs.width
      && this.pin.y >= rect.absolutePosition().y
      && this.pin.y <= rect.absolutePosition().y + rect.attrs.height
    ) {
      console.log('Good');
    } else {
      console.log('Bad');
    }
  }

  created() {
    const image = new Image();
    image.src = './maps/haven-layout-offense.svg';
    image.onload = () => {
      this.image = image;
    };
  }
}
</script>

<style lang="scss" scoped>
  .drag-hovered {
    cursor: pointer;
  }
</style>
