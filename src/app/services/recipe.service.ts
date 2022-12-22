import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];
  private recipesUpdated = new Subject<Recipe[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getRecipes() {
    this.http
      .get<{ message: string; recipes: any }>('http://localhost:3000/api/recipes')
      .pipe(
        map((recData) => {
          return recData.recipes.map((singleRecipe) => {
            return {
              title: singleRecipe.title,
              content: singleRecipe.content,
              id: singleRecipe._id,
            };
          });
        })
      )
      .subscribe((transformedData) => {
        this.recipes = transformedData;
        this.recipesUpdated.next([...this.recipes]);
      });
  }

  updateRecipe(id: string, title: string, content: string) {
    const recipe: Recipe = { id: id, title: title, content: content };
    this.http.put('http://localhost:3000/api/recipes/' + id, recipe).subscribe((response) => {
      const updatedRecipes = [...this.recipes];
      const oldRecipeIndex = updatedRecipes.findIndex((r) => r.id === recipe.id);
      updatedRecipes[oldRecipeIndex] = recipe;
      this.recipes = updatedRecipes;
      this.copyAndBack();
    });
  }

  getRecipe(recipeId: string) {
    return this.http.get<{_id: string; title: string; content: string}>('http://localhost:3000/api/recipes/' + recipeId);
  }

  getRecipesUpdated() {
    return this.recipesUpdated.asObservable();
  }

  addRecipe(title: string, content: string) {
    const recipe: Recipe = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; recipeId: string }>('http://localhost:3000/api/recipes', recipe)
      .subscribe((res) => {
        const recipeId = res.recipeId;
        recipe.id = recipeId;
        this.recipes.push(recipe);
        this.copyAndBack();
      });
  }

  deleteRecipe(recipeId: string) {
    this.http.delete('http://localhost:3000/api/recipes/' + recipeId).subscribe(() => {
      const updateRecipes = this.recipes.filter((recipe) => recipe.id !== recipeId);
      this.recipes = updateRecipes;
      this.recipesUpdated.next([...this.recipes]);
    });
  }

  copyAndBack(){
    this.recipesUpdated.next([...this.recipes]);
    this.router.navigate(['/'])
  }
}
