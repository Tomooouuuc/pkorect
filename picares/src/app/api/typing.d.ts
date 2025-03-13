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
  type UserUpdate = {
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole: string;
  };
  type PictureUpload = {
    url: string;
    name: string;
    introduction?: string;
    category: string;
    picSize?: number;
    picWidth?: number;
    picHeight?: number;
    picScale?: string;
    picFormat?: string;
    userId: string;
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
    userAccount?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
    createTime?: string;
    current: number;
    pageSize: number;
    sortField?: string;
    sortOrder?: string;
  };
  type Page = {
    current: number;
    pageSize: number;
    sortField?: string;
    sortOrder?: string;
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
    [key: string]: any;
  };
  type LoginUser = {
    id: string;
    userAccount: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole: string;
  };
}
