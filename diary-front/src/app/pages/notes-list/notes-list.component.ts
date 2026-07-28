import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.scss'
})
export class NotesListComponent
  implements OnInit {

  notes: any[] = [];
  searchTerm = '';

  constructor(
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes() {
    this.noteService.getAll(this.searchTerm)
      .subscribe(data => {
        this.notes = data;
      });
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement | null)
      ?.value ?? '';

    this.searchTerm = value;
    this.loadNotes();
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadNotes();
  }
}
