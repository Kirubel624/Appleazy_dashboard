import api from "../../api/api";

class TrainingService {
  createTrainin(data) {
    return api
      .post("/assistant/training", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set correct headers
        },
      })
      .then((response) => {
        return response.data.data;
      });
  }

  updateTrainin(data, id) {
    return api
      .patch("/assistant/training/" + id, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set correct headers
        },
      })
      .then((response) => {
        return response.data.data;
      });
  }

  searchTrainin({ page, limit, searchText = null, sort = null, order }) {
    let url = `/assistant/training?page=${page}&limit=${limit}`;
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

  getTrainin(id) {
    return api.get("/assistant/training/" + id).then((response) => {
      return response.data.data;
    });
  }

  deleteTrainin(id) {
    return api.delete("/assistant/training/" + id).then((response) => {
      return response.data.data;
    });
  }

  trainingDo({ method, payload }) {
    return api
      .post("/assistant/training/do", { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }

  traininDo({ method, payload, id }) {
    return api
      .post("/assistant/training/do/" + id, { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }
}

export default new TrainingService();
