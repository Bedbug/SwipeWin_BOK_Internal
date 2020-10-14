import { CanDeactivate } from '@angular/router';
import { GameComponent } from './game.component';

export class DeactivateGuard implements CanDeactivate<GameComponent> {

  canDeactivate(component: GameComponent) :Promise<boolean> | boolean{
    return component.canDeactivate();
    // return true;
  }
}