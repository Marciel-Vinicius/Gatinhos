let isDev = false;
if (process.env.NODE_ENV !== "production") {
  isDev = true;
}
export default {isDev};
