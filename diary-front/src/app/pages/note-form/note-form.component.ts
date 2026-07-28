import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.scss'
})
export class NoteFormComponent {

  note = {
    titre: '',
    texte: '',
    dateEtHeure: '',
    Id_BlocNote: 1
  };

  constructor(
    private noteService: NoteService
  ) {}

  createNote() {

    this.note.dateEtHeure =
      new Date().toISOString();

    this.noteService
      .create(this.note)
      .subscribe(() => {

        alert('Note créée');

        this.note = {
          titre: '',
          texte: '',
          dateEtHeure: '',
          Id_BlocNote: 1
        };
      });
  }
}
