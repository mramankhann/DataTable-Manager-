'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { addColumn } from '@/lib/features/userSlice';
import { Button } from '@mui/material';
import { ChangeEvent } from 'react';

export default function CSVControls() {
  const dispatch = useDispatch();
  const { data, visibleColumns } = useSelector((state: RootState) => state.users);

  type User = {
    id: number;
    name: string;
    email: string;
    age: number;
    role: string;
    [key: string]: string | number;
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const PapaModule = await import('papaparse');
    const Papa = PapaModule.default;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: Papa.ParseResult<Record<string, unknown>>) => {
        const importedData = result.data as any[];
        const existingCols = new Set(visibleColumns);

        Object.keys(importedData[0] || {}).forEach((col) => {
          if (!existingCols.has(col)) {
            dispatch(addColumn(col));
          }
        });

        alert('Imported CSV successfully!');
      },
      error: () => alert('Invalid CSV format'),
    });
  };

  const handleExport = async () => {
    const PapaModule = await import('papaparse');
    const Papa = PapaModule.default;

    const { saveAs } = await import('file-saver');

    const exportData = data.map((user: User) =>
      Object.fromEntries(visibleColumns.map((col) => [col, user[col]]))
    );

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'export.csv');
  };

  return (
    <div className="flex gap-4 mb-4">
      <Button variant="outlined" component="label">
        Import CSV
        <input type="file" accept=".csv" hidden onChange={handleImport} />
      </Button>
      <Button variant="contained" onClick={handleExport}>
        Export CSV
      </Button>
    </div>
  );
}
