import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SuggestionsRoutingModule } from './suggestions-routing.module';
import { SuggestionsComponent } from './suggestions.component';
import { ListSuggestionComponent } from './list-suggestion/list-suggestion.component';
import { SuggestionDetailsComponent } from './suggestion-details/suggestion-details.component';
import { SuggestionFormComponent } from './suggestion-form/suggestion-form.component';


@NgModule({
  declarations: [
    SuggestionsComponent,
    ListSuggestionComponent,
    SuggestionDetailsComponent,
    SuggestionFormComponent
  ],
  imports: [
    CommonModule,
    SuggestionsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SuggestionsModule { }
