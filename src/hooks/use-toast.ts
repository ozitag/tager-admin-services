import { ToastActions, ToastParams } from "../services/toast/toast-model";
import { toastService } from "../services/toast/toast-service";

const TOAST_ACTIONS = Object.freeze({
  show(params: ToastParams) {
    toastService.show(params);
  },
  hide(toastId: string) {
    toastService.hide(toastId);
  },
});

export function useToast(): Readonly<ToastActions> {
  return TOAST_ACTIONS;
}
