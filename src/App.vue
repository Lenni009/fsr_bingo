<script setup lang="ts">
import { cards } from '@/variables/cards';
import { randomiseArray } from '@/helpers/randomise';
import Card from '@/components/Card.vue';
import type { Card as ICard } from '@/types/card';
import { reactive, ref, watchEffect } from 'vue';
import { paginate } from '@/helpers/paginate';
import { amountOfBingoCards, bingoSize } from '@/variables/bingoSize';

const isBingo = ref(false);

const bingoDialog = ref<HTMLDialogElement | null>(null);

const randomCards = randomiseArray(cards).slice(0, amountOfBingoCards);
const cardObjects = reactive(
  randomCards.map<ICard>((text) => ({
    text,
    isCrossed: false,
  })),
);

const paginatedCards = paginate(cardObjects, bingoSize);

function cross(card: ICard) {
  card.isCrossed = !card.isCrossed;
}

watchEffect(() => {
  if (isBingo.value) bingoDialog.value?.showModal();
});

watchEffect(() => {
  let result = false;

  // one row full
  result = paginatedCards.some((row) => row.every((card) => card.isCrossed));

  // one column full
  if (!result) {
    let isColTicked = false;
    for (let colIdx = 0; colIdx < bingoSize; colIdx++) {
      let cardsInColCrossed = 0;

      for (const row of paginatedCards) {
        if (row[colIdx].isCrossed) cardsInColCrossed++;
      }
      isColTicked = cardsInColCrossed === bingoSize;
      if (isColTicked) break;
    }
    result = isColTicked;
  }

  if (!result) {
    // diagonal
    let cardsInIdentityCrossed = 0;
    let cardsInAntiIdentityCrossed = 0;
    for (let rowIdx = 0; rowIdx < paginatedCards.length; rowIdx++) {
      // top-left to bottom-right
      if (paginatedCards[rowIdx][rowIdx].isCrossed) cardsInIdentityCrossed++;

      // bottom-right to top-left
      // .length returns 1-based, so we need to subtract 1
      const antiIdentityIndex = paginatedCards[rowIdx].length - 1 - rowIdx;
      if (paginatedCards[rowIdx][antiIdentityIndex].isCrossed) cardsInAntiIdentityCrossed++;
    }
    const isIdentityCrossed = cardsInIdentityCrossed === bingoSize;
    const isAntiIdentityCrossed = cardsInAntiIdentityCrossed === bingoSize;

    result = isIdentityCrossed || isAntiIdentityCrossed;
  }

  // final bingo evaluation
  isBingo.value = result;
});
</script>

<template>
  <div class="container">
    <header>
      <img
        alt="FSR-BIMgo Logo"
        class="main-img"
        src="./assets/logo.png"
      />
    </header>

    <main class="main-container">
      <dialog
        class="bingo-alert-wrapper"
        ref="bingoDialog"
      >
        <div class="bingo-alert">
          <img
            v-if="isBingo"
            alt="Bingo! Schriftzug"
            src="./assets/bingo.png"
          />
          <form method="dialog">
            <button class="hide-bingo-btn">Zurück zum Spiel</button>
          </form>
        </div>
      </dialog>
      <div class="card-grid">
        <Card
          v-for="(card, index) in cardObjects"
          v-bind="card"
          :key="index"
          @click="cross(card)"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  padding-inline: 1rem;
  margin-inline: auto;
}

.main-img {
  display: block;
  margin-inline: auto;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(bingoSize), 1fr);
  gap: 1rem;
  flex: 1;
}

.main-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-block-end: 5rem;
}

.bingo-alert-wrapper {
  border: none;
  background-color: transparent;

  &::backdrop {
    backdrop-filter: blur(0.1rem);
  }

  .bingo-alert {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hide-bingo-btn {
    font-size: clamp(1rem, 5vw, 2rem);
    padding: 1rem;
    background-color: var(--fsr-color-light);
    border: 2px solid var(--fsr-color-medium);
    border-radius: var(--border-radius);
    color: var(--fsr-color-medium);
    transition:
      border-color var(--transition),
      color var(--transition),
      background-color var(--transition);
    cursor: pointer;

    &:hover {
      background-color: var(--fsr-color-medium);
      border-color: var(--fsr-color-light);
      color: var(--fsr-color-light);
    }
  }
}
</style>
