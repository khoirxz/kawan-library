export const baseAPI = {
  // dev: "https://bprkawan.co.id/api.library",
  dev: "http://localhost:5000/api.library",
  prod: "http://bprkawan.co.id/api.library",
  endpoints: {
    decrees: "/decrees",
  },
} as const;
