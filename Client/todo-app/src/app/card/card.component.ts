import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ListsService } from '../../../services/lists.service';
import { List } from '../../../Models/Lists';

@Component({
  selector: 'card',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, DragDropModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() CurrentList!: List;
  newCard: string = '';
  isEditing: Map<string, Map<string, boolean>> = new Map();
  newCardName = '';
  cdkDropListData = '';

  constructor(private listService: ListsService) {}

  addCardsToList(listID: String) {
    const card = this.newCard;
    this.listService.addCardToList(listID, card).subscribe((card) => {
      this.CurrentList.cards.push(card);
      this.newCard = '';
    });
  }

  deleteCard(listId: String, cardName: String): void {
    this.listService.deleteCardFromList(listId, cardName).subscribe(() => {
      this.CurrentList.cards = this.CurrentList.cards.filter(
        (card) => card !== cardName
      );
    });
  }

  updateCard(listId: String, cardName: String, newName: String): void {
    this.listService.updateCard(listId, cardName, newName).subscribe(() => {
      this.CurrentList.cards = this.CurrentList.cards.map((card) =>
        card === cardName ? newName : card
      );
    });
  }

  toggleEditing(listId: string, cardName: String): void {
    const innerMap = this.isEditing.get(listId) || new Map();
    innerMap.set(cardName, !innerMap.get(cardName));
    this.isEditing.set(listId, innerMap);
  }
}
