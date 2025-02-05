import { CardStatus } from "../enums/CardStatus";

export class Card {

  private text: string = "";
  private status: CardStatus = CardStatus.OPEN;

  constructor(_text: string) {
    this.text = _text;
  }

  public getText(): string {
    return this.text;
  }

  public getStatus(): CardStatus {
    return this.status;
  }

  public toggleStatus(): CardStatus {
    this.status == CardStatus.OPEN ? this.status = CardStatus.CHECKED : this.status = CardStatus.OPEN;
    return this.status;
  }

}