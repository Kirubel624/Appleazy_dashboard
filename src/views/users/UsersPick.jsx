
    import React, { useEffect, useRef, useState } from 'react'
    import { useSearchParams } from 'react-router-dom'
    import usersService from './UsersService';
    import CommonTable from '../../components/commons/CommonTable';
    import { ButtonStyle, SearchInputStyle } from '../../components/commons/CommonStyles';
    import { Divider, Input } from 'antd';
    import { searchUsers, updateUsersState, usersSearchText } from './UsersRedux';//** */
    import { useDispatch, useSelector } from 'react-redux'; /*** */

    
    const UsersPick = ({setIsModalOpen,selectHandler}) => {
    const [usersData, setUsersData] = useState([])
    const [total, setTotal] = useState()
    const [searchParams,setSearchParams] = useSearchParams()
    const dispatch = useDispatch(); /*** */
    const searchText = useSelector(usersSearchText); //** */
    
    
    const [loading, setLoading] = useState();
    const [usersSelection, setUsersSelection] = useState([])
    const delayTimerRef = useRef(null);
    
    const getPaginationInfo = () => {

        return [searchParams.get('page') || 1, searchParams.get('limit') || 5]
    }


    useEffect(() => {
        const [page, limit] = getPaginationInfo();
        dispatch(updateUsersState({ page: page, limit: limit }))

        searchData();
    }, [])

    async function searchData() {
        try {
            setLoading(true)
            const { payload } = await dispatch(searchUsers());
            setUsersData(payload.data)
            setTotal(payload.total)
            setLoading(false)
        } catch (err) {
            setLoading(false)
        }
    }
    const searchHandler = (e) => {
        const { value } = e.target;
        const [page, limit] = getPaginationInfo();

        dispatch(updateUsersState({ page: page, limit: limit, searchText: value }))
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = setTimeout(() => {


            searchData()
        }, 500);


    }

    const handlePagination = (page, pageSize) => {
        
        setSearchParams({page:page,limit:pageSize})
        searchData()
    }
    
    
     const columns = [
         
    
     
            {
                title: 'name',
                dataIndex: 'name',

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
                title: 'password',
                dataIndex: 'password',

            },
            
         
         ];
    
    
    
    
    return (

<div >
                <SearchInputStyle>
                    <Input onChange={searchHandler}
                        placeholder="Search"
                        value={searchText}
                        allowClear />
                </SearchInputStyle>


    <CommonTable
                rowSelectionType={"radio"}
                data={usersData}
                columns={columns}
                setSelection={setUsersSelection}
                handlePagination={handlePagination}
                total={total}
                loadding={loading}

            />
            <Divider style={{margin:15}}/>

<ButtonStyle>
     <button    onClick={()=>setIsModalOpen(false)} >
        cancel
      </button>
      <button disabled={usersSelection.length==0} className={usersSelection.length>0?'':'disable'} onClick={()=>selectHandler(usersSelection[0])}>
        Return
      </button>
     </ButtonStyle>     

    </div>
  )
}
    
    

    export default UsersPick
    