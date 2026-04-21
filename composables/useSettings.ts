import { useLocalStorage } from "@vueuse/core";

/**
 * useSettings — persistent app settings via localStorage
 */
export function useSettings() {
  const controllerIp = useLocalStorage<string>("fluidnc:ip", "");
  const locale = useLocalStorage<"en" | "uk">("fluidnc:locale", "en");
  const colorMode = useLocalStorage<"light" | "dark" | "system">(
    "fluidnc:theme",
    "system",
  );
  const jogFeedrate = useLocalStorage<number>("fluidnc:jog-feedrate", 2000);
  const jobControls = useLocalStorage<boolean>("fluidnc:job-controls", false);

  return {
    controllerIp,
    locale,
    colorMode,
    jogFeedrate,
    jobControls
  };
}
