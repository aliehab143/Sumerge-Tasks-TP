import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { TodoListComponent } from './todo-list';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.interface';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockTodos: Todo[] = [
    { _id: '1', title: 'Test Todo 1', description: 'Description 1', completed: false, createdAt: new Date().toISOString() },
    { _id: '2', title: 'Test Todo 2', description: 'Description 2', completed: true, createdAt: new Date().toISOString() }
  ];

  beforeEach(async () => {
    mockTodoService = jasmine.createSpyObj('TodoService', [], {
      pendingTodos$: new BehaviorSubject(mockTodos.filter(t => !t.completed)),
      completedTodos$: new BehaviorSubject(mockTodos.filter(t => t.completed))
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default search values', () => {
    expect(component.searchTerm).toBe('');
    expect(component.searchScope).toBe('all');
  });

  it('should update search term', () => {
    component.searchTerm = 'test';
    expect(component.searchTerm).toBe('test');
  });

  it('should clear search', () => {
    component.searchTerm = 'test';
    component.searchScope = 'pending';
    
    component.clearSearch();
    
    expect(component.searchTerm).toBe('');
    expect(component.searchScope).toBe('all');
  });

  it('should return correct scope text', () => {
    expect(component.getScopeText()).toBe('Searching in All Tasks');
    
    component.searchScope = 'pending';
    expect(component.getScopeText()).toBe('Searching in Pending Tasks');
  });
});
