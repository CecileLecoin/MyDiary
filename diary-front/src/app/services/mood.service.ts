import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  private api = `${environment.apiUrl}/moods`;

  constructor(
    private http: HttpClient
  ) {}

  getMoods() {
    return this.http.get(this.api);
  }

  createMood(humeur: string) {
    return this.http.post(this.api, {
      humeur
    });
  }

  getEmotionsByMood(
    humeur: string
  ) {
    return this.http.get(
      `${this.api}/${humeur}/emotions`
    );
  }

  addEmotion(
    humeur: string,
    emotion: string
  ) {
    return this.http.post(
      `${this.api}/emotions-sous-jacentes`,
      {
        humeur,
        emotion
      }
    );
  }
}
