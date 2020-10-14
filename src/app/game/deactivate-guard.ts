
import { ActivatedRouteSnapshot, CanDeactivate, Router } from '@angular/router';
import { GameComponent } from './game.component';

export class DeactivateGuard implements CanDeactivate<GameComponent> {
  

  canDeactivate(component: GameComponent, currentRoute: ActivatedRouteSnapshot) :Promise<boolean> | boolean{
    // 
    return component.canDeactivate(currentRoute);
    // return true;
  }
}