// components/UserTable.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleColumn, addColumn } from '@/lib/features/userSlice';
import CSVControls from './CSVControls';
import ColumnPersistLoader from './ColumnPersistLoader';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Pagination, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Checkbox, FormControlLabel, TextField
} from '@mui/material';

const rowsPerPage = 10;
const defaultCols = ['name', 'email', 'age', 'role'];

export default function UserTable() {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.data);
  const visibleColumns = useSelector((state: RootState) => state.users.visibleColumns);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [newColumn, setNewColumn] = useState('');

  const handleSort = (key: string) => {
    if (sortConfig && sortConfig.key === key) {
      setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const sortedData = [...users].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = String(a[key as keyof typeof a]).toLowerCase();
    const bValue = String(b[key as keyof typeof b]).toLowerCase();
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleCheckbox = (col: string) => {
    dispatch(toggleColumn(col));
  };

  const handleAddColumn = () => {
    if (newColumn.trim() !== '' && !visibleColumns.includes(newColumn)) {
      dispatch(addColumn(newColumn.trim()));
      setNewColumn('');
    }
  };

  useEffect(() => {
    localStorage.setItem('visibleColumns', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Paper className="p-4">
      <ColumnPersistLoader />

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded w-1/2"
        />
        <Button onClick={() => setOpen(true)} variant="contained">
          Manage Columns
        </Button>
      </div>

      <CSVControls />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableCell key={col} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
                  <b>{col.toUpperCase()}</b>
                  {sortConfig?.key === col ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((user, index) => (
              <TableRow key={index}>
                {visibleColumns.map((col) => (
                  <TableCell key={col}>{user[col as keyof typeof user]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex justify-center mt-4">
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Manage Columns</DialogTitle>
        <DialogContent>
          {defaultCols.map((col) => (
            <FormControlLabel
              key={col}
              control={
                <Checkbox
                  checked={visibleColumns.includes(col)}
                  onChange={() => handleCheckbox(col)}
                />
              }
              label={col.toUpperCase()}
            />
          ))}
          <TextField
            label="Add New Column"
            fullWidth
            value={newColumn}
            onChange={(e) => setNewColumn(e.target.value)}
            margin="normal"
          />
          <Button variant="outlined" onClick={handleAddColumn}>Add</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
