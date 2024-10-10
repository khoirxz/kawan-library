import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { DEV_API } from "../api";

interface initialStateProps {
  main: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    message: string | null;
    data: {
      code: number;
      status: string;
      token: string;
      data?: {
        name: string;
        role: string;
        token: string;
        userId: number | null;
        username: string;
      };
    };
  };
}

const initialState: initialStateProps = {
  main: {
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: null,
    data: {
      code: 0,
      status: "",
      token: "",
      data: {
        name: "",
        role: "",
        token: "",
        userId: null,
        username: "",
      },
    },
  },
};

export const LoginUser = createAsyncThunk<
  any,
  {
    username: string | undefined;
    password: string | undefined | null;
  },
  {
    rejectValue: {
      status: string;
      code: number;
      message: string;
    };
  }
>("auth/login", async (data, thunkAPI) => {
  try {
    const response = await axios.post(`${DEV_API}/auth/login`, data, {
      timeout: 6000,
    });
    return response.data;
  } catch (error: any) {
    if (error.status === "ERR_CONNECTION_REFUSED") {
      return thunkAPI.rejectWithValue({
        message: error.message,
        status: "ERR_CONNECTION_REFUSED",
        code: 404,
      });
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const VerifyToken = createAsyncThunk<
  any,
  any,
  {
    rejectValue: {
      status: string;
      code: number;
      message: string;
    };
  }
>("auth/verify", async (data, thunkAPI) => {
  try {
    const response = await axios.get(`${DEV_API}/auth/verify/`, {
      timeout: 6000,
    });
    return response.data;
  } catch (error: any) {
    if (error.status === "ERR_CONNECTION_REFUSED") {
      return thunkAPI.rejectWithValue({
        message: error.message,
        status: "ERR_CONNECTION_REFUSED",
        code: 404,
      });
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.pending, (state) => {
        state.main.isLoading = true;
      })
      .addCase(LoginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.main.isLoading = false;
        state.main.isSuccess = true;
        state.main.data = action.payload;
        state.main.message = "Login Berhasil";
      })
      .addCase(LoginUser.rejected, (state, action: PayloadAction<any>) => {
        state.main.isLoading = false;
        state.main.isError = true;
        state.main.message = action.payload.message;
        state.main.data = action.payload;
      });

    builder
      .addCase(VerifyToken.pending, (state) => {
        state.main.isLoading = true;
      })
      .addCase(VerifyToken.fulfilled, (state, action: PayloadAction<any>) => {
        state.main.isLoading = false;
        state.main.isSuccess = true;
        state.main.data = action.payload;
      })
      .addCase(VerifyToken.rejected, (state, action: PayloadAction<any>) => {
        state.main.isLoading = false;
        state.main.isError = true;
        state.main.message = action.payload.message;
        state.main.data = action.payload;
      });
  },
});

export const { reset } = AuthSlice.actions;
export default AuthSlice.reducer;
