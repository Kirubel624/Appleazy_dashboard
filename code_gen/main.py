from list import list
from edit import edit
from detail import detail
from pick import pick
from redux import redux
from service import service
from help import helpText
from addtoList import addToList
from back.model import backModel
from back.controller import backController
from back.router import backRouter




import os

def start():
    model = input("enter a model name: ").capitalize()
    
    fields = {}
    start = True
    count = 1
    smodel = model.lower()
    
    
    while start:
        key = input(f"Enter your field name {count}: ")
        if key == 'q':
            start =False
            break
            
        val = input(f"Enter the yupe of {key} [string, bool, enum, date, number]: ")
        fields[key.lower()]=val
        count +=1
    folder_path = os.path.join(os.path.dirname(__file__), '..','client','src','pages',smodel)
    # folder_path_model = os.path.join(os.path.dirname(__file__), '..','server','src','models')
    # folder_path_back = os.path.join(os.path.dirname(__file__), '..','server','src','routes',smodel)

    
    
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)   
    
    # if not os.path.exists(folder_path_back):
    #     os.makedirs(folder_path_back)        
    
    list(model,fields,folder_path)
    edit(model,fields,folder_path)
    detail(model,fields,folder_path)
    pick(model,fields,folder_path)
    redux(model,fields,folder_path)
    service(model,fields,folder_path)
    addToList(model,fields,folder_path)
    
    # backModel(model,fields,folder_path_model)
    # backController(model,fields,folder_path_back)
    # backRouter(model,fields,folder_path_back)
    
    
    
    helpText(model,fields,folder_path)
    
    
    
    
    
    
    
start()    
    
