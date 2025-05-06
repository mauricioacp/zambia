import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { RolesService } from '@zambia/data-access-roles-permissions';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hasAnyRole]',
  standalone: true,
})
export class HasAnyRoleDirective {
  private rolesService = inject(RolesService);
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  private hasView = false;

  @Input() set hasAnyRole(roles: string[]) {
    const hasAnyRole = this.rolesService.hasAnyRole(roles);

    if (hasAnyRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasAnyRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
