import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/user.model';
import {
  Login,
  LoginSuccess,
  LoginFailure,
  Register,
  RegisterSuccess,
  RegisterFailure,
  Logout,
  SetUser,
  ClearAuth
} from '../actions/auth.actions';

export interface AuthStateModel {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  error: string | null;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    token: null,
    isAuthenticated: false,
    role: null,
    loading: false,
    error: null
  }
})
@Injectable()
export class AuthState {
  constructor(private authService: AuthService) {}

  @Selector()
  static user(state: AuthStateModel): any | null {
    return state.user;
  }

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static role(state: AuthStateModel): string | null {
    return state.role;
  }

  @Selector()
  static loading(state: AuthStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: AuthStateModel): string | null {
    return state.error;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    ctx.patchState({ loading: true, error: null });
    
    return this.authService.login(action.payload).pipe(
      tap({
        next: (response: AuthResponse) => {
          const user = this.decodeUserFromToken(response.token);
          ctx.dispatch(new LoginSuccess({ token: response.token, user }));
        },
        error: (error) => {
          ctx.dispatch(new LoginFailure({ error: error.message }));
        }
      })
    );
  }

  @Action(LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, action: LoginSuccess) {
    ctx.patchState({
      user: action.payload.user,
      token: action.payload.token,
      isAuthenticated: true,
      role: action.payload.user.role,
      loading: false,
      error: null
    });
  }

  @Action(LoginFailure)
  loginFailure(ctx: StateContext<AuthStateModel>, action: LoginFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register) {
    ctx.patchState({ loading: true, error: null });
    
    return this.authService.register(action.payload).pipe(
      tap({
        next: (response: any) => {
          // For registration, we might not get a user object back immediately
          // So we'll create a basic user object from the registration data
          const user = {
            username: action.payload.username,
            email: action.payload.email,
            role: action.payload.role
          };
          ctx.dispatch(new RegisterSuccess({ user }));
        },
        error: (error) => {
          ctx.dispatch(new RegisterFailure({ error: error.message }));
        }
      })
    );
  }

  @Action(RegisterSuccess)
  registerSuccess(ctx: StateContext<AuthStateModel>, action: RegisterSuccess) {
    ctx.patchState({
      user: action.payload.user,
      loading: false,
      error: null
    });
  }

  @Action(RegisterFailure)
  registerFailure(ctx: StateContext<AuthStateModel>, action: RegisterFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    this.authService.logout();
    ctx.patchState({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
      loading: false,
      error: null
    });
  }

  @Action(SetUser)
  setUser(ctx: StateContext<AuthStateModel>, action: SetUser) {
    ctx.patchState({
      user: action.payload.user,
      isAuthenticated: !!action.payload.user,
      role: action.payload.user?.role || null
    });
  }

  @Action(ClearAuth)
  clearAuth(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      error: null
    });
  }

  private decodeUserFromToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.nameid || 0,
        username: payload.name || '',
        email: payload.email || '',
        role: payload.role || 'User'
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
