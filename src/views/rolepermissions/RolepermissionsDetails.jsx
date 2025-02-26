
    import { Divider } from 'antd'
    import React from 'react'
    import { useLocation } from 'react-router-dom'
    import styled from 'styled-components'


    
    const RolepermissionsDetail = () => {
    const {state} = useLocation();
    return (
    <DetailStyle>
        <h1>User Detail</h1>
        <Divider  style={{margin:'15px 0 25px 0'}} />

    
    
    
                <div className='detail_child'>
                <p className='detail_key'>role:</p>
                <p className='detail_value'>{state?.role}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>permission:</p>
                <p className='detail_value'>{state?.permission}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>create:</p>
                <p className='detail_value'>{state?.create?'true':'false'}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>read:</p>
                <p className='detail_value'>{state?.read?'true':'false'}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>update:</p>
                <p className='detail_value'>{state?.update?'true':'false'}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>delete:</p>
                <p className='detail_value'>{state?.delete?'true':'false'}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>date:</p>
                <p className='detail_value'>{state?.date}</p>  
            </div>
            

    </DetailStyle>
  )
}
    


    const DetailStyle = styled.div`
        border: 1px lightgray;
        margin: 30px;
        padding: 20px;
        background-color: white;
        border-radius: 8px;
        h1{
            padding: 0;
            margin: 0;
            font-size: 16px;

        }
        .detail_child{
            margin-bottom: 15px;
        }
        .detail_key{
            font-size: 20px;
            font-weight: bold;
        }
        .detail_value{
            color: #106085;
            font-size: 20px;
        }

`

export default RolepermissionsDetail
    