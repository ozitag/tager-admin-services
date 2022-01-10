import { computed, ComputedRef, Ref, ref, SetupContext } from "vue";

import { FetchStatus, Nullable, ResponseBody } from "../typings/common";
import { FETCH_STATUSES } from "../constants/common";
import { createId, getMessageFromError } from "../utils/common";
import { useToast } from "./use-toast";

export type ResourceRef<Data, Meta = undefined> = {
  data: Ref<Data>;
  meta: Ref<Meta | undefined>;
  loading: ComputedRef<boolean>;
  error: Ref<Nullable<string>>;
  status: Ref<FetchStatus>;
};

export type ResourceHookReturnType<Data, Meta, RequestParams> = [
  RequestParams extends undefined
    ? () => Promise<void>
    : (params: RequestParams) => Promise<void>,
  ResourceRef<Data, Meta>
];

export function useResource<
  Data,
  Meta = undefined,
  RequestParams = undefined
>(params: {
  fetchResource: RequestParams extends undefined
    ? () => Promise<ResponseBody<Data, Meta>>
    : (params: RequestParams) => Promise<ResponseBody<Data, Meta>>;
  initialValue: Data;
  resourceName?: string;
  context?: SetupContext;
}): ResourceHookReturnType<Data, Meta, RequestParams> {
  const data = ref<Data>(params.initialValue) as Ref<Data>;
  const meta = ref<Meta | undefined>(undefined) as Ref<Meta | undefined>;
  const status = ref<FetchStatus>(FETCH_STATUSES.IDLE);
  const error = ref<string | null>(null);
  const toast = useToast();

  const currentRequestId = ref<string | null>(null);

  const loading = computed(() => status.value === FETCH_STATUSES.LOADING);

  function makeRequest(requestParams: RequestParams): Promise<void> {
    status.value = FETCH_STATUSES.LOADING;

    const requestId = createId();
    currentRequestId.value = requestId;

    return params
      .fetchResource(requestParams)
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

        const resourceName = params.resourceName ?? "Resource";

        toast.show({
          variant: "danger",
          title: "Error",
          body: `${resourceName} fetching has been failed`,
        });

        data.value = params.initialValue;
        meta.value = undefined;
        status.value = FETCH_STATUSES.FAILURE;
        error.value = getMessageFromError(error);
      });
  }

  return [
    makeRequest,
    { data, meta, loading, error, status },
  ] as ResourceHookReturnType<Data, Meta, RequestParams>;
}
