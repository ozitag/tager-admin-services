import { RouteLocationRaw, Router } from "vue-router";
import { previousRouteTracker } from "../services/previous-route-tracker";

export function navigateBack(router: Router, fallback: RouteLocationRaw) {
  if (previousRouteTracker.previousRoute) {
    router.back();
  } else if (fallback) {
    router.push(fallback);
  } else {
    console.warn("There is no route to navigate. Please specify fallback!");
  }
}
