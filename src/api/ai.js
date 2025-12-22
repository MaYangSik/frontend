import api from "./axios";

export const getReviewTags = (review) => {
  return api.post("/api/ai/review/tags", {
    review: review
  });
};