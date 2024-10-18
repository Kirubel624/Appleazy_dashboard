import api from "../../api/api";

class ExerciseService {
  createExercis(data) {
    return api
      .post("/assistant/exercise", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set correct headers
        },
      })
      .then((response) => {
        return response.data.data;
      });
  }

  updateExercis(data, id) {
    return api
      .patch("/assistant/exercise/" + id, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set correct headers
        },
      })
      .then((response) => {
        return response.data.data;
      });
  }

  searchExercis({ page, limit, searchText = null, sort = null, order }) {
    let url = `/assistant/exercise?page=${page}&limit=${limit}`;
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

  getExercis(id) {
    return api.get("/assistant/exercise/" + id).then((response) => {
      return response.data.data;
    });
  }

  deleteExercis(id) {
    return api.delete("/assistant/exercise/" + id).then((response) => {
      return response.data.data;
    });
  }

  exerciseDo({ method, payload }) {
    return api
      .post("/assistant/exercise/do", { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }

  exercisDo({ method, payload, id }) {
    return api
      .post("/assistant/exercise/do/" + id, { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }
}

export default new ExerciseService();
