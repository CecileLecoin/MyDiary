import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-list.component.html'
})
export class NotesListComponent
  implements OnInit {

  notes: any[] = [];

  constructor(
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes() {
    this.noteService.getAll()
      .subscribe(data => {
        this.notes = data;
      });
  }
}
