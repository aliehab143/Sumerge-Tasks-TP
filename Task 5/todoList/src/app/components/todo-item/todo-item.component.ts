import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.interface';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  isLoading = false;

  constructor(private todoService: TodoService) {}

  toggleStatus(): void {
    if (!this.todo._id || this.isLoading) return;
    
    this.isLoading = true;
    this.todoService.toggleTodoStatus(this.todo._id, this.todo.completed).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to update todo status.');
      }
    });
  }

  deleteTodo(): void {
    if (!this.todo._id || this.isLoading) return;
    
    if (confirm('Delete this todo?')) {
      this.isLoading = true;
      this.todoService.deleteTodo(this.todo._id).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          alert('Failed to delete todo.');
        }
      });
    }
  }


  get toggleButtonText(): string {
    return this.todo.completed ? 'Mark as Pending' : 'Mark as Complete';
  }

  
  get toggleButtonClass(): string {
    return this.todo.completed 
      ? 'btn btn-outline-warning btn-sm'
      : 'btn btn-outline-success btn-sm';
  }


  get formattedDate(): string {
    if (!this.todo.createdAt) return '';
    return new Date(this.todo.createdAt).toLocaleDateString();
  }
}
