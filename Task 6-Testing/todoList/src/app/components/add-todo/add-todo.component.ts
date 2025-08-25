import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { CreateTodoRequest } from '../../models/todo.interface';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.css'
})
export class AddTodoComponent {

  todoForm: FormGroup;
  isLoading = false;
  isFormVisible = false;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService
  ) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.resetForm();
    }
  }

  onSubmit(): void {
    if (this.todoForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const todoData: CreateTodoRequest = {
        title: this.todoForm.value.title.trim(),
        description: this.todoForm.value.description?.trim() || undefined,
        completed: false
      };

      this.todoService.createTodo(todoData).subscribe({
        next: () => {
          this.resetForm();
          this.isLoading = false;
          this.isFormVisible = false;
        },
        error: () => {
          this.isLoading = false;
          alert('Failed to create todo.');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }


  resetForm(): void {
    this.todoForm.reset();
    this.todoForm.markAsUntouched();
  }


  private markFormGroupTouched(): void {
    Object.keys(this.todoForm.controls).forEach(key => {
      this.todoForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.todoForm.get(fieldName);
    
    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    
    return '';
  }

  
  hasFieldError(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}
