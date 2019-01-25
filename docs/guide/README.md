# 介绍

## 整体架构

![](/images/taroco.jpg)

## 目录结构

```
├── taroco-cloud  --微服务相关组件
│   ├── cloud-admin --服务治理相关
│   ├── cloud-config  --服务配置中心
│   ├── cloud-monitor --服务监控
│   ├── cloud-registry  --服务注册中心
├── taroco-common-starter --自定义spring boot starter
│   ├── taroco-common-spring-boot-starter --公共依赖模块(全局异常、常量、通用类)
│   ├── taroco-log-spring-boot-starter --通用logback-spring、自定义banner
│   ├── taroco-redis-spring-boot-starter --通用redis配置
│   ├── taroco-ribbon-spring-boot-starter --基于ribbon的服务治理扩展
│   ├── taroco-swagger2-spring-boot-starter --自定义封装swagger2配置
├── taroco-docs --文档、截图、docker文件、初始化脚本
├── taroco-gateway --微服务网关
├── taroco-authentication --统一认证服务
├── taroco-rbac --基于角色的权限控制服务
```

## 完成功能

* Spring Cloud Eureka 注册中心
* Spring Cloud Config Server 配置中心，统一管理配置信息
* Spring Cloud Zuul Gateway 统一微服务网关配置，支持动态路由配置
* 基于 spring-boot-starter-actuator 的自实现的服务治理。包括日志、变量、映射等情况。
* 基于 Hystrix 的聚合监控页面，包括单个服务和服务多个实例的监控。
* 基于 Spring Security OAuth2 的权限认证系统。采用JWT RSA非对称加密的形式进行 token 加密解密。
* 支持基于权重以及基于标签的服务路由，支持动态配置服务权重及标签信息。通过控制用户标签以及动态路由的配置，满足各种各样请求策略。
* 基于角色的RBAC权限控制(用户、部门、角色、菜单、日志、字典、动态路由、oauth2 客户端)，支持按钮级别的权限控制以及数据权限控制（DataScope）。
* 基于Zipkin的调用链追踪（如果生产上使用，还需要把监控内容持久化比，如采用ElasticSearch，把监控内容从发送http请求切换到MQ等改造）。


## 分支版本

* Branch 1.5.12：基于 Spring Boot 1.5.12.RELEASE + Spring Cloud Edgware.SR4，是Taroco最初的版本。
* Branch 2.x：基于 Spring Boot 2.0.5.RELEASE + Spring Cloud Finchley.SR1 是当前维护的版本。
* Master 分支已经改为从2.x merge代码，今后更新的中心也会放在2.x分支上。
