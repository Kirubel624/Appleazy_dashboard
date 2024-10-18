import os

def service(model,fields,folder_path):
    smodel = model.lower()
    file_path = os.path.join(folder_path,f'{model}Service.js')
    
    imports = f"""
    
import api from '../../api/api';

class {model}Service {{
    create{model[:-1]}(data) {{
        return api
            .post("/{smodel}", data)
            .then(response => {{
                return response.data.data;
            }});
    }}

    update{model[:-1]}(data, id) {{
        return api
            .patch("/{smodel}/" + id, data)
            .then(response => {{
                return response.data.data;
            }});
    }}

    search{model[:-1]}({{page, limit,searchText=null,sort=null,order}}) {{
        let url = `/{smodel}?page=${{page}}&limit=${{limit}}`
        if(sort){{
    const sortValue = order == 'ascend' ? sort : order == 'descend' ? '-'+sort:'';
            url = url + `&sort=${{sortValue}}`
        }}

        if(searchText){{
           
            url = url + `&searchText=${{searchText}}`
        }}

        return api
            .get(url)
            .then(response => {{
                return {{data:response.data.data,total:response.data.total}};
            }});
    }}

    get{model[:-1]}(id) {{
        return api
            .get("/{smodel}/" + id)
            .then(response => {{
                return response.data.data;
            }});
    }}


    delete{model[:-1]}( id) {{
        return api
            .delete("/{smodel}/" + id)
            .then(response => {{
                return response.data.data;
            }});
    }}

    {smodel}Do({{method,payload}}){{
        return api
            .post("/{smodel}/do",{{method,payload}})
            .then(response => {{
                return response.data.data;
            }});
    }}

    {smodel[:-1]}Do({{method,payload,id}}){{
        return api
            .post("/{smodel}/do/"+id,{{method,payload}})
            .then(response => {{
                return response.data.data;
            }});
    }}
}}

export default new {model}Service();

    """
    
    with open(file_path, 'w') as file:
        file.write(imports)