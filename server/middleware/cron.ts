import { initializeCronJobs } from "../cron";
import { defineNitroPlugin } from "nitropack/runtime/plugin";

export default defineNitroPlugin(() => {
  // Initialize cron jobs when the server starts
  initializeCronJobs();
});
