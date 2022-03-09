export type ToastVariant =
  | "success"
  | "warning"
  | "danger"
  | "primary"
  | "secondary"
  | "info";

export interface ToastParams {
  variant: ToastVariant;
  title: string;
  body: string;
}

export interface Toast extends ToastParams {
  id: string;
  hidden: boolean;
}

export interface ShowToastOptions {
  timeout?: number;
}

export interface ToastActions {
  show(params: ToastParams, options?: ShowToastOptions): string;
  hide(toastId: string): void;
  markAsHidden(toastId: string): void;
}

export interface ReactiveToastListStore {
  getReactiveToastList(): Array<Toast>;
}

export interface ToastService extends ToastActions, ReactiveToastListStore {}
