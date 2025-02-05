var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { Card } from "./classes/Card";
import { Sheet } from "./classes/Sheet";
import { CardStatus } from "./enums/CardStatus";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
// util
function getId(_id) {
    return document.getElementById(_id);
}
function getClass(_class) {
    return document.getElementsByClassName(_class)[0];
}
function getRandomItemsFromArray(_arr, _amount) {
    var _a;
    var shuffled = __spreadArray([], _arr, true);
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [shuffled[j], shuffled[i]], shuffled[i] = _a[0], shuffled[j] = _a[1];
    }
    return shuffled.slice(0, _amount);
}
// database 
var firebaseConfig = {
    apiKey: "AIzaSyAqzoauehtKmiurmLo7y0gUFlDanwirGag",
    authDomain: "fsr-bingo.firebaseapp.com",
    projectId: "fsr-bingo",
    storageBucket: "fsr-bingo.firebasestorage.app",
    messagingSenderId: "983238781700",
    appId: "1:983238781700:web:8013ee2dd4f911f9ca7e51"
};
var app = initializeApp(firebaseConfig);
var db = getFirestore(app);
// initialize selectors
var sheet = getClass("sheet");
// render sheet for the first time
function displaySheet(_sheet) {
    var cards = _sheet.getCards();
    var _loop_1 = function (i) {
        var _loop_2 = function (k) {
            var cardDom = document.createElement("div");
            cardDom.id = "card" + i + "" + k;
            cardDom.classList.add("card");
            cardDom.setAttribute("status", "not-selected");
            cardDom.addEventListener("click", function () { cards[i][k].toggleStatus(); updateSheet(_sheet); });
            var cardDomText = document.createElement("p");
            cardDomText.innerHTML = cards[i][k].getText();
            cardDom.appendChild(cardDomText);
            sheet.appendChild(cardDom);
        };
        for (var k = 0; k < cards[i].length; k++) {
            _loop_2(k);
        }
    };
    for (var i = 0; i < cards.length; i++) {
        _loop_1(i);
    }
}
// update sheet after card status change
function updateSheet(_sheet) {
    var cards = _sheet.getCards();
    for (var i = 0; i < cards.length; i++) {
        for (var k = 0; k < cards[i].length; k++) {
            var curCard = getId("card" + i + "" + k);
            if (curCard.getAttribute("status") == "selected" && cards[i][k].getStatus() === CardStatus.OPEN) {
                curCard.setAttribute("status", "not-selected");
            }
            else if (curCard.getAttribute("status") == "not-selected" && cards[i][k].getStatus() === CardStatus.CHECKED) {
                curCard.setAttribute("status", "selected");
            }
        }
    }
    if (_sheet.checkForBingo()) {
        var bingoEl = document.createElement("p");
        bingoEl.innerHTML = "BINGO!";
        getClass("sheet").appendChild(bingoEl);
        var cards_1 = _sheet.getCards();
        for (var i = 0; i < cards_1.length; i++) {
            for (var k = 0; k < cards_1[i].length; k++) {
                var curCard = getId("card" + i + "" + k);
                curCard.replaceWith(curCard.cloneNode(true)); // remove listeners
            }
        }
    }
}
function getTextsFromDb() {
    return __awaiter(this, arguments, void 0, function (_amount) {
        var cardTexts_1, cardsCollectionRef, querySnapshot, chosenCardTexts, e_1;
        if (_amount === void 0) { _amount = 25; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    cardTexts_1 = [];
                    cardsCollectionRef = collection(db, 'cards');
                    return [4 /*yield*/, getDocs(cardsCollectionRef)];
                case 1:
                    querySnapshot = _a.sent();
                    querySnapshot.forEach(function (doc) {
                        cardTexts_1.push(doc.data().text);
                    });
                    chosenCardTexts = getRandomItemsFromArray(cardTexts_1, _amount);
                    return [2 /*return*/, chosenCardTexts];
                case 2:
                    e_1 = _a.sent();
                    console.error("Error: ", e_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function generateSheet(_texts) {
    var cards = [];
    var curRow = [];
    for (var i = 0; i < _texts.length; i++) {
        if ((i / Math.sqrt(_texts.length) % 0)) { // todo: make this less insane
            cards.push(curRow);
            curRow = [];
        }
        var card = new Card(_texts[i]);
        curRow.push(card);
    }
    var sheet = new Sheet(cards, cards.length);
    return sheet;
}
var exampleCards = [
    [new Card("Adde hat eine Idee"), new Card("Jemand vergisst einen GO-Antrag"), new Card("Wahl wird verschoben"), new Card("Die Redeordnung wird nicht eingehalten"), new Card("Jemand geht früher")],
    [new Card("Sitzungspause geht länger als gedacht"), new Card("Jemand aus einem Amt fehlt"), new Card("Nela muss eine Diskussion beenden"), new Card("Eine Mate wird geöffnet"), new Card("Die Technik geht nicht")],
    [new Card("Adde hat eine Idee"), new Card("Jemand vergisst einen GO-Antrag"), new Card("Wahl wird verschoben"), new Card("Die Redeordnung wird nicht eingehalten"), new Card("Jemand geht früher")],
    [new Card("Sitzungspause geht länger als gedacht"), new Card("Jemand aus einem Amt fehlt"), new Card("Nela muss eine Diskussion beenden"), new Card("Eine Mate wird geöffnet"), new Card("Die Technik geht nicht")],
    [new Card("Adde hat eine Idee"), new Card("Jemand vergisst einen GO-Antrag"), new Card("Wahl wird verschoben"), new Card("Die Redeordnung wird nicht eingehalten"), new Card("Jemand geht früher")]
];
var exampleSheet = new Sheet(exampleCards, 5);
displaySheet(exampleSheet);
updateSheet(exampleSheet);
