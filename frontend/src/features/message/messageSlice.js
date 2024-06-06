import { createSlice } from '@reduxjs/toolkit'
const initialState ={
    value:""
}

export const messageSlice=createSlice({
    name:"message",
    initialState,
    reducers:{
        populateMessage:(state,action)=>{
            state.value =action.payload
        }
    }
})

export const {populateMessage} =messageSlice.actions

export default messageSlice.reducer
