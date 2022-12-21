import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipes: Recipe[] = [];
  private recipesUpdated = new Subject<Recipe[]>()

  constructor() { }

  getRecipes() {
    return [...this.recipes];
  }

  getRecipesUpdated(){
    return this.recipesUpdated.asObservable();
  }

  addRecipe(title: string, content: string) {
    const recipe: Recipe = { title: title, content: content };
    this.recipes.push(recipe);
    this.recipesUpdated.next([...this.recipes])
  }
}
