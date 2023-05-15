import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  API_URL: string = "";

  constructor(private http: HttpClient) {
    this.API_URL = environment.PRODUCTION
      ? environment.API_PROD_URL
      : environment.API_DEV_URL;
  }

  // Lifecycle

  public start(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/start`, {
      headers: new HttpHeaders({
        "api-key": environment.API_KEY,
      }),
    });
  }

  // Users

  public login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}/user/login`,
      {
        email: email,
        password: password,
      },
      {
        headers: new HttpHeaders({
          "api-key": environment.API_KEY,
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
      `${this.API_URL}/user/`,
      {
        email: email,
        password: password,
        username: username,
      },
      {
        headers: new HttpHeaders({
          "api-key": environment.API_KEY,
        }),
      }
    );
  }

  public updateUserProfile(
    email: string,
    password: string,
    username: string,
    userId: string
  ): Observable<any> {
    return this.http.put<any>(
      `${this.API_URL}/user/${userId}/profile`,
      {
        email: email,
        password: password,
        username: username,
      },
      {
        headers: new HttpHeaders({
          "api-key": environment.API_KEY,
        }),
      }
    );
  }

  public resetPassword(
    oldPassword: string,
    newPassword: string,
    userId: string
  ): Observable<any> {
    return this.http.put<any>(
      `${this.API_URL}/user/${userId}/password`,
      {
        old_password: oldPassword,
        new_password: newPassword,
      },
      {
        headers: new HttpHeaders({
          "api-key": environment.API_KEY,
        }),
      }
    );
  }

  public deleteAccount(password: string, userId: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/user/${userId}`, {
      headers: new HttpHeaders({
        "api-key": environment.API_KEY,
      }),
      body: {
        password: password,
      },
    });
  }

  // Words

  public random(lang: string, length: number): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/word/random?lang=${lang}&length=${length}`,
      {
        headers: new HttpHeaders({
          "api-key": environment.API_KEY,
        }),
      }
    );
  }

  public wordExists(lang: string, word: string): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/word/exists?lang=${lang}&word=${word}`,
      {
        headers: new HttpHeaders({
          "api-key": environment.API_KEY,
        }),
      }
    );
  }

  public dailyWordle(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/word/daily`, {
      headers: new HttpHeaders({
        "api-key": environment.API_KEY,
      }),
    });
  }

  // Scores

  public getScore(username: string, timestamp: number): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/score?username=${username}&timestamp=${timestamp}`,
      {
        headers: new HttpHeaders({
          "api-key": environment.API_KEY,
        }),
      }
    );
  }

  public sendScore(
    username: string,
    timestamp: number,
    tries: number
  ): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}/score`,
      {
        username: username,
        timestamp: timestamp,
        tries: tries,
      },
      {
        headers: new HttpHeaders({
          "api-key": environment.API_KEY,
        }),
      }
    );
  }
}
