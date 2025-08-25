import { Routes } from '@angular/router';
import { Auth } from './components/auth/auth';

export const routes: Routes = [
  { path: 'auth', component: Auth },
  { path: 'todos', loadComponent: () => import('./components/todo-list/todo-list').then(m => m.TodoListComponent) },
  { path: '', redirectTo: '/auth', pathMatch: 'full' }
];
