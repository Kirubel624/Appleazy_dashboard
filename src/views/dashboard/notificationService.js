import { apiNotification } from "../../utils/api";

class NotificationService {
  async getNotificationsForUser(
    userId,
    page = 1,
    limit = 5,
    searchText = null,
    sort = null,
    order = null
    // api
  ) {
    console.log("insdie get otificaiotns service");
    let url = `/notification/user/${userId}?page=${page}&limit=${limit}`;
    if (sort && order) {
      const sortValue = order == "ascend" ? "asc" : "desc";
      url = url + `&sortOrder=${sortValue}&sortBy=${sort}`;
    }

    if (searchText) {
      url = url + `&searchText=${searchText}`;
    }

    const response = await apiNotification.get(url);
    console.log(response, "response in service");
    return response.data;
  }

  async markNotificationAsRead(
    notificationId
    // api
  ) {
    const response = await apiNotification.patch(
      `/notification/${notificationId}/mark-read`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
  async markNotificationsAsRead(
    userId
    // api
  ) {
    const response = await apiNotification.patch(
      `/notification/${userId}/all/mark-read`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
}

export default new NotificationService();
