<template>
  <h3 class="subtitle is-3">
    {{ value.toFixed(2) }}
  </h3>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';

@Component({})
export default class Timer extends Vue {
  @Prop({
    required: true,
    type: Number,
  })
  value!: number;

  @Prop({
    required: true,
    type: Boolean,
  })
  isRunning!: boolean;

  timer = 0;

  @Watch('isRunning', { immediate: true })
  manageTimer(value: boolean) {
    if (value) {
      this.timer = setInterval(() => {
        this.$emit('input', this.value + 0.01);
      }, 10);
    } else {
      clearInterval(this.timer);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
