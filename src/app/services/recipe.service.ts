import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BE_URL = environment.apiUrl + '/recipes/'
@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];
  private recipesUpdated = new Subject<{ recipes: Recipe[]; recipeCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getRecipes(recipesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${recipesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; recipes: any; maxRecipes: number }>(BE_URL + queryParams)
      .pipe(
        map((recData) => {
          return {
            recipe: recData.recipes.map((singleRecipe) => {
              return {
                title: singleRecipe.title,
                content: singleRecipe.content,
                id: singleRecipe._id,
                imagePath: singleRecipe.imagePath,
                author: singleRecipe.author
              };
            }),
            maxRecipes: recData.maxRecipes,
          };
        })
      )
      .subscribe((transformedRecipeData) => {
        this.recipes = transformedRecipeData.recipe;
        this.recipesUpdated.next({ recipes: [...this.recipes], recipeCount: transformedRecipeData.maxRecipes });
      });
  }

  updateRecipe(id: string, title: string, content: string, image: any) {
    let recipe: Recipe | FormData;
    if (typeof image === 'object') {
      recipe = new FormData();
      recipe.append('id', id),
        recipe.append('title', title),
        recipe.append('content', content),
        recipe.append('image', image, title);
    } else {
      recipe = { id: id, title: title, content: content, imagePath: image, author: null };
    }
    this.http.put(BE_URL + id, recipe).subscribe((response) => {

      this.router.navigate(['/']);
    });
  }

  getRecipe(recipeId: string) {
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string, author: string }>(
      BE_URL + recipeId
    );
  }

  getRecipesUpdated() {
    return this.recipesUpdated.asObservable();
  }

  addRecipe(title: string, content: string, image: File) {
    const recipeData = new FormData();
    recipeData.append('title', title);
    recipeData.append('content', content);
    recipeData.append('image', image, title);
    this.http
      .post<{ message: string; recipe: Recipe }>(BE_URL, recipeData)
      .subscribe((res) => {

        this.router.navigate(['/']);
      });
  }

  deleteRecipe(recipeId: string) {
    return this.http.delete(BE_URL + recipeId);
  }
}
