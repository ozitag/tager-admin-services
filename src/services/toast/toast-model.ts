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
}

export interface ToastActions {
  show(params: ToastParams): void;
  hide(toastId: string): void;
}

export interface ReactiveToastListStore {
  getReactiveToastList(): Array<Toast>;
}

export interface ToastService extends ToastActions, ReactiveToastListStore {}
