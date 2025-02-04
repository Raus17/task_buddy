"use client";
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
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (userId: string) => {
  if (!userId) return [];

  const tasksRef = collection(db, `users/${userId}/tasks`);
  const querySnapshot = await getDocs(tasksRef);
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Task[];
});

export const addTask = createAsyncThunk('tasks/addTask', async ({ userId, task }: { userId: string; task: Omit<Task, 'id'> }) => {
  if (!userId) throw new Error("User not authenticated");

  try {
    const docRef = await addDoc(collection(db, `users/${userId}/tasks`), task);
    return { ...task, id: docRef.id };
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ userId, task }: { userId: string; task: Task }) => {
  if (!userId) throw new Error("User not authenticated");

  const taskRef = doc(db, `users/${userId}/tasks`, task.id);
  await updateDoc(taskRef, { status: task.status });
  return task;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async ({ userId, taskId }: { userId: string; taskId: string }) => {
  if (!userId) throw new Error("User not authenticated");

  await deleteDoc(doc(db, `users/${userId}/tasks`, taskId));
  return taskId;
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
        console.log("Task added:", action.payload); // Debugging
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
