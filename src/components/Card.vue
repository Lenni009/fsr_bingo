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
    <button @click="emit('cross')">
      <img
        v-if="isCrossed"
        :src="crossUrl"
        alt="Cross"
        class="cross"
      />
      <span class="btn-text">{{ text }}</span>
    </button>
  </div>
</template>

<style scoped>
.card-container {
  container-type: inline-size;
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
  background-color: var(--card-background-color);
  color: var(--card-text-color);
  border-color: white;
  border-radius: 1rem;
  user-select: none;

  button {
    all: unset;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .btn-text {
      margin: 1rem;
      text-align: center;
    }
  }

  .cross {
    position: absolute;
    top: 0;
    left: 0;
    width: 100cqw;
    aspect-ratio: 1;
  }
}
</style>
