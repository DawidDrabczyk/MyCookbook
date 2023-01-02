import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { mimeType } from '../../validators/mime-type-validators';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.scss'],
})
export class RecipeCreateComponent implements OnInit, OnDestroy {
  newRecipe: string = 'Brak dodanych przepisów!';
  private mode: string = 'create';
  private recipeId;
  private authStatusSub: Subscription;
  form: FormGroup;
  recipe: Recipe;
  isLoading: boolean = false;
  imagePreview: string;

  constructor(public recipeService: RecipeService, public activatedRoute: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatus().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
    });
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('recipeId')) {
        this.mode = 'edit';
        this.recipeId = paramMap.get('recipeId');
        this.isLoading = true;
        this.recipeService.getRecipe(this.recipeId).subscribe((recipeData) => {
          this.isLoading = false;
          this.recipe = {
            id: recipeData._id,
            title: recipeData.title,
            content: recipeData.content,
            imagePath: recipeData.imagePath,
            author: recipeData.author
          };
          this.form.setValue({ title: this.recipe.title, content: this.recipe.content, image: this.recipe.imagePath });
        });
      } else {
        this.mode = 'create';
        this.recipeId = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onSaveRecipe() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.recipeService.addRecipe(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.recipeService.updateRecipe(
        this.recipeId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
