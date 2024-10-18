import os

def edit(model,fields,folder_path):
    smodel = model.lower()
    file_path = os.path.join(folder_path,f'{model}Edit.jsx')
    
    
    imports = f"""
    import React, {{ useEffect, useState }} from 'react'
    import {{ Button, Form, Input, InputNumber, Select, Spin, Switch,DatePicker,Divider }} from 'antd';
    import styled from 'styled-components';
    import {{ ButtonStyle, FlexStyle, FormStyle }} from '../../components/commons/CommonStyles';
    import {smodel}Service from './{model}Service';
    import CommonModal from '../../components/commons/CommonModel';
    import {model}Pick from './{model}Pick';
    import dayjs from 'dayjs';
    
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
    """
    
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
        onError={{() => {{ }} }}

        validateMessages={{validateMessages}}
      >
      {form}
      
      <ButtonStyle>
          <button onClick={{() => setIsModalOpen(false)}} >
            cancel
          </button>
          <button type="submit" >
            Submit
          </button>
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
    
    
    
    react_func = f"""
    const {model}Edit = ({{setIsModalOpen,isModelOpen,mode,setMode,{smodel}Data,searchData}}) => {{
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
        form.resetFields(); // Reset form fields
    }}; 

    const {smodel[:-1]}PickHandler=(data)=>{{
        console.log('{smodel[:-1]}PickHandler',data)
        
        set{model[:-1]}Pick(false)
        
    }}


    const onAdd = async(datas)=>{{
        try{{

        setLoading(true);

        const data = await {smodel}Service.create{model[:-1]}(datas.{smodel[:-1]})
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
        mode == ''? onAdd(values):onUpdate(values)
    }};
    
    
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
    
    imports +=  react_func
    
    with open(file_path, 'w') as file:
        file.write(imports)
    