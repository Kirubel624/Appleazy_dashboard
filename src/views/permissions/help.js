/*
1) in sore.js file    
import permissionsReducer from '../views/permissions/PermissionsRedux' // import the permissions
    
    export const store = configureStore({
  reducer: {
     ......
    permissions: permissionsReducer, // add the permissions here
    
  },
})


2) in LayoutRouting.jsx

import PermissionsList from './views/permissions/PermissionsList'
import PermissionsDetail from './views/permissions/PermissionsDetails'

<Route path='permissions' element={<PermissionsList/>}/>
<Route path='permissions/:id' element={<PermissionsDetail/>}/>


3) in Sidebar.jsx (optional)

    await authService.checkPermmision(permissions, 'read'))&&getItem(Permissions,permissions,<DashboardOutlined/>),
    
    and change the icon


4) back end index.js

const permissionRoute = require('./permissions/permissionRouter');

{
    path: '/permissions',
    route: permissionRoute,
  },

*/
    