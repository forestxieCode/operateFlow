## 项目效果
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74a8e2993c084639beb519005a1d7bed~tplv-k3u1fbpfcp-zoom-1.image)



## 现在市场上的绘制图表工具有那些
- <span><a href="https://github.com/antvis/g6">G6</a></span> :是一个图可视化引擎。它提供了图的绘制、布局、分析、交互、动画等图可视化的基础能力。旨在让关系变得透明，简单。让用户获得关系数据的 Insight。
- <span><a href="https://www.graphviz.org/about/">graphviz</a></span>
图形可视化是一种将结构信息表示为抽象图形和网络图的方式。自动图形绘制在软件工程，数据库和Web设计，网络以及许多其他领域的可视界面中具有许多重要的应用程序。


## 什么是jsplumb,能做什么？
- `jsplumb`是一个图表插件，它能绘制一条链条的流程图，类似于Visio的应用程序或工作流程设计器，由于图表项目和连接的所有参数都是非常精细可控的，因此您可以绘制您可以想到的任何类型的图表的。而且它是完全免费的，并根据MIT许可证提供。您可以直接从`jsPlumb` github网站下载框架。该项目主要由`Simon Porritt`开发，他在澳大利亚西德尼担任网络开发人员。 `jsPlumb`由他积极开发。


## jsplumb 的简单入门
### 1.基本概念
- Souce 源节点
- Target 目标节点
- Anchor 锚点
	>一个位置，放置端点的地方，相对于一个元素的来源，您不需要自己硬编码来创建它，jsPlumb提供给您各种功能，您只需要按照您的需要创建它就可以了。它没有可视化的显示，只是一个逻辑位置，可以使用锚的id来引用它，jsPlumb支持这样做。

- Endpoint 端点
> 链接的一端的可视化表示，您可以创建并可以链接他们；您可以让他们支持拖拽，或者您可以直接使用jsPlumb.connect()在创建链接时直接创建它们。
- Connector 连接
> 链接两个元素的线，页面的可视化表示，jsPlumb有三种默认类型:Bezier曲线，直线，和流程图链接器，您不用去处理连接器，当您需要使用它们时，您只需要定义它们即可。
### 2.基础demo
#### 2.1. 连接两个节点

demo: https://wdd.js.org/jsplumb-chinese-tutorial/demos/01.html

jsPlumb.ready方法和jquery的ready方法差不多的功能，jsPlumb.connect用于建立连线

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69ef79ec4df44f87af8d8d61a8be3f06~tplv-k3u1fbpfcp-zoom-1.image)
```
<div id="diagramContainer">
    <div id="item_left" class="item"></div>
    <div id="item_right" class="item" style="margin-left:50px;"></div>
  </div>
  <script src="https://cdn.bootcss.com/jsPlumb/2.6.8/js/jsplumb.min.js"></script>

  <script>
    /* global jsPlumb */
    jsPlumb.ready(function () {
      jsPlumb.connect({
        source: 'item_left',
        target: 'item_right',
        endpoint: 'Dot'
      })
    })
  </script>
```


参数说明：
jsPlumb.connect(config) return connection

参数 | 参数类型 | 是否必须 | 说明
---|---|---|---
source | String,Object,Endpoint | 是 | 连线源的标识，可以是id, element, 或者Endpoint
target | String,Object,Endpoint | 是 | 连线目标的标识，可以是id, element, 或者Endpoint
endpoint | String | 可选 | 端点类型，形状

[>>> connect方法详情](https://jsplumbtoolkit.com/community/apidocs/classes/jsPlumbInstance.html#method_connect)


#### 2.2. 连接的其他参数

demo: https://wdd.js.org/jsplumb-chinese-tutorial/demos/03.html

可以通过connector去设置链接线的形状，如直线或者曲线之类的。anchor可以去设置锚点的位置。

jsplumb连线的样式有四种

- `Bezier`: 贝塞尔曲线
- `Flowchart`: 具有90度转折点的流程线
- `StateMachine`: 状态机
- `Straight`: 直线
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fee31799b9543bdbc14a5cf12a2fac4~tplv-k3u1fbpfcp-zoom-1.image)

```
<div id="diagramContainer">
    <div id="item_left" class="item"></div>
    <div id="item_right" class="item" style="left:150px;"></div>
  </div>
  <script src="https://cdn.bootcss.com/jsPlumb/2.6.8/js/jsplumb.min.js"></script>

  <script>
    /* global jsPlumb */
    jsPlumb.ready(function () {
      jsPlumb.connect({
        source: 'item_left',
        target: 'item_right',
        endpoint: 'Rectangle',
        connector: ['Bezier'],
        anchor: ['Left', 'Right']
      })

      jsPlumb.draggable('item_left')
      jsPlumb.draggable('item_right')
    })
  </script>
```
#### 2.3. 给连接加上样式

