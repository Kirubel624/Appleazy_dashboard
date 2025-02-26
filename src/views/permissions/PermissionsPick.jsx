
    import React, { useEffect, useRef, useState } from 'react'
    import { useSearchParams } from 'react-router-dom'
    import permissionsService from './PermissionsService';
    import CommonTable from '../../components/commons/CommonTable';
    import { ButtonStyle, SearchInputStyle } from '../../components/commons/CommonStyles';
    import { Divider, Input } from 'antd';

    
    const PermissionsPick = ({setIsModalOpen,selectHandler}) => {
    const [permissionsData, setPermissionsData] = useState([])
    const [total, setTotal] = useState()
    const [searchParams,setSearchParams] = useSearchParams()
    const [searchText, setSearchText] = useState('')

    const [loading, setLoading] = useState();
    const [permissionsSelection, setPermissionsSelection] = useState([])
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
            const data = await permissionsService.searchUser({page,limit,searchText});
            setPermissionsData(data.data)
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
                title: 'perm_name',
                dataIndex: 'perm_name',

            },
            
         
         ];
    
    
    
    
    return (
    <div>

<SearchInputStyle>
                <Input onChange={searchHandler} placeholder="Search" />
            </SearchInputStyle>


    <CommonTable
                rowSelectionType={"radio"}
                data={permissionsData}
                columns={columns}
                setSelection={setPermissionsSelection}
                handlePagination={handlePagination}
                total={total}
                loadding={loading}

            />
            <Divider style={{margin:15}}/>

<ButtonStyle>
     <button    onClick={()=>setIsModalOpen(false)} >
        cancel
      </button>
      <button disabled={permissionsSelection.length==0} className={permissionsSelection.length>0?'':'disable'} onClick={()=>selectHandler(permissionsSelection[0])}>
        Return
      </button>
     </ButtonStyle>     

    </div>
  )
}
    
    

    export default PermissionsPick
    