import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../models/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly API_URL = 'http://localhost:5000/api/todos';
  
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.todosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTodos().subscribe();
  }

  
  private loadTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.API_URL).pipe(
      tap(todos => this.todosSubject.next(todos)),
      catchError(this.handleError)
    );
  }

  refreshTodos(): Observable<Todo[]> {
    return this.loadTodos();
  }


  get completedTodos$(): Observable<Todo[]> {
    return this.todos$.pipe(
      map(todos => todos.filter(todo => todo.completed))
    );
  }

 
  get pendingTodos$(): Observable<Todo[]> {
    return this.todos$.pipe(
      map(todos => todos.filter(todo => !todo.completed))
    );
  }


  createTodo(todoData: CreateTodoRequest): Observable<Todo> {
    return this.http.post<Todo>(this.API_URL, todoData).pipe(
      tap(() => this.refreshTodos().subscribe()),
      catchError(this.handleError)
    );
  }

  
  updateTodo(id: string, todoData: UpdateTodoRequest): Observable<Todo> {
    return this.http.put<Todo>(`${this.API_URL}/${id}`, todoData).pipe(
      tap(() => this.refreshTodos().subscribe()),
      catchError(this.handleError)
    );
  }

  toggleTodoStatus(id: string, currentStatus: boolean): Observable<Todo> {
    return this.updateTodo(id, { completed: !currentStatus });
  }

  deleteTodo(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => this.refreshTodos().subscribe()),
      catchError(this.handleError)
    );
  }

 
  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

 
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Something went wrong!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error?.error) {
        errorMessage = error.error.error;
      }
    }
    console.error('TodoService Error:', errorMessage);
    return throwError(() => errorMessage);
  }
}
