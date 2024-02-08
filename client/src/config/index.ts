import { App } from "@/store";

export default <App>{
  printers: [],
  server: {
    host: location.href.replace(/\/$/gi, ""),
    connected: false,
  },
  spools: [],
};
