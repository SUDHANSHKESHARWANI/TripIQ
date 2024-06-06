import { createSlice } from '@reduxjs/toolkit'

const initialState={
    inputData:{
        city:"",
        nod:0,
        groupType:"",
        lat:null,
        long:null,
        country:""
    }   
}

export const inputSlice=createSlice({
    name:"input",
    initialState,
    reducers:{
        setInputData:(state,action)=>{
            state.inputData=action.payload
        }
    }
})

export const {setInputData} =inputSlice.actions;

export default inputSlice.reducer;