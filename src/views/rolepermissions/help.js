/*
1) in sore.js file    
import rolepermissionsReducer from '../views/rolepermissions/RolepermissionsRedux' // import the rolepermissions
    
    export const store = configureStore({
  reducer: {
     ......
    rolepermissions: rolepermissionsReducer, // add the rolepermissions here
    
  },
})


2) in LayoutRouting.jsx

import RolepermissionsList from './views/rolepermissions/RolepermissionsList'
import RolepermissionsDetail from './views/rolepermissions/RolepermissionsDetails'

<Route path='rolepermissions' element={<RolepermissionsList/>}/>
<Route path='rolepermissions/:id' element={<RolepermissionsDetail/>}/>


3) in Sidebar.jsx (optional)

    await authService.checkPermmision(rolepermissions, 'read'))&&getItem(Rolepermissions,rolepermissions,<DashboardOutlined/>),
    
    and change the icon


4) back end index.js

const rolepermissionRoute = require('./rolepermissions/rolepermissionRouter');

{
    path: '/rolepermissions',
    route: rolepermissionRoute,
  },

*/
    