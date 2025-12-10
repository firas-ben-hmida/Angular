import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-add-suggestion',
  templateUrl: './suggestion-form.component.html'
})
export class SuggestionFormComponent implements OnInit {

  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  suggestionForm!: FormGroup; // le ! indique qu'on initialisera dans ngOnInit

  constructor(
    private fb: FormBuilder,
    private suggestionService: SuggestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire avec FormBuilder
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[A-Z][a-zA-Z]*$')
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(30)
      ]],
      category: ['', Validators.required],
      date: [{ value: new Date().toLocaleDateString(), disabled: true }],
      status: [{ value: 'en_attente', disabled: true }]
    });
  }

  // Getters pour accéder facilement aux champs dans le HTML
  get title() { return this.suggestionForm.get('title')!; }
  get description() { return this.suggestionForm.get('description')!; }
  get category() { return this.suggestionForm.get('category')!; }

  onSubmit(): void {
    if (this.suggestionForm.invalid) return;

    const newSuggestion: Suggestion = {
      id: Date.now(), // id auto-incrémenté simulé
      title: this.title.value!,
      description: this.description.value!,
      category: this.category.value!,
      date: new Date(),
      status: 'en_attente',
      likes: 0
    };

    this.suggestionService.addSuggestion(newSuggestion);
    this.router.navigate(['/suggestions']); // retour à la liste après soumission
  }

}
