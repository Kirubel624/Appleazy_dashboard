import api from "../../api/api";

class RolepermissionsService {
  createRolepermission(data) {
    return api.post("/rolepermissions", data).then((response) => {
      return response.data.data;
    });
  }

  updateRolepermission(data, id) {
    return api.patch("/rolepermissions/" + id, data).then((response) => {
      return response.data.data;
    });
  }

  searchRolepermission({
    page,
    limit,
    searchText = null,
    sort = null,
    order,
    id,
  }) {
    let url = `/rolepermissions?page=${page}&limit=${limit}`;
    if (sort) {
      const sortValue =
        order == "ascend" ? sort : order == "descend" ? "-" + sort : "";
      url = url + `&sort=${sortValue}`;
    }

    if (searchText) {
      url = url + `&searchText=${searchText}`;
    }
    if (id) {
      url = url + `&permission=${id}`;
    }

    return api.get(url).then((response) => {
      return { data: response.data.data, total: response.data.total };
    });
  }

  getRolepermission(id) {
    return api.get("/rolepermissions/" + id).then((response) => {
      return response.data.data;
    });
  }
  getRolePermissions(id) {
    return api
      .get("/rolepermissions/" + id + "/permissions")
      .then((response) => {
        return response.data.data;
      })
      .catch((err) => console.log(err, "eepepepep"));
  }
  deleteRolepermission(id) {
    return api.delete("/rolepermissions/" + id).then((response) => {
      return response.data.data;
    });
  }

  rolepermissionsDo({ method, payload }) {
    return api
      .post("/rolepermissions/do", { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }

  rolepermissionDo({ method, payload, id }) {
    console.log("method,payload,id", method, payload);
    return api
      .post("/rolepermissions/do/" + id, { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }
}

export default new RolepermissionsService();
