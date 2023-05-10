import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${environment.API_URL}/user/login`,
      {
        email: email,
        password: password,
      },
      {
        headers: new HttpHeaders({
          api_key: environment.API_KEY,
        }),
      }
    );
  }

  public signup(
    email: string,
    password: string,
    username: string
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.API_URL}/user/`,
      {
        email: email,
        password: password,
        username: username,
      },
      {
        headers: new HttpHeaders({
          api_key: environment.API_KEY,
        }),
      }
    );
  }

  public random(
    lang: string,
    length: number,
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.API_URL}/word/random?lang=${lang}&length=${length}`,
      {
        headers: new HttpHeaders({
          api_key: environment.API_KEY,
        }),
      }
    );
  }

  public wordExists(
    lang: string,
    word: string,
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.API_URL}/word/exists?lang=${lang}&word=${word}`,
      {
        headers: new HttpHeaders({
          api_key: environment.API_KEY,
        }),
      }
    );
  }
}
