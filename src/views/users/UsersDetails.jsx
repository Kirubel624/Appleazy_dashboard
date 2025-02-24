import { Divider } from 'antd'
import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

const UsersDetail = () => {
    const {state} = useLocation();
  return (
    <DetailStyle>
        <h1>User Detail</h1>
        <Divider  style={{margin:'15px 0 25px 0'}} />

        <div className='detail_child'>
            <p className='detail_key'>Name:</p>
            <p className='detail_value'>{state?.fullName}</p>  
        </div>
        <div className='detail_child'>
            <p className='detail_key'>Username:</p>
            <p className='detail_value'>{state?.username}</p>  
        </div>   
        <div className='detail_child'>
            <p className='detail_key'>Email:</p>
            <p className='detail_value'>{state?.email}</p>  
        </div>   

        <div className='detail_child'>
            <p className='detail_key'>Phone Number:</p>
            <p className='detail_value'>{state?.phoneNumber}</p>  
        </div>  

        <div className='detail_child'>
            <p className='detail_key'>Branch:</p>
            <p className='detail_value'>{state?.branch}</p>  
        </div>  

        <div className='detail_child'>
            <p className='detail_key'>Role:</p>
            <p className='detail_value'>{state?.userType}</p>  
        </div>  

        <div className='detail_child'>
            <p className='detail_key'>Is System Admin:</p>
            <p className='detail_value'>{state?.isSystemAdmin}</p>  
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

export default UsersDetail