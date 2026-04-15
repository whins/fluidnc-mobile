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

  return {
    controllerIp,
    locale,
    colorMode,
    jogFeedrate,
  };
}
