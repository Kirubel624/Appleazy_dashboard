
    import React, { useEffect, useRef, useState } from 'react'
    import { useSearchParams } from 'react-router-dom'
    import group_usersService from './Group_usersService';
    import CommonTable from '../../components/commons/CommonTable';
    import { ButtonStyle, SearchInputStyle } from '../../components/commons/CommonStyles';
    import { Divider, Input } from 'antd';

    
    const Group_usersPick = ({setIsModalOpen,selectHandler}) => {
    const [group_usersData, setGroup_usersData] = useState([])
    const [total, setTotal] = useState()
    const [searchParams,setSearchParams] = useSearchParams()
    const [searchText, setSearchText] = useState('')

    const [loading, setLoading] = useState();
    const [group_usersSelection, setGroup_usersSelection] = useState([])
    const delayTimerRef = useRef(null);

    useEffect(() => {
        const page =searchParams.get('page') || 1
        const limit = searchParams.get('limit') ||5
        setSearchParams({page:page,limit:limit})

        searchData({ page, limit });
    }, [])

    async function searchData({ page, limit,searchText }) {
        try {
            setLoading(true)
            const data = await group_usersService.searchUser({page,limit,searchText});
            setGroup_usersData(data.data)
            setTotal(data.total)
            setLoading(false)
        } catch (err) {
            setLoading(false)
        }
    }
    const searchHandler = (e) => {
        const { value } = e.target;
        setSearchText(value);
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = setTimeout(() => {
            const page = searchParams.get('page') || 1
            const limit = searchParams.get('limit') || 5
            setSearchParams({ page: page, limit: limit })
            searchData({ page, limit,searchText:e.target.value })
        }, 500); 


    }

    const handlePagination = (page, pageSize) => {
        
        setSearchParams({page:page,limit:pageSize})
        searchData({page,limit:pageSize})
    }
    
    
     const columns = [
         
    
     
            {
                title: 'fullname',
                dataIndex: 'fullname',

            },
             
            {
                title: 'username',
                dataIndex: 'username',

            },
             
            {
                title: 'email',
                dataIndex: 'email',

            },
             
            {
                title: 'issystemadmin',
                dataIndex: 'issystemadmin',
                render: (text, recored) => {
                    return recored.issystemadmin ? <p>true</p> : <p>false</p>
                },
            },
            
         
         ];
    
    
    
    
    return (
    <div>

<SearchInputStyle>
                <Input onChange={searchHandler} placeholder="Search" />
            </SearchInputStyle>


    <CommonTable
                rowSelectionType={"radio"}
                data={group_usersData}
                columns={columns}
                setSelection={setGroup_usersSelection}
                handlePagination={handlePagination}
                total={total}
                loadding={loading}

            />
            <Divider style={{margin:15}}/>

<ButtonStyle>
     <button    onClick={()=>setIsModalOpen(false)} >
        cancel
      </button>
      <button disabled={group_usersSelection.length==0} className={group_usersSelection.length>0?'':'disable'} onClick={()=>selectHandler(group_usersSelection[0])}>
        Return
      </button>
     </ButtonStyle>     

    </div>
  )
}
    
    

    export default Group_usersPick
    