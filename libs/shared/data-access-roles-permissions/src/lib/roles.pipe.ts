import { Pipe, PipeTransform } from '@angular/core';
import { AkRole } from './role.service';

@Pipe({
  name: 'akRoleLabel',
  standalone: true,
  pure: true,
})
export class AkRoleLabelPipe implements PipeTransform {
  transform = (roles: AkRole[]): string[] => roles.map((role) => role.name);
}
