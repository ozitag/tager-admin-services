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

export type ResourceRef<D, M> = {
  data: Ref<D>;
  meta: Ref<M | undefined>;
  loading: ComputedRef<boolean>;
  error: Ref<Nullable<string>>;
  status: Ref<FetchStatus>;
};

export function useResource<D, M = undefined>(params: {
  fetchResource: () => Promise<ResponseBody<D, M>>;
  initialValue: D;
  resourceName?: string;
  context?: SetupContext;
}): [() => Promise<void>, ResourceRef<D, M>] {
  const data = ref<D>(params.initialValue) as Ref<D>;
  const meta = ref<M | undefined>(undefined) as Ref<M | undefined>;
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
        meta.value = response.meta;
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
        meta.value = undefined;
        status.value = FETCH_STATUSES.FAILURE;
        error.value = getMessageFromError(error);
      });
  }

  return [makeRequest, { data, meta, loading, error, status }];
}
