import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private http: HttpClient ) { }

  createShortenLink(form) {
      return this.http.get<any>(`https://api.shrtco.de/v2/shorten?url=${form['link']}`);
  }

}
