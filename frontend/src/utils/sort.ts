export type SortDirection = 'asc' | 'desc';

export interface SortState {
  sortBy: string;
  sortDirection: SortDirection;
}

/**
 * Ciclo ao clicar no título da coluna:
 * 1) crescente → 2) descendente → 3) desabilitar (sem coluna ativa; API usa LastModifiedAt desc).
 */
export function cycleSortState(current: SortState, columnId: string): SortState {
  if (current.sortBy !== columnId) {
    return { sortBy: columnId, sortDirection: 'asc' };
  }

  if (current.sortDirection === 'asc') {
    return { sortBy: columnId, sortDirection: 'desc' };
  }

  return { sortBy: '', sortDirection: 'desc' };
}

export function getLastModifiedAt(entity: { updatedAt?: string | null; createdAt: string; lastModifiedAt?: string }): string {
  return entity.lastModifiedAt ?? entity.updatedAt ?? entity.createdAt;
}
