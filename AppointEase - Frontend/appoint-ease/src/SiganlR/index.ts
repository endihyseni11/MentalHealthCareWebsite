import useSignalRHub from "./SignalRComponent";
import { setDefaults } from "./global";

const signalR = {
  useHub: useSignalRHub,
  setDefaults
};

export { default as useSignalRHub } from "./SignalRComponent";
export type { Options } from "./types";
export default signalR;
