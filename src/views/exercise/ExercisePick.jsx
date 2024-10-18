
    import React, { useEffect, useRef, useState } from 'react'
    import { useSearchParams } from 'react-router-dom'
    import exerciseService from './ExerciseService';
    import CommonTable from '../../components/commons/CommonTable';
    import { ButtonStyle, SearchInputStyle } from '../../components/commons/CommonStyles';
    import { Divider, Input } from 'antd';
    import { searchExercise, updateExerciseState, exerciseSearchText } from './ExerciseRedux';//** */
    import { useDispatch, useSelector } from 'react-redux'; /*** */

    
    const ExercisePick = ({setIsModalOpen,selectHandler}) => {
    const [exerciseData, setExerciseData] = useState([])
    const [total, setTotal] = useState()
    const [searchParams,setSearchParams] = useSearchParams()
    const dispatch = useDispatch(); /*** */
    const searchText = useSelector(exerciseSearchText); //** */
    
    
    const [loading, setLoading] = useState();
    const [exerciseSelection, setExerciseSelection] = useState([])
    const delayTimerRef = useRef(null);
    
    const getPaginationInfo = () => {

        return [searchParams.get('page') || 1, searchParams.get('limit') || 5]
    }


    useEffect(() => {
        const [page, limit] = getPaginationInfo();
        dispatch(updateExerciseState({ page: page, limit: limit }))

        searchData();
    }, [])

    async function searchData() {
        try {
            setLoading(true)
            const { payload } = await dispatch(searchExercise());
            setExerciseData(payload.data)
            setTotal(payload.total)
            setLoading(false)
        } catch (err) {
            setLoading(false)
        }
    }
    const searchHandler = (e) => {
        const { value } = e.target;
        const [page, limit] = getPaginationInfo();

        dispatch(updateExerciseState({ page: page, limit: limit, searchText: value }))
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
                title: 'type',
                dataIndex: 'type',

            },
             
            {
                title: 'question',
                dataIndex: 'question',

            },
             
            {
                title: 'choice',
                dataIndex: 'choice',

            },
             
            {
                title: 'files',
                dataIndex: 'files',

            },
             
            {
                title: 'training_type',
                dataIndex: 'training_type',

            },
             
            {
                title: 'excercise_type',
                dataIndex: 'excercise_type',

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
                data={exerciseData}
                columns={columns}
                setSelection={setExerciseSelection}
                handlePagination={handlePagination}
                total={total}
                loadding={loading}

            />
            <Divider style={{margin:15}}/>

<ButtonStyle>
     <button    onClick={()=>setIsModalOpen(false)} >
        cancel
      </button>
      <button disabled={exerciseSelection.length==0} className={exerciseSelection.length>0?'':'disable'} onClick={()=>selectHandler(exerciseSelection[0])}>
        Return
      </button>
     </ButtonStyle>     

    </div>
  )
}
    
    

    export default ExercisePick
    