import { ref } from "vue";
import { useToast } from "./use-toast";

type ResourceId = string | number;

export function useResourceDelete(params: {
  deleteResource: (entityId: ResourceId) => Promise<{ success: boolean }>;
  resourceName?: string;
  onSuccess?: () => void;
}): {
  handleResourceDelete: (entityId: ResourceId) => void;
  isDeleting: (entityId: ResourceId) => boolean;
} {
  const deletingResourceIdList = ref<Array<ResourceId>>([]);
  const toast = useToast();

  function handleResourceDelete(entityId: ResourceId) {
    const resourceName = params.resourceName ?? "Resource";

    const shouldDeleteResource = window.confirm(
      `Are you sure you want to delete ${resourceName.toLowerCase()}?`
    );

    if (shouldDeleteResource) {
      deletingResourceIdList.value.push(entityId);

      params
        .deleteResource(entityId)
        .then((response) => {
          if (response.success) {
            if (params.onSuccess) {
              params.onSuccess();
            }

            toast.show({
              variant: "success",
              title: "Success",
              body: `${resourceName} has been successfully removed`,
            });
          } else {
            toast.show({
              variant: "danger",
              title: "Error",
              body: `${resourceName} deletion has been failed`,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          toast.show({
            variant: "danger",
            title: "Error",
            body: `${resourceName} deletion has been failed`,
          });
        })
        .finally(() => {
          deletingResourceIdList.value = deletingResourceIdList.value.filter(
            (id) => id !== entityId
          );
        });
    }
  }

  return {
    handleResourceDelete,
    isDeleting: (entityId: ResourceId) =>
      deletingResourceIdList.value.includes(entityId),
  };
}
