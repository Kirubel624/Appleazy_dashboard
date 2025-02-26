
    import React, { useEffect, useRef, useState } from 'react'
    import { useSearchParams } from 'react-router-dom'
    import rolesService from './RolesService';
    import CommonTable from '../../components/commons/CommonTable';
    import { ButtonStyle, SearchInputStyle } from '../../components/commons/CommonStyles';
    import { Divider, Input } from 'antd';

    
    const RolesPick = ({setIsModalOpen,selectHandler,selectedType}) => {
    const [rolesData, setRolesData] = useState([])
    const [total, setTotal] = useState()
    const [searchParams,setSearchParams] = useSearchParams()
    const [searchText, setSearchText] = useState('')

    const [loading, setLoading] = useState();
    const [rolesSelection, setRolesSelection] = useState([])
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
            console.log("================================")

            const data = await rolesService.searchRole({page,limit,searchText});
            setRolesData(data.data)
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
                title: 'role_name',
                dataIndex: 'role_name',

            },
            
         
         ];
    
    
    
    
    return (
    <div>

<SearchInputStyle>
                <Input onChange={searchHandler} placeholder="Search" />
            </SearchInputStyle>


    <CommonTable
                rowSelectionType={selectedType}
                data={rolesData}
                columns={columns}
                setSelection={setRolesSelection}
                handlePagination={handlePagination}
                total={total}
                loadding={loading}

            />
            <Divider style={{margin:15}}/>

<ButtonStyle>
     <button    onClick={()=>setIsModalOpen(false)} >
        cancel
      </button>
      <button disabled={rolesSelection.length==0} className={rolesSelection.length>0?'':'disable'} onClick={()=>selectHandler(rolesSelection)}>
        Return
      </button>
     </ButtonStyle>     

    </div>
  )
}
    
    

    export default RolesPick
    