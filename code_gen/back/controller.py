import os

def backController(model,fields,folder_path):
    smodel = model.lower()
    file_path = os.path.join(folder_path,f'{smodel[:-1]}Controller.js')
    
    
    all = f"""
    const {model[:-1]} = require("../../models/{smodel[:-1]}Model");
    const AppErorr = require("../../utils/appError");
    const APIFeature = require('../../utils/apiFeature')
    const filterObj = require('../../utils/pick')
    const catchAsync = require("../../utils/catchAsync");





const create{model[:-1]} = catchAsync(async (req, res, next)=>{{

   

  const {smodel[:-1]} = await {model[:-1]}.create(req.body);

  res.status(201).json({{
    status:"success",
    data:{smodel[:-1]}
  }})
  
}});


const search{model} = catchAsync(async (req,res,next)=>{{
  if(req.query.{smodel[:-1]}name){{
    req.query.{smodel[:-1]}name = {{ $regex: req.query.{smodel[:-1]}name, $options: 'i' }} 

  }}
  if(req.query.searchText){{
    req.query.{smodel[:-1]}_name = {{ $regex: req.query.searchText, $options: 'i' }} 

  }}
  const feature = new APIFeature({model[:-1]}.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paging();
  const {model} = await feature.query;
  const count = await {model[:-1]}.countDocuments({{}});

  res.status(200).json({{
    status:'success2',
    total:count,
    data:{model}
  }})

}});

const get{model[:-1]} = catchAsync(async (req, res, next) => {{
  const {smodel[:-1]} = await {model[:-1]}.findById({{ _id: req.params.id }});
  if (!{smodel[:-1]}) {{
    return next(new AppErorr("There is not {smodel[:-1]} in this ID", 404));
  }}
  res.status(200).json({{ 
    status: "success",
    data: {smodel[:-1]},
  }});
}});



const update{model[:-1]} = catchAsync(async (req, res, next) => {{
 
    const {{ id }} = req.params;
  
    const {smodel[:-1]} = await {model[:-1]}.findByIdAndUpdate(id,req.body,{{new:true}})
    if (!{smodel[:-1]}) {{
      return next(new AppErorr('{smodel[:-1]} is not found!', 404))
    }}
    
    res.status(201).json({{
      status: "success",
      message: "The {model[:-1]} is updated successfully!",
      data:{smodel[:-1]}
  
    }})
}});



const delete{model[:-1]} = catchAsync(async (req, res, next) => {{
    const {{ id }} = req.params;
  
    const {smodel[:-1]} = await {model[:-1]}.findByIdAndDelete(id)
    if (!{smodel[:-1]}) {{
      return next(new AppErorr('{smodel[:-1]} is not found!', 404))
    }}
    res.status(205).json({{
      status: "success",
      message: "The {model[:-1]} is  deleted!",
      data:null
  
    }})
}});


const {smodel[:-1]}ListDo = catchAsync(async (req, res, next) => {{
    const {{ method,payload }} = req.body;

    const method_list = ['add_list_to_{smodel[:-1]}','method2']

    if(method_list.includes(method) && method == 'add_list_to_{smodel[:-1]}'){{
      
      try{{
       
        
        
        for (let {smodel[:-1]} of payload.data){{
            const filteredBody =  filterObj({smodel[:-1]}, "{smodel[:-1]}_name") ;
           
            const new{model[:-1]} = new {model[:-1]}(filteredBody);
            await new{model[:-1]}.save();
          
        }}
       
      
      
      res.status(201).json({{
        status: "success",
        message: "The {model[:-1]} is created successfully!",
      }})

    }}catch(err){{      
      return next(new AppErorr('Something is wrong!', 400))

    }}

    }}else if(method_list.includes(method) && method == 'medthod2'){{

    }}

    
  
   
    return next(new AppErorr('method is not found!', 404))
   
}});

const {smodel[:-1]}DetailDo = catchAsync(async (req, res, next) => {{
    const {{ method,payload }} = req.body;
    const {{id }} = req.params

    const method_list = ['method1','method2']

    if(method_list.includes(method) && method == 'method1'){{

    }}else if(method_list.includes(method) && method == 'medthod2'){{

    }}

    
  
   
    return next(new AppErorr('method is not found!', 404))
}});



module.exports = {{
  create{model[:-1]},
  search{model},
  get{model[:-1]},
  update{model[:-1]},
  delete{model[:-1]},
  {smodel[:-1]}ListDo,
  {smodel[:-1]}DetailDo

}}
    
    
    """

    with open(file_path, 'w') as file:
        file.write(all)    