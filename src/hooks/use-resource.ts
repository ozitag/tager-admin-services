import {computed, ComputedRef, Ref, ref} from "vue";

import {FetchStatus, Nullable, ResponseBody} from "../typings/common";
import {FETCH_STATUSES} from "../constants/common";
import {createId, getMessageFromError} from "../utils/common";
import {useToast} from "./use-toast";
import {Scopes} from "../typings/user";
import {useUserStore} from "../store/user";

export type ResourceRef<Data, Meta = undefined> = {
    data: Ref<Data>;
    meta: Ref<Meta | undefined>;
    loading: ComputedRef<boolean>;
    errorMessage: Ref<Nullable<string>>;
    error: Ref<any>;
    status: Ref<FetchStatus>;
};

export type ResourceHookReturnType<Data, Meta, RequestParams> = [
    RequestParams extends undefined
        ? () => Promise<void>
        : (params: RequestParams) => Promise<void>,
    ResourceRef<Data, Meta>
];

export function useResource<Data,
    Meta = undefined,
    RequestParams = undefined>(params: {
    fetchResource: RequestParams extends undefined
        ? () => Promise<ResponseBody<Data, Meta>>
        : (params: RequestParams) => Promise<ResponseBody<Data, Meta>>;
    initialValue: Data;
    resourceName?: string;
    scopes?: Scopes;
}): ResourceHookReturnType<Data, Meta, RequestParams> {
    const data = ref<Data>(params.initialValue) as Ref<Data>;
    const meta = ref<Meta | undefined>(undefined) as Ref<Meta | undefined>;
    const status = ref<FetchStatus>(FETCH_STATUSES.IDLE);
    const errorMessage = ref<string | null>(null);
    const error = ref<any>(null);
    const toast = useToast();

    const currentRequestId = ref<string | null>(null);

    const loading = computed(() => status.value === FETCH_STATUSES.LOADING);

    function makeRequest(requestParams: RequestParams): Promise<void> {
        const isValidScopes = params.scopes ? useUserStore().checkScopes(params.scopes) : true;
        if (!isValidScopes) {
            return new Promise((resolve) => resolve());
        }

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
                errorMessage.value = null;
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
                error.value = error;
                errorMessage.value = getMessageFromError(error);
            });
    }

    return [
        makeRequest,
        {data, meta, loading, error, errorMessage, status},
    ] as ResourceHookReturnType<Data, Meta, RequestParams>;
}
