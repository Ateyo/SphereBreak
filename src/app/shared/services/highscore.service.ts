import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Highscore } from '../interfaces/highscore.interface';

@Injectable({
  providedIn: 'root'
})
export class HighscoreService {
  private getApiUrl = environment.url + 'get-scores.php';
  private saveApiUrl = environment.url + 'save-score.php';
  private apiKey = environment.apiKey;

  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-API-Key': this.apiKey
    });
  }

  loadHighscores(): Observable<Highscore[]> {
    return this.http.get<Highscore[]>(this.getApiUrl, {
      headers: this.getHeaders()
    });
  }

  addHighscore(
    initials: string,
    score: number,
    level: number
  ): Observable<any> {
    const newHighscore = { initials, score, level };
    return this.http.post(this.saveApiUrl, newHighscore, {
      headers: this.getHeaders()
    });
  }
}
