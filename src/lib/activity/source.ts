/**
 * Punto ÚNICO donde se elige la fuente de actividad.
 *
 * El componente la instancia dos veces —una en el servidor para el primer
 * render, otra en el cliente para las operaciones nuevas— y antes cada una
 * nombraba la implementación por separado. Al llegar la fuente real habría que
 * acordarse de las dos.
 *
 * PENDIENTE DE DECISIÓN — fuente real de operaciones confirmadas y anonimizadas
 * (CLAUDE.md §13, D18). Al existir: se cambia el `new` de esta función por
 * `DLPayActivitySource`, con `isReal = true`, y no se toca nada más.
 */
import { MockActivitySource } from './mock-activity-source.ts';
import type { StreamingActivitySource } from './types.ts';

export function createActivitySource(seed?: number): StreamingActivitySource {
  return new MockActivitySource(seed);
}
