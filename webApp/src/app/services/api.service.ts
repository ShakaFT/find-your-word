import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/user/login`, {
      email: email,
      password: password
    }, {
      headers: new HttpHeaders({
        api_key: environment.API_KEY
      }
      )
    })
  }
}
