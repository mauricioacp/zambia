import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { USER_ROLE_TOKEN } from './ROLE_TOKEN';
import { RoleCode } from '@zambia/util-roles-definitions';

@Directive({
  selector: '[zHasAnyRole]',
  standalone: true,
})
export class HasAnyRoleDirective implements OnInit {
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);
  private userRole = inject(USER_ROLE_TOKEN);
  @Input() zHasAnyRole: RoleCode[] = [];

  ngOnInit(): void {
    if (this.zHasAnyRole.includes(this.userRole())) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
