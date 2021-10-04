import {ref, SetupContext} from '@vue/composition-api';

type ResourceId = string | number;

export function useResourceClone(params: {
    cloneResource: (entityId: ResourceId) => Promise<{ data: any }>;
    confirmMessage: string;
    successMessage: string;
    failureMessage: string;
    onSuccessRedirectTo?: (data: any) => string;
    context?: SetupContext;
}): {
    handleResourceClone: (entityId: ResourceId) => void;
    isCloning: (entityId: ResourceId) => boolean;
} {
    const cloningResourceIdList = ref<Array<ResourceId>>([]);

    function handleResourceClone(entityId: ResourceId) {

        if (!window.confirm(params.confirmMessage)) return;

        cloningResourceIdList.value.push(entityId);

        params.cloneResource(entityId)
            .then((response) => {
                if (params.onSuccessRedirectTo) {
                    const redirectToUrl = params.onSuccessRedirectTo(response.data);
                    if (redirectToUrl && params.context?.root.$router) {
                        params.context?.root.$router.push(redirectToUrl);
                    }
                }

                if (params.context?.root.$toast) {
                    params.context.root.$toast({
                        variant: 'success',
                        title: 'Success',
                        body: params.successMessage,
                    });
                }
            })
            .catch((error) => {
                console.error(error);
                if (params.context?.root.$toast) {
                    params.context.root.$toast({
                        variant: 'danger',
                        title: 'Error',
                        body: params.failureMessage,
                    });
                }
            })
            .finally(() => {
                cloningResourceIdList.value = cloningResourceIdList.value.filter(
                    (id) => id !== entityId
                );
            });
    }

    return {
        handleResourceClone,
        isCloning: (entityId: ResourceId) => cloningResourceIdList.value.includes(entityId),
    };
}
