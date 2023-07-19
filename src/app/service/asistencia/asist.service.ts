import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AsistService {
  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get('http://localhost:3000/asists');
  }

  create(data: any) {
    return this.http.post('http://localhost:3000/asists', data);
  }
}
