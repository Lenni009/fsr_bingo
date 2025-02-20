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
  <div class="card-container">
    <button>
      <img
        v-if="isCrossed"
        :src="crossUrl"
        alt="Kreuz"
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
  border: 2px solid var(--card-border-color);
  border-radius: var(--border-radius);
  user-select: none;
  cursor: pointer;
  transition: border-color var(--transition);

  &:has(:hover, :focus-visible) {
    border-color: var(--fsr-color-dark);
  }

  button {
    all: unset;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .btn-text {
      --font-size: clamp(0.5rem, 2.5vw, 1rem);
      margin: 1rem;
      text-align: center;
      font-size: var(--font-size);
      line-height: calc(var(--font-size) * var(--font-size));
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
