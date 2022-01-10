import { reactive } from "vue";
import { nanoid } from "nanoid";
import { Toast, ToastParams, ToastService } from "./toast-model";

interface ToastState {
  toastList: Array<Toast>;
}

class ToastServiceImpl implements ToastService {
  private readonly state = reactive<ToastState>({ toastList: [] });

  show(params: ToastParams) {
    this.state.toastList.push({ id: nanoid(), ...params });
  }

  hide(toastId: string) {
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
