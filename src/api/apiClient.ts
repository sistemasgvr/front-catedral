import axios from "axios";

const apiClient = axios.create({
  baseURL:
    import.meta.env.API_URL ||
    "https://qhmroavowtbihgiqyiyu.supabase.co/rest/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: import.meta.env.AUTHORIZATION,
    apikey: import.meta.env.API_KEY||"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobXJvYXZvd3RiaWhnaXF5aXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyODc1MjIsImV4cCI6MjA4NTg2MzUyMn0.GEEdZTyYS1KzPLM8L_Q7NNsjgQHZmQ3BGsSvIPE7r4E",
  },
});

export default apiClient;
