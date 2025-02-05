import { Sheet } from "./classes/Sheet";
import { CardStatus } from "./enums/CardStatus";

function getId(_id: string): HTMLElement {
  return <HTMLElement>document.getElementById(_id);
}

// Initialize selectors
let sheet: HTMLElement = getId("sheet")!;

function displaySheet(_sheet: Sheet): void {
  let cards = _sheet.getCards();

  for (let i = 0; i < cards.length; i++) {
    for (let k = 0 ; k < cards[i].length; k++) {
      let cardDom: HTMLDivElement = document.createElement("div");
      cardDom.id = "card" + i + "" + k;
      let cardDomText: HTMLParagraphElement = document.createElement("p");
      cardDomText.innerHTML = cards[i][k].getText();
      cardDom.appendChild(cardDomText);
    }
  }
}

function updateSheet(_sheet: Sheet): void {
  let cards = _sheet.getCards();

  for (let i = 0; i < cards.length; i++) {
    for (let k = 0; k < cards[i].length; k++) {
      let cardDomSelected = getId("card" + i + "" + k).className
      if (cardDomSelected == "selected" && cards[i][k].getStatus() == CardStatus.OPEN) {
        cardDomSelected = "";
      }
      else if (cardDomSelected == "" && cards[i][k].getStatus() == CardStatus.CHECKED) {
        cardDomSelected = "selected";
      }
    }
  }
}