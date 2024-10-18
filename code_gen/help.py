import os

def helpText(model,fields,folder_path):
    smodel = model.lower()
    file_path = os.path.join(folder_path,'help.js')
    
    text = f"""/*
1) in sore.js file    
import {smodel}Reducer from '../views/{smodel}/{model}Redux' // import the {smodel}
    
    export const store = configureStore({{
  reducer: {{
     ......
    {smodel}: {smodel}Reducer, // add the {smodel} here
    
  }},
}})


2) in LayoutRouting.jsx

import {model}List from './views/{smodel}/{model}List'
import {model}Detail from './views/{smodel}/{model}Details'

<Route path='{smodel}' element={{<{model}List/>}}/>
<Route path='{smodel}/:id' element={{<{model}Detail/>}}/>


3) in Sidebar.jsx (optional)

    await authService.checkPermmision({smodel}, 'read'))&&getItem({model},{smodel},<DashboardOutlined/>),
    
    and change the icon


4) back end index.js

const {smodel[:-1]}Route = require('./{smodel}/{smodel[:-1]}Router');

{{
    path: '/{smodel}',
    route: {smodel[:-1]}Route,
  }},

*/
    """
        
    
    
    
    with open(file_path, 'w') as file:
        file.write(text)