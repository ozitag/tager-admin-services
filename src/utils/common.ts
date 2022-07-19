import {nanoid} from "nanoid";

import {Nullable, QueryParams, ResponseBody} from "../typings/common";
import {ACCESS_TOKEN_FIELD, REFRESH_TOKEN_FIELD} from "../constants/common";
import RequestError from "./request-error";
import {isValidationErrorsBody} from "./type-guards";
import {LOCAL_ENV} from "../constants/common";
import {environment} from "../services/environment.js";

export function getApiUrl(): string {
    return environment.apiUrl ?? "";
}

export function getAccessToken(): Nullable<string> {
    const predefinedAccessToken = environment.accessToken ?? "";

    const shouldUsePredefinedAccessToken =
        Boolean(predefinedAccessToken) && environment.appEnv === LOCAL_ENV;

    if (shouldUsePredefinedAccessToken) {
        console.warn("API service uses predefined access token from environment.");
    }
    return shouldUsePredefinedAccessToken
        ? predefinedAccessToken
        : localStorage.getItem(ACCESS_TOKEN_FIELD);
}

export function setAccessToken(token: string): void {
    return localStorage.setItem(ACCESS_TOKEN_FIELD, token);
}

export function removeAccessToken(): void {
    return localStorage.removeItem(ACCESS_TOKEN_FIELD);
}

export function removeRefreshToken(): void {
    return localStorage.removeItem(REFRESH_TOKEN_FIELD);
}

export function getSearchString(queryParams?: QueryParams): string {
    if (!queryParams || Object.keys(queryParams).length === 0) return "";

    const searchParams = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) =>
        searchParams.append(key, value)
    );

    return `?${searchParams.toString()}`;
}

export function convertRequestErrorToMap(error: Error): Record<string, string> {
    if (error instanceof RequestError && isValidationErrorsBody(error.body)) {
        const errorBody = error.body;

        return Object.keys(errorBody.errors).reduce<Record<string, string>>(
            (result, key) => {
                const validationError = errorBody.errors[key];

                result[key] = validationError.message;
                return result;
            },
            {}
        );
    }

    return {};
}

export function getMessageByStatusCode(error: RequestError): string {
    switch (error.status) {
        case 401:
            return "User is not authorized";
        case 403:
            return "Forbidden";
        case 404:
            return `Server endpoint "${error.url}" is not found`;
        case 500:
            return "Server error";
        case 502:
            return "Server is not available";

        default:
            return error.statusText ?? "Request error";
    }
}

export function getMessageFromRequestError(error: RequestError): string {
    const simpleMessage = getMessageByStatusCode(error);

    if (error.body && typeof error.body === "object") {
        const responseBody = error.body as ResponseBody;

        return responseBody.message || responseBody.exception || simpleMessage;
    }

    return simpleMessage;
}

export function getMessageFromError(error: unknown): string {
    if (error instanceof RequestError) {
        return getMessageFromRequestError(error);
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Unknown error";
}

export function convertStringToNumberIfValid(value: string): number | string {
    const parsedNumber = Number(value.trim());

    return Number.isNaN(parsedNumber) ? value : parsedNumber;
}

export function trimTrailingSlash(url: string): string {
    return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function isAbsoluteUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

export function getAuthPageUrl(): string {
    const baseUrl = environment.publicPath === "/" ? "" : environment.publicPath;
    return baseUrl + "/auth";
}

export function removeAuthTokensAndRedirectToAuthPage(): void {
    removeAccessToken();
    removeRefreshToken();

    window.location.href = getAuthPageUrl();
}

export function generateNumberArray(length: number): Array<number> {
    return Array.from({length}, (_, index) => index);
}

export function createId(size?: number): string {
    return nanoid(size);
}

export function urlTranslit(phrase: string): string {
    return phrase
        .replace(/([а-яё])|([\s_-])|([^a-z\d])/gi, (_all, ch, space, words) => {
            if (space || words) {
                return space ? "-" : "";
            }
            const code = ch.charCodeAt(0);

            const index =
                    code == 1025 || code == 1105
                        ? 0
                        : code > 1071
                            ? code - 1071
                            : code - 1039,
                t = [
                    "yo",
                    "a",
                    "b",
                    "v",
                    "g",
                    "d",
                    "e",
                    "zh",
                    "z",
                    "i",
                    "y",
                    "k",
                    "l",
                    "m",
                    "n",
                    "o",
                    "p",
                    "r",
                    "s",
                    "t",
                    "u",
                    "f",
                    "h",
                    "c",
                    "ch",
                    "sh",
                    "shch",
                    "",
                    "y",
                    "",
                    "e",
                    "yu",
                    "ya",
                ];

            return t[index];
        })
        .replace(/-+/gi, "-")
        .toLowerCase();
}

export function getWebsiteOrigin(): string {
    return environment.websiteUrl || window.location.origin;
}

export function getSearchParams(): URLSearchParams {
    return new URLSearchParams(window.location.search);
}

export function getNameWithDepth(name: string, depth: number): string {
    return (
        generateNumberArray(depth)
            .map(() => '—')
            .join(' ') +
        ' ' +
        name
    );
}