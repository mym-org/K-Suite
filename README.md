# K-Suite: 为高性能开源微服务网关[Kong Gateway](http://getkong.org) 社区版开发的一款监控与管理软件。所有模块抽象设计，可配置装载。具备灵活度高、扩展性好、兼容性强的特点。能快速支撑Kong Community的任何历史版本。

  [![Gitter](https://badges.gitter.im/K-Suite/community.svg)](https://gitter.im/K-Suite/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# 目录
- [**主要特性**](#主要特性)
- [**对Kong的兼容性**](#对Kong的兼容性)
- [**先决条件**](#先决条件)
- [**安装与使用**](#安装与使用)
- [**登录认证**](#登录认证)
- [**升级**](#升级)
- [**FAQ**](#FAQ)
- [**配置model说明**](#配置model说明)
- [**License**](#license)
- [**直接贡献者**](#直接贡献者)
- [**gitHub社区**](#gitHub社区)

# 主要特性
* 基于kong admin api支持对所有kong的实体对象与插件进行灵活管理
* 只支持一个kong server，推荐针对不同的kong server，独立部署一个K-Suite
* 用户认证目目前支持LDAP或LOCAL-USER密码认证
* 支持两种管理角色:admin,user。其中admin具备所有CRUD权限，user只能查阅配置信息。方便团队成员灵活管理.
* 为了简化生产部署依赖，本项目除了与Kong Admin EndPoint对接外，不再依赖任何第三方中间件、数据库等。
* 所有前端用户界面基于AntD模块化设计，动态加载，无需二次开发即可支持对kong的新增实体的管理。比如upstreams,targets等。
* 配置model中支持强大的PathVariable动态解析
* 按照不同版本的Kong定制核心model配置项，即可轻松兼容kong某个中间版本。
* 支持docker image部署

# 对Kong的兼容性

从2016年起，团队开始关注Kong Community，并在B端大型企业实践微服务，基于kong管理了数百个微服务模块，目前有三个版本（0.11、1.2、2.0(latest)）在线。 因此，K-Suite第一个Released版本首先对这三个版本的兼容性做了验证支持。如果您要支持某个kong的历史版本，可以联系我们 [choaryzhang@163.com](mailto:choaryzhang@163.com),我们将会在较短时间内调整Model后并
做兼容性tests推出K-Suite部署镜像。

# 先决条件
- 运行任意版本的kong server。请参考 [Kong installation](https://getkong.org/) 先安装，安全的开放kong admin api
- Nodejs >= 8 (8.11.3 LTS is recommended)
- Npm
- jdk1.8+
- Gradle 5.10+

# 安装与使用
## 1、compile
### build with ui
```
  gradle build -Pnode.install -Pnode.build -x test
```
### build java only
```
  gradle build -x test
```
## 2、Docker deploy

### build image
```
  docker build -f Dockerfile -t meetyourmakers/ksuite:1.0.0 .
```
### pull
```
  docker pull meetyourmakers/ksuite:1.0.0
```

### run

```

docker run -e KONG_ADMIN_ENDPOINT=https://local:8001 -e KONG_NAME=test -e AUTH_TYPE=ldap -e LOCAL_USERS=yourname@domain.com##true -e LDAP_URLS=ldap://ldap.domain.com -e LDAP_BASE=dc=test,dc=com -d --name ksuite -p 8080:8080 meetyourmakers/ksuite:1.0.0


```


预设的环境变量

| YML               | DESCRIPTION                           |
|--------------------|---------------------------------------|
|KONG_ADMIN_ENDPOINT | kong server暴露的管理端点地址，注意其安全性要求 |
|KONG_NAME| 给网关取一个名字用于标记。方便在K-Suite管理界面看到这个标记，防止误操作 |
|AUTH_TYPE | K-Suite当前选择的认证方式 |
|LOCAL_USERS| K-Suite当前的管理用户.配置参考 [**登录认证用户信息**](#登录认证用户信息) |
|LOCAL_USERS_FILE|K-Suite当前的管理用户,通过外挂文件方式提供。配置参考 [**登录认证用户信息**](#登录认证用户信息)|
|LDAP_URLS| K-Suite如果当前选择LDAP认证，为LDAP的地址信息。|
|LDAP_BASE |K-Suite如果当前选择LDAP认证，为LDAP的BASE DN信息 |

### compose
```
  docker-compose up -d
  docker-compose down
```
  
# 登录认证
K-Suite提供两种方式的认证: LDAP与LOCAL-USER
- LDAP: 方便与企业AD域控进行对接
- LOCAL-USER: 在启动YML参数预先设置一些管理员信息，包含利用BCrypt加密后的密码。

配置示例如下:
```yaml
spring
  customized:
    suite:
      auth_type: ${AUTH_TYPE:ldap}
      local_users: ${LOCAL_USERS:a@domain.com##true##$2a$10$ar69iI1HwW9rAKwun0wDteeHzRVUmRaV7EH30a/lymgU0yHPz757q,b@domain.com##true}
      local_users_file: ${LOCAL_USERS_FILE:file:/Users/aa/Downloads/local_users.json}
  #ldap:
    #urls: ldap://ldap.aa.com
    #base: dc=ac,dc=com
```

| YML               | DESCRIPTION                           |
|--------------------|---------------------------------------|
| spring.customized.suite.auth_type | 认证方式。取值 ldap、local_user|
| spring.customized.suite.local_users | k-suite登录用户信息。支持admin和user两类.只包含三个属性，用##隔开，依次为 username,admin,password。参考 [**登录认证用户信息**](#登录认证用户信息)|
| spring.customized.suite.local_users_file | 如果用户信息很多，支持外部挂载用户JSON文件。格式参考  [**登录认证用户数据文件**](#登录认证用户数据文件)|
| spring.ldap.urls | 当支持LDAP认证时候，ldap的地址|
| spring.ldap.base | 当支持LDAP认证时候，ldap的base DN信息|

### 登录认证用户信息
| ATTR               | DESCRIPTION                           |
|--------------------|---------------------------------------|
| username | 登录用户信息。如果是ldap认证，可能是 xx@domain.com |
| admin | 是否是管理员。true-是，false-否。非管理员只能查看kong配置。不能进行任何POST DELETE PUT PATCH 操作 |
| password |密码。只有当auth_type=local_user时候需要设定。基于BCrypt加密。建议采用 BCryptPasswordEncoder 提前生成 |

### 登录认证用户数据文件
```json
[
    {
        "username": "xx@domain.com",
        "password": "$2a$10$ar69iI1HwW9rAKwun0wDteeHzRVUmRaV7EH30a/lymgU0yHPz757q",
        "admin": true
    }]

```

# 升级

我们会依据[getKong.org](https://getkong.org/)官方发布的社区版本，来跟进K-Suite对最新版本的兼容性。同时发布最新的docker image到官方hub仓库，供大家使用。

# FAQ

## 1. 如何使K-Suite能支持Kong的某个中间版本？
目前我们提供的release版本只支撑了Kong 0.11 ,1.2, 2.0最新版本。未来会从2.0版本开始跟随社区同步支撑最新版本，并保留对历史版本的兼容。

- 如果您需要我们支持某个历史版本，您可以告知我们，我们可以单独调整配置来支持
- 如果您需要尝试下自己基于源码来compile build一个版本，在您对Kong底层schema了解的情况下，您可以通过修改一下源码包下的配置model来支持。
```
src/main/resources
-- entity
-- pages
-- plugins

//对每个package下的模型定制版本即可
```

## 2. K-Suite的一个配置模型是否支撑对多个Kong的版本兼容性？
当然可以。

`每个.json的模型定义文件中，属性supportKongVersions用来表示该模型所支持的kong的版本信息（可以是大版本号,如:2.0;也可以是小版本号:如2.0.4）。确认相关版本中该实体的schema没有变化的情况下，可以设置多个版本号。根据长期对不同版本Kong底层的研究，发现各个版本有时候有差异，为了确保已经验证的版本支撑稳定性，建议单个model只支撑一个固定的kong版本`

具体的配置如下:
```json
{
  "name": "acls",
  "supportKongVersions": [
    "2.0"
  ],
  "description": "You can have more than one group associated to a consumer.",
  "fields": [
    {
      "name": "group",
      "component": "Input",
      "type": "string",
      "restrict": "required",
      "help": "The arbitrary group name to associate to the consumer."
    }
  ],
  "methods": {
    "add": {
      "method": "POST",
      "url": "/consumers/{$scope_parent_entity_data.id}/acls"
    }
  }
}

```
## 3. K-Suite如何连接到Kong Server
请先确认Kong server的admin endpoint地址信息。
>注意kong admin endpoint暴露的安全性。

通过调整yml文件或者对应的启动参数来设置
```yaml
spring
  customized:
    kong:
      admin_endpoint: ${KONG_ADMIN_ENDPOINT:{your kong admin endpoint}}
      name: ${KONG_NAME:{your kong name}}

```


# 配置model说明
K-Suite为了尽最大灵活度兼容对不同kong版本的支撑，抽象了一组核心model，具体如下

| TYPE               | DESCRIPTION                           | CODE PATH                              |
|--------------------|---------------------------------------|----------------------------------------|
|entity              | Kong核心模型。可利用关联的admin API对其新增与编辑。example:POST /consumers | src/main/resources/model/entity|
|page                | k-Suite功能管理模型。针对一个Kong实体管理主页，定义了相关操作，查询，搜索，分页列表展现 | src/main/resources/model/page|
|plugins             | Kong plugin核心模型，结合plugin's schema行了模型抽象。对所有plugins进行动态加载与配置 | src/main/resources/model/plugins|

## 1、Entity Model

依据kong核心实体的schema,对其抽象出一套实体model，以方便前端动态加载，实现新增与修改

属性说明

| ATTR               | DESCRIPTION|
|--------------------|------------|
| name | 实体名称 [**Entity Model Name**](#Entity Model Name)|
|supportKongVersions| 支持的kong.version。array.可以是多个，为了保证版本独立性，建议固定一个。避免后续kong的Schema发送变更引起其它未知问题 |
|description| 该实体的描述 |
|fields| 参考实体schema的定义指定的表单组件，array.用于生成配置Form. 具体说明参考 [**form-fields**](#form-fields)
|methods| 实体编辑提交方法。其中add-新增处理， update-修改处理 |
|method.url | 提交处理的admin api |
|method.method | 提交处理http method | 

for example:

```json
{
  "name": "consumers",
  "supportKongVersions": [
    "2.0"
  ],
  "description": "The Consumer object represents a consumer - or a user - of an API",
  "fields": [
    {
      "name": "username",
      "component": "Input",
      "type": "string",
      "restrict": "semi-optional",
      "help": "The unique username of the consumer. You must send either this field or <code class=\"highlighter-rouge\">custom_id</code> with the request."
    },
    {
      "name": "custom_id",
      "component": "Input",
      "type": "string",
      "restrict": "semi-optional",
      "help": "Field for storing an existing unique ID for the consumer - useful for mapping Kong with users in your existing database. You must send either this field or <code class=\"highlighter-rouge\">username</code> with the request."
    },
    {
      "name": "tags",
      "component": "InputMultiple",
      "type": "string",
      "restrict": "optional",
      "help": "An optional set of strings associated with the Consumer, for grouping and filtering."
    }
  ],
  "methods": {
    "add": {
      "method": "POST",
      "url": "/consumers"
    },
    "update": {
      "method": "PATCH",
      "url": "/consumers/{id}"
    }
  }
}

```


### Entity Model Name

| NAME               | Kong.Version|
|--------------------|------------|
| apis | less than 0.13.x|
| consumers| all |
| acls | all |
| basic-auth | all |
| ca-certificates| greater than 1.3.x |
| certificates | all |
| key-auth | all |
| oauth2 | all |
| routes | greater than 0.14.x |
| services | greater than 0.14.x |
| snis | all |
| upstreams |all |
| targets |all |


## 2、Page Model

Page Model主要用来定义 某个实体的列表管理页面。由于不同版本中的entity schema的属性略有差异，那么在page list中可能呈现的字段属性也不一样，因此我们定义这个PageModel来实现动态列表页面的统一处理，确保能兼容所有版本。

| ATTR               | DESCRIPTION|
|--------------------|------------|
| name | 实体名称 [**entity's model name**](#entity's model name)|
|supportKongVersions| 支持的kong.version。array.可以是多个，为了保证版本独立性，建议固定一个。避免后续kong的Schema发送变更引起其它未知问题 |
|description| 该实体的描述 |
|showPageTitleBar| 是否显示title bar.true-显示,false-不显示 |
|listByPage| 用来定义实体的列表页面的加载请求的api|
|listByPage.showByKeywords| 是否显示关键字搜索框 |
|listByPage.url| 分页加载admin_api |
|listByPage.method| 分页加载接口请求http method |
|listByPage.searchTarget| 搜索实体目标。大写。分别是 [**KongEntity枚举定义**](#KongEntity枚举定义) |
|buttons| 列表上的操作按钮，array. 具体说明参考 [**Page Buttons**](#Page Buttons)
|columns| 动态列。array.具体说明参考 [**Page Columns**](#Page Columns|
|method.url | 提交处理的admin api |
|method.method | 提交处理http method | 


### Page Buttons

定义列表页面左上方的按钮

#### button.actionType
定义按钮的操作类型
| NAME               | DESCRIPTION|
|--------------------|------------|
|openModal| 打开modal框，需要设置modal属性的配置项。参考 [**modal.type**](#modal.type) |
|openLink|打开一个超链接，需要设置link属性的配置项


openModal示例：
```json

{
  "icon": "plus",
  "text": "ADD API",
  "actionType": "openModal",
  "modal": {
    "name": "entityCreateUpdateModal",
    "modalName": "api",
    "config": {
      "entityName": "apis"
    }
  }
}

```

openLink示例
```json
{
      "icon": "link",
      "text": "go to services",
      "actionType": "openLink",
      "link": {
        "href": "/services",
        "target": "_self"
      }
    }

```

### Page Column

对Page实体列表中的列进行定义

| ATTR NAME  |  DESCRIPTION  | 
|------------|---------------|
|title|列名。 |
| align| 对齐方式。left middle right |
|field| 字段配置. json对象|
|field.type|字段类型。参考 |
|field.fieldName|字段名称.必须同该实体schema的属性名保持一致|
|field.config| 字段扩展配置项。每个type都不一样.json格式 |


```json
 {
  "title": "name",
  "align": "left",
  "field": {
    "type": "normal",
    "fieldName": "name"
  }
}

```




### form-fields
在entity和plugin的管理维护UI界面上呈现的属性称之为Field。其属性配置项完全一致:

```
 {
  "name": "",
  "component": "InputNumber",
  "type": "number",
  "value": "",
  "format_empty":"null",
  "restrict": "optional",
  "help": ""
}
```

| ATTR NAME  |  DESCRIPTION  | 
|------------|---------------|
| name       | 字段名称，必须与admin api实体新增相关Request Body保持一致。比如 [add-service](https://docs.konghq.com/2.0.x/admin-api/#add-service)|
| component  | UI组件类型。参考列表 [**field-components**](#field-components)|
| type       | 字段值类型，即kong.schema对相关实体的数据类型。参考列表 [**field-types**](#field-types)|
| options       | Array. 默认取值列表。当type=Select\SelectMultiple时候，给定的选项列表。for example: ["POST","GET"]|
| value       | 字段默认值. 取决于component.可能是number,boolean,array|
| restrict       | 字段约束。默认为空，表示必填。optional-可选  semi-optional：满足条件下可选，一般在多个属性之中选择一个|
| help       | 属性说明。支持rich text|
#### field-components

定义field在Admin UI上的控件类型。用于展示不同的表单控件

| name  |  DESCRIPTION  | 
|------------|---------------|
|Input | 普通文本输入框|
|InputNumber | 数字输入框，附带增减功能。|
|InputHidden | 隐藏文本框|
|InputMultiple | 单文本输入多个内容。一般用enter来处理，支持delete.提交时候一般为array|
|InputJSON | 接收输入json字符串。最终将输入的文本作为本字段的值。用来支持lua中动态table的输入|
|Switch| 开关。一般用于true\false的切换选择|
|Select| 单选框。下拉框的固定取值来源 field.options。选中值来源于value|
|SelectMultiple | 多选框。值提交时候以array形式提交|
|SelectConsumer| consumer单选框。key=consumer.id,value=consumer.name|
|SelectUpstream| upstream搜索建议框，支持模糊搜索选择返回upstream.name，也支持手动输入，比如aa.com
|SelectCertificates| certificate单选框。 key=certificate.id ,value=如果certificate.tags存在则显示逗号分隔的tags，如果没有，则显示certificate.id|
|SelectMultipleAcls | acl group多选择框 0.11以下版本无效.|

#### field-types

在符合kong.schema 对各个实体要求的情况下，表单接收的数据类型。目前k-suite一般不使用，仅用于说明。目前主要有

| name  |  DESCRIPTION  | 
|------------|---------------|
|string | 字符串|
|number | 数字|


#### column.field.type

page.model中定义了grid列表的column列，每列会包含多个field，每个field会指定一个field.type，并附带field.config

| FIELD.TYPE  |  DESCRIPTION  | CONFIG |
|------------|---------------|--------|
|icon | 图标，图标位置放在本地代码目录 /src/main/frontend/src/app/assets | 有|
|raw_view| 直接查看data raw json数据 | 无 |
|normal | 直接显示fieldName定义的属性值，不做任何特殊处理 | 无|
|format| 对指定fieldName的字段值进行格式化显示。| 有。需要指定格式化方法|
|action| 操作按钮。可以指定一个或多个操作按钮时间 | 有.依据不同的操作按钮来定|


##### 1、column.field.type#icon

```json
{
    "type": "icon",
    "config": {
      "src": "/images/plugins/{name}.png",
      "height": "42px"
    }
}
```

##### 2、column.field.type#raw_view

```json
 {
      "title": "",
      "align": "left",
      "field": {
        "type": "raw_view"
      }
    }
```
##### 3、column.field.type#normal

```json

  {
      "title": "name",
      "align": "left",
      "field": {
        "type": "normal",
        "fieldName": "name"
      }
    }
```

##### 4、column.field.type#format

格式显示属性值时候，必须指定 config.method格式化方法。常见的格式方法参考 [**format functions**](#format functions)
```json

 {
  "title": "uris",
  "align": "left",
  "field": {
    "type": "format",
    "fieldName": "uris",
    "config": {
      "method": "_format_tags"
    }
  }
}
```

##### 5、column.field.type#action

```json

{
      "title": "ACTIONS",
      "align": "left",
      "fields": [
        {
          "type": "action",
          "config": {
            "icon": "lajitong",
            "text": "delete",
            "actionType": "callAPI",
            "confirm":"Are you sure to delete it?",
            "api": {
              "url": "/consumers/{consumer_id}/basic-auth/{id}",
              "method": "DELETE"
            }
          }
        }
      ]
    }
```


#### format functions
page-model中对column字段格式化，前端页面组件提供了若干全局方法进行处理。

```
//一般定义格式:
(data,fieldName)->{
    //具体实现
}

- data：默认指实体的数据。每个实体参考 kong.schema
- fieldName: 字段名称。支持多级key。 for example: consumer.id
```


| FUNCTION  |  DESCRIPTION  | EXAMPLE |
|------------|---------------|--------|
|_plugin_scope | 针对单个plugin配置数据，计算其适用范围实体名称。结果是: apis,services,routes,consumers,global | none
|_plugin_apply_to | 根据单个plugin的配置数据，计算其适用范围实体的ID.结果是:api.id,service,id,route.id,consumer.id, All| none
|_format_date | 将到毫秒时间戳转换成yyyy-MM-dd hh:mm:ss | none
|_format_date2 | 将到秒时间戳转换成yyyy-MM-dd hh:mm:ss | none
|_format_tags | 将任意实体中某个字段的转换成前端react.tags样式显示处理。一般用于处理array类型数据 | 比如对services.tags,oauth2.redirect_uris处理后显示


#### modal.type
定义page.model中几种常用的modal组件

| MODEL.TYPE  |  DESCRIPTION  | CONFIG |
|------------|---------------|--------|
|pluginsHubModal |plugins仓库。支持从不同的scope进行选择。自动过滤已经给某个实体绑定过的插件 | 有|
|pluginUpModal | 单个plugin配置界面。支持新增或修改。动态支持所有Plugin | 有|
|entityCreateUpdateModal |单个实体对象的新增或修改。比如对consumer,upstream等的新增或编辑 | 有|
|entityListModal |单个实体列表信息在模态框中管理.支持分页查询，新增与修改等 | 有|

pluginsHubModal
```json
{  "modal": {
         "name": "pluginsHubModal",
         "modalName": "plugin",
         "config": {
           "editable": false
         }
 
       }}
```

pluginUpModal
```json
{ "modal": {
               "name": "pluginUpModal",
               "modalName": "Plugin",
               "config": {
                 "editable": true,
                 "entityIdFieldName": "id",
                 "entityName": "plugins",
                 "loadAPI": {
                   "url": "/plugins/{id}",
                   "method": "GET"
                 }
               }}
```

entityCreateUpdateModal

```json

{"modal": {
   "name": "entityCreateUpdateModal",
   "modalName": "api",
   "config": {
     "editable": true,
     "entityName": "apis",
     "entityIdFieldName": "id",
     "loadAPI": {
       "url": "/apis/{id}",
       "method": "GET"
     }
   }
 }}

```
entityListModal配置实例
```json
{"modal": {
     "name": "entityListModal",
     "modalName": "targets",
     "config": {
       "pageModelName": "targets"
     }
   }}
```

#### KongEntity枚举定义

```java

public enum KongEntity {

    /**
     * default when not defined
     */
    DEFAULTS,

    /**
     * apis
     * kong.version<=0.12.x
     */
    APIS,

    /**
     * tags
     * kong.version>=1.2.x
     */
    TAGS,

    /**
     * services
     * kong.version>=0.13.x
     */
    SERVICES,

    /**
     * routes
     * kong.version>=0.13.x
     */
    ROUTES,

    /**
     * plugins
     */
    PLUGINS,

    /**
     * consumers
     */
    CONSUMERS,

    /**
     * acls
     */
    ACLS,

    /**
     * basic_auth
     */
    BASIC_AUTH,

    /**
     * key_auth
     */
    KEY_AUTH,

    /**
     * oauth2
     */
    OAUTH2,

    /**
     * certificates
     */
    CERTIFICATES,

    /**
     * snis
     */
    SNIS,

    /**
     * targets
     */
    TARGETS,


    /**
     * upstreams
     */
    UPSTREAMS;

}
```

# license


# 直接贡献者
- [https://github.com/choaryzhang](https://github.com/choaryzhang) 
- [https://github.com/coxon](https://github.com/coxon)
- [https://github.com/zhangchunl](https://github.com/zhangchunl)
- [https://github.com/DarlingJY](https://github.com/DarlingJY)
- [https://github.com/mushroomli](https://github.com/mushroomli)
- [https://github.com/Blackmamba1](https://github.com/Blackmamba1)
- [https://github.com/liang33zhou](https://github.com/liang33zhou)