import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListsService } from '../../services/lists.service';
import { List } from '../../Models/Lists';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'todo-app';
  readonly apiURL: string = 'http://localhost:3001';
  lists!: List[];
  constructor(private listService: ListsService, private http: HttpClient) {}

  ngOnInit(): void {
    this.listService.refreshLists().subscribe((data: any) => {
      this.lists = data;
      //
      console.log(this.lists);
    });
  }

  /*     addList() {
    const newListName = <HTMLInputElement>document.getElementById('newList');
    const requestBody = { name: newListName };
    const newList = { _id: '', listName: newListName.value, cards: [] };
    this.listService
      .addList(requestBody)
      .subscribe((list) => this.lists.push(list));
  } */
  addList() {
    const url = this.apiURL + '/addList';
    const newList = (<HTMLInputElement>document.getElementById('newList'))
      .value;
    const requestBody = { name: newList };
    this.http.post(url, requestBody).subscribe((data: any) => {
      alert(data.body);
      this.listService.refreshLists();
    });
  }

  /* getCradsForList(lists: List[]) {
    for(let item of lists) {
      for (let  card of item.cards){
        
      }

    }
  } */
}
