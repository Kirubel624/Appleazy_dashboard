import os

def redux(model,fields,folder_path):
    smodel = model.lower()
    file_path = os.path.join(folder_path,f'{model}Redux.js')
    
    
    imports = f"""
    import {{ createAsyncThunk, createSlice }} from '@reduxjs/toolkit'
    import {model}Service from './{model}Service';


    export const search{model} = createAsyncThunk(
        "{smodel}/search{model}",
        async (data, {{ rejectWithValue,getState }}) => {{
        try {{
            
            const {{ searchText,page,limit,sort,order }} = getState().{smodel}.query; // Access state directly

            const res = await {model}Service.search{model[:-1]}({{page,limit,searchText,sort,order}});
            
    
            return res;
        }} catch (err) {{
            return rejectWithValue(err.response.data);
        }}
        }}
    );

    export const {smodel}Slice = createSlice({{
    name: '{smodel}',
    initialState:{{
        query:{{
            searchText:'',
            page:1,
            limit:5,
            sort:'',
            order:''
        }}
    }},
    reducers: {{
        update{model}State: (state,action) => {{
        
        state.query = {{...state.query,...action.payload}}

        }},
        
        
    }},

    }})

    export const {{ update{model}State }} = {smodel}Slice.actions

    export default {smodel}Slice.reducer
    export const {smodel}SearchText = (state) => state.{smodel}.query.searchText;
    export const {smodel}Page = (state)=>state.{smodel}.query.page
    export const {smodel}Limit = (state)=>state.{smodel}.query.limit
    export const {smodel}Sort = (state)=>state.{smodel}.query.sort
    export const {smodel}Query = (state)=>state.{smodel}.query


    
    """
    
    with open(file_path, 'w') as file:
        file.write(imports)