import {
  RouteLocationNormalizedLoaded,
  Router,
  START_LOCATION,
} from "vue-router";
import { Nullable } from "../typings/common";

let previousRoute: Nullable<RouteLocationNormalizedLoaded> = null;

export const previousRouteTracker = Object.freeze({
  track(router: Router) {
    router.beforeEach((_, from, next) => {
      previousRoute = from === START_LOCATION ? null : from;
      next();
    });
  },
  get previousRoute() {
    return previousRoute;
  },
});
