import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '@zambia/data-access-auth';

/**
 * Structural directive that conditionally renders an element based on whether
 * the current user has the specified role.
 *
 * Usage:
 * ```html
 * <div *hasRole="'superadmin'">Only visible to superadmins</div>
 * ```
 */
@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private authService = inject(AuthService);
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  private hasView = false;

  /**
   * Sets the role required to display the element
   * @param role The role to check against the current user's roles
   */
  @Input() set hasRole(role: string) {
    const hasRole = this.authService.hasRole(role);

    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
