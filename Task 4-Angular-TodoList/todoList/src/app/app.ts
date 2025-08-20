import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { TodoService } from './services/todo.service';
import { Todo } from './models/todo.interface';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet, AddTodoComponent, TodoItemComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private searchTermSubject = new BehaviorSubject<string>('');
  private searchScopeSubject = new BehaviorSubject<string>('all');
  
  searchTerm$ = this.searchTermSubject.asObservable();
  searchScope$ = this.searchScopeSubject.asObservable();
  
  get searchTerm(): string { return this.searchTermSubject.value; }
  set searchTerm(value: string) { this.searchTermSubject.next(value); }
  
  get searchScope(): string { return this.searchScopeSubject.value; }
  set searchScope(value: string) { this.searchScopeSubject.next(value); }
  
  pendingTodos$: Observable<Todo[]>;
  completedTodos$: Observable<Todo[]>;

  constructor(private todoService: TodoService) {
    this.pendingTodos$ = combineLatest([
      this.todoService.pendingTodos$,
      this.searchTermSubject,
      this.searchScopeSubject
    ]).pipe(
      map(([todos, searchTerm, searchScope]) => 
        this.filterPendingTodos(todos, searchTerm, searchScope))
    );

    this.completedTodos$ = combineLatest([
      this.todoService.completedTodos$,
      this.searchTermSubject,
      this.searchScopeSubject
    ]).pipe(
      map(([todos, searchTerm, searchScope]) => 
        this.filterCompletedTodos(todos, searchTerm, searchScope))
    );
  }

  private filterPendingTodos(todos: Todo[], searchTerm: string, searchScope: string): Todo[] {
    if (!searchTerm) return todos;
    
    if (searchScope === 'completed') return [];
    
    const term = searchTerm.toLowerCase();
    return todos.filter(todo => 
      todo.title.toLowerCase().includes(term)
    );
  }

  private filterCompletedTodos(todos: Todo[], searchTerm: string, searchScope: string): Todo[] {
    if (!searchTerm) return todos;
    
    if (searchScope === 'pending') return [];
    
    const term = searchTerm.toLowerCase();
    return todos.filter(todo => 
      todo.title.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';       
    this.searchScope = 'all';    

  }

  getScopeText(): string {
    switch (this.searchScope) {
      case 'pending': return 'Searching in Pending Tasks';
      case 'completed': return 'Searching in Completed Tasks';
      case 'all': 
      default: return 'Searching in All Tasks';
    }
  }
}
