<template>
  <v-image :config="{
    image,
    width,
    height,
    x: 0,
    y: 0,
  }"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class GameMap extends Vue {
  @Prop({
    required: true,
    type: String,
  })
  src!: string;

  @Prop({
    required: true,
    type: Number,
  })
  width!: number;

  @Prop({
    required: true,
    type: Number,
  })
  height!: number;

  image: HTMLImageElement | null = null;

  mapSize = { width: 0, height: 0 };


  mounted() {
    const image = new Image();
    image.src = `${process.env.BASE_URL}${this.src}`;
    image.onload = () => {
      this.image = image;
    };
  }
}
</script>

<style lang="scss" scoped>
</style>
