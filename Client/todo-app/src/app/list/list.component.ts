import { Component, OnInit } from '@angular/core';
import { List } from '../../../Models/Lists';
import { ListsService } from '../../../services/lists.service';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'list',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    DragDropModule,
    CardComponent,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  lists!: List[];
  CurrentList!: List;
  newListName: string = '';

  constructor(private listService: ListsService) {}

  ngOnInit(): void {
    this.listService.refreshLists().subscribe((data: any) => {
      this.lists = data;
    });
  }
  addList(): void {
    this.listService.addList(this.newListName).subscribe(() => {
      this.listService.refreshLists().subscribe((data: any) => {
        this.lists = data;
      });
      this.newListName = '';
    });
  }

  deleteList(listID: String) {
    this.listService.deleteList(listID).subscribe(() => {
      this.listService.refreshLists().subscribe((data: any) => {
        this.lists = data;
      });
    });
  }
  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.listService
        .addCardsToList(
          this.lists[event.container.id]._id,
          this.lists[event.container.id].cards
        )
        .subscribe();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.listService
        .addCardsToList(
          this.lists[event.container.id]._id,
          this.lists[event.container.id].cards
        )
        .subscribe();
      this.listService
        .addCardsToList(
          this.lists[event.previousContainer.id]._id,
          this.lists[event.previousContainer.id].cards
        )
        .subscribe();
    }
  }
}
