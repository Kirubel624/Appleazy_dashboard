class SubscriptionService {
  // Create a new subscription
  async createSubscription(subscriptionData, apiPrivate, contentType) {
    const response = await apiPrivate.post("/subscription", subscriptionData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Fetch all subscription for a specific user
  async getSubscriptionsForUser(
    userId,
    page = 1,
    limit = 5,
    searchText = null,
    sort = null,
    order = null,
    apiPrivate
  ) {
    let url = `/subscription/user/${userId}?page=${page}&limit=${limit}`;
    console.log(sort, order, "sort and order serv");
    if (sort && order) {
      const sortValue = order == "ascend" ? "asc" : "desc";
      url = url + `&sortOrder=${sortValue}&sortBy=${sort}`;
    }

    if (searchText) {
      url = url + `&searchText=${searchText}`;
    }

    const response = await apiPrivate.get(url);
    return response.data;
  }

  // Fetch a single subscription by its ID
  async getSubscriptionById(subscriptionId, userId, apiPrivate) {
    const response = await apiPrivate.get(
      `/subscription/${subscriptionId}?userId=${userId}`
    );
    return response.data;
  }

  // Update a subscription by its ID
  async updateSubscription(subscriptionId, updatedData, apiPrivate) {
    const response = await apiPrivate.patch(
      `/subscription/${subscriptionId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
  async updateSubscriptionProfile(id, updatedData, subscriptionId, apiPrivate) {
    const response = await apiPrivate.patch(
      `/subscription/profile/${id}?subscriptionId=${subscriptionId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Delete a subscription by its ID
  async deleteSubscription(subscriptionId, apiPrivate) {
    const response = await apiPrivate.delete(`/subscription/${subscriptionId}`);
    return response.data;
  }

  // Fetch all subscription associated with a specific Subscription Request
  async getSubscriptionsBySubscriptionRequest(
    subscriptionRequestId,
    apiPrivate
  ) {
    const response = await apiPrivate.get(
      `/subscriptionrequests/${subscriptionRequestId}/subscription`
    );
    return response.data;
  }

  // Create a subscription for a specific subscription request
  async createSubscriptionForSubscriptionRequest(
    subscriptionRequestId,
    subscriptionData,
    apiPrivate
  ) {
    const response = await apiPrivate.post(
      `/subscriptionrequests/${subscriptionRequestId}/subscription`,
      subscriptionData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
}

export default new SubscriptionService();
