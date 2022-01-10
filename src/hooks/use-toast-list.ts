import { Toast } from "../services/toast/toast-model";
import { toastService } from "../services/toast/toast-service";

export function useToastList(): Array<Toast> {
  return toastService.getReactiveToastList();
}