demo: https://wdd.js.org/jsplumb-chinese-tutorial/demos/05.html

例如给连线设置不同的颜色，设置不同的粗细之类的。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86394f850bd74b7ea482a03a7071ca40~tplv-k3u1fbpfcp-zoom-1.image)

```
jsPlumb.connect({
  source: 'item_left',
  target: 'item_right',
  paintStyle: { stroke: 'lightgray', strokeWidth: 3 },
  endpointStyle: { fill: 'lightgray', outlineStroke: 'darkgray', outlineWidth: 2 }
}, common)
```

#### 2.4. 给连接加上箭头

demo: https://wdd.js.org/jsplumb-chinese-tutorial/demos/06.html

箭头实际上是通过设置`overlays`去设置的，可以设置箭头的长宽以及箭头的位置，location 0.5表示箭头位于中间，location 1表示箭头设置在连线末端。 一根连线是可以添加多个箭头的。

`overlays`也是一个比较重要的概念，overlays可以理解为遮罩层。遮罩层不仅仅可以设置箭头，也可以设置其他内容。

overlays有五种类型，下面给出简介。具体使用方法参见 https://jsplumbtoolkit.com/community/doc/overlays.html 

- `Arrow` 一个可配置的箭头
- `Label` 标签，可以在链接上显示文字信息
- `PlainArrow` 原始类型的箭头
- `Diamond` 菱形箭头
- `Custom` 自定义类型

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fc6ce98fbca4a71b0c58d2c4d3f9d18~tplv-k3u1fbpfcp-zoom-1.image)
```
jsPlumb.connect({
  source: 'item_left',
  target: 'item_right',
  paintStyle: { stroke: 'lightgray', strokeWidth: 3 },
  endpointStyle: { fill: 'lightgray', outlineStroke: 'darkgray', outlineWidth: 2 },
  overlays: [ ['Arrow', { width: 12, length: 12, location: 0.5 }] ]
}, common)
```

#### 2.5. 限制节点拖动区域

demo: https://wdd.js.org/jsplumb-chinese-tutorial/demos/11.html

默认情况下，节点可以被拖动到区域外边，如果想只能在区域内拖动，需要设置containment，这样节点只能在固定区域内移动。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f28498c0c444409af8ad05f1515a7ff~tplv-k3u1fbpfcp-zoom-1.image)

```
jsPlumb.setContainer('area-id')
```
#### 2.6. 给端点增加样式

demo: https://wdd.js.org/jsplumb-chinese-tutorial/demos/09.html

通过设置各种 `*Style`来改变链接或者端点的样式。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/481dbe8c26aa477ca0c477981bd6f4ec~tplv-k3u1fbpfcp-zoom-1.image)

```
jsPlumb.ready(function () {
      jsPlumb.setContainer('diagramContainer')

      var common = {
        isSource: true,
        isTarget: true,
        connector: 'Straight',
        endpoint: 'Dot',
        paintStyle: {
          fill: 'white',
          outlineStroke: 'blue',
          strokeWidth: 3
        },
        hoverPaintStyle: {
          outlineStroke: 'lightblue'
        },
        connectorStyle: {
          outlineStroke: 'green',
          strokeWidth: 1
        },
        connectorHoverStyle: {
          strokeWidth: 2
        }
      }

      jsPlumb.addEndpoint('item_left', {
        anchors: ['Right']
      }, common)

      jsPlumb.addEndpoint('item_right', {
        anchor: 'Left'
      }, common)

      jsPlumb.addEndpoint('item_right', {
        anchor: 'Right'
      }, common)
    })
```
#### 2.7. 给链接添加点击事件：点击删除连线

demo: https://wdd.js.org/jsplumb-chinese-tutorial/demos/13.html

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a953dbf9b4bd43958e8f02667a359eeb~tplv-k3u1fbpfcp-zoom-1.image)
```
// 请单点击一下连接线, 
jsPlumb.bind('click', function (conn, originalEvent) {
  if (window.prompt('确定删除所点击的链接吗？ 输入1确定') === '1') {
    jsPlumb.detach(conn)
  }
})
```

## 参考文档
https://docs.jsplumbtoolkit.com/








