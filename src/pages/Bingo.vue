<script setup lang="ts">
import { cards } from '@/variables/cards';
import { randomiseArray } from '@/helpers/randomise';
import Card from '@/components/Card.vue';
import type { Card as ICard } from '@/types/card';
import { ref, watchEffect } from 'vue';
import { paginate } from '@/helpers/paginate';
import { bingoSize } from '@/variables/bingoSize';

const isBingo = ref(false);

const randomCards = randomiseArray(cards);
const cardObjects = randomCards.map<ICard>((text) => ({
  text,
  isCrossed: false,
}));

const paginatedCards = paginate(cardObjects, bingoSize);

function cross(card: ICard) {
  card.isCrossed = !card.isCrossed;
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
    const isAntiIdentityCrossed = paginatedCards[rowIdx][paginatedCards[rowIdx].length - rowIdx].isCrossed;

    colTickedStatus.push(isIdentityCrossed || isAntiIdentityCrossed);
    results.push(colTickedStatus.every(Boolean));
  }

  isBingo.value = results.some(Boolean);
});
</script>

<template>
  <div class="card-grid">
    <Card
      v-for="card in cardObjects"
      v-bind="card"
      :key="card.text"
      @cross="cross(card)"
    />
  </div>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}
</style>
