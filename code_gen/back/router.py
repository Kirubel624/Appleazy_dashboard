import os

def backRouter(model,fields,folder_path):
    smodel = model.lower()
    file_path = os.path.join(folder_path,f'{smodel[:-1]}Router.js')
    
    all = f"""
    const express = require('express')
const {{
  get{model[:-1]},
  update{model[:-1]},
  create{model[:-1]},
  search{model},
  delete{model[:-1]},
  {smodel[:-1]}ListDo,
  {smodel[:-1]}DetailDo
}} = require("./{smodel[:-1]}Controller");
const {{ protect, restricTo }} = require('../auth/auth.controller');

const router = express.Router();


router.route('').post(protect,restricTo("{smodel}",'create'), create{model[:-1]}).get(protect, restricTo("{smodel}",'read'), search{model})
router.route('/do').post(protect,restricTo("{smodel}",'create'), {smodel[:-1]}ListDo)
router.route('/do/:id').post(protect,restricTo("{smodel}",'create'), {smodel[:-1]}DetailDo)



router.route("/:id").patch(protect,restricTo("{smodel}",'update'), update{model[:-1]})
                    .get(protect,restricTo("{smodel}",'read'), get{model[:-1]})
                    .delete(protect,restricTo("{smodel}","delete"),delete{model[:-1]});

module.exports = router;

    
    """
    with open(file_path, 'w') as file:
        file.write(all)   