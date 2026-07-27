import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlocNote } from '../models/bloc_note';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlocnoteService {

  private api = `${environment.apiUrl}/blocnotes`;

  constructor(
    private http: HttpClient
  ) {}

  /**
   * Récupérer tous les blocs-notes
   */
  getAll(): Observable<BlocNote[]> {
    return this.http.get<BlocNote[]>(this.api);
  }

  /**
   * Récupérer un bloc-note par son id
   */
  getById(id: number): Observable<BlocNote> {
    return this.http.get<BlocNote>(
      `${this.api}/${id}`
    );
  }

  /**
   * Créer un bloc-note
   */
  create(blocnote: BlocNote): Observable<any> {
    return this.http.post(
      this.api,
      blocnote
    );
  }

  /**
   * Modifier un bloc-note
   */
  update(
    id: number,
    blocnote: BlocNote
  ): Observable<any> {

    return this.http.put(
      `${this.api}/${id}`,
      blocnote
    );
  }

  /**
   * Supprimer un bloc-note
   */
  delete(id: number): Observable<any> {
    return this.http.delete(
      `${this.api}/${id}`
    );
  }
}