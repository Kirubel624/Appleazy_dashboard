
    import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
    import AssistantsService from './AssistantsService';


    export const searchAssistants = createAsyncThunk(
        "assistants/searchAssistants",
        async (data, { rejectWithValue,getState }) => {
        try {
            
            const { searchText,page,limit,sort,order } = getState().assistants.query; // Access state directly

            const res = await AssistantsService.searchAssistant({page,limit,searchText,sort,order});
            
    
            return res;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
        }
    );

    export const assistantsSlice = createSlice({
    name: 'assistants',
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
        updateAssistantsState: (state,action) => {
        
        state.query = {...state.query,...action.payload}

        },
        
        
    },

    })

    export const { updateAssistantsState } = assistantsSlice.actions

    export default assistantsSlice.reducer
    export const assistantsSearchText = (state) => state.assistants.query.searchText;
    export const assistantsPage = (state)=>state.assistants.query.page
    export const assistantsLimit = (state)=>state.assistants.query.limit
    export const assistantsSort = (state)=>state.assistants.query.sort
    export const assistantsQuery = (state)=>state.assistants.query


    
    