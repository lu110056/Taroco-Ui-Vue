# 整体架构

![](/images/taroco.jpg)

# 目录结构

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
├── taroco-oauth2 --认证中心
│   ├── authentication-server --统一认证服务
│   ├── oauth2-config --oauth2抽象封装
│   ├── sso-demo1 --sso案例
│   ├── sso-demo1 --sso案例
├── taroco-rbac --基于角色的权限控制服务
```