import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface Mood {
  humeur: string;
}

interface MoodEmotion {
  emotion: string;
  selected: number;
}

interface WeeklyMoodPoint {
  day: string;
  label: string;
  value: number;
}

export interface WeeklyMoodCount {
  humeur: string;
  count: number;
}

export interface WeeklyEmotionCount {
  emotion: string;
  count: number;
}

export interface WeeklyMoodStats {
  moodCounts: WeeklyMoodCount[];
  topEmotions: WeeklyEmotionCount[];
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  private api = `${environment.apiUrl}/moods`;

  constructor(
    private http: HttpClient
  ) {}

  getMoods(): Observable<Mood[]> {
    return this.http.get<Mood[]>(this.api);
  }

  createMood(humeur: string) {
    return this.http.post(this.api, {
      humeur
    });
  }

  getEmotionsByMood(
    humeur: string
  ): Observable<MoodEmotion[]> {
    return this.http.get<MoodEmotion[]>(
      `${this.api}/${humeur}/emotions`
    );
  }

  getWeeklyMoodAverages(): Observable<WeeklyMoodPoint[]> {
    return this.http.get<WeeklyMoodPoint[]>(
      `${this.api}/weekly-average`
    );
  }

  getWeeklyStats(): Observable<WeeklyMoodStats> {
    return this.http.get<WeeklyMoodStats>(
      `${this.api}/weekly-stats`
    );
  }

  saveDailyMood(humeur: string) {
    return this.http.post(
      `${this.api}/daily`,
      { humeur }
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

  deleteEmotion(
    humeur: string,
    emotion: string
  ) {
    return this.http.delete(
      `${this.api}/emotions-sous-jacentes/${encodeURIComponent(humeur)}/${encodeURIComponent(emotion)}`
    );
  }
}
