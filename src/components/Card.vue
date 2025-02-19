<script setup lang="ts">
import { getRndInteger } from '@/helpers/randomNumber';
import type { Card } from '@/types/card';
import { crosses } from '@/variables/crosses';

defineProps<Card>();

const emit = defineEmits(['cross']);

const amountOfCrosses = crosses.length;
const randomCrossId = getRndInteger(0, amountOfCrosses);

const crossUrl = crosses[randomCrossId];
</script>

<template>
  <div class="card-container">
    <img
      v-if="isCrossed"
      :src="crossUrl"
      alt="Cross"
      class="cross"
    />
    <button @click="emit('cross')">
      {{ text }}
    </button>
  </div>
</template>

<style scoped>
.card-container {
  container-type: inline-size;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  .cross {
    display: absolute;
    top: 0;
    left: 0;
    width: 100cqw;
    aspect-ratio: 1;
  }
}
</style>
