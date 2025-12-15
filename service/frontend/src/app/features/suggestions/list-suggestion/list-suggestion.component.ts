import { Component, OnInit } from '@angular/core';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css']
})
export class ListSuggestionComponent implements OnInit {

  searchText: string = '';
  suggestions: Suggestion[] = [];

  private searchSubject = new Subject<string>();

  constructor(private suggestionService: SuggestionService) {}

  ngOnInit(): void {
    this.loadSuggestions();
    this.searchSubject.pipe(
      debounceTime(300),               // attendre 300ms après la dernière frappe
      distinctUntilChanged(),          // ignorer si le texte n'a pas changé
      switchMap((text: string) => this.searchServer(text))
    ).subscribe({
      next: data => this.suggestions = data,
      error: err => console.error(err)
    });
  }

  loadSuggestions(): void {
    this.suggestionService.getAll().subscribe({
      next: data => this.suggestions = data,
      error: err => console.error(err)
    });
  }

  searchSuggestions(): void {
    this.searchSubject.next(this.searchText.trim().toLowerCase());
  }

  private searchServer(text: string) {
    if (!text) {
      return this.suggestionService.getAll();
    }
    const statuses = ['acceptee', 'refusee', 'en_attente'];
    if (statuses.includes(text)) {
      return this.suggestionService.getByStatus(text);
    } else {
      return this.suggestionService.getByCategory(text);
    }
  }

  incrementLikes(s: Suggestion): void {
  this.suggestionService.incrementLikes(s.id).subscribe({
    next: updated => {
      s.nbLikes = updated.nbLikes;
    },
    error: err => console.error(err)
  });
}


  addToFavorites(s: Suggestion): void {
    if (!this.suggestionService.isFavorite(s.id)) {
      this.suggestionService.addToFavorites(s);
      alert('Suggestion ajoutée aux favoris: ' + s.title);
    } else {
      alert('Cette suggestion est déjà dans les favoris');
    }
  }

  isFavorite(s: Suggestion): boolean {
    return this.suggestionService.isFavorite(s.id);
  }

  deleteSuggestion(id: number): void {
    const confirmed = window.confirm('Voulez-vous vraiment supprimer cette suggestion ?');
    if (confirmed) {
      this.suggestionService.delete(id).subscribe(() => this.loadSuggestions());
    }
  }

}
