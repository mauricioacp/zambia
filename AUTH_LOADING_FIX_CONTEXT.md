# Fix de Autenticación - Contexto de Cambios

## Problema Identificado

Cuando un usuario con sesión activa accedía a la ruta `/`, el `ShellSmartComponent` mostraba una página en blanco debido a:

1. **ChangeDetectionStrategy.OnPush**: No detectaba los cambios asíncronos del estado de autenticación
2. **Estado de Carga No Manejado**: Durante la verificación inicial de la sesión, el componente mostraba incorrectamente la pantalla de login
3. **Rutas Duplicadas**: La redirección a `/login` era innecesaria ya que el Shell maneja la autenticación

## Solución Implementada

### 1. Manejo del Estado de Carga en ShellSmartComponent

```typescript
// Antes
@if (isAuthenticated()) {
  <router-outlet />
} @else {
  <z-auth />
}

// Después
@if (authService.loading()) {
  <!-- Mostrar un loading mientras verifica la sesión -->
  <div class="flex h-screen items-center justify-center">
    <div class="text-center">
      <div class="mb-4 h-24 w-24 mx-auto rounded-2xl bg-white/30 backdrop-blur-sm shadow-2xl" [tuiSkeleton]="true"></div>
      <div class="h-4 w-32 mx-auto rounded bg-white/20 backdrop-blur-sm" [tuiSkeleton]="true"></div>
    </div>
  </div>
} @else if (authService.isAuthenticated()) {
  <router-outlet />
} @else {
  <z-auth />
}
```

### 2. Inyección Correcta del Servicio

```typescript
// Antes
export class ShellSmartComponent {
  isAuthenticated = inject(AuthService).isAuthenticated;
}

// Después
export class ShellSmartComponent {
  authService = inject(AuthService);
}
```

### 3. Simplificación de Rutas

```typescript
// Antes
const childRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('@zambia/feat-dashboard').then((mod) => mod.zambiaFeatDashboardRoutes),
  },
  {
    path: 'login',
    component: AuthSmartComponent,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

// Después
const childRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('@zambia/feat-dashboard').then((mod) => mod.zambiaFeatDashboardRoutes),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
```

## Beneficios

1. **Mejor UX**: Los usuarios no ven un flash de la pantalla de login cuando ya están autenticados
2. **Estado de Carga Claro**: Muestra un skeleton loader mientras verifica la sesión
3. **Mantiene OnPush**: Preserva la estrategia de detección de cambios para mejor performance
4. **Código Más Limpio**: Elimina la duplicación entre rutas y la lógica del Shell

## Flujo de Autenticación

1. Usuario accede a `/`
2. Se muestra el skeleton loader mientras `AuthService` verifica la sesión
3. Si hay sesión activa → Redirige a `/dashboard`
4. Si no hay sesión → Muestra el componente de login (`<z-auth />`)

## Archivos Modificados

1. `/libs/zambia/feat-shell/src/lib/components/smart/shell/shell.smart-component.ts`

   - Agregado manejo del estado de carga
   - Importado `TuiSkeleton`
   - Cambiado la inyección del servicio

2. `/libs/zambia/feat-shell/src/lib/lib.routes.ts`
   - Removida la ruta de login
   - Cambiada la redirección por defecto a dashboard
   - Removida importación no utilizada

## Notas Adicionales

- El `AuthService` maneja automáticamente los cambios de estado de autenticación mediante Supabase's `onAuthStateChange`
- El signal `loading` se establece en `false` después de verificar la sesión inicial
- La estrategia `OnPush` funciona correctamente porque usamos signals reactivos
