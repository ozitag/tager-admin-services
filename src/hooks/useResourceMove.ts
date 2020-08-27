import { ref, SetupContext } from '@vue/composition-api';

type ResourceId = string | number;
type Direction = 'up' | 'down';

export function useResourceMove(params: {
  moveResource: (
    entityId: ResourceId,
    direction: Direction
  ) => Promise<{ success: boolean }>;
  resourceName?: string;
  onSuccess?: () => void;
  context?: SetupContext;
}): {
  handleResourceMove: (entityId: ResourceId, direction: Direction) => void;
  isMoving: (entityId: ResourceId) => boolean;
} {
  const movingResourceIdList = ref<Array<ResourceId>>([]);

  function handleResourceMove(entityId: ResourceId, direction: Direction) {
    const resourceName = params.resourceName ?? 'Resource';

    movingResourceIdList.value.push(entityId);

    params
      .moveResource(entityId, direction)
      .then((response) => {
        if (response.success) {
          if (params.onSuccess) {
            params.onSuccess();
          }

          if (params.context?.root.$toast) {
            params.context.root.$toast({
              variant: 'success',
              title: 'Success',
              body: `${resourceName} has been successfully moved`,
            });
          }
        } else {
          if (params.context?.root.$toast) {
            params.context.root.$toast({
              variant: 'danger',
              title: 'Error',
              body: `${resourceName} move has been failed`,
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
            body: `${resourceName} move has been failed`,
          });
        }
      })
      .finally(() => {
        movingResourceIdList.value = movingResourceIdList.value.filter(
          (id) => id !== entityId
        );
      });
  }

  return {
    handleResourceMove,
    isMoving: (entityId: ResourceId) =>
      movingResourceIdList.value.includes(entityId),
  };
}
