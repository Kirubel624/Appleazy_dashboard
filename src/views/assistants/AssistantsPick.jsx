
    import React, { useEffect, useRef, useState } from 'react'
    import { useSearchParams } from 'react-router-dom'
    import assistantsService from './AssistantsService';
    import CommonTable from '../../components/commons/CommonTable';
    import { ButtonStyle, SearchInputStyle } from '../../components/commons/CommonStyles';
    import { Divider, Input } from 'antd';
    import { searchAssistants, updateAssistantsState, assistantsSearchText } from './AssistantsRedux';//** */
    import { useDispatch, useSelector } from 'react-redux'; /*** */

    
    const AssistantsPick = ({setIsModalOpen,selectHandler}) => {
    const [assistantsData, setAssistantsData] = useState([])
    const [total, setTotal] = useState()
    const [searchParams,setSearchParams] = useSearchParams()
    const dispatch = useDispatch(); /*** */
    const searchText = useSelector(assistantsSearchText); //** */
    
    
    const [loading, setLoading] = useState();
    const [assistantsSelection, setAssistantsSelection] = useState([])
    const delayTimerRef = useRef(null);
    
    const getPaginationInfo = () => {

        return [searchParams.get('page') || 1, searchParams.get('limit') || 5]
    }


    useEffect(() => {
        const [page, limit] = getPaginationInfo();
        dispatch(updateAssistantsState({ page: page, limit: limit }))

        searchData();
    }, [])

    async function searchData() {
        try {
            setLoading(true)
            const { payload } = await dispatch(searchAssistants());
            setAssistantsData(payload.data)
            setTotal(payload.total)
            setLoading(false)
        } catch (err) {
            setLoading(false)
        }
    }
    const searchHandler = (e) => {
        const { value } = e.target;
        const [page, limit] = getPaginationInfo();

        dispatch(updateAssistantsState({ page: page, limit: limit, searchText: value }))
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
                title: 'profileimage',
                dataIndex: 'profileimage',

            },
             
            {
                title: 'experience',
                dataIndex: 'experience',

            },
             
            {
                title: 'skills',
                dataIndex: 'skills',

            },
             
            {
                title: 'firstname',
                dataIndex: 'firstname',

            },
             
            {
                title: 'lastname',
                dataIndex: 'lastname',

            },
             
            {
                title: 'resume',
                dataIndex: 'resume',

            },
             
            {
                title: 'availability',
                dataIndex: 'availability',

            },
             
            {
                title: 'trainingstatus',
                dataIndex: 'trainingstatus',

            },
             
            {
                title: 'completedjobs',
                dataIndex: 'completedjobs',

            },
             
            {
                title: 'ispassed',
                dataIndex: 'ispassed',
                render: (text, recored) => {
                    return recored.ispassed ? <p>true</p> : <p>false</p>
                },
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
                data={assistantsData}
                columns={columns}
                setSelection={setAssistantsSelection}
                handlePagination={handlePagination}
                total={total}
                loadding={loading}

            />
            <Divider style={{margin:15}}/>

<ButtonStyle>
     <button    onClick={()=>setIsModalOpen(false)} >
        cancel
      </button>
      <button disabled={assistantsSelection.length==0} className={assistantsSelection.length>0?'':'disable'} onClick={()=>selectHandler(assistantsSelection[0])}>
        Return
      </button>
     </ButtonStyle>     

    </div>
  )
}
    
    

    export default AssistantsPick
    