import { cards } from './cards';

export const bingoSize = Math.floor(Math.sqrt(cards.length));
export const amountOfBingoCards = bingoSize ** 2;
