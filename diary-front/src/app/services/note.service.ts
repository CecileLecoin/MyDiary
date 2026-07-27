import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private api =
    'http://localhost:3000/api/notes';

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Note[]> {
    return this.http.get<Note[]>(this.api);
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
}