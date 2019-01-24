::: tip
本文将介绍如何编译-启动 Taroco，如果您已经是个 Java 多年使用者，或者对 Spring Cloud 有充分的理解，那么可以忽略本章节。
:::

# 后端环境依赖

* JDK1.8+
* Spring Boot 2.0.5
* Spring Cloud Finchley.SR1
* Maven 3.0+
* Redis 3.0+
* MySQL 5.7

# 前端依赖

Taroco 前端基于开源项目 [D2Admin](https://github.com/d2-projects/d2-admin) 构建。

D2Admin 中文文档：[D2Admin Document](https://doc.d2admin.fairyever.com/zh/)。

<a href="https://github.com/d2-projects/d2-admin" target="_blank"><img src="https://raw.githubusercontent.com/FairyEver/d2-admin/master/doc/image/d2-admin@2x.png" width="200"></a>

# 编译源码

* 克隆代码到本地

```
git clone -b 2.x https://github.com/liuht777/Taroco.git
```

* 编译源码

```
mvn clean install -DskipTests
```

* 用开发工具打开 推荐: IDEA

# 克隆配置

* 将 Taroco 的配置文件 fork 到自己仓库 或者克隆下来，push 到自己的git仓库

``` git
git clone https://github.com/liuht777/Taroco-Config.git
```

* 修改 Taroco Config 服务的 git 路径为自己的地址

``` yaml{8}
spring:
  application:
    name: taroco-config
  cloud:
    config:
      server:
        git:
          uri: https://github.com/liuht777/Taroco-Config
          search-paths: config-dev, config-test
          default-label: master
```

# 导入数据库脚本
