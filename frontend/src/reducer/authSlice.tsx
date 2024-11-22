import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseAPI } from "../api";

interface initialStateProps {
  main: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    message: string | null;
    verify: {
      code: number | null;
      status: string | null;
      message: string | null;
      data: {
        userId: string;
        username: string;
        role: string;
        avatarImg: string;
      };
    };
    login: {
      code: number | null;
      status: string | null;
      message: string | null;
    };
    logout: {
      code: number | null;
      status: string | null;
      message: string | null;
    };
  };
}

const handleAxiosError = (axiosError: AxiosError) => {
  if (
    axiosError.code === "ECONNABORTED" ||
    axiosError.message === "Network Error"
  ) {
    return {
      message: axiosError.message,
      status: "ERR_CONNECTION_REFUSED",
      code: 404,
    };
  }

  if (axiosError.response && axiosError.response.data) {
    return axiosError.response.data as initialStateProps["main"]["login"];
  }

  return {
    message: "An unexpected error occurred",
    status: "UNKNOWN",
    code: 500,
  };
};

const initialState: initialStateProps = {
  main: {
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: null,
    verify: {
      code: null,
      status: null,
      message: null,
      data: {
        userId: "",
        username: "",
        role: "",
        avatarImg: "",
      },
    },
    login: {
      code: null,
      status: null,
      message: null,
    },
    logout: {
      code: null,
      status: null,
      message: null,
    },
  },
};

export const LoginUser = createAsyncThunk<
  initialStateProps["main"]["login"],
  {
    username: string;
    password: string;
  },
  {
    rejectValue: initialStateProps["main"]["login"];
  }
>("auth/login", async (data, thunkAPI) => {
  try {
    const response = await axios.post(`${baseAPI.dev}/auth/login`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleAxiosError(error as AxiosError));
  }
});

export const VerifyToken = createAsyncThunk<
  initialStateProps["main"]["verify"],
  void,
  {
    rejectValue: initialStateProps["main"]["login"];
  }
>("auth/verify", async (_, thunkAPI) => {
  try {
    const response = await axios.get<initialStateProps["main"]["verify"]>(
      `${baseAPI.dev}/auth/verify`
    );

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleAxiosError(error as AxiosError));
  }
});

export const LogoutUser = createAsyncThunk<
  initialStateProps["main"]["logout"],
  void,
  {
    rejectValue: initialStateProps["main"]["logout"];
  }
>("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await axios.delete<initialStateProps["main"]["logout"]>(
      `${baseAPI.dev}/auth/logout/`
    );

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleAxiosError(error as AxiosError));
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
        (state, action: PayloadAction<initialStateProps["main"]["login"]>) => {
          state.main.isLoading = false;
          state.main.isSuccess = true;
          state.main.isError = false;
          state.main.message = action.payload.message;
          state.main.login = action.payload;
        }
      )
      .addCase(
        LoginUser.rejected,
        (
          state,
          action: PayloadAction<initialStateProps["main"]["login"] | undefined>
        ) => {
          state.main.isLoading = false;
          state.main.isError = true;
          state.main.message = action.payload?.message || null;
          state.main.login = {
            code: null,
            status: null,
            message: null,
          };
        }
      );

    builder
      .addCase(VerifyToken.pending, (state) => {
        state.main.isLoading = true;
      })
      .addCase(
        VerifyToken.fulfilled,
        (state, action: PayloadAction<initialStateProps["main"]["verify"]>) => {
          state.main.isLoading = false;
          state.main.isSuccess = true;
          state.main.message = action.payload.message;
          state.main.verify = action.payload;
        }
      )
      .addCase(
        VerifyToken.rejected,
        (
          state,
          action: PayloadAction<initialStateProps["main"]["login"] | undefined>
        ) => {
          state.main.isLoading = false;
          state.main.isError = true;
          state.main.message = action.payload?.message || null;
          state.main.verify = {
            code: action.payload?.code || null,
            status: action.payload?.status || null,
            message: action.payload?.message || null,
            data: {
              userId: "",
              username: "",
              role: "",
              avatarImg: "",
            },
          };
        }
      );

    builder
      .addCase(LogoutUser.pending, (state) => {
        state.main.isLoading = true;
      })
      .addCase(
        LogoutUser.fulfilled,
        (state, action: PayloadAction<initialStateProps["main"]["logout"]>) => {
          state.main.isLoading = false;
          state.main.isSuccess = true;
          state.main.message = action.payload.message;
          state.main.logout = action.payload;
        }
      )
      .addCase(
        LogoutUser.rejected,
        (
          state,
          action: PayloadAction<initialStateProps["main"]["logout"] | undefined>
        ) => {
          state.main.isLoading = false;
          state.main.isError = true;
          state.main.message = action.payload?.message || null;
        }
      );
  },
});

export const { resetAll, resetLogin, resetVerify, resetLogout } =
  AuthSlice.actions;
export default AuthSlice.reducer;
