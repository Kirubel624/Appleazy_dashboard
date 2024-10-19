
    import { Divider } from 'antd'
    import React from 'react'
    import { useLocation } from 'react-router-dom'
    import styled from 'styled-components'


    
    const AssistantsDetail = () => {
    const {state} = useLocation();
    return (
    <DetailStyle>
        <h1>User Detail</h1>
        <Divider  style={{margin:'15px 0 25px 0'}} />

    
    
    
                <div className='detail_child'>
                <p className='detail_key'>profileimage:</p>
                <p className='detail_value'>{state?.profileimage}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>experience:</p>
                <p className='detail_value'>{state?.experience}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>skills:</p>
                <p className='detail_value'>{state?.skills}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>firstname:</p>
                <p className='detail_value'>{state?.firstname}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>lastname:</p>
                <p className='detail_value'>{state?.lastname}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>resume:</p>
                <p className='detail_value'>{state?.resume}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>availability:</p>
                <p className='detail_value'>{state?.availability}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>trainingstatus:</p>
                <p className='detail_value'>{state?.trainingstatus}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>completedjobs:</p>
                <p className='detail_value'>{state?.completedjobs}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>ispassed:</p>
                <p className='detail_value'>{state?.ispassed?'true':'false'}</p>  
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

export default AssistantsDetail
    