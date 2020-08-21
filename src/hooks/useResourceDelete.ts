import { ref, SetupContext } from '@vue/composition-api';

type ResourceId = string | number;

function useResourceDelete(params: {
  deleteResource: (entityId: ResourceId) => Promise<{ success: boolean }>;
  resourceName?: string;
  onSuccess?: () => void;
  context?: SetupContext;
}): {
  handleResourceDelete: (entityId: ResourceId) => void;
  isDeleting: (entityId: ResourceId) => void;
} {
  const deletingResourceIdList = ref<Array<ResourceId>>([]);

  function handleResourceDelete(entityId: ResourceId) {
    const resourceName = params.resourceName ?? 'Resource';

    const shouldDeleteResource = window.confirm(
      `Are you sure you want to delete ${resourceName.toLowerCase()}?`
    );

    if (shouldDeleteResource) {
      deletingResourceIdList.value.push(entityId);

      params
        .deleteResource(entityId)
        .then((response) => {
          if (response.success) {
            deletingResourceIdList.value.filter((id) => id !== entityId);

            if (params.onSuccess) {
              params.onSuccess();
            }

            if (params.context?.root.$toast) {
              params.context.root.$toast({
                variant: 'success',
                title: 'Success',
                body: `${resourceName} has been successfully removed`,
              });
            }
          } else {
            if (params.context?.root.$toast) {
              params.context.root.$toast({
                variant: 'danger',
                title: 'Error',
                body: `${resourceName} deletion has been failed`,
              });
            }
          }
        })
        .catch((error) => {
          console.error(error);
          if (params.context?.root.$toast) {
            params.context.root.$toast({
              variant: 'danger',
              title: 'Error',
              body: `${resourceName} deletion has been failed`,
            });
          }
        });
    }
  }

  return {
    handleResourceDelete,
    isDeleting: (entityId: ResourceId) =>
      deletingResourceIdList.value.includes(entityId),
  };
}

export default useResourceDelete;
