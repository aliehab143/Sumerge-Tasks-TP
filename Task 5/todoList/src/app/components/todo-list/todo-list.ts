import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';

import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.interface';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule, 
    FormsModule, 
    AddTodoComponent, 
    TodoItemComponent, 
    MatAutocompleteModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatIconModule, 
    MatOptionModule
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css'
})
export class TodoListComponent {
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
  allTodos$: Observable<Todo[]>;
  filteredTodos$: Observable<{title: string, completed: boolean}[]>;

  constructor(
    private todoService: TodoService,
    private router: Router
  ) {
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

    this.allTodos$ = combineLatest([
      this.todoService.pendingTodos$,
      this.todoService.completedTodos$
    ]).pipe(
      map(([pending, completed]) => [...pending, ...completed])
    );

    this.filteredTodos$ = combineLatest([
      this.allTodos$,
      this.searchTermSubject
    ]).pipe(
      map(([todos, searchTerm]) => {
        const todoOptions = todos.map(todo => ({ title: todo.title, completed: todo.completed }));
        if (!searchTerm) return todoOptions.slice(0, 6);
        return todoOptions.filter(option => 
          option.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 6);
      })
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
