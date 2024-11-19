import api from "../../utils/api";

class ReviewService {
  // Create a new review
  async createReview(reviewData, apiPrivate) {
    const response = await apiPrivate.post("/review", reviewData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  // Fetch all reviews for a specific user (reviewedId)
  async getReviewsForUser(
    reviewedId,
    page = 1,
    limit = 5,
    searchText = null,
    sort = null,
    order = null,
    apiPrivate
  ) {
    let url = `/review/all/${reviewedId}?page=${page}&limit=${limit}`;

    if (sort && order) {
      const sortValue = order === "ascend" ? "asc" : "desc";
      url = url + `&sortOrder=${sortValue}&sortBy=${sort}`;
    }

    if (searchText) {
      url = url + `&searchText=${searchText}`;
    }

    const response = await apiPrivate.get(url);
    return response.data;
  }

  // Fetch a single review by its ID
  async getReviewById({ id, reviewedId, reviewerId, apiPrivate }) {
    try {
      const response = await apiPrivate.get(
        `/review/${id}?reviewedId=${reviewedId}&reviewerId=${reviewerId}`
      );
      return response.data;
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    }
  }

  // Update a review by its ID
  async updateReview(reviewId, updatedData, apiPrivate) {
    const response = await apiPrivate.put(`/review/${reviewId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  // Delete a review by its ID
  async deleteReview(reviewId, apiPrivate) {
    const response = await apiPrivate.delete(`/review/${reviewId}`);
    return response.data;
  }
}

export default new ReviewService();
