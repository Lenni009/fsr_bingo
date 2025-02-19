<script setup lang="ts">
import { cards } from '@/variables/cards';
import { randomiseArray } from '@/helpers/randomise';
import Card from '@/components/Card.vue';
import type { Card as ICard } from '@/types/card';
import { reactive, ref, watchEffect } from 'vue';
import { paginate } from '@/helpers/paginate';
import { bingoSize } from '@/variables/bingoSize';

const isBingo = ref(false);

const randomCards = randomiseArray(cards);
const cardObjects = reactive(randomCards.map<ICard>((text) => ({
  text,
  isCrossed: false,
})));

const paginatedCards = paginate(cardObjects, bingoSize);

function cross(card: ICard) {
  card.isCrossed = !card.isCrossed;
  console.log('click');
}

watchEffect(() => {
  const results: boolean[] = [];

  // one row full
  results.push(paginatedCards.some((row) => row.every((card) => card.isCrossed)));

  // one column full
  for (let colIdx = 0; colIdx < (paginatedCards[0]?.length ?? 0); colIdx++) {
    const colTickedStatus: boolean[] = [];

    for (const row of paginatedCards) {
      colTickedStatus.push(row[colIdx].isCrossed);
    }

    results.push(colTickedStatus.every(Boolean));
  }

  // diagonal
  for (let rowIdx = 0; rowIdx < paginatedCards.length; rowIdx++) {
    const colTickedStatus: boolean[] = [];

    // top-left to bottom-right
    const isIdentityCrossed = paginatedCards[rowIdx][rowIdx].isCrossed;

    // bottom-right to top-left
    // .length returns 1-based, so we need to subtract 1
    const antiIdentityIndex = paginatedCards[rowIdx].length - 1 - rowIdx;
    const isAntiIdentityCrossed = paginatedCards[rowIdx][antiIdentityIndex].isCrossed;

    colTickedStatus.push(isIdentityCrossed || isAntiIdentityCrossed);
    results.push(colTickedStatus.every(Boolean));
  }

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

    <main class="card-grid">
      <Card
        v-for="card in cardObjects"
        v-bind="card"
        :key="card.text"
        @cross="cross(card)"
      />
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
  max-width: 100%;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

main {
  margin-bottom: 5rem;
}
</style>
