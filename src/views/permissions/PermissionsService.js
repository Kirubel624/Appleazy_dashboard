// import api from '../../api/api';

class PermissionsService {
  createPermission(data, api) {
    return api.post("/permissions", data).then((response) => {
      return response.data.data;
    });
  }

  updatePermission(data, id, api) {
    return api.patch("/permissions/" + id, data).then((response) => {
      return response.data.data;
    });
  }

  searchPermission({
    page,
    limit,
    searchText = null,
    sort = null,
    order,
    api,
  }) {
    let url = `/permissions?page=${page}&limit=${limit}`;
    if (sort) {
      const sortValue =
        order == "ascend" ? sort : order == "descend" ? "-" + sort : "";
      url = url + `&sort=${sortValue}`;
    }

    if (searchText) {
      url = url + `&searchText=${searchText}`;
    }

    return api
      .get(url)
      .then((response) => {
        console.log(response, "pppppppppppppppppppppppppp");
        return { data: response.data.data, total: response.data.total };
      })
      .catch((err) => console.log(err, "ooeoeoeooeoeo"));
  }

  getPermission(id, api) {
    return api.get("/permissions/" + id).then((response) => {
      return response.data.data;
    });
  }

  deletePermission(id, api) {
    return api.delete("/permissions/" + id).then((response) => {
      return response.data.data;
    });
  }

  permissionsDo({ method, payload, api }) {
    return api.post("/permissions/do", { method, payload }).then((response) => {
      return response.data.data;
    });
  }

  permissionDo({ method, payload, api }) {
    return (
      api.post("/permissions/do/" + id),
      { method, payload }.then((response) => {
        return response.data.data;
      })
    );
  }
}

export default new PermissionsService();
