import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListResponseModel } from '../Models/ListResponseModel';
import { ResponseModel } from '../Models/ResponseModel';
import { List } from '../Models/Lists';
import { environment } from '../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  apiURL = environment.apiURL;
  constructor(private http: HttpClient) {}

  refreshLists(): Observable<ListResponseModel<List>> {
    return this.http.get<ListResponseModel<List>>(this.apiURL + '/list');
  }
  getListById(id: String): Observable<ResponseModel> {
    const url = `${this.apiURL}/list/${id}`;
    return this.http.get<ResponseModel>(url).pipe();
  }
  addList(listName: string): Observable<ListResponseModel<List>> {
    const requestBody = { listName: listName };
    return this.http.post<ListResponseModel<List>>(
      `${this.apiURL}/list`,
      requestBody
    );
  }

  deleteList(ListID: String): Observable<unknown> {
    const url = `${this.apiURL}/list/${ListID}`;

    return this.http.delete(url);
  }

  addCardToList(listId: String, card: String): Observable<any> {
    const url = `${this.apiURL}/card/${listId}`;
    return this.http.post(url, { card });
  }

  addCardsToList(listId: String, cards: String[]): Observable<any> {
    const url = `${this.apiURL}/card/${listId}`;
    return this.http.put(url, { cards });
  }

  deleteCardFromList(listId: String, cardName: String): Observable<any> {
    const url = `${this.apiURL}/card/${listId}/${cardName}`;
    return this.http.delete(url);
  }

  updateCard(
    listId: String,
    cardName: String,
    newName: String
  ): Observable<any> {
    const url = `${this.apiURL}/card/${listId}/${cardName}`;
    return this.http.put(url, { newName });
  }
}
