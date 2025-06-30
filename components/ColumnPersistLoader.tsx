'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleColumn } from '@/lib/features/userSlice';

export default function ColumnPersistLoader() {
    const dispatch = useDispatch();

    useEffect(() => {
        const stored = localStorage.getItem('visibleColumns');
        if (stored) {
            const saved = JSON.parse(stored) as string[];


            ['name', 'email', 'age', 'role'].forEach((col) => {
                if (!saved.includes(col)) dispatch(toggleColumn(col));
            });
            saved.forEach((col) => {
                if (!['name', 'email', 'age', 'role'].includes(col)) dispatch(toggleColumn(col));
            });
        }
    }, [dispatch]);

    return null;
}
