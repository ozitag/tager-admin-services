import {defineStore} from "pinia";

import {FETCH_STATUSES,} from "../constants/common";
import RequestError from "../utils/request-error";
import {FetchStatus, Nullable} from "../typings/common";

import {getUserProfile} from "../services/profile-api";
import {Scopes, ScopesOperand, UserModel} from "../typings/user";

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
        },
        checkScopes(state) {
            return (scopes: Scopes): boolean => {
                const roles = state.profile ? state.profile.roles : [];


                const scopesAll: Array<string> = [];
                roles.forEach((role) => {
                    scopesAll.push(...role.scopes);
                });

                if (scopesAll.includes("*")) return true;

                const scopesArray = typeof scopes === 'string' ? [scopes] : scopes;
                if (scopesArray.length === 0) {
                    return false;
                }

                const scopesOperand: ScopesOperand = scopesArray[0] === 'OR' ? 'OR' : 'AND';

                if (scopesOperand === 'OR') {
                    for (let i = 0; i < scopesArray.length; i++) {
                        if (scopesArray[i] === 'OR' || scopesArray[i] === 'AND') continue;
                        if (scopesAll.includes(scopesArray[i])) {
                            return true;
                        }
                    }

                    return false;
                } else if (scopesOperand === 'AND') {
                    for (let i = 0; i < scopesArray.length; i++) {
                        if (scopesArray[i] === 'OR' || scopesArray[i] === 'AND') continue;
                        if (!scopesAll.includes(scopesArray[i])) {
                            return false;
                        }
                    }

                    return true;
                } else {
                    return false;
                }
            }
        }
    }
});

export function useUserPermission(scope: string): boolean {
    return useUserStore().checkScopes(scope);
}
