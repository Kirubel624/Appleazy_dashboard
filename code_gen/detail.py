import os

def detail(model,fields,folder_path):
    smodel = model.lower()
    file_path = os.path.join(folder_path,f'{model}Details.jsx')
    
    data = f"""
    
    """
    for i,(k,v) in enumerate(fields.items()):
        if v == 'bool':
            
            data += f"""
                <div className='detail_child'>
                <p className='detail_key'>{k}:</p>
                <p className='detail_value'>{{state?.{k}?'true':'false'}}</p>  
            </div>
            """    
        else:
             data += f"""
                <div className='detail_child'>
                <p className='detail_key'>{k}:</p>
                <p className='detail_value'>{{state?.{k}}}</p>  
            </div>
            """    
    
     
    react_func  = f"""
    const {model}Detail = () => {{
    const {{state}} = useLocation();
    return (
    <DetailStyle>
        <h1>User Detail</h1>
        <Divider  style={{{{margin:'15px 0 25px 0'}}}} />

    {data}

    </DetailStyle>
  )
}}
    """

    
    imports = f"""
    import {{ Divider }} from 'antd'
    import React from 'react'
    import {{ useLocation }} from 'react-router-dom'
    import styled from 'styled-components'


    {react_func}


    const DetailStyle = styled.div`
        border: 1px lightgray;
        margin: 30px;
        padding: 20px;
        background-color: white;
        border-radius: 8px;
        h1{{
            padding: 0;
            margin: 0;
            font-size: 16px;

        }}
        .detail_child{{
            margin-bottom: 15px;
        }}
        .detail_key{{
            font-size: 20px;
            font-weight: bold;
        }}
        .detail_value{{
            color: #106085;
            font-size: 20px;
        }}

`

export default {model}Detail
    """
    
    
    
    
    
    
    
    
    
    with open(file_path, 'w') as file:
        file.write(imports)
    