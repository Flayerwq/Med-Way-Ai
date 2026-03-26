import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Made the initial state for user and everything else

interface UserState {
  user: {
    full_name: string;
    email: string;
    jwt_token: string;
    company: string;
    number: number;
    intro: string;
    // emailVerified: boolean;
  } | null;
  verification: {
    mode: string;
    oobCode: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  verificationComplete: boolean;
  status: string;
}

// Define the initial state

const initialState: UserState = {
  user: null,
  verification: null,
  isLoading: false,
  error: null,
  verificationComplete: false,
  status: 'loading'
}

// 

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // setUser: (state, action: PayloadAction<UserState['user']>) => {
    //  state.user = action.payload;
    //  state.isLoading = false;
    //  state.error = null;
    // },
    setUser: (state, action: PayloadAction<Partial<UserState['user']>>) => {
      state.user = {
          ...state.user, // Keep existing user data
          ...action.payload // Merge new values
      };
      state.isLoading = false;
      state.error = null;
  },
    setverification: (state, action: PayloadAction<UserState['verification']>) => { 
      state.verification = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    setVerificationComplete: (state, action: PayloadAction<boolean>) => { 
      state.verificationComplete = action.payload
    },
    setStatus: (state, action: PayloadAction<string>) => {
      // console.log("Current state:", state);
      if (!state) return;  // Prevent modifying null state
      state.status = action.payload;
    }
  }
})


export const { setUser, setverification, setLoading, setError, logoutUser, setVerificationComplete, setStatus } = userSlice.actions;


export default userSlice.reducer