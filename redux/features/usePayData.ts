import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentData {
    payment: {
        subscription: string;
        amount: string;
        status: string;
        date: string
    } | null;
    isLoading: boolean;
    error: string | null;
}

// Define the initial state

const initialState: PaymentData = {
  payment: null,
  isLoading: false,
  error: null,
}

// 

const paymentDataSlice = createSlice({
  name: "PaymentData",
  initialState,
  reducers: {
    setPayData: (state, action: PayloadAction<PaymentData["payment"]>) => {
      state.payment = action.payload;
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
    resetPayData: (state) => {
      state.payment = null; // or whatever default your payment is
      state.isLoading = false;
      state.error = null;
    },
  },
});


export const { setPayData, resetPayData } = paymentDataSlice.actions;


export default paymentDataSlice.reducer