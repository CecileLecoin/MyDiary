import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note';
import { environment } from '../../environments/environment';

export interface WordCount {
  word: string;
  count: number;
}

export interface WordStatsResponse {
  weeklyTop: WordCount[];
  allTimeTop: WordCount[];
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private api = `${environment.apiUrl}/notes`;

  constructor(
    private http: HttpClient
  ) {}

  getAll(searchTerm = ''): Observable<Note[]> {
    const params = new HttpParams()
      .set('q', searchTerm.trim());

    return this.http.get<Note[]>(
      this.api,
      { params }
    );
  }

  create(note: Note) {
    return this.http.post(this.api, note);
  }

  update(note: Note) {
    return this.http.put(this.api, note);
  }

  delete(note: Note) {
    return this.http.request(
      'delete',
      this.api,
      { body: note }
    );
  }

  getWordStats(): Observable<WordStatsResponse> {
    return this.http.get<WordStatsResponse>(
      `${this.api}/word-stats`
    );
  }
}