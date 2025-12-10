import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {
  suggestion!: Suggestion | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.suggestion = this.suggestionService.getById(id);
    });
  }

  incrementLikes(): void {
    if (this.suggestion) {
      this.suggestionService.incrementLikes(this.suggestion.id);
    }
  }

  addToFavorites(): void {
    if (this.suggestion) {
      if (!this.suggestionService.isFavorite(this.suggestion.id)) {
        this.suggestionService.addToFavorites(this.suggestion.id);
        alert('Suggestion ajoutée aux favoris: ' + this.suggestion.title);
      } else {
        alert('Cette suggestion est déjà dans les favoris');
      }
    }
  }

  isFavorite(): boolean {
    return this.suggestion ? this.suggestionService.isFavorite(this.suggestion.id) : false;
  }

  goBack(): void {
    this.router.navigate(['/suggestions']);
  }
  goNext(): void {
  if (this.suggestion) {
    const suggestions = this.suggestionService.getAll(); 
    const currentIndex = suggestions.findIndex(s => s.id === this.suggestion!.id);

    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % suggestions.length;
      const nextSuggestion = suggestions[nextIndex];
      this.router.navigate(['/suggestions', nextSuggestion.id]);
    }
  }
}

}
