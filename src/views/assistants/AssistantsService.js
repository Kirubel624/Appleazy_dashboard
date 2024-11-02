import api from "../../api/api";

class AssistantsService {
  createAssistant(data) {
    return api.post("/assistant", data).then((response) => {
      return response.data.data;
    });
  }

  updateAssistant(data, id) {
    return api
      .patch("/assistant/" + id, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set correct headers
        },
      })
      .then((response) => {
        return response.data.data;
      });
  }

  searchAssistant({ page, limit, searchText = null, sort = null, order }) {
    let url = `/assistant?page=${page}&limit=${limit}`;
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
        data: response.data?.assistants,
        total: response.data?.totalItems,
      };
    });
  }

  getAssistant(id) {
    return api.get("/assistant/" + id).then((response) => {
      return response.data.data;
    });
  }

  deleteAssistant(id) {
    return api.delete("/assistant/" + id).then((response) => {
      return response.data.data;
    });
  }

  assistantsDo({ method, payload }) {
    return api.post("/assistant/do", { method, payload }).then((response) => {
      return response.data.data;
    });
  }

  assistantDo({ method, payload, id }) {
    return api
      .post("/assistant/do/" + id, { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }
}

export default new AssistantsService();
