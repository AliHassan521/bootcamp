export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { username: string; password: string }) {}
}

export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
  constructor(public payload: { token: string; user: any }) {}
}

export class LoginFailure {
  static readonly type = '[Auth] Login Failure';
  constructor(public payload: { error: string }) {}
}

export class Register {
  static readonly type = '[Auth] Register';
  constructor(public payload: { username: string; email: string; password: string; role: string }) {}
}

export class RegisterSuccess {
  static readonly type = '[Auth] Register Success';
  constructor(public payload: { user: any }) {}
}

export class RegisterFailure {
  static readonly type = '[Auth] Register Failure';
  constructor(public payload: { error: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class RefreshToken {
  static readonly type = '[Auth] Refresh Token';
}

export class RefreshTokenSuccess {
  static readonly type = '[Auth] Refresh Token Success';
  constructor(public payload: { token: string }) {}
}

export class RefreshTokenFailure {
  static readonly type = '[Auth] Refresh Token Failure';
  constructor(public payload: { error: string }) {}
}

export class SetUser {
  static readonly type = '[Auth] Set User';
  constructor(public payload: { user: any }) {}
}

export class ClearAuth {
  static readonly type = '[Auth] Clear Auth';
}
