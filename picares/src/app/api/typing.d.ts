declare namespace MODEL {
  type UserRegister = {
    userAccount: string;
    userPassword: string;
    userName: string;
  };
  type UserLogin = {
    userAccount: string;
    userPassword: string;
  };
}

declare namespace REQUEST {
  type UserRegister = {
    userAccount: string;
    userPassword: string;
    checkPassword: string;
  };
  type UserLogin = {
    userAccount: string;
    userPassword: string;
  };
  type UserQuery = {
    page?: Page;
    userName?: string;
    userProfile?: string;
    userRole?: string;
    createTime?: string;
  };
  type Page = {
    current: number;
    pageSize: number;
    sortField: string;
    sortOrder: string;
  };
}

declare namespace RESPONSE {
  type Base<T> = {
    code?: number;
    data?: T;
    message?: string;
  };
  type Page<T> = {
    records?: T[];
    total?: number;
  };
  type User = {
    id: number;
    userAccount: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole: string;
    createTime: string;
  };
  type LoginUser = {
    id: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole: string;
  };
}
