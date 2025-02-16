import { Card } from "./classes/Card";
import { Sheet } from "./classes/Sheet";
import { CardStatus } from "./enums/CardStatus";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";

// util
function getId(_id: string): HTMLElement | null {
  return <HTMLElement | null>document.getElementById(_id);
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
function appendEventListeners(): void {
  let submitBtn = getId("submitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", submitCardToDb);
  }
}

// database 
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
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
      let curCard = getId("card" + i + "" + k)!;
      if (curCard.getAttribute("status") == "selected" && cards[i][k].getStatus() === CardStatus.OPEN) {
        curCard.setAttribute("status", "not-selected");
        const existingImg = curCard.querySelector('img');
        if (existingImg) {
          existingImg.remove();
        }
      }
      else if (curCard.getAttribute("status") == "not-selected" && cards[i][k].getStatus() === CardStatus.CHECKED) {
        curCard.setAttribute("status", "selected");
        const img = document.createElement('img');
        img.src = "./assets/x" + Math.floor(Math.random()*4) + ".png";

        curCard.appendChild(img);
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
        let curCard = getId("card" + i + "" + k)!;
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

function submitCardToDb(): void {
  const feedbackEl = getId("feedback")!;
  feedbackEl.innerHTML = "";
  try { 
    const newCardEl: HTMLInputElement = getId("cardTextInput") as HTMLInputElement;
    const newCardText = newCardEl.value;
    const newCardObject = {
      text: newCardText
    };
    const submissionCollectionRef = collection(db, 'submissions');
    addDoc(submissionCollectionRef, newCardObject)
      .then(() => {
        feedbackEl.innerHTML = "Vorschlag wurde eingereicht! 🎉";
      })
      .catch(() => {
        feedbackEl.innerHTML = "Etwas ist schiefgegangen :( Bitte kontaktiere das Technik-Amt 😵";
      })
  }
  catch(e) {
    feedbackEl.innerHTML = "Etwas ist schiefgegangen :( Bitte kontaktiere das Technik-Amt 😵";
  }
}

function generateSheet(_texts: string[]): Sheet {
  let cards: Card[][] = [];
  let curRow: Card[] = [];
  for (let i = 0; i <= _texts.length; i++) {
    if ((i % 5 == 0) && i != 0) { // todo: make this less insane
      cards.push(curRow);
      curRow = [];
    }
    let card: Card = new Card(_texts[i]);
    curRow.push(card);
  } 
  console.log(cards);
  let sheet: Sheet = new Sheet(cards, cards.length);
  return sheet;
}

switch (document.location.href.split("/").pop()) { // todo: make this loading better because what is this
  case "submit.html": 
    appendEventListeners();
    break;
  case "bingo.html":
    displaySheet(generateSheet(await getTextsFromDb()));
    break;
  default:
    break;
}