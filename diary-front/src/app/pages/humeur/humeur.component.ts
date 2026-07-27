import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MoodService } from '../../services/mood.service';

@Component({
  selector: 'app-humeur',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './humeur.component.html'
})
export class HumeurComponent {

  moods: any[] = [];

  selectedMood = '';

  emotions: any[] = [];

  constructor(
    private moodService: MoodService
  ) {}

  ngOnInit(): void {

    this.moodService
      .getMoods()
      .subscribe((data: any) => {

        this.moods = data;

      });
  }

  loadEmotions() {

    this.moodService
      .getEmotionsByMood(
        this.selectedMood
      )
      .subscribe((data: any) => {

        this.emotions = data;

      });
  }
}