// import api from "../../api/api";

class TrainingService {
  createTrainin(data, api) {
    return api
      .post("/api/v1/assistant/training", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set correct headers
        },
      })
      .then((response) => {
        return response.data.data;
      });
  }

  updateTrainin(data, id, api) {
    return api
      .patch("/api/v1/assistant/training/" + id, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set correct headers
        },
      })
      .then((response) => {
        return response.data.data;
      });
  }

  searchTrainin({ page, limit, searchText = null, sort = null, order, api }) {
    let url = `/api/v1/assistant/training?page=${page}&limit=${limit}`;
    if (sort) {
      const sortValue =
        order == "ascend" ? sort : order == "descend" ? "-" + sort : "";
      url = url + `&sort=${sortValue}`;
    }

    if (searchText) {
      url = url + `&searchText=${searchText}`;
    }

    return api.get(url).then((response) => {
      return { data: response.data.trainings, total: response.data.totalItems };
    });
  }

  getTrainin(id, api) {
    return api.get("/api/v1/assistant/training/" + id).then((response) => {
      return response.data.data;
    });
  }

  deleteTrainin(id, api) {
    return api.delete("/api/v1/assistant/training/" + id).then((response) => {
      return response.data.data;
    });
  }

  trainingDo({ method, payload, api }) {
    return api
      .post("/api/v1/assistant/training/do", { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }

  traininDo({ method, payload, id, api }) {
    return api
      .post("/api/v1/assistant/training/do/" + id, { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }
}

export default new TrainingService();
