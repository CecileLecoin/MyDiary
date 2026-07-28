import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { NotesListComponent } from './pages/notes-list/notes-list.component';
import { NoteFormComponent } from './pages/note-form/note-form.component';
import { HumeurComponent } from './pages/humeur/humeur.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'notes',
    component: NotesListComponent
  },
  {
    path: 'new-note',
    component: NoteFormComponent
  },
  {
    path: 'moods',
    component: HumeurComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];