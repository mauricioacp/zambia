import { Directive, inject, Input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { RoleCode } from '@zambia/util-roles-definitions';

@Directive({
  selector: '[zHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private roleService = inject(RoleService);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  @Input() set zHasRole(roles: RoleCode | RoleCode[]) {
    const roleArray = Array.isArray(roles) ? roles : [roles];

    effect(() => {
      if (this.roleService.hasAnyRole(roleArray)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
