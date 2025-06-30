import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [
    { id: 1, name: 'Aman', email: 'aman@example.com', age: 25, role: 'Admin' },
    { id: 2, name: 'Zoya', email: 'zoya@example.com', age: 22, role: 'Viewer' },
    { id: 3, name: 'Ravi', email: 'ravi@example.com', age: 28, role: 'Editor' },
  ],
  visibleColumns: ['name', 'email', 'age', 'role'],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    toggleColumn: (state, action) => {
      const col = action.payload;
      if (state.visibleColumns.includes(col)) {
        state.visibleColumns = state.visibleColumns.filter((c) => c !== col);
      } else {
        state.visibleColumns.push(col);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('visibleColumns', JSON.stringify(state.visibleColumns));
      }
    },
    addColumn: (state, action) => {
      const col = action.payload;
      state.visibleColumns.push(col);
      state.data = state.data.map((user) => ({
        ...user,
        [col]: '',
      }));
      if (typeof window !== 'undefined') {
        localStorage.setItem('visibleColumns', JSON.stringify(state.visibleColumns));
      }
    },
  },
});

export const { toggleColumn, addColumn } = userSlice.actions;
export const userReducer = userSlice.reducer;
