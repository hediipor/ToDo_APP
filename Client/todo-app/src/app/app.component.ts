import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListsService } from '../../services/lists.service';
import { List } from '../../Models/Lists';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, DragDropModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'todo-app';
  readonly apiURL: string = 'http://localhost:3001';
  lists!: List[];
  newCard: string = '';
  isEditing: Map<string, Map<string, boolean>> = new Map();
  newCardName = '';
  cdkDropListData = '';
  constructor(private listService: ListsService, private http: HttpClient) {}

  ngOnInit(): void {
    this.listService.refreshLists().subscribe((data: any) => {
      this.lists = data;
      //
      console.log(this.lists);
    });
  }

  addList() {
    const url = this.apiURL + '/addList';
    const newList = (<HTMLInputElement>document.getElementById('newList'))
      .value;
    const requestBody = { listName: newList };
    this.http.post(url, requestBody).subscribe((data: any) => {
      alert('list added succesfully');
      this.listService.refreshLists();
      window.location.reload();
    });
  }

  deleteList(listID: String) {
    console.log(listID);
    this.listService.deleteList(listID).subscribe();
    window.location.reload();
  }

  addCardsToList(listID: String) {
    const cards = [this.newCard];
    this.listService.addCardsToList(listID, cards).subscribe(() => {
      alert('Card added succesfully');
      window.location.reload();
    });
  }

  deleteCard(listId: String, cardName: String): void {
    this.listService.deleteCardFromList(listId, cardName).subscribe(() => {
      alert('Card deleted successfully');
      window.location.reload();
    });
  }

  updateCard(listId: String, cardName: String, newName: String): void {
    this.listService.updateCard(listId, cardName, newName).subscribe(() => {
      alert('Card updated successfully');
      window.location.reload();
    });
  }

  toggleEditing(listId: string, cardName: String): void {
    const innerMap = this.isEditing.get(listId) || new Map();
    innerMap.set(cardName, !innerMap.get(cardName));
    this.isEditing.set(listId, innerMap);
  }
}
