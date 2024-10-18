import os

def addToList(model,fields,folder_path):
    smodel = model.lower()
    file_path = os.path.join(folder_path,f'{model}AddEdit.jsx')
    
    
    
    form = f"""

        """  
    for i,(k,v) in enumerate(fields.items()):
        if v == 'bool':
            form += f"""
                <Form.Item name={{['{smodel[:-1]}', '{k}']}} label="{k}" >
                    <Switch checked={{switch2}} onChange={{(value)=>setSwitch2(value)}} style={{{{background:switch2?'blue':'gray'}}}} />
                </Form.Item>
            """
        elif v == 'enum':
            form += f"""
                <Form.Item
            name={{['{smodel[:-1]}', '{k}']}}
            label="{k}"
            className=' flex-1'
            rules={{[
              {{
                required: true,
                message: 'Please select {k}!',
              }},
            ]}}
          >
            <Select
              className='border-gray-400 '
              placeholder="select your {k}">
              <Option value="value1">Value1</Option>
              <Option value="value2">Value2</Option>
            </Select>
          </Form.Item>
            """
        elif v == 'date':
            form += f"""
                <Form.Item name={{['{smodel[:-1]}', '{k}']}}  label="{k}">
            <DatePicker format={{'YYYY/MM/DD'}} />
        </Form.Item>
            """    
        elif v == 'number':
            form += f"""
            <Form.Item
      
            name={{['{smodel[:-1]}', '{k}']}}
            label="{k}"
            rules={{[
            {{
                type: 'number',
                min: 0,
                max: 99,
            }},

            ]}}
            
            >
            <InputNumber 
            className='border-gray-400 py-1'
            style={{{{
                minWidth:150
            }}}} 
            />
            </Form.Item>
                    """ 
        else:
            form += f"""
            <Form.Item
            className=' flex-1'
            name={{['{smodel[:-1]}', '{k}']}}
            label="{k}"
            rules={{[
                {{
                required: true,
                }},
            ]}}
            >
            <Input  
            className='border-gray-400 py-2'
            />
            </Form.Item>
            """    
    
    forms = f"""
    <FormStyle
        form={{form}}
        layout="vertical"
        name="nest-messages"
        onFinish={{onFinish}}
        onError={{() => {{}} }}

        validateMessages={{validateMessages}}
      >
      
      {form}
      
      
    {{{smodel}Data2.length>0 && <CommonTable
                    rowSelectionType={{"checkbox"}}
                    data={{{smodel}Data2}}
                    columns={{columns}}
                    total={{{smodel}Data2.lenght}}
                    loadding={{loading}}
                    type={{true}}

                />}}

                <Divider/>
            
      
      <ButtonStyle>
          <button onClick={{() => setIsModalOpen(false)}} >
            cancel
          </button>

          {{mode?<button type='submit'  >
           Submit
          </button>:<button type='submit'  >
            Add List
          </button>}}

          {{!mode&&<button disabled={{{smodel}Data2.length==0}} onClick={{onAdd}} className={{{smodel}Data2.length>0?"":'disable'}} type='submit'  >
            Submit
          </button>}}
        </ButtonStyle>
      </FormStyle>
    """  
    
    returns = f"""
    return (
    <div>
      {{/*******  picks **********/}}
      {{{smodel[:-1]}Pick ? <CommonModal
        width={{700}}
        isModalOpen={{{smodel[:-1]}Pick}}
        setIsModalOpen={{set{model[:-1]}Pick}}
      >
        <{model}Pick
          setIsModalOpen={{set{model[:-1]}Pick}}
          selectHandler={{{smodel[:-1]}PickHandler}}
        />
      </CommonModal> : ""}}


      {{loading ? <SpinStyle>
        <Spin style={{{{ color: "#fff" }}}} size="large" />
      </SpinStyle> : ""}}
      <button onClick={{() => set{model[:-1]}Pick(true)}}>hhhhhh</button>
      
      
      {forms}
      
       
      </div>
  )
    
    """
    
    column = f"""
    
    """  
    
    for i,(k,v) in enumerate(fields.items()):
        if  v=='bool':
            column += f""" 
            {{
                title: '{k}',
                dataIndex: '{k}',
                render: (text, recored) => {{
                    return recored.{k} ? <p>true</p> : <p>false</p>
                }},
            }},
            """
        else:
            column += f""" 
            {{
                title: '{k}',
                dataIndex: '{k}',

            }},
            """
    
    
    columns = f"""
     const columns = [
         {column}
         
         ];
    
    """  
    
    react_func = f"""
    const {model}Edit = ({{setIsModalOpen,isModelOpen,mode,setMode,{smodel}Data,searchData}}) => {{
      const [{smodel}Data2, set{model}Data2] = useState([])

      const [form] = Form.useForm();
      const [switch2,setSwitch2] = useState("")
      const [loading,setLoading] = useState("")
      const [{smodel[:-1]}Pick,set{model[:-1]}Pick] = useState(false)


    
    useEffect(()=>{{
        const featchData = async()=>{{
        try{{

            const data = await {smodel}Service.get{model[:-1]}(mode);
            form.setFieldsValue({{ {smodel[:-1]}: {{...data,updatedAt:dayjs(data.updatedAt)}} }});
            
    
        }}catch(err){{
        }}
        }}
        if (mode==''){{
        
        }} else{{
        
        featchData()
        }}
    }},[])


    const handleReset = () => {{
        form.resetFields();
    }}; 

    const {smodel[:-1]}PickHandler=(data)=>{{
        console.log('{smodel[:-1]}PickHandler',data)
        
        set{model[:-1]}Pick(false)
        
    }}


    const onAdd = async(e)=>{{
      e.preventDefault();
        try{{

        setLoading(true);

        const data = await {smodel}Service.{smodel}Do({{method:'add_list_to_{smodel[:-1]}',payload:{{data:{smodel}Data2}}}})
        setIsModalOpen(false)
        
        searchData()
        setLoading(false);

        }}catch(err){{
        setLoading(false);
        }}
    }} 

    const onUpdate = async(datas)=>{{
        
        try{{

        setLoading(true);

        const data = await {smodel}Service.update{model[:-1]}(datas.{smodel[:-1]},mode)
        searchData()
        setIsModalOpen(false)
        setLoading(false);

        }}catch(err){{
        setLoading(false);
        }}
    }}
    

    const onFinish = (values) => {{
      console.log("===========")
        mode == ''? handleAddToList(values):onUpdate(values)
    }};
    const handleAddToList = (e)=>{{
      // e.preventDefault()
      set{model}Data2([{{...form.getFieldsValue()?.{smodel[:-1]},_id:new Date().getTime()}},...{smodel}Data2])
      handleReset()
    }}
    
    
    const onClick = ({{ key }}, record) => {{
      if (key == 'edit') {{
        console.log("========",record)

        form.setFieldsValue({{{smodel[:-1]}:record}})
        const data = {smodel}Data2.filter(({smodel[:-1]})=>{smodel[:-1]}._id !== record._id)
        set{model}Data2(data)

      }} else if (key === 'delete') {{
        console.log("========",record)
          const data = {smodel}Data2.filter(({smodel[:-1]})=>{smodel[:-1]}._id !== record._id)
          set{model}Data2(data)
      }}
  }};
    const items = [
      {{
          key: 'edit',
          label: (
              <Button type="text">Edit</Button>
          ),


      }},
      {{
          key: 'delete',
          label: (
              <Button type="text"> Delete</Button>
          ),
      }},
      {{
          key: '3',
          label: (
              <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                  3rd menu item
              </a>
          ),
      }},
  ];
  {columns}
  
  
  {returns}
  
   }}  
   
   
  const SpinStyle = styled.div`
  /* border: 1px solid; */
  width: 50px;
  height:  50px;
  background-color: rgba(0,0,0,0.2);
  z-index: 100;
  display: flex;
  border-radius:  120px;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 40%;

  .ant-spin-dot .ant-spin-dot-spin {{
    background-color: red; 
  }}
 


`



export default {model}Edit
    """
    
    
    

    imports = f"""
    
import React, {{ useEffect, useState }} from 'react'
import {{ Button, Divider, Dropdown, Form, Input, InputNumber, Select, Spin, Switch,DatePicker }} from 'antd';
import styled from 'styled-components';
import {{ ButtonStyle, FlexStyle, FormStyle }} from '../../components/commons/CommonStyles';
import {smodel}Service from './{model}Service';
import CommonModal from '../../components/commons/CommonModel';
import {model}Pick from './{model}Pick';
import dayjs from 'dayjs';
import CommonTable from '../../components/commons/CommonTable';
import {{
  MoreOutlined,
  ReloadOutlined
}} from '@ant-design/icons';

import {{ NavLink }} from 'react-router-dom';
    const {{ Option }} = Select;

    const validateMessages = {{
    required: '${{label}} is required!',
    types: {{
        email: '${{label}} is not a valid email!',
        number: '${{label}} is not a valid number!',
    }},
    number: {{
        range: '${{label}} must be between ${{min}} and ${{max}}',
    }},
    }};
    
    
    {react_func}
    """
    
    
    with open(file_path, 'w') as file:
        file.write(imports)
    
    
    
    
    