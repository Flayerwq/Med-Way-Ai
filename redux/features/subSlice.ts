import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subscriptionPlans: [],
};

const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setSubscriptionPlans: (state, action) => {
      state.subscriptionPlans = action.payload;
    },
    resetSubscriptionPlans: (state) => {
      state.subscriptionPlans = []; // or whatever your default is
    },
  },
});

export const { setSubscriptionPlans, resetSubscriptionPlans } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
