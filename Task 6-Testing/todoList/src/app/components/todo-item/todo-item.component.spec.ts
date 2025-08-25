import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TodoItemComponent } from './todo-item.component';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.interface';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;

  const mockTodo: Todo = {
    _id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    createdAt: new Date('2023-01-01').toISOString()
  };

  const mockUpdatedTodo: Todo = {
    _id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: true,
    createdAt: new Date('2023-01-01').toISOString()
  };

  beforeEach(async () => {
    mockTodoService = jasmine.createSpyObj('TodoService', ['toggleTodoStatus', 'deleteTodo']);

    await TestBed.configureTestingModule({
      imports: [TodoItemComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.todo = mockTodo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept todo input', () => {
    expect(component.todo).toEqual(mockTodo);
  });

  it('should call todoService.toggleTodoStatus', () => {
    mockTodoService.toggleTodoStatus.and.returnValue(of(mockUpdatedTodo));
    
    component.toggleStatus();
    
    expect(mockTodoService.toggleTodoStatus).toHaveBeenCalled();
  });

  it('should call todoService.deleteTodo when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockTodoService.deleteTodo.and.returnValue(of(mockTodo));
    
    component.deleteTodo();
    
    expect(mockTodoService.deleteTodo).toHaveBeenCalled();
  });

  it('should return correct toggle button text', () => {
    expect(component.toggleButtonText).toBe('Mark as Complete');
    
    component.todo = { ...mockTodo, completed: true };
    expect(component.toggleButtonText).toBe('Mark as Pending');
  });

  it('should return formatted date', () => {
    expect(component.formattedDate).toBe('1/1/2023');
  });
});
