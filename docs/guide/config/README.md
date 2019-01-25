# 配置解读

::: tip
Taroco 将配置放在远程 github 进行维护，方便调试与集中管理。

Taroco 内置了开发环境和测试环境两套配置，我们以测试环境配置为例进行详细解读。
:::

更多关于 Spring Cloud 配置中心的内容，请阅读 Spring Cloud 配置中心 [官方文档](https://cloud.spring.io/spring-cloud-config/single/spring-cloud-config.html)

## application-test.yml

所有服务的全局配置

```yaml
# 公共配置地址
base:
  auth:
    server: http://taroco-authentication-server:9001
  mysql:
    url: jdbc:mysql://taroco-mysql:3306
  redis:
    host: taroco-redis
    port: 6379
    password: taroco!@#$
  zipkin:
    url: http://taroco-zipkin:10003/

management:
  endpoints:
    web:
      exposure:
        include: "*"
  endpoint:
    health:
      show-details: always

spring:
  zipkin:
    base-url: ${base.zipkin.url}
    sender:
      type: web
  sleuth:
    sampler:
      percentage: 1.0

server:
  tomcat:
    max-threads: 200 # Maximum amount of worker threads.
    min-spare-threads: 10 # Minimum amount of worker threads

# eureka配置
eureka:
  client:
    # eureka客户端从eureka服务器注册表中获取服务注册信息的时间间隔（s），默认为30秒,开发阶段调小
    registry-fetch-interval-seconds: 30
  instance:
      # 注册服务ip到eureka server上
      prefer-ip-address: true
      # 自定义服务实例id
      instance-id: ${spring.application.name}:${spring.cloud.client.ip-address}:${server.port}
      # 服务实例的续约到期时间（默认90秒），也就是心跳的最大等待时间。开发阶段调小
      lease-expiration-duration-in-seconds: 90
      # 服务实例的续约更新时间间隔（默认30秒），也就是心跳时间。开发阶段调小
      lease-renewal-interval-in-seconds: 30
      metadata-map:
        # 服务实例权重 默认100
        weight: 100
        # 服务actuator的管理port，如果设置了的话，Turbine监控台就获取不到对应服务的hystrix.stream。
        # 这里就需要设置，Turbine会读取这个端口。
        management.port: ${management.port:${server.port}}

# hystrix配置
hystrix:
  threadpool:
    default:
      coreSize: 100
      maxQueueSize: 1000
      queueSizeRejectionThreshold: 800
  command:
    default:
      execution:
        isolation:
          thread:
            # 断路器的超时时间,断路器的超时时间需要大于ribbon的超时时间，不然不会触发重试。
            timeoutInMilliseconds: 61000

# ribbon配置
ribbon:
  eager-load:
    enabled: true
    clients: taroco-admin,taroco-rbac-service,taroco-authentication-server
  # ribbon请求连接的超时时间 默认2秒 ms
  ConnectTimeout: 5000
  # 请求处理的超时时间 默认5秒 ms
  ReadTimeout: 5000
  # 对所有操作请求都进行重试,不配置这个MaxAutoRetries不起作用 默认false
  OkToRetryOnAllOperations: true
  # 对当前实例的重试次数 默认0
  MaxAutoRetries: 1
  # 切换实例的重试次数 默认1
  MaxAutoRetriesNextServer: 2
  # 自定义的ribbon负载均衡策略 默认com.netflix.loadbalancer.AvailabilityFilteringRule
  NFLoadBalancerRuleClassName: cn.taroco.common.ribbon.XlabelWeightMetadataRule
  # 从注册中心刷新servelist的时间 默认30秒 ms
  ServerListRefreshInterval: 15000


feign:
  hystrix:
    enabled: true
  client:
    config:
      feignName:
        connectTimeout: 5000
        readTimeout: 5000
  compression:
    request:
      enabled: true
    response:
      enabled: true
```

## taroco-authentication-server-test.yml

认证服务配置

```yaml
# jpa配置 数据源配置
spring:
  datasource:
    url: ${base.mysql.url}/taroco-oauth2?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&useSSL=false&zeroDateTimeBehavior=convertToNull
    username: root
    password: taroco@1234
    driver-class-name: com.mysql.jdbc.Driver
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      pool-name: Taroco-OAuth2-HikariCP
  #redis配置
  redis:
    host: ${base.redis.host}
    port: ${base.redis.port}
    password: ${base.redis.password}
    database: 0
  freemarker:
    allow-request-override: false
    allow-session-override: false
    cache: true
    charset: UTF-8
    check-template-location: true
    content-type: text/html
    enabled: true
    expose-request-attributes: false
    expose-session-attributes: false
    expose-spring-macro-helpers: true
    prefer-file-system-access: true
    suffix: .ftl
    template-loader-path: classpath:/templates/

# oauth2 配置
taroco:
  oauth2:
    key-store:
      location: classpath:taroco.jks
      secret: taroco!@#$
      alias: taroco
    url-permit-all:
      - /actuator/**
      - /authentication/**
      - /**/*.css
      - /**/*.jpg
      - /**/*.png
      - /**/*.woff2
      - /**/*.js
```

## taroco-gateway-test.yml

网关服务配置

```yaml
# 服务网关配置
spring:
  #redis配置
  redis:
    host: ${base.redis.host}
    port: ${base.redis.port}
    password: ${base.redis.password}
    database: 0

# 路由配置
zuul:
  retryable: true
  #　忽略所有默认路由
  ignored-services: '*'
  # 需要聚合的swagger服务
  swagger:
    serviceIds: taroco-rbac-service

security:
  validate:
    code: true
    # 演示环境限制 如果设置为true, 将拦截所有非 GET 请求
    preview: true
  sessions: stateless
  oauth2:
    client:
      client-id: taroco
      client-secret: taroco
    resource:
      jwt:
         key-uri: ${base.auth.server}/oauth/token_key #解析jwt令牌所需要密钥的地址

# oauth2 配置
taroco:
  oauth2:
    url-permit-all:
      - /actuator/**
      - /mobile/**
      - /auth/**
      - /admin/code/*
      - /admin/smsCode/*
      - /admin/user/info
      - /admin/menu/userMenu
      - /swagger-resources/**
      - /swagger-ui.html
      - /*/v2/api-docs
      - /swagger/api-docs
      - /webjars/**
```

## taroco-monitor-test.yml

监控服务配置

```yaml
turbine:
  # 要监测的Eureka服务列表
  app-config: taroco-gateway,taroco-authentication-server,taroco-rbac-service
  # 表示同一主机上的服务通过host和port的组合来进行区分，默认情况下是使用host来区分，这样会使本地调试有问题
  combine-host-port: true
  aggregator:
      # 服务集群名称,默认serviceId,这里必须大写
      clusterConfig: TAROCO-GATEWAY,TAROCO-AUTHENTICATION-SERVER,TAROCO-RBAC-SERVICE
  # 所有的服务都用一个default集群名称
  #cluster-name-expression: new String("default")
```

## taroco-rbac-service-test.yml

权限服务配置

```yaml
# jpa配置 数据源配置
spring:
  datasource:
    url: ${base.mysql.url}/taroco-oauth2?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&useSSL=false&zeroDateTimeBehavior=convertToNull
    username: root
    password: taroco@1234
    driver-class-name: com.mysql.jdbc.Driver
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      pool-name: Taroco-OAuth2-HikariCP
  #redis配置
  redis:
    host: ${base.redis.host}
    port: ${base.redis.port}
    password: ${base.redis.password}
    database: 0

mybatis-plus:
  mapper-locations: classpath:/mapper/*Mapper.xml
  typeAliasesPackage: cn.taroco.rbac.admin.model.entity
  global-config:
    #主键类型  0:"数据库ID自增", 1:"用户输入ID",2:"全局唯一ID (数字类型唯一ID)", 3:"全局唯一ID UUID";
    id-type: 0
    #字段策略 0:"忽略判断",1:"非 NULL 判断"),2:"非空判断"
    field-strategy: 1
    #驼峰下划线转换
    db-column-underline: true
    #刷新mapper 调试神器
    refresh-mapper: true
    #数据库大写下划线转换
    #capital-mode: true
  configuration:
    map-underscore-to-camel-case: true
    cache-enabled: true

taroco:
  # swagger2配置
  swagger:
    enabled: true
    title: Taroco权限管理(RBAC)
    description: Taroco权限管理(RBAC) RestFull Api
    version: 1.0.1-SNAPSHOT
    license: Apache License, Version 2.0
    license-url: https://www.apache.org/licenses/LICENSE-2.0.html
    terms-of-service-url: https://github.com/liuht777/Taroco
    contact:
      name: liuht
      url: https://github.com/liuht777
      email: liuht777@qq.com
    base-package: cn.taroco.rbac.admin.controller
    base-path: /**
    exclude-path: /error
```