import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseAPI } from "../api";

interface RejectValue {
  status: string;
  code: number;
  message: string;
}

interface VerifyProps {
  code: number;
  status: string;
  data: {
    userId: string;
    username: string;
    role: string;
    avatarImg: string;
    token: string;
  };
}

interface LoginProps {
  code: number;
  status: string;
  token: string;
}

interface LogoutProps {
  code: number;
  status: string;
  message: string;
}

interface initialStateProps {
  main: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    message: string | null;
    verify: VerifyProps;
    login?: LoginProps;
    logout: LogoutProps;
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
        userId: "",

        username: "",
        role: "",
        avatarImg: "",
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
  {
    code: number;
    status: string;
    token: string;
  },
  {
    username: string | undefined;
    password: string | undefined | null;
  },
  {
    rejectValue: RejectValue;
  }
>("auth/login", async (data, thunkAPI) => {
  try {
    const response = await axios.post<{
      code: number;
      status: string;
      token: string;
    }>(`${baseAPI.dev}/auth/login`, data, {
      timeout: 6000,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (
      axiosError.code === "ECONNABORTED" ||
      axiosError.message === "Network Error"
    ) {
      return thunkAPI.rejectWithValue({
        message: axiosError.message,
        status: "ERR_CONNECTION_REFUSED",
        code: 404,
      });
    }

    if (axiosError.response && axiosError.response.data) {
      return thunkAPI.rejectWithValue(axiosError.response.data as RejectValue);
    }

    return thunkAPI.rejectWithValue({
      message: "An unexpected error occurred",
      status: "UNKNOWN",
      code: 500,
    });
  }
});

export const VerifyToken = createAsyncThunk<
  {
    code: number;
    status: string;
    data: {
      userId: string;
      username: string;
      role: string;
      avatarImg: string;
      token: string;
    };
  },
  void,
  {
    rejectValue: {
      status: string;
      code: number;
      message: string;
    };
  }
>("auth/verify", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${baseAPI.dev}/auth/verify/`, {
      timeout: 6000,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (
      axiosError.code === "ECONNABORTED" ||
      axiosError.message === "Network Error"
    ) {
      return thunkAPI.rejectWithValue({
        message: axiosError.message,
        status: "ERR_CONNECTION_REFUSED",
        code: 404,
      });
    }

    if (axiosError.response && axiosError.response.data) {
      return thunkAPI.rejectWithValue(axiosError.response.data as RejectValue);
    }

    return thunkAPI.rejectWithValue({
      message: "An unexpected error occurred",
      status: "UNKNOWN",
      code: 500,
    });
  }
});

export const LogoutUser = createAsyncThunk<
  LogoutProps,
  void,
  {
    rejectValue: {
      status: string;
      code: number;
      message: string;
    };
  }
>("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await axios.delete(`${baseAPI.dev}/auth/logout/`, {
      timeout: 6000,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (
      axiosError.code === "ECONNABORTED" ||
      axiosError.message === "Network Error"
    ) {
      return thunkAPI.rejectWithValue({
        message: axiosError.message,
        status: "ERR_CONNECTION_REFUSED",
        code: 404,
      });
    }

    if (axiosError.response && axiosError.response.data) {
      return thunkAPI.rejectWithValue(axiosError.response.data as RejectValue);
    }

    return thunkAPI.rejectWithValue({
      message: "An unexpected error occurred",
      status: "UNKNOWN",
      code: 500,
    });
  }
});

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAll: () => initialState,
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
      .addCase(
        LoginUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            code: number;
            status: string;
            token: string;
          }>
        ) => {
          state.main.isLoading = false;
          state.main.isSuccess = true;
          state.main.message = "success";
          state.main.login = action.payload;
        }
      )
      .addCase(
        LoginUser.rejected,
        (state, action: PayloadAction<RejectValue | undefined>) => {
          state.main.isLoading = false;
          state.main.isError = true;
          state.main.message = action?.payload?.message || "error";
        }
      );

    builder
      .addCase(VerifyToken.pending, (state) => {
        state.main.isLoading = true;
      })
      .addCase(
        VerifyToken.fulfilled,
        (state, action: PayloadAction<VerifyProps>) => {
          state.main.isLoading = false;
          state.main.isSuccess = true;
          state.main.verify = action.payload;
          state.main.message = "success";
        }
      )
      .addCase(
        VerifyToken.rejected,
        (state, action: PayloadAction<RejectValue | undefined>) => {
          state.main.isLoading = false;
          state.main.isError = true;
          state.main.message = action?.payload?.message || "error";
          state.main.verify = initialState.main.verify;
        }
      );

    builder
      .addCase(LogoutUser.pending, (state) => {
        state.main.isLoading = true;
      })
      .addCase(
        LogoutUser.fulfilled,
        (state, action: PayloadAction<LogoutProps>) => {
          state.main.isLoading = false;
          state.main.isSuccess = true;
          state.main.logout = action.payload;
          state.main.message = action.payload.message || "success";
        }
      )
      .addCase(
        LogoutUser.rejected,
        (state, action: PayloadAction<RejectValue | undefined>) => {
          state.main.isLoading = false;
          state.main.isError = true;
          state.main.logout = initialState.main.logout;
          state.main.message = action?.payload?.message || "error";
        }
      );
  },
});

export const { resetAll, resetLogin, resetVerify, resetLogout } =
  AuthSlice.actions;
export default AuthSlice.reducer;
