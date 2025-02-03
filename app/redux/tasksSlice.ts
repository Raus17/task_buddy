"use client"
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../FirebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
};

// Async Thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const querySnapshot = await getDocs(collection(db, 'tasks'));
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Task[];
});

export const addTask = createAsyncThunk('tasks/addTask', async (task: Omit<Task, 'id'>) => {
  const docRef = await addDoc(collection(db, 'tasks'), task);
  return { ...task, id: docRef.id };
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (task: Task) => {
  const taskRef = doc(db, 'tasks', task.id);
  await updateDoc(taskRef, { status: task.status });
  return task;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string) => {
  await deleteDoc(doc(db, 'tasks', id));
  return id;
});

// Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
