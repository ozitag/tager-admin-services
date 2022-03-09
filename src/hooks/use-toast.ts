import { ToastActions } from "../services/toast/toast-model";
import { toastService } from "../services/toast/toast-service";

const TOAST_ACTIONS = Object.freeze<ToastActions>({
  show(...args) {
    return toastService.show(...args);
  },
  markAsHidden(...args) {
    toastService.markAsHidden(...args);
  },
  hide(...args) {
    toastService.hide(...args);
  },
});

export function useToast() {
  return TOAST_ACTIONS;
}
