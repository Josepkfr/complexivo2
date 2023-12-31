import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  constructor(private http: HttpClient) { }
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private url = environment.API_URL + '/actividades';
  private url2 = environment.API_URL + '/project';
  private url3 = environment.API_URL + '/activities';
  private url4 = environment.API_URL + '/goals';

  public addActividades(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.url}/create`, data,
      this.httpOptions
    );
  }
  public getActividades(): Observable<any> {

    return this.http.get<any>(
      `${this.url}/`,
      this.httpOptions
    );
  }
  public getAllActivities(): Observable<any> {

    return this.http.get<any>(
      `${this.url3}/`,
      this.httpOptions
    );
  }
  public getActividadesById(id:any): Observable<any> {

    return this.http.get<any>(
      `${this.url}/${id}`,
      this.httpOptions
    );
  }
  
  public getAllActivitiesById (id:any): Observable<any> {

    return this.http.get<any>(
      `${this.url3}/${id}`,
      this.httpOptions
    );
  }

  public getAllGoalssById (id:any): Observable<any> {

    return this.http.get<any>(
      `${this.url3}/${id}`,
      this.httpOptions
    );
  }
  public updateActividades(id: any, data: any): Observable<any> {

    return this.http.put(
      `${this.url}/update/${id}`, data, this.httpOptions
    );
  }

  public deleteActividadesById(id: any): Observable<any> {

    return this.http.delete<any>(
      `${this.url}/delete/${id}`, this.httpOptions
    );

  }
  public getProyecto(): Observable<any> {

    return this.http.get<any>(
      `${this.url2}/`,
      this.httpOptions
    );
  }
  public getProyectoById(id:number): Observable<any> {

    return this.http.get<any>(
      `${this.url2}/${id}`,
      this.httpOptions
    );
  }
}
