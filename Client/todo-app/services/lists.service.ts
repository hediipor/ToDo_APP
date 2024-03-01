import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../Models/ListResponseModel';
import { ResponseModel } from '../Models/ResponseModel';
import { List } from '../Models/Lists';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  readonly apiURL: string = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  refreshLists(): Observable<ListResponseModel<List>> {
    return this.http.get<ListResponseModel<List>>(this.apiURL + '/getlists');
  }

  getListById(id: String): Observable<ResponseModel> {
    const url = `${this.apiURL}/getListById/${id}`;
    console.log(url);
    return this.http.get<ResponseModel>(url).pipe();
  }

  deleteList(ListID: String): Observable<unknown> {
    const url = `${this.apiURL}/deleteList/${ListID}`;
    console.log('Delete URL : ', url);
    alert('List deleted successfully');
    return this.http.delete(url);
  }

  addCardsToList(listId: String, cards: String[]): Observable<any> {
    const url = `${this.apiURL}/addCards/${listId}`;
    return this.http.post(url, { cards });
  }

  deleteCardFromList(listId: String, cardName: String): Observable<any> {
    const url = `${this.apiURL}/deleteCard/${listId}/${cardName}`;
    return this.http.delete(url);
  }

  updateCard(
    listId: String,
    cardName: String,
    newName: String
  ): Observable<any> {
    const url = `${this.apiURL}/updateCard/${listId}/${cardName}`;
    return this.http.put(url, { newName });
  }
}
