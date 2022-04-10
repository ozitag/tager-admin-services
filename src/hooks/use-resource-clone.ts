import { ref } from "vue";
import { useToast } from "./use-toast";
import { useRouter } from "vue-router";

type ResourceId = string | number;

export function useResourceClone(params: {
  cloneResource: (entityId: ResourceId) => Promise<{ data: any }>;
  confirmMessage: string;
  successMessage: string;
  failureMessage: string;
  onSuccessRedirectTo?: (data: any) => string;
}): {
  handleResourceClone: (entityId: ResourceId) => void;
  isCloning: (entityId: ResourceId) => boolean;
} {
  const cloningResourceIdList = ref<Array<ResourceId>>([]);
  const toast = useToast();
  const router = useRouter();

  function handleResourceClone(entityId: ResourceId) {
    if (!window.confirm(params.confirmMessage)) return;

    cloningResourceIdList.value.push(entityId);

    params
      .cloneResource(entityId)
      .then((response) => {
        if (params.onSuccessRedirectTo) {
          const redirectToUrl = params.onSuccessRedirectTo(response.data);
          if (redirectToUrl) {
            router.push(redirectToUrl);
          }
        }

        toast.show({
          variant: "success",
          title: "Success",
          body: params.successMessage,
        });
      })
      .catch((error) => {
        console.error(error);
        toast.show({
          variant: "danger",
          title: "Error",
          body: params.failureMessage,
        });
      })
      .finally(() => {
        cloningResourceIdList.value = cloningResourceIdList.value.filter(
          (id) => id !== entityId
        );
      });
  }

  return {
    handleResourceClone,
    isCloning: (entityId: ResourceId) =>
      cloningResourceIdList.value.includes(entityId),
  };
}
