import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeCreateComponent } from './recipe-create/recipe-create.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RecipeCreateComponent, RecipeListComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AngularMaterialModule, RouterModule]
})
export class RecipesModule {}
