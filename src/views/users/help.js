/*
1) in sore.js file    
import usersReducer from '../views/users/UsersRedux' // import the users
    
    export const store = configureStore({
  reducer: {
     ......
    users: usersReducer, // add the users here
    
  },
})


2) in LayoutRouting.jsx

import UsersList from './views/users/UsersList'
import UsersDetail from './views/users/UsersDetails'

<Route path='users' element={<UsersList/>}/>
<Route path='users/:id' element={<UsersDetail/>}/>


3) in Sidebar.jsx (optional)

    await authService.checkPermmision(users, 'read'))&&getItem(Users,users,<DashboardOutlined/>),
    
    and change the icon


4) back end index.js

const userRoute = require('./users/userRouter');

{
    path: '/users',
    route: userRoute,
  },

*/
    