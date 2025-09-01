import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }
    
    if (requiredRoles && requiredRoles.length > 0) {
      if (requiredRoles.includes(currentUser.role)) {
        return true;
      } else {
        this.router.navigate(['/dashboard']);
        return false;
      }
    }
    
    return true;
  }
}

