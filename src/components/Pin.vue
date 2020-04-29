<template>
  <v-circle
    ref="pin"
    :config="{
      fill: 'whitesmoke',
      x: pin.x,
      y: pin.y,
      radius: 5,
      hitStrokeWidth: 10,
    }"
    @click="onClick"
    @touchstart="onClick"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import Konva from 'konva';

@Component({})
export default class Pin extends Vue {
  @Prop({
    required: true,
    type: Object,
  })
  pin!: { x: number; y: number; callout: string };

  @Prop({
    required: true,
    type: Boolean,
  })
  isActive!: boolean;

  @Prop({
    required: true,
    type: Boolean,
  })
  isAnswer!: boolean;

  $refs!: {
    pin: Vue & { getNode: () => Konva.Node };
  }

  onClick() {
    if (this.isActive) {
      const pin = this.$refs.pin.getNode();
      const anim = new Konva.Animation((frame) => {
        if (frame) {
          const scale = 0.7 * Math.sin((frame.time * 2 * Math.PI) / 800) + 1;
          pin.scale({ x: scale, y: scale });
        }
      }, pin.getLayer());
      const color = this.isAnswer ? '#24e8ad' : '#ff4655';
      pin.fill(color);
      anim.start();
      setTimeout(() => {
        anim.stop();
        pin.fill('whitesmoke');
        pin.draw();
      }, 400);
      this.$emit('click', this.isAnswer);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
