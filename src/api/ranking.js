import api from "./axios";


export function getRanking({ type, period }) {
  return api.get(`/ranking/${type}`, {
    params: { period },
  });
}