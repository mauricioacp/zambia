import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { RolesService } from '../roles.service';
import { RoleCode } from '@zambia/util-roles-permissions';

/**
 * Structural directive that conditionally renders an element based on whether
 * the current user has a role with a level equal to or higher than the specified role.
 *
 * Usage:
 * ```html
 * <div *hasRoleLevel="'headquarter_manager'">
 *   Visible to headquarter managers and higher roles
 * </div>
 * ```
 */
@Directive({
  selector: '[hasRoleLevel]',
  standalone: true,
})
export class HasRoleLevelDirective {
  private rolesService = inject(RolesService);
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  private hasView = false;

  /**
   * Sets the minimum role level required to display the element
   * @param role The minimum role level required
   */
  @Input() set hasRoleLevel(role: RoleCode) {
    const hasRequiredLevel = this.rolesService.hasRoleLevelOrHigher(role);

    if (hasRequiredLevel && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRequiredLevel && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
