# Taroco 服务治理

## 总体介绍

* Taroco通过对Ribbon的扩展：自定义我们自己的负载均衡策略，实现了基于权重的流量控制。同时支持基于标签的路由。入口请求含有各种标签，然后我们可以根据标签幻化出各种各样的路由规则。
* Taroco服务治理通过对Spring Boot Actuator的使用，在我们的服务详情页面，可以轻松查看甚至修改服务的各项指标信息。包括服务日志、性能指标、映射列表、环境参数、请求追踪、Heap dump等。

### 基于权重的负载均衡
    Spring Cloud Ribbon默认是ZoneAvoidanceRule，优先选择相同Zone下的实例，实例间采用轮询方式做负载均衡。我们将服务的权重信息放在eureka服务实例的metadata当中。我们只需从eureka拿每个实例的权重信息，然后根据权重来选择服务器即可。接下来就是如何在项目中使用的问题：
    1. 我们定义了一个starter：taroco-ribbon-spring-boot-starter 关于ribbon的扩展都在当中。我们的服务想要使用扩展的ribbon功能,只需要引入此依赖即可。XlabelWeightMetadataRule就是扩展的负载均衡的类。
    2. 由于Spring Cloud Ribbon并没有实现Netflix Ribbon的所有配置项。Netflix配置全局Rule方式为：ribbon.NFLoadBalancerRuleClassName=package.YourRule，Spring Cloud并不支持，Spring Cloud直接到服务粒度，即SERVICE_ID.ribbon.NFLoadBalancerRuleClassName=package.YourRule。我们通过扩展org.springframework.cloud.netflix.ribbon.PropertiesFactory修正spring cloud ribbon未能完全支持netflix ribbon配置的问题。这样我们就可以将自定义的Ribbon配置写到配置中心的全局配置中，然后各个微服务还可以根据自身情况做个性化定制。DefaultPropertiesFactory继承PropertiesFactory，通过重写getClassName方法实现。
 ```
    /**
     * 重写 支持 ribbon.NFLoadBalancerRuleClassName=package.YourRule 全局配置的方式
     */
    @Override
    public String getClassName(Class clazz, String name) {
        String className = super.getClassName(clazz, name);
        // 读取全局配置
        if(!StringUtils.hasText(className) && this.classToProperty.containsKey(clazz)){
            String classNameProperty = this.classToProperty.get(clazz);
            className = environment.getProperty(NAMESPACE + "." + classNameProperty);
        }
        return className;
    }
```

### 网关限流

* taroco使用开源 zuul 限流工具 `spring-cloud-zuul-ratelimit`, 进行服务级别的限流。具体配置可参考[spring-cloud-zuul-ratelimit](https://github.com/marcosbarbero/spring-cloud-zuul-ratelimit)

### 应用限流

* taroco 内置了基于 redis 的应用级别限流, 需要引入依赖:

``` java
<dependency>
  <groupId>cn.taroco</groupId>
  <artifactId>taroco-redis-spring-boot-starter</artifactId>
</dependency>
```

* 在Controller方法添加注解`@SpringControllerLimit`

* 添加配置

``` java
taroco.redis.limit.value=100
```

::: tip
你也可以自行扩展相关类, 达到更好的限流效果
:::

### 基于标签的路由
* 入口请求含有各种标签，然后我们可以根据标签幻化出各种各样的路由规则。例如只有标注为粉丝的用户才使用新版本，例如标注为中国的用户请求必须发送到中国的服务器，例如标注为写的请求必须发送到专门的写服务实例（读写分离），等等等等。
* 根据标签的控制，我们放到之前写的Ribbon的rule中，每个实例配置的不同规则也是跟之前一样放到注册中心的metadata中，关键是标签数据如何传过来。这时我们会想到ThreadLocal，所有请求都从网关进来，我们可以在这里给用户的请求打上各种各样的标签。然而，由于Hystrix的存在，我们是拿不到ThreadLocal的，因为Hystrix通过命令模式启用线程隔离，在Hystrix的线程中拿不到前面线程的ThreadLocal数据。查找Hystrix的源码，发现可以使用HystrixRequestVariableDefault，这里不建议直接使用HystrixConcurrencyStrategy，会和sleuth的strategy冲突。代码参见XlabelHeaderInterceptor。现在zuul里面的rule，已经能够拿到标签内容了。这里要注意的是：HystrixRequestContext.initializeContext()的调用必须在Hystrix Command执行之前调用，不然会报错。HystrixRequestContext.initializeContext() must be called at the beginning of each request before RequestVariable functionality can be used.
* 接下来就是服务到服务之间的标签传递问题了。网关内的服务在接收到请求时，我们通过统一的Spring MVC拦截器将用户标签信息放入HystrixRequestVariableDefault当中，代码参见XlabelHeaderInterceptor。然后当此服务需要再次调用其他服务时，自动带上这里面保存的标签信息。这行就能将标签信息一直传递下去，保证我们自定义的Ribbon的Rule是可用的。
* * RestTemplate请求的方式参照XlabelHttpRequestInterceptor
* * Feign请求的方式参照 

### Actuator&Hystrix
* actuator是spring boot提供的对服务的自省和监控的集成功能，可以对应用系统进行配置查看、相关功能统计等。通过taroco-ribbon-spring-boot-starter引入了actuator，Hystrix并且默认开启了@EnableCircuitBreaker。
* 在我们服务治理的服务详情页面，可以轻松查看甚至修改服务的各项指标信息。包括服务日志、性能指标、映射列表、环境参数、请求追踪、Heap dump等。
* 在写自己的服务时可以直接使用@HystrixCommand进行熔断的使用，关于Hystrix会在专门的章节进行详细的讲解。