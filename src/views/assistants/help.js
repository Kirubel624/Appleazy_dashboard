/*
1) in sore.js file    
import assistantsReducer from '../views/assistants/AssistantsRedux' // import the assistants
    
    export const store = configureStore({
  reducer: {
     ......
    assistants: assistantsReducer, // add the assistants here
    
  },
})


2) in LayoutRouting.jsx

import AssistantsList from './views/assistants/AssistantsList'
import AssistantsDetail from './views/assistants/AssistantsDetails'

<Route path='assistants' element={<AssistantsList/>}/>
<Route path='assistants/:id' element={<AssistantsDetail/>}/>


3) in Sidebar.jsx (optional)

    await authService.checkPermmision(assistants, 'read'))&&getItem(Assistants,assistants,<DashboardOutlined/>),
    
    and change the icon


4) back end index.js

const assistantRoute = require('./assistants/assistantRouter');

{
    path: '/assistants',
    route: assistantRoute,
  },

*/
    