import { Card } from "./classes/Card";
import { Sheet } from "./classes/Sheet";
import { CardStatus } from "./enums/CardStatus";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

// util
function getId(_id: string): HTMLElement {
  return <HTMLElement>document.getElementById(_id);
}
function getClass(_class: string): HTMLElement {
  return <HTMLElement>document.getElementsByClassName(_class)[0];
}
function getRandomItemsFromArray(_arr: string[], _amount: number): string[] {
  const shuffled = [..._arr];

  for (let i = shuffled.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  } 

  return shuffled.slice(0, _amount);
}

// database 
const firebaseConfig = {
  apiKey: "AIzaSyAqzoauehtKmiurmLo7y0gUFlDanwirGag",
  authDomain: "fsr-bingo.firebaseapp.com",
  projectId: "fsr-bingo",
  storageBucket: "fsr-bingo.firebasestorage.app",
  messagingSenderId: "983238781700",
  appId: "1:983238781700:web:8013ee2dd4f911f9ca7e51"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// initialize selectors
let sheet: HTMLElement = getClass("sheet")!;

// render sheet for the first time
function displaySheet(_sheet: Sheet): void {
  let cards = _sheet.getCards();
  for (let i = 0; i < cards.length; i++) {
    for (let k = 0 ; k < cards[i].length; k++) {
      let cardDom: HTMLDivElement = document.createElement("div");
      cardDom.id = "card" + i + "" + k;
      cardDom.classList.add("card");
      cardDom.setAttribute("status", "not-selected");
      cardDom.addEventListener("click", () => {cards[i][k].toggleStatus(); updateSheet(_sheet);});
      let cardDomText: HTMLParagraphElement = document.createElement("p"); 
      cardDomText.innerHTML = cards[i][k].getText();
      cardDom.appendChild(cardDomText);
      sheet.appendChild(cardDom);
    }
  }
}

// update sheet after card status change
function updateSheet(_sheet: Sheet): void {
  let cards = _sheet.getCards();
  for (let i = 0; i < cards.length; i++) {
    for (let k = 0; k < cards[i].length; k++) {
      let curCard = getId("card" + i + "" + k);
      if (curCard.getAttribute("status") == "selected" && cards[i][k].getStatus() === CardStatus.OPEN) {
        curCard.setAttribute("status", "not-selected");
      }
      else if (curCard.getAttribute("status") == "not-selected" && cards[i][k].getStatus() === CardStatus.CHECKED) {
        curCard.setAttribute("status", "selected");
      }
    }
  }
  if (_sheet.checkForBingo()) {
    let bingoEl: HTMLElement = document.createElement("p");
    bingoEl.innerHTML = "BINGO!";
    getClass("sheet").appendChild(bingoEl);
    let cards = _sheet.getCards();
    for (let i = 0; i < cards.length; i++) {
      for (let k = 0 ; k < cards[i].length; k++) {
        let curCard = getId("card" + i + "" + k);
        curCard.replaceWith(curCard.cloneNode(true)); // remove listeners
      }
    }
  }
}

async function getTextsFromDb(_amount: number = 25): Promise<string[]> {
  try {
    let cardTexts: string[] = [];
    const cardsCollectionRef = collection(db, 'cards');
    const querySnapshot = await getDocs(cardsCollectionRef);
    querySnapshot.forEach((doc) => {
      cardTexts.push(doc.data().text);
    });
    let chosenCardTexts: string[] = getRandomItemsFromArray(cardTexts, _amount);
    return chosenCardTexts;
  }
  catch (e) {
    console.error("Error: ", e);
    return [];
  }
}

function generateSheet(_texts: string[]): Sheet {
  let cards: Card[][] = [];
  let curRow: Card[] = [];
  for (let i = 0; i < _texts.length; i++) {
    if ((i / Math.sqrt(_texts.length) % 0)) { // todo: make this less insane
      cards.push(curRow);
      curRow = [];
    }
    let card: Card = new Card(_texts[i]);
    curRow.push(card);
  } 

  let sheet: Sheet = new Sheet(cards, cards.length);
  return sheet;
}

let exampleCards: Card[][] = [
  [new Card("Adde hat eine Idee"), new Card("Jemand vergisst einen GO-Antrag"), new Card("Wahl wird verschoben"), new Card("Die Redeordnung wird nicht eingehalten"), new Card("Jemand geht früher")],
  [new Card("Sitzungspause geht länger als gedacht"), new Card("Jemand aus einem Amt fehlt"), new Card("Nela muss eine Diskussion beenden"), new Card("Eine Mate wird geöffnet"), new Card("Die Technik geht nicht")],
  [new Card("Adde hat eine Idee"), new Card("Jemand vergisst einen GO-Antrag"), new Card("Wahl wird verschoben"), new Card("Die Redeordnung wird nicht eingehalten"), new Card("Jemand geht früher")],
  [new Card("Sitzungspause geht länger als gedacht"), new Card("Jemand aus einem Amt fehlt"), new Card("Nela muss eine Diskussion beenden"), new Card("Eine Mate wird geöffnet"), new Card("Die Technik geht nicht")],
  [new Card("Adde hat eine Idee"), new Card("Jemand vergisst einen GO-Antrag"), new Card("Wahl wird verschoben"), new Card("Die Redeordnung wird nicht eingehalten"), new Card("Jemand geht früher")]
];
let exampleSheet: Sheet = new Sheet(exampleCards, 5)
 
displaySheet(exampleSheet);
updateSheet(exampleSheet); 