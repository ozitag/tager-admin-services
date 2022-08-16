import {request} from "../index";
import {UserModel} from "../typings/user";

export function getUserProfile(): Promise<{
    data: UserModel;
}> {
    return request.get({path: "/admin/self"});
}