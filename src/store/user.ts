import {defineStore} from "pinia";

import {FETCH_STATUSES,} from "../constants/common";
import RequestError from "../utils/request-error";
import {FetchStatus, Nullable} from "../typings/common";

import {getUserProfile} from "../services/profile-api";
import {UserModel} from "../typings/user";

interface State {
    profile: Nullable<UserModel>;
    profileStatus: FetchStatus;
    profileError: Nullable<RequestError>;
}

export const useUserStore = defineStore("user", {
    state: (): State => {
        return {
            profile: null,
            profileStatus: FETCH_STATUSES.IDLE,
            profileError: null
        };
    },
    actions: {
        fetchProfile() {
            if (this.profileStatus !== FETCH_STATUSES.IDLE) return;

            this.profileStatus = FETCH_STATUSES.LOADING;
            this.profileError = null;

            getUserProfile()
                .then((response) => {
                    this.profileStatus = FETCH_STATUSES.SUCCESS;
                    this.profile = response.data;
                })
                .catch((error) => {
                    console.error(error);
                    this.profileStatus = FETCH_STATUSES.FAILURE;
                    this.profile = null;
                    this.profileError = error;
                });
        }
    },
    getters: {
        userScopes(): Array<string> {
            const roles = this.profile ? this.profile.roles : [];
            const scopes: Array<string> = [];

            roles.forEach((role) => {
                scopes.push(...role.scopes);
            });

            return scopes;
        }
    }
});

export function useUserPermission(scope: string): boolean {
    const store = useUserStore();

    const scopes = store.userScopes;

    if (scopes.includes("*")) return true;

    return scopes.includes(scope);
}
