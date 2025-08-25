import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { AddTodoComponent } from './add-todo.component';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.interface';

describe('AddTodoComponent', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;

  const mockTodo: Todo = {
    _id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    createdAt: new Date().toISOString()
  };

  beforeEach(async () => {
    mockTodoService = jasmine.createSpyObj('TodoService', ['createTodo']);

    await TestBed.configureTestingModule({
      imports: [AddTodoComponent, ReactiveFormsModule],
      providers: [
        { provide: TodoService, useValue: mockTodoService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with todo form', () => {
    expect(component.todoForm).toBeDefined();
    expect(component.todoForm.get('title')).toBeDefined();
    expect(component.todoForm.get('description')).toBeDefined();
  });

  it('should have initial loading state as false', () => {
    expect(component.isLoading).toBeFalse();
  });

  it('should validate required title field', () => {
    const titleControl = component.todoForm.get('title');
    titleControl?.setValue('');
    titleControl?.markAsTouched();
    
    expect(component.hasFieldError('title')).toBeTrue();
  });

  it('should toggle form visibility', () => {
    expect(component.isFormVisible).toBeFalse();
    
    component.toggleForm();
    expect(component.isFormVisible).toBeTrue();
  });

  it('should call todoService.createTodo when form is valid', () => {
    mockTodoService.createTodo.and.returnValue(of(mockTodo));
    
    component.todoForm.patchValue({
      title: 'Test Todo',
      description: 'Test Description'
    });
    
    component.onSubmit();
    
    expect(mockTodoService.createTodo).toHaveBeenCalled();
  });

  it('should reset form', () => {
    component.todoForm.patchValue({
      title: 'Test Title',
      description: 'Test Description'
    });
    
    component.resetForm();
    
    const titleControl = component.todoForm.get('title');
    const descriptionControl = component.todoForm.get('description');
    
    expect(titleControl?.value || '').toBe('');
    expect(descriptionControl?.value || '').toBe('');
  });
});
