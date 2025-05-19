import { InjectionToken } from '@angular/core';
import { RoleCode } from '@zambia/util-roles-definitions';

export const USER_ROLE_TOKEN = new InjectionToken<() => RoleCode>('Current user role');
