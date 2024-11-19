import api from "../../utils/api";

class JobService {
  // Create a new job
  async createJob(jobData, apiPrivate) {
    const response = await apiPrivate.post("/job", jobData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  // Fetch all job for a specific user
  async getJobsForUser(
    subscriptionId,
    page = 1,
    limit = 5,
    searchText = null,
    sort = null,
    order = null,
    apiPrivate
  ) {
    console.log(subscriptionId, "subscriptionId");
    let url = `/job/userjobs/${subscriptionId}?page=${page}&limit=${limit}`;
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

  // Fetch a single job by its ID
  async getJobById(jobId, apiPrivate) {
    const response = await apiPrivate.get(`/job/${jobId}`);
    return response.data;
  }

  // Update a job by its ID
  async updateJob(jobId, updatedData, apiPrivate) {
    const response = await apiPrivate.patch(`/job/${jobId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  // Delete a job by its ID
  async deleteJob(jobId, apiPrivate) {
    const response = await apiPrivate.delete(`/job/${jobId}`);
    return response.data;
  }

  // Fetch all job associated with a specific Job Request
  async getJobsByJobRequest(jobRequestId, apiPrivate) {
    const response = await apiPrivate.get(`/jobrequests/${jobRequestId}/job`);
    return response.data;
  }

  // Create a job for a specific job request
  async createJobForJobRequest(jobRequestId, jobData, apiPrivate) {
    const response = await apiPrivate.post(
      `/jobrequests/${jobRequestId}/job`,
      jobData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
}

export default new JobService();
