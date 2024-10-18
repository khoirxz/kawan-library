import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { baseAPI } from "../api";

interface initialStateProps {
  main: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    message: string | null;
    verify: {
      code: number;
      status: string;
      data: {
        userId: number;
        name: string;
        username: string;
        role: string;
        token: string;
      };
    };
    login: {
      code: number;
      status: string;
      token: string;
    };
    logout: {
      code: number;
      status: string;
      message: string;
    };
  };
}

const initialState: initialStateProps = {
  main: {
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: null,
    //state for login
    login: {
      code: 0,
      status: "",
      token: "",
    },
    //state for verify
    verify: {
      code: 0,
      status: "",
      data: {
        userId: 0,
        name: "",
        username: "",
        role: "",
        token: "",
      },
    },
    //state for logout
    logout: {
      code: 0,
      status: "",
      message: "",
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
    const response = await axios.post(`${baseAPI.dev}/auth/login`, data, {
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
    const response = await axios.get(`${baseAPI.dev}/auth/verify/`, {
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

export const LogoutUser = createAsyncThunk<
  any,
  any,
  {
    rejectValue: {
      status: string;
      code: number;
      message: string;
    };
  }
>("auth/logout", async (token: string, thunkAPI) => {
  try {
    const response = await axios.delete(`${baseAPI.dev}/auth/logout/`, {
      timeout: 6000,
      headers: {
        Authorization: token,
      },
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
    resetAll: (state) => initialState,
    resetLogin: (state) => {
      state.main.login = initialState.main.login;
    },
    resetVerify: (state) => {
      state.main.verify = initialState.main.verify;
    },
    resetLogout: (state) => {
      state.main.logout = initialState.main.logout;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.pending, (state) => {
        state.main.isLoading = true;
      })
      .addCase(LoginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.main.isLoading = false;
        state.main.isSuccess = true;
        state.main.message = action.payload.message;
        state.main.login = action.payload;
      })
      .addCase(LoginUser.rejected, (state, action: PayloadAction<any>) => {
        state.main.isLoading = false;
        state.main.isError = true;
        state.main.message = action.payload.message;
        state.main.login = action.payload;
      });

    builder
      .addCase(VerifyToken.pending, (state) => {
        state.main.isLoading = true;
      })
      .addCase(VerifyToken.fulfilled, (state, action: PayloadAction<any>) => {
        state.main.isLoading = false;
        state.main.isSuccess = true;
        state.main.verify = action.payload;
        state.main.message = null;
      })
      .addCase(VerifyToken.rejected, (state, action: PayloadAction<any>) => {
        state.main.isLoading = false;
        state.main.isError = true;
        state.main.message = action.payload.message;
        state.main.verify = action.payload;
      });

    builder
      .addCase(LogoutUser.pending, (state) => {
        state.main.isLoading = true;
      })
      .addCase(LogoutUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.main.isLoading = false;
        state.main.isSuccess = true;
        state.main.logout = action.payload;
        state.main.message = action.payload.message;
      })
      .addCase(LogoutUser.rejected, (state, action: PayloadAction<any>) => {
        state.main.isLoading = false;
        state.main.isError = true;
        state.main.logout = action.payload;
      });
  },
});

export const { resetAll, resetLogin, resetVerify, resetLogout } =
  AuthSlice.actions;
export default AuthSlice.reducer;
