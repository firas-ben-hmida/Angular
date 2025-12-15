import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuggestionsComponent } from './suggestions.component';
import { ListSuggestionComponent } from './list-suggestion/list-suggestion.component';
import { SuggestionDetailsComponent } from './suggestion-details/suggestion-details.component';
import { SuggestionFormComponent } from './suggestion-form/suggestion-form.component';

const routes: Routes = [{ path: '', component: SuggestionsComponent,
  children: [
    {path: '', component:ListSuggestionComponent},
    {path: 'AddSuggestion', component:SuggestionFormComponent},
    {path: 'AddSuggestion/:id', component: SuggestionFormComponent},
    {path: ':id', component:SuggestionDetailsComponent}
  ]
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuggestionsRoutingModule { }
