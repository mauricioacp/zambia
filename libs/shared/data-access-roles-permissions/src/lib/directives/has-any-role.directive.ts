import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '@zambia/data-access-auth';

/**
 * Structural directive that conditionally renders an element based on whether
 * the current user has any of the specified roles.
 *
 * Usage:
 * ```html
 * <div *hasAnyRole="['superadmin', 'general_director']">
 *   Visible to superadmins or general directors
 * </div>
 * ```
 */
@Directive({
  selector: '[hasAnyRole]',
  standalone: true,
})
export class HasAnyRoleDirective {
  private authService = inject(AuthService);
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  private hasView = false;

  /**
   * Sets the roles required to display the element
   * @param roles Array of roles to check against the current user's roles
   */
  @Input() set hasAnyRole(roles: string[]) {
    const hasAnyRole = this.authService.hasAnyRole(roles);

    if (hasAnyRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasAnyRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
