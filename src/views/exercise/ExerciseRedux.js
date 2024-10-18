
    import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
    import ExerciseService from './ExerciseService';


    export const searchExercise = createAsyncThunk(
        "exercise/searchExercise",
        async (data, { rejectWithValue,getState }) => {
        try {
            
            const { searchText,page,limit,sort,order } = getState().exercise.query; // Access state directly

            const res = await ExerciseService.searchExercis({page,limit,searchText,sort,order});
            
    
            return res;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
        }
    );

    export const exerciseSlice = createSlice({
    name: 'exercise',
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
        updateExerciseState: (state,action) => {
        
        state.query = {...state.query,...action.payload}

        },
        
        
    },

    })

    export const { updateExerciseState } = exerciseSlice.actions

    export default exerciseSlice.reducer
    export const exerciseSearchText = (state) => state.exercise.query.searchText;
    export const exercisePage = (state)=>state.exercise.query.page
    export const exerciseLimit = (state)=>state.exercise.query.limit
    export const exerciseSort = (state)=>state.exercise.query.sort
    export const exerciseQuery = (state)=>state.exercise.query


    
    