import { RouteLocationRaw, Router } from "vue-router";
import { previousRouteTracker } from "../services/previous-route-tracker";
import { Nullish } from "../typings/common";

export function navigateBack(
  router: Router,
  fallback?: Nullish<RouteLocationRaw>
) {
  if (previousRouteTracker.previousRoute) {
    router.back();
  } else if (fallback) {
    router.push(fallback);
  } else {
    console.warn("There is no route to navigate. Please specify fallback!");
  }
}
