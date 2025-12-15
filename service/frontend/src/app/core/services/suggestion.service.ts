import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suggestion } from '../../models/suggestion';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  private suggestionUrl = 'http://localhost:3000/suggestions';
  private favorites: Suggestion[] = [];

  constructor(private http: HttpClient) {}

  getAll(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(this.suggestionUrl);
  }

  getById(id: number): Observable<Suggestion> {
    return this.http.get<Suggestion>(`${this.suggestionUrl}/${id}`);
  }

  create(suggestion: Suggestion): Observable<Suggestion> {
    return this.http.post<Suggestion>(this.suggestionUrl, suggestion);
  }

  update(id: number, suggestion: Suggestion): Observable<Suggestion> {
    return this.http.put<Suggestion>(`${this.suggestionUrl}/${id}`, suggestion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.suggestionUrl}/${id}`);
  }

  incrementLikes(id: number): Observable<Suggestion> {
  return this.http.post<Suggestion>(`${this.suggestionUrl}/${id}/like`, {});
}

  getByCategory(category: string): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(`${this.suggestionUrl}/category/${category}`);
  }

  getByStatus(status: string): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(`${this.suggestionUrl}/status/${status}`);
  }

  addToFavorites(s: Suggestion): void {
    if (!this.isFavorite(s.id)) {
      this.favorites.push(s);
    }
  }

  isFavorite(id: number): boolean {
    return this.favorites.some(fav => fav.id === id);
  }

  getFavorites(): Suggestion[] {
    return this.favorites;
  }

  addSuggestion(suggestion: Suggestion): Observable<Suggestion> {
    return this.http.post<Suggestion>(this.suggestionUrl, suggestion);
  }

  updateSuggestion(id: number, s: Suggestion): void {
    this.update(id, s).subscribe();
  }


}
