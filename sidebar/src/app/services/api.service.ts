// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RxJS
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private _httpClient: HttpClient) {}

  getData() {
    return this._httpClient.get<IDataMeta>("../../assets/data/data.json").pipe(
      map(res => res.data)
    );
  }
}
