import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    token : "",
    userData : null
}
const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        login: (state , action)=>{
            if(action.payload !== null){
                const {tempToken , user} = action.payload;
            state.token = tempToken;
            state.userData = user;
            }
            
        },
        signout : (state , action) => {
            state.token = "";
            state.userData = null
        }
    }
})
export const {login , signout} = userSlice.actions;
export default userSlice.reducer;