/*
1) in sore.js file    
import trainingReducer from '../views/training/TrainingRedux' // import the training
    
    export const store = configureStore({
  reducer: {
     ......
    training: trainingReducer, // add the training here
    
  },
})


2) in LayoutRouting.jsx

import TrainingList from './views/training/TrainingList'
import TrainingDetail from './views/training/TrainingDetails'

<Route path='training' element={<TrainingList/>}/>
<Route path='training/:id' element={<TrainingDetail/>}/>


3) in Sidebar.jsx (optional)

    await authService.checkPermmision(training, 'read'))&&getItem(Training,training,<DashboardOutlined/>),
    
    and change the icon


4) back end index.js

const traininRoute = require('./training/traininRouter');

{
    path: '/training',
    route: traininRoute,
  },

*/
    