# Eureka是什么?

* Eureka是Netflix开源的一个Restful服务，主要用于服务的注册发现。Eureka 由两个组件组成：Eureka服务器和Eureka客户端。Eureka服务器用作服务注册服务器。Eureka客户端是一个Java客户端，用来简化与服务器的交互、作为轮询负载均衡器，并提供服务的故障切换。Netflix在其生产环境中使用的是另外的客户端，它提供基于流量、资源利用率以及出错状态的加权负载均衡。  
* Spring Cloud封装了Netflix公司开发的Eureka模块来实现服务注册和发现。Eureka采用了C-S的设计架构。Eureka Server作为服务注册功能的服务器，它是服务注册中心。而系统中的其他微服务，使用Eureka的客户端连接到 Eureka Server，并维持心跳连接。这样系统的维护人员就可以通过 Eureka Server 来监控系统中各个微服务是否正常运行。Spring Cloud 的一些其他模块（比如Zuul）就可以通过 Eureka Server 来发现系统中的其他微服务，并执行相关的逻辑。

## 为什么使用Eureka?

- 开源： 大家可以对实现一探究竟，甚至修改源代码。
- 可靠： 经过 Netflix 多年的生产环境考验，使用应该比较靠谱处心。
- 功能齐全： 不但提供了完整的注册发现服务，还有Ribbon等可以配合使用服务。
- 基于 Java： 对于 Java 程序员来说，使用起来，心里比较有底。
- Spring Cloud: Spring Cloud与Eureka进行了很好的集成，同时集成了一系列Netflix开源的产品，使用起来非常方便。

## Eureka架构说明

