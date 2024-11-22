// import api from "../../api/api";

class AssistantsService {
  createAssistant(data, api) {
    return api.post("/api/v1/assistant", data).then((response) => {
      return response.data.data;
    });
  }

  updateAssistant(data, id, api) {
    return api
      .patch("/api/v1/assistant/" + id, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set correct headers
        },
      })
      .then((response) => {
        return response.data.data;
      });
  }

  searchAssistant({ page, limit, searchText = null, sort = null, order, api }) {
    let url = `/api/v1/assistant?page=${page}&limit=${limit}`;
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

  getAssistant(id, api) {
    return api.get("/api/v1/assistant/" + id).then((response) => {
      return response.data.data;
    });
  }

  deleteAssistant(id, api) {
    return api.delete("/api/v1/assistant/" + id).then((response) => {
      return response.data.data;
    });
  }

  assistantsDo({ method, payload, api }) {
    return api
      .post("/api/v1/assistant/do", { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }

  assistantDo({ method, payload, id, api }) {
    return api
      .post("/api/v1/assistant/do/" + id, { method, payload })
      .then((response) => {
        return response.data.data;
      });
  }
}

export default new AssistantsService();
