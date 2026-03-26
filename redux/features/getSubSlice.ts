import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subscriptionPlans: [],
};

const newsubscriptionSlice = createSlice({
  name: "newsubscriptions",
  initialState,
  reducers: {
    setnewSubscriptionPlans: (state, action) => {
      state.subscriptionPlans = action.payload;
    },
    resetnewSubscriptionPlans: (state) => {
      state.subscriptionPlans = []; // or whatever your default is
    },
  },
});

export const { setnewSubscriptionPlans, resetnewSubscriptionPlans } =
  newsubscriptionSlice.actions;
export default newsubscriptionSlice.reducer;
