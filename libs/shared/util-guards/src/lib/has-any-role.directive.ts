import { computed, Directive, effect, inject, Input, signal, TemplateRef, ViewContainerRef } from '@angular/core';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { ROLE_GROUP, RoleCode } from '@zambia/util-roles-definitions';

@Directive({
  selector: '[zHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private roleService = inject(RoleService);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  private roles = signal<RoleCode[]>([]);
  private groups = signal<ROLE_GROUP[]>([]);

  private hasAccess = computed(() => {
    const roleArray = this.roles();
    const groupArray = this.groups();

    if (groupArray.length > 0) {
      return this.roleService.isInAnyGroup(groupArray);
    }

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

  @Input() set zHasRole(value: RoleCode | RoleCode[] | ROLE_GROUP | ROLE_GROUP[]) {
    const valueArray = Array.isArray(value) ? value : [value];

    const isRoleGroup = valueArray.every((v) => v === v.toUpperCase());

    if (isRoleGroup) {
      this.groups.set(valueArray as ROLE_GROUP[]);
      this.roles.set([]);
    } else {
      this.roles.set(valueArray as RoleCode[]);
      this.groups.set([]);
    }
  }
}
