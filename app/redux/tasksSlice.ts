import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db, storage } from "../../FirebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
  category: string;
  attachment?: File;
  attachmentURL?: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Fetch tasks
export const fetchTasks = createAsyncThunk<Task[], string>(
  "tasks/fetchTasks",
  async (userId) => {
    const tasksSnapshot = await getDocs(collection(db, `users/${userId}/tasks`));
    return tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
  }
);

// Add a new task
export const addTask = createAsyncThunk<Task, { userId: string; task: Task }>(
  "tasks/addTask",
  async ({ userId, task }) => {
    let attachmentURL = null;

    if (task.attachment) {
      const attachmentRef = ref(storage, `users/${userId}/tasks/${task.attachment.name}`);
      await uploadBytes(attachmentRef, task.attachment);
      attachmentURL = await getDownloadURL(attachmentRef);
    }

    const docRef = await addDoc(collection(db, `users/${userId}/tasks`), {
      title: task.title,
      description: task.description,
      date: task.date,
      status: task.status,
      category: task.category,
      attachmentURL,
    });

    return { id: docRef.id, ...task, attachmentURL };
  }
);

// Update a task
export const updateTask = createAsyncThunk<
  Task,
  { userId: string; taskId: string; updates: Task }
>("tasks/updateTask", async ({ userId, taskId, updates }) => {
  const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
  const updateData: Partial<Task> = { ...updates };
  delete updateData.id; // Remove id from updates as it shouldn't be updated

  // Handle file attachment
  if (updates.attachment instanceof File) {
    // Delete old attachment if it exists
    if (updates.attachmentURL) {
      try {
        const oldAttachmentRef = ref(storage, updates.attachmentURL);
        await deleteObject(oldAttachmentRef);
      } catch (error) {
        console.log("No old attachment to delete or error deleting:", error);
      }
    }

    // Upload new attachment
    const attachmentRef = ref(storage, `users/${userId}/tasks/${updates.attachment.name}`);
    await uploadBytes(attachmentRef, updates.attachment);
    updateData.attachmentURL = await getDownloadURL(attachmentRef);
  }

  // Remove the File object before updating Firestore
  delete updateData.attachment;

  await updateDoc(taskRef, updateData);

  // Return the complete updated task
  return {
    id: taskId,
    ...updates,
    attachmentURL: updateData.attachmentURL || updates.attachmentURL,
  };
});

// Delete a task
export const deleteTask = createAsyncThunk<
  string,
  { userId: string; taskId: string; attachmentURL?: string }
>("tasks/deleteTask", async ({ userId, taskId, attachmentURL }) => {
  await deleteDoc(doc(db, `users/${userId}/tasks/${taskId}`));

  if (attachmentURL) {
    try {
      const attachmentRef = ref(storage, attachmentURL);
      await deleteObject(attachmentRef);
    } catch (error) {
      console.log("Error deleting attachment:", error);
    }
  }

  return taskId;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(addTask.pending, (state) => {
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
        state.error = null;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add task";
      })
      .addCase(updateTask.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update task";
      })
      .addCase(deleteTask.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete task";
      });
  },
});

export default tasksSlice.reducer;