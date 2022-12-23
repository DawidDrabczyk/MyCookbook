import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  private subscription: Subscription;
  isLoading: boolean = false;
  recipePerPage = 2;
  currentPage = 1;
  total = 0;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public recipeService: RecipeService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.recipeService.getRecipes(this.recipePerPage, this.currentPage);
    this.subscription = this.recipeService
      .getRecipesUpdated()
      .subscribe((recipeData: { recipes: Recipe[]; recipeCount: number }) => {
        this.isLoading = false;
        this.total = recipeData.recipeCount;
        this.recipes = recipeData.recipes;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onDelete(recipeId: string) {
    this.isLoading = true;
    this.recipeService.deleteRecipe(recipeId).subscribe(() => {
      this.recipeService.getRecipes(this.recipePerPage, this.currentPage);
    });
    this.currentPage = this.currentPage - 1;
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.recipePerPage = pageData.pageSize;
    this.recipeService.getRecipes(this.recipePerPage, this.currentPage);
  }
}
