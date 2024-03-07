import { Component, OnInit } from '@angular/core';
import { List } from '../../../Models/Lists';
import { ListsService } from '../../../services/lists.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
    if (this.newListName.trim() !== '') {
      this.listService.addList(this.newListName).subscribe(
        () => {
          this.listService.refreshLists().subscribe((data: any) => {
            this.lists = data;
          });
          this.newListName = '';
        },
        (error) => {
          console.error('Error adding list:', error);
        }
      );
    } else {
      alert('List name cannot be empty');
    }
  }

  deleteList(listID: String) {
    this.listService.deleteList(listID).subscribe(() => {
      this.listService.refreshLists().subscribe((data: any) => {
        this.lists = data;
      });
    });
  }
}
