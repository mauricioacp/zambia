export interface DatabaseError {
  code: string;
  details?: string;
  hint?: string;
  message: string;
}

export interface ParsedConstraintError {
  type: 'foreign_key' | 'unique' | 'check' | 'not_null' | 'unknown';
  table?: string;
  column?: string;
  constraintName?: string;
  referencedTable?: string;
  details?: string;
}

/**
 * Utility function to check if an error is a database constraint violation
 */
export function isDatabaseConstraintError(error: unknown): error is DatabaseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as DatabaseError).code === 'string'
  );
}

/**
 * Parses a PostgreSQL constraint error to extract meaningful information
 */
export function parseConstraintError(error: DatabaseError): ParsedConstraintError {
  const { code, message, details } = error;

  if (code === '23503') {
    const foreignKeyMatch = message.match(/violates foreign key constraint "([^"]+)" on table "([^"]+)"/);
    const referencedTableMatch = details?.match(/Key is still referenced from table "([^"]+)"/);

    return {
      type: 'foreign_key',
      table: foreignKeyMatch?.[2],
      constraintName: foreignKeyMatch?.[1],
      referencedTable: referencedTableMatch?.[1],
      details,
    };
  }

  if (code === '23505') {
    const uniqueMatch = message.match(/violates unique constraint "([^"]+)"/);
    const tableMatch = message.match(/on table "([^"]+)"/);

    return {
      type: 'unique',
      table: tableMatch?.[1],
      constraintName: uniqueMatch?.[1],
      details,
    };
  }

  if (code === '23514') {
    const checkMatch = message.match(/violates check constraint "([^"]+)"/);
    const tableMatch = message.match(/on table "([^"]+)"/);

    return {
      type: 'check',
      table: tableMatch?.[1],
      constraintName: checkMatch?.[1],
      details,
    };
  }

  if (code === '23502') {
    const columnMatch = message.match(/null value in column "([^"]+)"/);
    const tableMatch = message.match(/of relation "([^"]+)"/);

    return {
      type: 'not_null',
      table: tableMatch?.[1],
      column: columnMatch?.[1],
      details,
    };
  }

  return {
    type: 'unknown',
    details: message,
  };
}
