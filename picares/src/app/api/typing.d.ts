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
    categoryId?: number;
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
  type UserQuery = Page & {
    userAccount?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
    createTime?: string;
  };
  type Page = {
    current: number;
    pageSize: number;
    sortField?: string;
    sortOrder?: string;
  };
  type PictrueQuery = Page & {
    name?: string;
    introduction?: string;
    userId?: number;
    createTime?: string;
  };
}

declare namespace RESPONSE {
  type Base<T> = {
    code?: number;
    data?: T;
    message?: string;
  };
  type Page<T> = {
    rows: T[];
    count: number;
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
  type CategorysQuery = {
    id: number;
    name: string;
  };
  type Pictrue = {
    id: number;
    url: string;
    name: string;
    introduction?: string;
    picSize: number;
    picWidth: number;
    picHeight: number;
    picScale: number;
    picFormat?: string;
    createTime: string;
    user: {
      userAccount: string;
    };
    category: {
      name: string;
    };
    tags: [{ name: string }];
  };
  type Categorys = {
    id: number;
    name: string;
    createTime: string;
    pictureCount: number;
  };
  type Tags = {
    id: number;
    name: string;
    createTime: string;
    pictureCount: number;
  };
}
