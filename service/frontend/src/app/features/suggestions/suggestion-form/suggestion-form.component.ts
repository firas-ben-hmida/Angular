import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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

  suggestionForm!: FormGroup;
  id!: number;
  suggestion!: Suggestion;

  constructor(
    private fb: FormBuilder,
    private suggestionService: SuggestionService,
    private router: Router,
    private actR: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(5), 
        Validators.pattern('^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][a-zA-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇàâäéèêëïîôöùûüÿç\\s\'-]*$')
      ]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      category: ['', Validators.required],
      date: [{ value: new Date().toLocaleDateString(), disabled: true }],
      status: [{ value: 'en_attente', disabled: true }]
    });

    this.id = this.actR.snapshot.params['id'];
    if (this.id) {
      this.suggestionService.getById(this.id).subscribe((data) => {
        this.suggestion = (data as any).suggestion;
        this.suggestionForm.patchValue(this.suggestion);
      });
    }
  }

  get title() { return this.suggestionForm.get('title')!; }
  get description() { return this.suggestionForm.get('description')!; }
  get category() { return this.suggestionForm.get('category')!; }

  onSubmit(): void {
    if (this.suggestionForm.invalid) return;

    const newSuggestion: Suggestion = {
      id: this.id || Date.now(),
      title: this.title.value!,
      description: this.description.value!,
      category: this.category.value!,
      date: new Date(),
      status: this.suggestion?.status || 'en_attente',
      nbLikes: this.suggestion?.nbLikes || 0
    };

    if (this.id) {
      this.suggestionService.update(this.id, newSuggestion)
        .subscribe({
          next: () => {
            alert('Suggestion mise à jour avec succès !');
            this.router.navigate(['/suggestions']);
          },
          error: err => console.error('Erreur lors de la mise à jour', err)
        });
    } else {
      this.suggestionService.addSuggestion(newSuggestion)
        .subscribe({
          next: () => {
            alert('Suggestion ajoutée avec succès !');
            this.router.navigate(['/suggestions']);
          },
          error: err => console.error('Erreur lors de l\'ajout', err)
        });
    }
  }
}