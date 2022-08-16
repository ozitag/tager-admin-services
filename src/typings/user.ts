export interface RoleModel {
  readonly id: number;
  readonly name: string;
  readonly scopes: Array<string>;
}

export interface UserModel {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly roles: Array<RoleModel>;
}
