/*
1) in sore.js file    
import group_usersReducer from '../views/group_users/Group_usersRedux' // import the group_users
    
    export const store = configureStore({
  reducer: {
     ......
    group_users: group_usersReducer, // add the group_users here
    
  },
})


2) in LayoutRouting.jsx

import Group_usersList from './views/group_users/Group_usersList'
import Group_usersDetail from './views/group_users/Group_usersDetails'

<Route path='group_users' element={<Group_usersList/>}/>
<Route path='group_users/:id' element={<Group_usersDetail/>}/>


3) in Sidebar.jsx (optional)

    await authService.checkPermmision(group_users, 'read'))&&getItem(Group_users,group_users,<DashboardOutlined/>),
    
    and change the icon


4) back end index.js

const group_userRoute = require('./group_users/group_userRouter');

{
    path: '/group_users',
    route: group_userRoute,
  },

*/
    