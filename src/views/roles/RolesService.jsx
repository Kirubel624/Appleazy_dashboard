

import api from '../../api/api';

class RolesService {
    createRole(data) {
        return api
            .post("/roles", data)
            .then(response => {
                return response.data.data;
            });
    }

    updateRole(data, id) {
        return api
            .patch("/roles/" + id, data)
            .then(response => {
                return response.data.data;
            });
    }

    searchRole({ page, limit, searchText = null, sort = null, order }) {
        let url = `/roles?page=${page}&limit=${limit}`
        if (sort) {
            const sortValue = order == 'ascend' ? sort : order == 'descend' ? '-' + sort : '';
            url = url + `&sort=${sortValue}`
        }

        if (searchText) {

            url = url + `&searchText=${searchText}`
        }

        return api
            .get(url)
            .then(response => {
                return { data: response.data.data, total: response.data.total };
            });
    }

    getRole(id) {
        return api
            .get("/roles/" + id)
            .then(response => {
                return response.data.data;
            });
    }


    deleteRole(id) {
        return api
            .delete("/roles/" + id)
            .then(response => {
                return response.data.data;
            });
    }

    rolesDo({method,payload}) {
        console.log(method,payload)
        return api
            .post("/roles/do",{method,payload})
            .then(response => {
                return response.data.data;
            });
    }

    roleDo({method,payload}) {
        return api
            .post("/roles/do/"+ id,{method,payload})
            .then(response => {
                return response.data.data;
            });
    }
}

export default new RolesService();

