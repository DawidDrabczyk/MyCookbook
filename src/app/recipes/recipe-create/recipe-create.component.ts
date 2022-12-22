import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.scss'],
})
export class RecipeCreateComponent implements OnInit {
  newRecipe: string = 'Brak dodanych przepisów!';
  private mode: string = 'create';
  private recipeId;
  form: FormGroup;
  recipe;
  isLoading: boolean = false;

  constructor(public recipeService: RecipeService, public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('recipeId')) {
        this.mode = 'edit';
        this.recipeId = paramMap.get('recipeId');
        this.isLoading = true;
        this.recipeService.getRecipe(this.recipeId).subscribe((recipeData) => {
          this.isLoading = false;
          this.recipe = { id: recipeData._id, title: recipeData.title, content: recipeData.content };
          this.form.setValue({ title: this.recipe.title, content: this.recipe.content });
        });
      } else {
        this.mode = 'create';
        this.recipeId = null;
      }
    });
  }

  onSaveRecipe() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.recipeService.addRecipe(this.form.value.title, this.form.value.content);
    } else {
      this.recipeService.updateRecipe(this.recipeId, this.form.value.title, this.form.value.content);
    }

    this.form.reset();
  }
}
