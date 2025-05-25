import { Directive, inject, Input, TemplateRef, ViewContainerRef, effect, signal, computed } from '@angular/core';
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

  private roles = signal<RoleCode[]>([]);

  private hasAccess = computed(() => {
    const roleArray = this.roles();
    return roleArray.length > 0 ? this.roleService.hasAnyRole(roleArray) : false;
  });

  constructor() {
    effect(() => {
      if (this.hasAccess()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }

  @Input() set zHasRole(roles: RoleCode | RoleCode[]) {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    this.roles.set(roleArray);
  }
}
