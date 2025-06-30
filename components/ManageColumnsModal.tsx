'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleColumn, addColumn } from '@/lib/features/userSlice';
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Checkbox, FormControlLabel, TextField
} from '@mui/material';

export default function ManageColumnsModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const dispatch = useDispatch();
  const visibleColumns = useSelector((state: RootState) => state.users.visibleColumns);
  const [newColumn, setNewColumn] = useState('');

  const defaultCols = ['name', 'email', 'age', 'role'];

  const handleCheckbox = (col: string) => {
    dispatch(toggleColumn(col));
  };

  const handleAddColumn = () => {
    if (newColumn.trim() !== '' && !visibleColumns.includes(newColumn)) {
      dispatch(addColumn(newColumn.trim()));
      setNewColumn('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
