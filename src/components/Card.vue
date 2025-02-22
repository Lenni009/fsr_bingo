<script setup lang="ts">
import { getRndInteger } from '@/helpers/randomNumber';
import type { Card } from '@/types/card';
import { crosses } from '@/variables/crosses';

defineProps<Card>();

const amountOfCrosses = crosses.length;
const randomCrossId = getRndInteger(0, amountOfCrosses);

const crossUrl = crosses[randomCrossId];
</script>

<template>
  <button class="card-container">
    <img
      v-if="isCrossed"
      :src="crossUrl"
      alt="Kreuz"
      class="cross"
    />
    <span class="btn-text">{{ text }}</span>
  </button>
</template>

<style scoped>
.card-container {
  all: unset;
  container-type: inline-size;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
  background-color: var(--card-background-color);
  color: var(--card-text-color);
  border: 2px solid var(--card-border-color);
  border-radius: var(--border-radius);
  user-select: none;
  cursor: pointer;
  transition: border-color var(--transition);

  &:is(:hover, :focus-visible) {
    border-color: var(--fsr-color-dark);
  }

  .btn-text {
    --font-size: clamp(0.5rem, 2.5vw, 1rem);
    margin: 1rem;
    text-align: center;
    font-size: var(--font-size);
    line-height: calc(var(--font-size) * var(--font-size));
  }

  .cross {
    position: absolute;
    width: 100%;
    aspect-ratio: 1;
  }
}
</style>
