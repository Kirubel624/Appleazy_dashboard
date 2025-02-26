
    import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
    import RolesService from './RolesService';


    export const searchRoles = createAsyncThunk(
        "roles/searchRoles",
        async (data, { rejectWithValue,getState }) => {
        try {
            
            const { searchText,page,limit,sort,order } = getState().roles.query; // Access state directly

            const res = await RolesService.searchRole({page,limit,searchText,sort,order});
            
    
            return res;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
        }
    );

    export const rolesSlice = createSlice({
    name: 'roles',
    initialState:{
        query:{
            searchText:'',
            page:1,
            limit:5,
            sort:'',
            order:''
        }
    },
    reducers: {
        updateRolesState: (state,action) => {
        
        state.query = {...state.query,...action.payload}

        },
        
        
    },

    })

    export const { updateRolesState } = rolesSlice.actions

    export default rolesSlice.reducer
    export const rolesSearchText = (state) => state.roles.query.searchText;
    export const rolesPage = (state)=>state.roles.query.page
    export const rolesLimit = (state)=>state.roles.query.limit
    export const rolesSort = (state)=>state.roles.query.sort
    export const rolesQuery = (state)=>state.roles.query


    
    