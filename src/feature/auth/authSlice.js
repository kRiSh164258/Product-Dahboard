import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  generateToken,
  decodeToken,
  findUser,
  saveUser,
  getUsers,
} from "../../utils/auth";

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    await new Promise((r) => setTimeout(r, 500));

    const user = findUser(username);

    if (!user) {
      return rejectWithValue("Username not found. Please register first.");
    }
    if (user.password !== password) {
      return rejectWithValue("Incorrect password. Please try again.");
    }

    const token = generateToken(user);
    localStorage.setItem("token", token);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    };
  },
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    { firstName, lastName, username, email, password },
    { rejectWithValue },
  ) => {
    await new Promise((r) => setTimeout(r, 500));

    const existing = findUser(username);
    if (existing) {
      return rejectWithValue("Username already taken. Please choose another.");
    }

    const existingEmail = getUsers().find((u) => u.email === email);
    if (existingEmail) {
      return rejectWithValue("Email already registered. Please login instead.");
    }

    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      username,
      email,
      password,
    };

    saveUser(newUser);
    return newUser;
  },
);

// Rehydrate on page refresh
const token = localStorage.getItem("token");
const decoded = token ? decodeToken(token) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: decoded || null,
    token: decoded ? token : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = {
          id: payload.user.id,
          username: payload.user.username,
          email: payload.user.email,
          firstName: payload.user.firstName,
          lastName: payload.user.lastName,
        };
        state.token = payload.token;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
