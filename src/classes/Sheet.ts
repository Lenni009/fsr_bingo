import { CardStatus } from "../enums/CardStatus";
import { Card } from "./Card";

export class Sheet {

  private cards: Card[][] = [];
  private sheetSize: number = 5;

  constructor(_cards: Card[][], _sheetSize = 5) {
    this.cards = _cards;
    this.sheetSize = _sheetSize;
  }

  public getCards(): Card[][] {
    return this.cards;
  }

  public checkForBingo(): boolean {
    let consecutiveCheckedCards: number = 0;
    
    // Horizontal
    for (let i = 0; i < this.sheetSize; i++) {
      for (let k = 0; k < this.sheetSize; k++) {
        if (this.cards[i][k].getStatus() == CardStatus.CHECKED) {
          consecutiveCheckedCards++;
        }
        else {
          consecutiveCheckedCards = 0;
          break;
        }
      }
      if (consecutiveCheckedCards == 5) {
        return true;
      }
    }

    // Vertical
    for (let i = 0; i < this.sheetSize; i++) {
      for (let k = 0; k < this.sheetSize; k++) {
        if (this.cards[k][i].getStatus() == CardStatus.CHECKED) {
          consecutiveCheckedCards++;
        }
        else {
          consecutiveCheckedCards = 0;
          break;
        }
      }
      if (consecutiveCheckedCards == 5) {
        return true;
      }
    }

    // Diagonal
    for (let i = 0; i < this.sheetSize; i++) {
      if (this.cards[i][i].getStatus() == CardStatus.CHECKED) {
        consecutiveCheckedCards++;
      }
      else {
        consecutiveCheckedCards = 0;
        break;
      }
    }
    if (consecutiveCheckedCards == 5) {
      return true;
    }

    for (let i = 0; i < this.sheetSize; i++) {
      if (this.cards[i][(this.sheetSize - 1) - i].getStatus() == CardStatus.CHECKED) {
        consecutiveCheckedCards++;
      }
      else {
        consecutiveCheckedCards = 0;
        break;
      }
    }
    if (consecutiveCheckedCards == 5) {
      return true;
    }

    return false;
  }
  
}