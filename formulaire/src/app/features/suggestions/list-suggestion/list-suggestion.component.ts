import { Component } from '@angular/core';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css']
})
export class ListSuggestionComponent {
  searchText: string = '';

  constructor(public suggestionService: SuggestionService) {}

  getFilteredSuggestions(): Suggestion[] {
    const suggestions = this.suggestionService.getAll();
    if (!this.searchText.trim()) return suggestions;

    const searchLower = this.searchText.toLowerCase();
    return suggestions.filter(s =>
      s.title.toLowerCase().includes(searchLower) ||
      s.category.toLowerCase().includes(searchLower)
    );
  }

  incrementLikes(s: Suggestion): void {
    this.suggestionService.incrementLikes(s.id);
  }

  addToFavorites(s: Suggestion): void {
    if (!this.suggestionService.isFavorite(s.id)) {
      this.suggestionService.addToFavorites(s.id);
      alert('Suggestion ajoutée aux favoris: ' + s.title);
    } else {
      alert('Cette suggestion est déjà dans les favoris');
    }
  }

  isFavorite(s: Suggestion): boolean {
    return this.suggestionService.isFavorite(s.id);
  }
}
