import { TFunction } from "i18next";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $t: TFunction;
  }
}
