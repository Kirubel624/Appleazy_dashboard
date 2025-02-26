

import api from '../../api/api';

class Group_usersService {
    createGroup_user(data) {
        return api
            .post("/group_users", data)
            .then(response => {
                return response.data.data;
            });
    }

    updateGroup_user(data, id) {
        return api
            .patch("/group_users/" + id, data)
            .then(response => {
                return response.data.data;
            });
    }

    searchGroup_user({ page, limit, searchText = null, sort = null, order }) {
        let url = `/group_users?page=${page}&limit=${limit}`
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

    getGroup_user(id) {
        return api
            .get("/group_users/" + id)
            .then(response => {
                return response.data.data;
            });
    }


    deleteGroup_user(id) {
        return api
            .delete("/group_users/" + id)
            .then(response => {
                return response.data.data;
            });
    }

    group_usersDo({ method, payload }) {
        return api
            .post("/group_users/do", { method, payload })
            .then(response => {
                return response.data.data;
            });
    }

    group_userDo({ method, payload, id, page, limit, searchText = null, sort = null, order }) {
        let url;
        if (method === "search_users") {
            url = `/group_users/do/${id}?page=${page}&limit=${limit}`

            if (sort) {
                const sortValue = order == 'ascend' ? sort : order == 'descend' ? '-' + sort : '';
                url = url + `&sort=${sortValue}`
            }

            if (searchText) {

                url = url + `&searchText=${searchText}`
            }
        } else {
            url = "/group_users/do/" + id
        }

        if(method=="search_users"){
            return api
            .post(url, { method, payload })
            .then(response => {
                return { data: response.data.data, total: response.data.total };
            });
        }

        return api
            .post(url, { method, payload })
            .then(response => {
                return response.data.data;
            });
    }
}

export default new Group_usersService();

