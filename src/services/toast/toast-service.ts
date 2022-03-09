import { reactive } from "vue";
import { nanoid } from "nanoid";
import {
  ShowToastOptions,
  Toast,
  ToastParams,
  ToastService,
} from "./toast-model";

interface ToastState {
  toastList: Array<Toast>;
}

const DEFAULT_TIMEOUT = 3000;

class ToastServiceImpl implements ToastService {
  private readonly state = reactive<ToastState>({ toastList: [] });
  private readonly timeoutMap = new Map<string, number>();

  show(params: ToastParams, options?: ShowToastOptions): string {
    const timeout = options?.timeout ?? DEFAULT_TIMEOUT;
    const toastId = nanoid();
    this.state.toastList.push({ id: toastId, hidden: false, ...params });

    if (timeout > 0) {
      const timeoutId = window.setTimeout(
        () => this.markAsHidden(toastId),
        timeout
      );
      this.timeoutMap.set(toastId, timeoutId);
    }

    return toastId;
  }

  markAsHidden(toastId: string) {
    const toastIndex = this.state.toastList.findIndex(
      (toast) => toast.id === toastId
    );

    if (toastIndex === -1) {
      console.warn(`Toast with id: "${toastId}" is not found`);
      return;
    }

    const toast = this.state.toastList[toastIndex];
    toast.hidden = true;
  }

  hide(toastId: string) {
    const toastTimeoutId = this.timeoutMap.get(toastId);

    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
      this.timeoutMap.delete(toastId);
    }

    const toastIndex = this.state.toastList.findIndex(
      (toast) => toast.id === toastId
    );

    if (toastIndex === -1) {
      console.warn(`Toast with id: "${toastId}" is not found`);
      return;
    }

    this.state.toastList.splice(toastIndex, 1);
  }

  getReactiveToastList() {
    return this.state.toastList;
  }
}

export const toastService = new ToastServiceImpl();
