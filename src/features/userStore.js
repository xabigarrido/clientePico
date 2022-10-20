import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: 'ligth',
  empleado: null,
};

export const counterSlice = createSlice({
  name: "userStore",
  initialState,
  reducers: {
    changeMode: (state, action) =>{
      console.log(action)
      return {...state, mode: action.payload}
    },
    addEmpleado: (state, action)=>{
      return {...state, empleado: action.payload}
    }
    // addInfoUser: (state, action) => {
    //   return action.payload;
    // },
    // changeInfo: (state, action) => {
    //   return { ...state, tikado: action.payload };
    // },
  },
});

export const { changeMode, addEmpleado } = counterSlice.actions;

export default counterSlice.reducer;
