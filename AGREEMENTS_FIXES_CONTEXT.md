# Contexto de Correcciones en Agreements Module

## Problemas Resueltos

### 1. Error de Función RPC No Encontrada

- **Problema**: La función RPC `get_agreements_with_role_paginated` esperaba parámetros `p_limit` y `p_offset`, pero el código enviaba `p_page` y `p_page_size`.
- **Solución**:
  - Actualizada la interfaz `AgreementsRpcParams` para usar `p_limit` y `p_offset`
  - Modificada la lógica de paginación para calcular el offset correctamente: `(currentPage - 1) * pageSize`
  - Removido el parámetro `p_user_role` que no existe en la función

### 2. Error de UUID Inválido

- **Problema**: Se intentaba buscar un agreement con un ID vacío (`""`) causando error de conversión a UUID
- **Solución**: Agregada validación en `agreementById` resource para retornar `null` si el ID está vacío

### 3. Estructura de Datos Incorrecta

- **Problema**: La interfaz `AgreementWithShallowRelations` no coincidía con la estructura de la vista `agreement_with_role`
- **Solución**:
  - Actualizada la interfaz para incluir el campo `role` como objeto JSON con estructura `RoleInAgreement`
  - Agregados campos planos como `headquarter_name`, `country_name`, `season_name`
  - Actualizado el mapeo en `transformAgreementsData` para usar `agreement.role?.role_name` en lugar de `agreement.roles?.name`

## Cambios en agreements-facade.service.ts

```typescript
// Antes
export interface AgreementsRpcParams {
  p_page: number;
  p_page_size: number;
  p_user_role?: string;
  // ...
}

// Después
export interface AgreementsRpcParams {
  p_limit: number;
  p_offset: number;
  // p_user_role removido
  // ...
}

// Cálculo de parámetros
const params: AgreementsRpcParams = {
  p_limit: this.pageSize(),
  p_offset: (this.currentPage() - 1) * this.pageSize(),
};

// Validación de agreementId vacío
if (!request.agreementId) {
  return null;
}
```

## Cambios en agreements-list.smart-component.ts

```typescript
// Mapeo actualizado para usar la estructura correcta
role: agreement.role?.role_name || this.translate.instant('no_role'),
headquarter: agreement.headquarter_name || this.translate.instant('no_headquarter'),
```

## Estructura de Datos de la Vista agreement_with_role

La vista devuelve:

- Campos planos del agreement
- `role`: Objeto JSON con estructura `{ role_id, role_name, role_description, role_code, role_level }`
- Campos adicionales como `headquarter_name`, `country_name`, `season_name` ya unidos

## TODOs Pendientes

1. **Autenticación**: Implementar obtención del `role_id` del usuario actual para el parámetro `p_role_id`
2. **Edge Functions**: Implementar activación/desactivación real cuando estén disponibles
3. **Base de Datos**: Considerar agregar campos `agreement_type` y `verification_status`

## Comandos de Depuración

Para verificar la función RPC en Supabase:

```sql
SELECT proname, pronargs, proargtypes
FROM pg_proc
WHERE proname = 'get_agreements_with_role_paginated';
```

Para probar la función manualmente:

```sql
SELECT get_agreements_with_role_paginated(
  p_limit := 10,
  p_offset := 0,
  p_status := NULL,
  p_headquarter_id := NULL,
  p_season_id := NULL,
  p_search := NULL,
  p_role_id := NULL
);
```
