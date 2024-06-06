import { configureStore } from '@reduxjs/toolkit'
import messageReducer from "../features/message/messageSlice"
import inputReducer from "../features/input/inputSlice"

export const store = configureStore({
  reducer: {
      message:messageReducer,
      input:inputReducer
  },
})

