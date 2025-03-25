-- 用户表
create table if not exists user
(
    id           bigint auto_increment comment 'id' primary key,
    userAccount  varchar(256)                           not null comment '账号',
    userPassword varchar(512)                           not null comment '密码',
    userName     varchar(256)                           null comment '用户昵称',
    userAvatar   varchar(1024)                          null comment '用户头像',
    userProfile  varchar(512)                           null comment '用户简介',
    userRole     varchar(256) default 'user'            not null comment '用户角色：user/admin',
    editTime     datetime     default CURRENT_TIMESTAMP not null comment '编辑时间',
    createTime   datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime   datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint      default 0                 not null comment '是否删除',
    UNIQUE KEY uk_userAccount (userAccount),
    INDEX idx_userName (userName)
) comment '用户' collate = utf8mb4_unicode_ci;

-- 图片表  
create table if not exists picture  
(  
    id           bigint auto_increment comment 'id' primary key,  
    url          varchar(512)                       not null comment '图片 url',  
    name         varchar(128)                       not null comment '图片名称',  
    introduction varchar(512)                       null comment '简介',  
    categoryId   bigint                             null comment '分类',  
    picSize      bigint                             null comment '图片体积',  
    picWidth     int                                null comment '图片宽度',  
    picHeight    int                                null comment '图片高度',  
    picScale     double                             null comment '图片宽高比例',  
    picFormat    varchar(32)                        null comment '图片格式',
    reviewStatus tinyint  default 0                 not null COMMENT '审核状态：0-待审核; 1-通过; 2-拒绝',
    userId       bigint                             not null comment '创建用户 id',  
    createTime   datetime default CURRENT_TIMESTAMP not null comment '创建时间',  
    editTime     datetime default CURRENT_TIMESTAMP not null comment '编辑时间',  
    updateTime   datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',  
    isDelete     tinyint  default 0                 not null comment '是否删除',
    UNIQUE KEY uk_url (url),
    INDEX idx_name (name),                 -- 提升基于图片名称的查询性能  
    INDEX idx_introduction (introduction), -- 用于模糊搜索图片简介  
    INDEX idx_category (categoryId),         -- 提升基于分类的查询性能  
    INDEX idx_userId (userId),              -- 提升基于用户 ID 的查询性能  
    INDEX idx_reviewStatus (reviewStatus)
) comment '图片' collate = utf8mb4_unicode_ci;

create table if not exists categorys  
(  
    id           bigint auto_increment comment 'id' primary key,  
    name         varchar(128)                       not null comment '目录名称',  
    createTime   datetime default CURRENT_TIMESTAMP not null comment '创建时间',  
    editTime     datetime default CURRENT_TIMESTAMP not null comment '编辑时间',  
    updateTime   datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',  
    isDelete     tinyint  default 0                 not null comment '是否删除',  
    UNIQUE KEY uk_name (name),
    INDEX idx_name (name)                 -- 提升基于图片名称的查询性能  
) comment '目录' collate = utf8mb4_unicode_ci;

create table if not exists pictureTag  
(  
    tagId        bigint                             NOT NULL comment 'tagId',  
    pictureId    bigint                             NOT NULL  comment 'pictureId',  
    createTime   datetime default CURRENT_TIMESTAMP not null comment '创建时间',  
    INDEX idx_tagId (tagId),
    INDEX idx_pictureId (pictureId)                 -- 提升基于图片名称的查询性能  
) comment '图片标签' collate = utf8mb4_unicode_ci;

create table if not exists tags
(  
    id           bigint auto_increment comment 'id' primary key,  
    name         varchar(128)                       not null comment '标签名称',  
    createTime   datetime default CURRENT_TIMESTAMP not null comment '创建时间',  
    editTime     datetime default CURRENT_TIMESTAMP not null comment '编辑时间',  
    updateTime   datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',  
    isDelete     tinyint  default 0                 not null comment '是否删除',  
    UNIQUE KEY uk_name (name),
    INDEX idx_name (name)                 -- 提升基于图片名称的查询性能  
) comment '标签' collate = utf8mb4_unicode_ci;





ALTER TABLE picture  
    -- 添加新列  
    ADD COLUMN reviewStatus INT DEFAULT 0 NOT NULL COMMENT '审核状态：0-待审核; 1-通过; 2-拒绝';  
  
-- 创建基于 reviewStatus 列的索引  
CREATE INDEX idx_reviewStatus ON picture (reviewStatus);






