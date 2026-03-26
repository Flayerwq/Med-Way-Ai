import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// interface SubData {
//     subData: {
//         name: string;
//         queries_allowed: number;
//         queries_used: number;
//         queries_left: number;
//         images_allowed: number;
//         images_used: number;
//         images_left: number;
//         start_date: string;
//         end_date: string;
//         is_active: boolean;
//     } | null;
//     isLoading: boolean;
//     error: string | null;
// }

interface SubscriptionData {
    name: string;
    queries_allowed: number;
    queries_used: number; 
    queries_left: number;
    images_allowed: number;
    images_used: number;
    images_left: number;
    start_date: string;
    end_date: string;
    amount: string;
    is_active: boolean;
  }
  
  interface SubDataState {
    subData: SubscriptionData | null;
    isLoading: boolean;
    error: string | null;
  }

// Define the initial state

const initialState: SubDataState = {
    subData: null,
    isLoading: false,
    error: null,
};

// 

const subDataSlice = createSlice({
  name: "SubData",
  initialState,
  reducers: {
    setSubData: (state, action: PayloadAction<SubscriptionData | null>) => {
      state.subData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    resetSubData: (state) => {
      state.subData = null; // or your default value
      state.isLoading = false;
      state.error = null;
    },
  },
});


export const { setSubData, resetSubData } = subDataSlice.actions;


export default subDataSlice.reducer