import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Authentication } from '../service/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardGuard implements CanActivate {
  constructor(private authService: Authentication, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const protectedRoutes: { [key: string]: string[] } = {
      '/profile': [],
      '/update-profile': [],
      '/individuals': ['Admin'],
      '/associations': ['Admin'],
      '/offerBySociety': ['Exposant','Professor'],
      '/offre': ['Admin','Community'],
      '/listCandidat': ['Student','Alumini'],
      '/dashboard': ['Admin', 'Exposant','Professor','Community','FinancialDirection','Fourniseur'],
      '/reclamation': ['Admin'],
      '/forumList': ['Admin','Community'],
      '/packList': ['Admin','Community'],
      '/standList': ['Admin','Community'],
      '/supplyrequests': ['Admin','Community'],
      '/invoices': ['Admin','Community'],
      '/devis': ['Fourniseur'],
    };
    const currentRoute = state.url;
    const userRole = this.authService.user?.role;
    const routeRoles = protectedRoutes[currentRoute];
    const hasRole =
      routeRoles.length > 0
        ? userRole && routeRoles.some((role) => userRole.includes(role))
        : true;
    if (protectedRoutes[currentRoute] && !this.authService.isLoggedIn) {
      return this.router.parseUrl('/');
    }
    if (protectedRoutes[currentRoute] && !hasRole) {
      return false;
    }
    return true;
  }
}
