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
  }))
);

const paginatedCards = paginate(cardObjects, bingoSize);

function cross(card: ICard) {
  card.isCrossed = !card.isCrossed;
}

watchEffect(() => {
  if (isBingo.value) bingoDialog.value?.showModal();
});

watchEffect(() => {
  const results: boolean[] = [];

  // one row full
  results.push(paginatedCards.some((row) => row.every((card) => card.isCrossed)));

  // one column full
  const colsTicked: boolean[] = [];
  for (let colIdx = 0; colIdx < (paginatedCards[0]?.length ?? 0); colIdx++) {
    const colTickedStatus: boolean[] = [];

    for (const row of paginatedCards) {
      colTickedStatus.push(row[colIdx].isCrossed);
    }
    colsTicked.push(colTickedStatus.every(Boolean));
  }
  results.push(colsTicked.some(Boolean));

  // diagonal
  const diagonalTicked: boolean[] = [];
  const identityCrossed: boolean[] = [];
  const antiIdentityCrossed: boolean[] = [];
  for (let rowIdx = 0; rowIdx < paginatedCards.length; rowIdx++) {
    // top-left to bottom-right
    identityCrossed.push(paginatedCards[rowIdx][rowIdx].isCrossed);

    // bottom-right to top-left
    // .length returns 1-based, so we need to subtract 1
    const antiIdentityIndex = paginatedCards[rowIdx].length - 1 - rowIdx;
    antiIdentityCrossed.push(paginatedCards[rowIdx][antiIdentityIndex].isCrossed);
  }
  const isIdentityCrossed = identityCrossed.every(Boolean);
  const isAntiIdentityCrossed = antiIdentityCrossed.every(Boolean);

  diagonalTicked.push(isIdentityCrossed, isAntiIdentityCrossed);
  results.push(diagonalTicked.some(Boolean));

  // final bingo evaluation
  isBingo.value = results.some(Boolean);
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
            alt="Bingo! Schriftzug"
            src="./assets/bingo.png"
          />
          <form method="dialog">
            <button class="hide-bingo-btn">Zurück zum Spiel</button>
          </form>
        </div>
      </dialog>
      <div
        class="card-grid"
        :style="`--bingo-size: ${bingoSize}`"
      >
        <Card
          v-for="card in cardObjects"
          v-bind="card"
          :key="card.text"
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
  grid-template-columns: repeat(var(--bingo-size), 1fr);
  gap: 1rem;
  flex: 1;
}

.main-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5rem;
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
    font-size: 2rem;
    padding: 1rem;
    background-color: var(--fsr-color-light);
    border: 2px solid var(--fsr-color-medium);
    border-radius: var(--border-radius);
    color: var(--fsr-color-medium);
    transition:
      border-color 0.2s ease-in-out,
      color 0.2s ease-in-out,
      background-color 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
      background-color: var(--fsr-color-medium);
      border-color: var(--fsr-color-light);
      color: var(--fsr-color-light);
    }
  }
}
</style>
