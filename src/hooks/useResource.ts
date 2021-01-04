import {
  computed,
  ComputedRef,
  Ref,
  ref,
  SetupContext,
} from '@vue/composition-api';

import { FetchStatus, Nullable, ResponseBody } from '../common.types';
import { FETCH_STATUSES } from '../constants';
import { createId, getMessageFromError } from '../utils';

export type ResourceRef<T> = {
  data: Ref<T>;
  loading: ComputedRef<boolean>;
  error: Ref<Nullable<string>>;
  status: Ref<FetchStatus>;
};

export function useResource<T>(params: {
  fetchResource: () => Promise<ResponseBody<T>>;
  initialValue: T;
  resourceName?: string;
  context?: SetupContext;
}): [() => Promise<void>, ResourceRef<T>] {
  const data = ref<T>(params.initialValue) as Ref<T>;
  const status = ref<FetchStatus>(FETCH_STATUSES.IDLE);
  const error = ref<string | null>(null);

  const currentRequestId = ref<string | null>(null);

  const loading = computed(() => status.value === FETCH_STATUSES.LOADING);

  function makeRequest(): Promise<void> {
    status.value = FETCH_STATUSES.LOADING;

    const requestId = createId();
    currentRequestId.value = requestId;

    return params
      .fetchResource()
      .then((response) => {
        if (requestId !== currentRequestId.value) return;

        currentRequestId.value = null;

        data.value = response.data;
        status.value = FETCH_STATUSES.SUCCESS;
        error.value = null;
      })
      .catch((error) => {
        if (requestId !== currentRequestId.value) return;

        currentRequestId.value = null;

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

  return [makeRequest, { data, loading, error, status }];
}
