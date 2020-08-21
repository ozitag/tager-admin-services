/** Toast */
export type ToastVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'primary'
  | 'secondary'
  | 'info';

export type ToastParams = {
  variant: ToastVariant;
  title: string;
  body: string;
};

export type ToastItem = ToastParams & {
  id: number;
};

export type ToastFunction = (params: ToastParams) => void;

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $toast?: ToastFunction;
  }
  interface VueConstructor {
    $toast?: ToastFunction;
  }
}