![Eureka架构图](https://gitee.com/uploads/images/2017/1226/101404_9ad49788_629056.png "4673-e73e12b7d2033cc8.png")
* 上图是 Eureka Wiki 中提供的架构图。从上面的架构图可以看出，主要有三种角色：

    Eureka Server： 通过 Register， Get，Renew 等 接口提供注册和发现

    Application Service （Service Provider）： 服务提供方，把自身服务实例注册到 Eureka Server

    Application Client （Service Consumer）： 服务调用方，通过 Eureka Server 获取服务实例，并调用 Application Service

* 他们主要进行的活动如下：

    每个 Region 有一个 Eureka Cluster， Region 中的每个 Zone 都至少有一个 Eureka Server。

    Service 作为一个 Eureka Client，通过 register 注册到 Eureka Server，并且通过发送心跳的方式更新租约（renew leases）。如果 Eureka Client 到期没有更新租约，那么过一段时间后，Eureka Server 就会移除该 Service 实例。

    当一个 Eureka Server 的数据改变以后，会把自己的数据同步到其他 Eureka Server。

    Application Client 也作为一个 Eureka Client 通过 Get 接口从 Eureka Server 中获取 Service 实例信息，然后直接调用 Service 实例。

    Application Client 调用 Service 实例时，可以跨可用区调用。

## 区域与可用区

* 区域（Region）: AWS 云服务在全球不同的地方都有数据中心，比如北美、南美、欧洲和亚洲等。与此对应，根据地理位置我们把某个地区的基础设施服务集合称为一个区域。通过 AWS 的区域，一方面可以使得 AWS 云服务在地理位置上更加靠近我们的用户，另一方面使得用户可以选择不同的区域存储他们的数据以满足法规遵循方面的要求。美东（北佛吉尼亚）、美西（俄勒冈）、美西（北加利佛尼亚）、欧洲（爱尔兰）、亚太（新加坡）、亚太（东京）等。每个区域都有自己对应的编码。
* 可用区（Zone）： AWS 的每个区域一般由多个可用区（AZ）组成，而一个可用区一般是由多个数据中心组成。AWS引入可用区设计主要是为了提升用户应用程序的高可用性。因为可用区与可用区之间在设计上是相互独立的，也就是说它们会有独立的供电、独立的网络等，这样假如一个可用区出现问题时也不会影响另外的可用区。在一个区域内，可用区与可用区之间是通过高速网络连接，从而保证有很低的延时。

## 启动 Eureka Server

1.在 pom.xml 中添加依赖：
```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-eureka-server</artifactId>
</dependency>
```
2.实现 Application，添加 annotation。 @EnableEurekaServer、@EnableDiscoveryClient 执行 main 方法启动 Eureka Server。
```
@SpringBootApplication
@EnableEurekaServer
@EnableDiscoveryClient
public class Application {
    public static void main(String[] args) throws Exception {
        SpringApplication.run(Application.class, args);
    }
}
```
3.运行 Application 即可启动 Server，启动 Server 后打开 http://localhost:8761/，可以看到信息页面。

## 注册服务

1.添加 eureka 依赖
```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-eureka</artifactId>
</dependency>
```
2.添加 @EnableDiscoveryClient或者@EnableEurekaClient 注解，建议是@EnableDiscoveryClient
```
@EnableDiscoveryClient
public class Application
```
3.在 application.yml 或者 application.properties 中添加配置，更多配置请参考配置管理-配置解读
```
eureka:
  client:
    serviceUrl:
      defaultZone: http://127.0.0.1:8761/eureka/
    lease:
      duration: 5
spring:
  application:
    name: customer-service
```
配置中有两项需要额外注意：

* eureka.client.serviceUrl.defaultZone：指定 Eureka 服务端的地址，当客户端没有专门进行配置时，就会使用这个默认地址。
* spring.application.name：服务注册所使用的名称，同时其他服务查找该服务时也使用该名称。我们启动该服务后，可以在管理页面中查看到该服务已经在注册中心中注册成功了。

## 服务发现与负载均衡

* 直接使用 Eureka Client 还是比较麻烦的，幸运的是，Spring Cloud为我们提供了整合过后的RestTemplate以及Feign。我们可以通过这两种方式很好的进行服务调用。
* Taroco中对RestTemplate和Feign都做了响应的扩展，因为两者都是通过ribbon作为负载均衡器的，因此对应的扩展都放在taroco-ribbon-spring-boot-starter当中。

## Eureka高可用理论

* 著名的CAP理论指出，一个分布式系统不可能同时满足C(一致性)、A(可用性)和P(分区容错性)。由于分区容错性在是分布式系统中必须要保证的，因此我们只能在A和C之间进行权衡。
* Eureka Server提供服务注册服务，各个节点启动后，会在Eureka Server中进行注册，这样Eureka Server中的服务注册表中将会存储所有可用服务节点的信息，服务节点的信息可以在界面中直观的看到。
* Eureka在设计时就优先保证可用性。Zookeeper保证的是CP, 而Eureka则是AP。Eureka各个节点都是平等的，几个节点挂掉不会影响正常节点的工作，剩余的节点依然可以提供注册和查询服务。
* 在应用启动后，将会向Eureka Server发送心跳,默认周期为30秒，如果Eureka Server在多个心跳周期内没有接收到某个节点的心跳，Eureka Server将会从服务注册表中把这个服务节点移除(默认90秒)。
* 其次，Eureka Client对已经获取到的注册信息也做了30s缓存。即服务通过eureka客户端第一次查询到可用服务地址后会将结果缓存，下次再调用时就不会真正向Eureka发起HTTP请求了。
* 再次， 负载均衡组件Ribbon也有30s缓存。Ribbon会从上面提到的Eureka Client获取服务列表，然后将结果缓存30s。
* 最后，如果你并不是在Spring Cloud环境下使用这些组件(Eureka, Ribbon)，你的服务启动后并不会马上向Eureka注册，而是需要等到第一次发送心跳请求时才会注册。心跳请求的发送间隔也是30s。（Spring Cloud对此做了修改，服务启动后会马上注册）
* Eureka Server之间通过复制的方式完成数据的同步，Eureka还提供了客户端缓存机制，即使所有的Eureka Server都挂掉，客户端依然可以利用缓存中的信息消费其他服务的API。
* 以上这几个30秒正是官方wiki上写服务注册最长需要2分钟的原因。Eureka通过心跳检查、客户端缓存等机制，确保了系统的高可用性、灵活性和可伸缩性。
* 而Eureka的客户端在向某个Eureka注册或时如果发现连接失败，则会自动切换至其它节点，只要有一台Eureka还在，就能保证注册服务可用(保证可用性)，只不过查到的信息可能不是最新的(不保证强一致性)。
* 除此之外，Eureka还有一种自我保护机制，如果在15分钟内超过85%的节点都没有正常的心跳，那么Eureka就认为客户端与注册中心出现了网络故障，此时会出现以下几种情况：

```
Eureka不再从注册列表中移除因为长时间没收到心跳而应该过期的服务
Eureka仍然能够接受新服务的注册和查询请求，但是不会被同步到其它节点上(即保证当前节点依然可用)
当网络稳定时，当前实例新的注册信息会被同步到其它节点中
```
* 因此， Eureka可以很好的应对因网络故障导致部分节点失去联系的情况，而不会像Zookeeper那样使整个注册服务瘫痪。

## Eurek高可用配置

* 主要是利用多个eureka相互注册,下例用采用三台服务器做集群部署,其中每台eureka服务器向另外两台注册自己的实例。

```
1.Eureka Server的同步遵循着一个非常简单的原则：只要有一条边将节点连接，就可以进行信息传播与同步
2.如果Eureka A的peer指向了B, B的peer指向了C，那么当服务向A注册时，B中会有该服务的注册信息，但是C中没有。也就是说，如果你希望只要向一台Eureka注册其它所有实例都能得到注册信息，那么就必须把其它所有节点都配置到当前Eureka的peer属性中。这一逻辑是在PeerAwareInstanceRegistryImpl#replicateToPeers()方法中实现的。
```

高可用配置中需要注意的几点：

1.在Eureka中，一个instance通过一个eureka.instance.instanceId 来唯一标识，如果这个值没有设置，就采用eureka.instance.metadataMap.instanceId来代替。instance之间通过eureka.instance.appName 来彼此访问，在spring cloud中默认值是spring.application.name,如果没有设置则为UNKNOWN。在实际使用中spring.application.name不可或缺,因为相同名字的应用会被Eureka合并成一个群集。eureka.instance.instanceId也可以不设置，直接使用缺省值(client.hostname:application.name:port)
,同一个appName下InstanceId不能相同。

2.如果 eureka.client.registerWithEureka设置成true（默认值true），应用启动时，会利用指定的eureka.client.serviceUrl.defaultZone注册到对应的Eureka server中。之后每隔30s（通过eureka.instance.leaseRenewalIntervalInSeconds来配置）向Eureka server发送一次心跳，如果Eureka server在90s（通过eureka.instance.leaseExpirationDurationInSeconds配置）内没有收到某个instance发来的心跳就会把这个instance从注册中心中移走。发送心跳的操作是一个异步任务，如果发送失败，则以2的指数形式延长重试的时间，直到达到eureka.instance.leaseRenewalIntervalInSeconds * eureka.client.heartbeatExecutorExponentialBackOffBound这个上限,之后一直以这个上限值作为重试间隔，直至重新连接到Eureka server，并且重新尝试连接到Eureka server的次数是不受限制的。

3.在Eureka server中每一个instance都由一个包含大量这个instance信息的com.netflix.appinfo.InstanceInfo标识，client向Eureka server发送心跳和更新注册信息是不相同的，InstanceInfo也以固定的频率发送到Eureka server，这些信息在Eureka client启动后的40s（通过eureka.client.initialInstanceInfoReplicationIntervalSeconds配置）首次发送，之后每隔30s(通过eureka.client.instanceInfoReplicationIntervalSeconds配置)发送一次。

4.如果eureka.client.fetchRegistry设置成true（默认值true），Eureka client在启动时会从Eureka server获取注册信息并缓存到本地，之后只会增量获取信息（可以把eureka.client.shouldDisableDelta设置成false来强制每次都全量获取）。获取注册信息的操作也是一个异步任务，每隔30秒执行一次（通过eureka.client.registryFetchIntervalSeconds配置），如果操作失败，也是以2的指数形式延长重试时间，直到达到eureka.client.registryFetchIntervalSeconds * eureka.client.cacheRefreshExecutorExponentialBackOffBound 这个上限，之后一直以这个上限值作为重试间隔，直至重新获取到注册信息，并且重新尝试获取注册信息的次数是不受限制的。
这些任务都是在com.netflix.discovery.DiscoveryClient中启动，spring cloud用org.springframework.cloud.netflix.eureka.CloudEurekaClient对这个类进行了扩展。

## Eureka配置最佳实践参考

[Eureka配置最佳实践参考](https://github.com/spring-cloud/spring-cloud-netflix/issues/203)

## eureka.client.healthcheck.enabled=true配置项必须设置在application.yml中

eureka.client.healthcheck.enabled=true 只应该在application.yml中设置。如果设置在bootstrap.yml中将会导致一些不良的副作用，例如在Eureka中注册的应用名称是UNKNOWN等。