import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Box,
} from '@mui/material';
import type { ReactNode } from 'react';
import { EmptyState, Loading } from '../common/PageStates';

export interface Column<T> {
  id: string;
  label: string;
  sortable?: boolean;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  page: number;
  pageSize: number;
  totalItems: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange?: (sortBy: string) => void;
  getRowId: (row: T) => string;
}

export function DataTable<T>({
  columns,
  rows,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado.',
  page,
  pageSize,
  totalItems,
  sortBy,
  sortDirection = 'asc',
  onPageChange,
  onPageSizeChange,
  onSortChange,
  getRowId,
}: DataTableProps<T>) {
  if (loading) {
    return <Loading />;
  }

  if (rows.length === 0) {
    return (
      <Paper>
        <EmptyState message={emptyMessage} />
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                const active = Boolean(sortBy) && sortBy === column.id;
                return (
                  <TableCell key={column.id} sortDirection={active ? sortDirection : false}>
                    {column.sortable && onSortChange ? (
                      <TableSortLabel
                        active={active}
                        direction={active ? sortDirection : 'asc'}
                        hideSortIcon={false}
                        onClick={() => onSortChange(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={getRowId(row)} hover>
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.render(row)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box>
        <TablePagination
          component="div"
          count={totalItems}
          page={page - 1}
          onPageChange={(_, nextPage) => onPageChange(nextPage + 1)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(event) => onPageSizeChange(Number(event.target.value))}
          rowsPerPageOptions={[5, 10, 20]}
          labelRowsPerPage="Itens"
        />
      </Box>
    </Paper>
  );
}
