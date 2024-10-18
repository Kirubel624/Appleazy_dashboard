
    import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
    import TrainingService from './TrainingService';


    export const searchTraining = createAsyncThunk(
        "training/searchTraining",
        async (data, { rejectWithValue,getState }) => {
        try {
            
            const { searchText,page,limit,sort,order } = getState().training.query; // Access state directly

            const res = await TrainingService.searchTrainin({page,limit,searchText,sort,order});
            
    
            return res;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
        }
    );

    export const trainingSlice = createSlice({
    name: 'training',
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
        updateTrainingState: (state,action) => {
        
        state.query = {...state.query,...action.payload}

        },
        
        
    },

    })

    export const { updateTrainingState } = trainingSlice.actions

    export default trainingSlice.reducer
    export const trainingSearchText = (state) => state.training.query.searchText;
    export const trainingPage = (state)=>state.training.query.page
    export const trainingLimit = (state)=>state.training.query.limit
    export const trainingSort = (state)=>state.training.query.sort
    export const trainingQuery = (state)=>state.training.query


    
    