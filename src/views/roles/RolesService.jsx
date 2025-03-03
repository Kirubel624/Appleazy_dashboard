// import api from '../../api/api';

class RolesService {
  createRole(data, api) {
    return api.post("/roles", data).then((response) => {
      return response.data.data;
    });
  }

  updateRole(data, id, api) {
    return api.patch("/roles/" + id, data).then((response) => {
      return response.data.data;
    });
  }

  searchRole({ page, limit, searchText = null, sort = null, order, api }) {
    let url = `/roles?page=${page}&limit=${limit}`;
    if (sort) {
      const sortValue =
        order == "ascend" ? sort : order == "descend" ? "-" + sort : "";
      url = url + `&sort=${sortValue}`;
    }

    if (searchText) {
      url = url + `&searchText=${searchText}`;
    }

    return api.get(url).then((response) => {
      return { data: response.data.data, total: response.data.total };
    });
  }

  getRole(id, api) {
    return api.get("/roles/" + id).then((response) => {
      return response.data.data;
    });
  }

  deleteRole(id, api) {
    return api.delete("/roles/" + id).then((response) => {
      return response.data.data;
    });
  }

  rolesDo({ method, payload, api }) {
    console.log(method, payload);
    return api.post("/roles/do", { method, payload }).then((response) => {
      return response.data.data;
    });
  }

  roleDo({ method, payload, api }) {
    return api.post("/roles/do/" + id, { method, payload }).then((response) => {
      return response.data.data;
    });
  }
}

export default new RolesService();
