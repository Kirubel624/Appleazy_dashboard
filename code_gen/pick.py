import os

def pick(model,fields,folder_path):
    smodel = model.lower()
    file_path = os.path.join(folder_path,f'{model}Pick.jsx')


    column = f"""
    
    """  
    
    for i,(k,v) in enumerate(fields.items()):
        if  v=='bool':
            column += f""" 
            {{
                title: '{k}',
                dataIndex: '{k}',
                render: (text, recored) => {{
                    return recored.{k} ? <p>true</p> : <p>false</p>
                }},
            }},
            """
        else:
            column += f""" 
            {{
                title: '{k}',
                dataIndex: '{k}',

            }},
            """
    columns = f"""
     const columns = [
         {column}
         
         ];
    
    """            
            

    react_fun = f"""
    const {model}Pick = ({{setIsModalOpen,selectHandler}}) => {{
    const [{smodel}Data, set{model}Data] = useState([])
    const [total, setTotal] = useState()
    const [searchParams,setSearchParams] = useSearchParams()
    const dispatch = useDispatch(); /*** */
    const searchText = useSelector({smodel}SearchText); //** */
    
    
    const [loading, setLoading] = useState();
    const [{smodel}Selection, set{model}Selection] = useState([])
    const delayTimerRef = useRef(null);
    
    const getPaginationInfo = () => {{

        return [searchParams.get('page') || 1, searchParams.get('limit') || 5]
    }}


    useEffect(() => {{
        const [page, limit] = getPaginationInfo();
        dispatch(update{model}State({{ page: page, limit: limit }}))

        searchData();
    }}, [])

    async function searchData() {{
        try {{
            setLoading(true)
            const {{ payload }} = await dispatch(search{model}());
            set{model}Data(payload.data)
            setTotal(payload.total)
            setLoading(false)
        }} catch (err) {{
            setLoading(false)
        }}
    }}
    const searchHandler = (e) => {{
        const {{ value }} = e.target;
        const [page, limit] = getPaginationInfo();

        dispatch(update{model}State({{ page: page, limit: limit, searchText: value }}))
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = setTimeout(() => {{


            searchData()
        }}, 500);


    }}

    const handlePagination = (page, pageSize) => {{
        
        setSearchParams({{page:page,limit:pageSize}})
        searchData()
    }}
    
    {columns}
    
    
    return (

<div >
                <SearchInputStyle>
                    <Input onChange={{searchHandler}}
                        placeholder="Search"
                        value={{searchText}}
                        allowClear />
                </SearchInputStyle>


    <CommonTable
                rowSelectionType={{"radio"}}
                data={{{smodel}Data}}
                columns={{columns}}
                setSelection={{set{model}Selection}}
                handlePagination={{handlePagination}}
                total={{total}}
                loadding={{loading}}

            />
            <Divider style={{{{margin:15}}}}/>

<ButtonStyle>
     <button    onClick={{()=>setIsModalOpen(false)}} >
        cancel
      </button>
      <button disabled={{{smodel}Selection.length==0}} className={{{smodel}Selection.length>0?'':'disable'}} onClick={{()=>selectHandler({smodel}Selection[0])}}>
        Return
      </button>
     </ButtonStyle>     

    </div>
  )
}}
    
    """

    imports = f"""
    import React, {{ useEffect, useRef, useState }} from 'react'
    import {{ useSearchParams }} from 'react-router-dom'
    import {smodel}Service from './{model}Service';
    import CommonTable from '../../components/commons/CommonTable';
    import {{ ButtonStyle, SearchInputStyle }} from '../../components/commons/CommonStyles';
    import {{ Divider, Input }} from 'antd';
    import {{ search{model}, update{model}State, {smodel}SearchText }} from './{model}Redux';//** */
    import {{ useDispatch, useSelector }} from 'react-redux'; /*** */

    {react_fun}

    export default {model}Pick
    """
    
    # imports +=  react_func
    
    with open(file_path, 'w') as file:
        file.write(imports)