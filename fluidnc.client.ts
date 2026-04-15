/**
 * Plugin that provides a single shared FluidNC instance across all pages.
 * Use inject('fluidnc') in any component/page.
 */
import type { useFluidNC } from "~/composables/useFluidNC";

export default defineNuxtPlugin((nuxtApp) => {
  const fluidnc = useFluidNC();
  nuxtApp.provide("fluidnc", fluidnc);
});

// Type augmentation for useNuxtApp()
declare module "#app" {
  interface NuxtApp {
    $fluidnc: ReturnType<typeof useFluidNC>;
  }
}
