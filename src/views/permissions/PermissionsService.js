
    
import api from '../../api/api';

class PermissionsService {
    createPermission(data) {
        return api
            .post("/permissions", data)
            .then(response => {
                return response.data.data;
            });
    }

    updatePermission(data, id) {
        return api
            .patch("/permissions/" + id, data)
            .then(response => {
                return response.data.data;
            });
    }

    searchPermission({page, limit,searchText=null,sort=null,order}) {
        let url = `/permissions?page=${page}&limit=${limit}`
        if(sort){
    const sortValue = order == 'ascend' ? sort : order == 'descend' ? '-'+sort:'';
            url = url + `&sort=${sortValue}`
        }

        if(searchText){
           
            url = url + `&searchText=${searchText}`
        }

        return api
            .get(url)
            .then(response => {
                return {data:response.data.data,total:response.data.total};
            });
    }

    getPermission(id) {
        return api
            .get("/permissions/" + id)
            .then(response => {
                return response.data.data;
            });
    }


    deletePermission( id) {
        return api
            .delete("/permissions/" + id)
            .then(response => {
                return response.data.data;
            });
    }

    permissionsDo({method,payload}){
        return api
            .post("/permissions/do",{method,payload})
            .then(response => {
                return response.data.data;
            });
    }

    permissionDo({method,payload}){
        return api
            .post("/permissions/do/"+id),{method,payload}
            .then(response => {
                return response.data.data;
            });
    }
}

export default new PermissionsService();

    