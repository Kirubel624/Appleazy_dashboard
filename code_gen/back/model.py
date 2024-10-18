import os

def backModel(model,fields,folder_path):
    smodel = model.lower()
    file_path = os.path.join(folder_path,f'{smodel[:-1]}Model.js')
    
    
    
    forms = f"""
    """
    
    for i,(k,v) in enumerate(fields.items()):
         if v == 'bool':
             forms += f"""
                {k}:Boolean,
             """
         elif v == 'date':
             forms += f"""
                {k}:Date,
             """     
         elif v == 'enum':
             forms += f"""
                {k}: {{
                type: String,
                enum: {{
                    values: ["value1", "value2"],
                }},
                 }},
             """    
         elif v == 'number':
             forms += f"""
                {k}:Number,
            """   
         else:
             forms += f"""
                {k}:String,
            """  
                   
                
             
    
    all = f"""
    const mongoose = require('mongoose');

    const {smodel[:-1]}Schema = new mongoose.Schema(
        {{
        {forms}
        }},
        {{
            timestamps:true
        }}
    )

    const {model[:-1]} = mongoose.model('{model[:-1]}',{smodel[:-1]}Schema);

    module.exports = {model[:-1]};
    
    """
    
    with open(file_path, 'w') as file:
        file.write(all)
    
    