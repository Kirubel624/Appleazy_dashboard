
    import { Divider } from 'antd'
    import React from 'react'
    import { useLocation } from 'react-router-dom'
    import styled from 'styled-components'


    
    const ExerciseDetail = () => {
    const {state} = useLocation();
    return (
    <DetailStyle>
        <h1>User Detail</h1>
        <Divider  style={{margin:'15px 0 25px 0'}} />

    
    
    
                <div className='detail_child'>
                <p className='detail_key'>type:</p>
                <p className='detail_value'>{state?.type}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>question:</p>
                <p className='detail_value'>{state?.question}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>choice:</p>
                <p className='detail_value'>{state?.choice}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>files:</p>
                <p className='detail_value'>{state?.files}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>training_type:</p>
                <p className='detail_value'>{state?.training_type}</p>  
            </div>
            
                <div className='detail_child'>
                <p className='detail_key'>excercise_type:</p>
                <p className='detail_value'>{state?.excercise_type}</p>  
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

export default ExerciseDetail
    