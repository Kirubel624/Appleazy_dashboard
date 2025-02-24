
    import React, { useEffect, useRef, useState } from 'react'
    import { useSearchParams } from 'react-router-dom'
    import rolepermissionsService from './RolepermissionsService';
    import CommonTable from '../../components/commons/CommonTable';
    import { ButtonStyle, SearchInputStyle } from '../../components/commons/CommonStyles';
    import { Divider, Input } from 'antd';

    
    const RolepermissionsPick = ({setIsModalOpen,selectHandler}) => {
    const [rolepermissionsData, setRolepermissionsData] = useState([])
    const [total, setTotal] = useState()
    const [searchParams,setSearchParams] = useSearchParams()
    const [searchText, setSearchText] = useState('')

    const [loading, setLoading] = useState();
    const [rolepermissionsSelection, setRolepermissionsSelection] = useState([])
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
            const data = await rolepermissionsService.searchUser({page,limit,searchText});
            setRolepermissionsData(data.data)
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
                title: 'role',
                dataIndex: 'role',

            },
             
            {
                title: 'permission',
                dataIndex: 'permission',

            },
             
            {
                title: 'create',
                dataIndex: 'create',
                render: (text, recored) => {
                    return recored.create ? <p>true</p> : <p>false</p>
                },
            },
             
            {
                title: 'read',
                dataIndex: 'read',
                render: (text, recored) => {
                    return recored.read ? <p>true</p> : <p>false</p>
                },
            },
             
            {
                title: 'update',
                dataIndex: 'update',
                render: (text, recored) => {
                    return recored.update ? <p>true</p> : <p>false</p>
                },
            },
             
            {
                title: 'delete',
                dataIndex: 'delete',
                render: (text, recored) => {
                    return recored.delete ? <p>true</p> : <p>false</p>
                },
            },
             
            {
                title: 'date',
                dataIndex: 'date',

            },
            
         
         ];
    
    
    
    
    return (
    <div>

<SearchInputStyle>
                <Input onChange={searchHandler} placeholder="Search" />
            </SearchInputStyle>


    <CommonTable
                rowSelectionType={"radio"}
                data={rolepermissionsData}
                columns={columns}
                setSelection={setRolepermissionsSelection}
                handlePagination={handlePagination}
                total={total}
                loadding={loading}

            />
            <Divider style={{margin:15}}/>

<ButtonStyle>
     <button    onClick={()=>setIsModalOpen(false)} >
        cancel
      </button>
      <button disabled={rolepermissionsSelection.length==0} className={rolepermissionsSelection.length>0?'':'disable'} onClick={()=>selectHandler(rolepermissionsSelection[0])}>
        Return
      </button>
     </ButtonStyle>     

    </div>
  )
}
    
    

    export default RolepermissionsPick
    