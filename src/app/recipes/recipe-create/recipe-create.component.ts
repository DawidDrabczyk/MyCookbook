import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.scss'],
})
export class RecipeCreateComponent implements OnInit {
  newRecipe: string = 'Brak dodanych przepisów!';

  constructor(public recipeService: RecipeService) {}

  ngOnInit(): void {}

  onAddRecipe(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.recipeService.addRecipe(form.value.title, form.value.content);
    form.resetForm();
  }
}
