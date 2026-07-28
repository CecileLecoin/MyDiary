import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { MoodService } from '../../services/mood.service';

@Component({
  selector: 'app-humeur',
  standalone: true,
  imports: [FormsModule, CommonModule, MatChipsModule],
  templateUrl: './humeur.component.html',
  styleUrl: './humeur.component.scss'
})
export class HumeurComponent {

  moods: any[] = [];

  selectedMood = '';

  emotions: any[] = [];
  selectedEmotions: string[] = [];
  emojiMood!: (humeur: string) => string;

  constructor(
    private moodService: MoodService
  ) {}

  ngOnInit(): void {

    this.moodService
      .getMoods()
      .subscribe((data: any) => {

        this.moods = data;

        this.emojiMood = (humeur: string): string => {

          switch(humeur) {

            case 'Super':
              return '😁';

            case 'Bien':
              return '🙂';

            case 'Mouais':
              return '😕';

            case 'Mauvais':
              return '😞';

            case 'Horrible':
              return '😡';

            default:
              return '🌸';
          }

        }

      });
  }

  loadEmotions() {

    this.selectedEmotions = [];

    if (!this.selectedMood) {
      this.emotions = [];
      return;
    }

    this.moodService.saveDailyMood(this.selectedMood)
      .subscribe();

    this.moodService
      .getEmotionsByMood(
        this.selectedMood
      )
      .subscribe((data: any[]) => {

        this.emotions = data;
        this.selectedEmotions = data
          .filter((item) => Boolean(item.selected))
          .map((item) => item.emotion);

      });
  }

  onEmotionSelectionChange(
    emotion: string,
    event: MatChipSelectionChange
  ) {
    if (!this.selectedMood || !event.isUserInput) {
      return;
    }

    if (event.selected) {
      if (!this.selectedEmotions.includes(emotion)) {
        this.selectedEmotions.push(emotion);
      }

      this.moodService
        .addEmotion(this.selectedMood, emotion)
        .subscribe({
          error: () => {
            this.selectedEmotions = this.selectedEmotions
              .filter((item) => item !== emotion);
          }
        });

      return;
    }

    this.selectedEmotions = this.selectedEmotions
      .filter((item) => item !== emotion);

    this.moodService
      .deleteEmotion(this.selectedMood, emotion)
      .subscribe({
        error: () => {
          if (!this.selectedEmotions.includes(emotion)) {
            this.selectedEmotions.push(emotion);
          }
        }
      });
  }

  isEmotionSelected(emotion: string) {
    return this.selectedEmotions.includes(emotion);
  }
}