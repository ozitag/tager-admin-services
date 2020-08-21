import {
  computed,
  ComputedRef,
  Ref,
  ref,
  SetupContext,
} from '@vue/composition-api';

import { FetchStatus, Nullable, ResponseBody } from '../common.types';
import { FETCH_STATUSES } from '../constants';
import { getMessageFromError } from '../utils';

export type ResourceRef<T> = {
  data: Ref<T>;
  loading: ComputedRef<boolean>;
  error: Ref<Nullable<string>>;
  status: Ref<FetchStatus>;
};

function useResource<T>(params: {
  fetchResource: () => Promise<ResponseBody<T>>;
  initialValue: T;
  resourceName?: string;
  context?: SetupContext;
}): [() => void, ResourceRef<T>] {
  const data = ref<T>(params.initialValue) as Ref<T>;
  const status = ref<FetchStatus>(FETCH_STATUSES.IDLE);
  const error = ref<string | null>(null);

  const loading = computed(() => status.value === FETCH_STATUSES.LOADING);

  function fetchEntityList(): Promise<void> {
    status.value = FETCH_STATUSES.LOADING;

    return params
      .fetchResource()
      .then((response) => {
        data.value = response.data;
        status.value = FETCH_STATUSES.SUCCESS;
        error.value = null;
      })
      .catch((error) => {
        console.error(error);

        const resourceName = params.resourceName ?? 'Resource';

        if (params.context?.root.$toast) {
          params.context.root.$toast({
            variant: 'danger',
            title: 'Error',
            body: `${resourceName} fetching has been failed`,
          });
        }

        data.value = params.initialValue;
        status.value = FETCH_STATUSES.FAILURE;
        error.value = getMessageFromError(error);
      });
  }

  return [fetchEntityList, { data, loading, error, status }];
}

export default useResource;
