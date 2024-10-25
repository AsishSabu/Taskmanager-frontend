import {createSlice,PayloadAction} from "@reduxjs/toolkit"

interface UserState{
    name:string|null;
    isAuthenticated:boolean|null;
    role:string|null;
    id?:string|null;
}
const initialState:UserState={
    name:null,
    isAuthenticated:null,
    role:null,
    id:null,
};

const UserSlice=createSlice({
    name:"userSlice",
    initialState,
    reducers:{
        setUser:(state,action:PayloadAction<UserState>)=>{
            return {...state,...action.payload}
        },
        clearUser:()=>initialState
    }
})

export const {setUser,clearUser}=UserSlice.actions;
export default UserSlice.reducer;
