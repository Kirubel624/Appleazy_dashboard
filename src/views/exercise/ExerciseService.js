// import api from "../../api/api";

class ExerciseService {
  createExercis(data, api) {
    return api
      .post("/api/v1/assistant/exercise", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set correct headers
        },
      })
      .then((response) => {
        return response.data.data;
      });
  }

  updateExercis(data, id, api) {
    return api
      .patch("/api/v1/assistant/exercise/" + id, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set correct headers
        },
      })
      .then((response) => {
        return response.data.data;
      });
  }

  searchExercis({ page, limit, searchText = null, sort = null, order, api }) {
    let url = `/api/v1/assistant/exercise?page=${page}&limit=${limit}`;
    if (sort) {
      const sortValue =
        order == "ascend" ? sort : order == "descend" ? "-" + sort : "";
      url = url + `&sort=${sortValue}`;
    }

    if (searchText) {
      url = url + `&searchText=${searchText}`;
    }

    return api.get(url).then((response) => {
      return {
        data: response.data.excercises,
        total: response.data.totalItems,
      };
    });
  }

  getExercis(id, api) {
    return api.get("/api/v1/assistant/exercise/" + id).then((response) => {
      return response.data.data;
    });
  }

  deleteExercis(id, api) {
    return api.delete("/api/v1/assistant/exercise/" + id).then((response) => {
      return response.data.data;
    });
  }

  exerciseDo({ method, payload, api }) {
    return api
      .post("/api/v1/assistant/exercise/do", { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }

  exercisDo({ method, payload, id, api }) {
    return api
      .post("/api/v1/assistant/exercise/do/" + id, { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }
}

export default new ExerciseService();
