/*
1) in sore.js file    
import exerciseReducer from '../views/exercise/ExerciseRedux' // import the exercise
    
    export const store = configureStore({
  reducer: {
     ......
    exercise: exerciseReducer, // add the exercise here
    
  },
})


2) in LayoutRouting.jsx

import ExerciseList from './views/exercise/ExerciseList'
import ExerciseDetail from './views/exercise/ExerciseDetails'

<Route path='exercise' element={<ExerciseList/>}/>
<Route path='exercise/:id' element={<ExerciseDetail/>}/>

P
3) in Sidebar.jsx (optional)

    await authService.checkPermmision(exercise, 'read'))&&getItem(Exercise,exercise,<DashboardOutlined/>),
    
    and change the icon


4) back end index.js

const exercisRoute = require('./exercise/exercisRouter');

{
    path: '/exercise',
    route: exercisRoute,
  },

*/
