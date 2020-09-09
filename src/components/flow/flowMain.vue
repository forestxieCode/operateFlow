<template>
  <div class="appcontainer">
    <div class="flow-menu">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="用户" name="1">
          <div class="features">
            <div class="features-item" v-for="(item, index) in userMenue" :key="index">
               <span :class="item.icon" draggable="true" @dragstart="drag(item)"  @dragend="dragendHandle" :key="index"></span>
              <label class="name">{{item.name}}</label>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="动作" name="2">
          <div class="features">
            <div class="features-item" v-for="(item, index) in aisleMenue" :key="index">
               <span :class="item.icon" draggable="true" @dragstart="drag(item)" @dragend="dragendHandle" :key="index"></span>
              <label class="name">{{item.name}}</label>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="条件" name="3">
          <div class="features">
            <div class="features-item" v-for="(item, index) in conditionMenue" :key="index">
               <span :class="item.icon" draggable="true" @dragstart="drag(item)" @dragend="dragendHandle" :key="index"></span>
              <label class="name">{{item.name}}</label>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="flow-detail">
      <div id="flowContent"
           ref="flowContent"
           @drop="drop($event)"
           @dragover="allowDrop($event)"
           @dblclick="isConnect=false">
        <flowNode v-for="node in data.nodeList" :key="node.id"
                  :node="node"
                  :id="node.id"
                  :isconnect="isConnect"
                  @delete-node="deleteNode"
                  @change-node-site="changeNodeSite"
                >
        </flowNode>
      </div>
      <div class="savebtn">
        <el-button type="primary" size="mini" @click="saveData()">保 存</el-button>
      </div>
    </div>
    <el-dialog
      :title="`设置${currenEditContent.label}`"
      :visible.sync="flowEditContentVisible"
      width="40%"
      >
      <!-- 设置分群 -->
      <editArkClustering v-if="currenEditContent.nodeId === 1" ref="1"></editArkClustering>
      <span slot="footer" class="dialog-footer">
        <el-button @click="flowEditContentVisible = false">取 消</el-button>
        <el-button type="primary" @click="flowEditContentSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { jsPlumb } from 'jsplumb'
import flowNode from './flowNode.vue'
import editArkClustering from './editArkClustering.vue'

  export default {
    name: 'flowMain',
    provide () {
      return {
        flow: this
      }
    },
    data() {
      return {
        userMenue: [
          {
            groupId: 1, // 用户组
            nodeId: 1,
            icon: 'el-icon-burger',
            name: '分群',
            events: [
              {
                eventType: 1,
                eventName: '添加步骤'
              }
            ]
          }
        ],
        aisleMenue: [
          {
            groupId: 2, // 通道组
            nodeId: 2,
            icon: 'el-icon-football',
            name: '学校',
            events: [
              {
                eventType: 1,
                eventName: '学习'
              },
              {
                eventType: 2,
                eventName: '不学习'
              }
            ]
          },
          {
            groupId: 2,
            nodeId: 3,
            icon: 'el-icon-soccer',
            name: '公司',
            events: [
              {
                eventType: 1,
                eventName: '上班'
              },
              {
                eventType: 2,
                eventName: '不上班'
              }
            ]
          },
           {
            groupId: 2,
            nodeId: 4,
            icon: 'el-icon-wind-power',
            name: '超市',
            events: [
              {
                eventType: 1,
                eventName: '买东西'
              },
              {
                eventType: 2,
                eventName: '吃饭'
              },
              {
                eventType: 3,
                eventName: '买衣服'
              },
              {
                eventType: 3,
                eventName: '买零食'
              }
            ]
           },
           {
            groupId: 2,
            nodeId: 5,
            icon: 'el-icon-sunset',
            name: '游乐园',
            events: [
              {
                eventType: 1,
                eventName: '玩耍'
              },
              {
                eventType: 2,
                eventName: '游泳'
              }
            ]
          },
           {
            groupId: 2,
            nodeId: 6,
            icon: 'el-icon-tableware',
            name: '家'
          }
        ],
        conditionMenue:[
          {
            groupId: 3, // 条件组
            nodeId: 8,
            icon: 'el-icon-coffee',
            name: '等待',
            events: [
              {
                eventType: 1,
                eventName: '是'
              },
              {
                eventType: 2,
                eventName: '否'
              }
            ]
          },
          {
            groupId: 3, 
            nodeId: 10,
            icon: 'el-icon-ice-cream-square',
            name: '事件',
            events: [
              {
                eventType: 1,
                eventName: '是'
              },
              {
                eventType: 2,
                eventName: '否'
              }
            ]
          }
        ],
        activeNames: ['1','2','3'],
        jsPlumb: null, // jsPlumb 实例
        startDragging: false,
        index: 1,
        flowEditContentVisible: false, // 弹框
        currenEditContent: {},
        // 默认设置参数
        jsplumbSetting: {
          // 动态锚点、位置自适应
          // 'Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter',
          //  'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'
          Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter',
            'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'
          ],
          Container: 'flowContent',
          // 连线的样式 StateMachine、Flowchart,有四种默认类型：Bezier（贝塞尔曲线），Straight（直线），Flowchart（流程图），State machine（状态机）
          Connector: 'Straight',
          //这个是鼠标拉出来的线的属性
          ConnectionOverlays: [
            ["Label", {
              label: "连线文本",
              id: "label-1",
              cssClass: "csslabel"
            }]
          ],
          // 鼠标不能拖动删除线
          ConnectionsDetachable: false,
          // 删除线的时候节点不删除
          DeleteEndpointsOnDetach: false,
          // 连线的端点
          // Endpoint: ["Dot", {radius: 5}],
          Endpoint: ["Rectangle", {
            height: 10,
            width: 10
          }],
          // 线端点的样式
          EndpointStyle: {
            fill: 'rgba(255,255,255,0)',
            outlineWidth: 1
          },
          LogEnabled: true, //是否打开jsPlumb的内部日志记录
          // 绘制线
          PaintStyle: {
            stroke: '#999999',
            strokeWidth: 1
          },
          // 绘制箭头
          Overlays: [
            ['Arrow', {
              width: 8,
              length: 8,
              stroke: '#999999',
              location: 1
            }],
            [
              "Custom", {
                create:function(component) {
                  console.log(component)
                  if(component.idPrefix === '_jsplumb_e_'){
                    let span = document.createElement('span')
                    return span
                  }
                  let span = document.createElement('span')
                  span.setAttribute('class', 'custom-circular')
                  return span;                
                },
                location: 0,
                id: "customOverlay"
              }
            ]
          ],
          RenderMode: "svg"
        },
        // jsplumb连接参数
        jsplumbConnectOptions: {
          isSource: true,
          isTarget: true,
          // 动态锚点、提供了4个方向 Continuous、AutoDefault
          anchor: "AutoDefault",
        },
        jsplumbSourceOptions: {
          filter: ".flow-node-item",  //触发连线的区域
          /*"span"表示标签，".className"表示类，"#id"表示元素id*/
          filterExclude: false,
          anchor: "Continuous",
          allowLoopback: false
        },
        jsplumbTargetOptions: {
          filter: ".flow-node-item",
          /*"span"表示标签，".className"表示类，"#id"表示元素id*/
          filterExclude: false,
          anchor: "Continuous",
          allowLoopback: false
        },
        // 是否加载完毕
        loadEasyFlowFinish: false,
        // 数据
        data: {
          nodeList: [
            {nodeId: 1, content: '',groupId: 1 ,id: "69c8b9ed-fa07-4d92-86e1-90c39f14f809",label: "分群",left: "420",top: "112", zIndex: 8, events: [{eventType: 1,eventName: '添加步骤'}]}
          ],
          lineList: [
          ]
        },
        currentItem: '', //临时存添加的元素
        isConnect: false, //判断是否连接
        timer: null, //定时器,判断单双击,
        currentConnect: '', //当前的连接线
        currentLine: '', //当前连接线数据
        editType: '', //编辑的类型
      }
    },
    components: {
      flowNode,
      editArkClustering
    },
    created() {},
    mounted() {
      // this.getFlowInfo()
      jsPlumb.setSuspendDrawing(true);
      this.jsPlumb = jsPlumb.getInstance();
      this.$nextTick(() => {
        this.init();
      });
    },
    methods: {
      flowEditContentSave() {
        console.log()
        this.data.nodeList.forEach(item => {
          if(item.nodeId === this.currenEditContent.nodeId) {
            item.content = this.$refs[this.currenEditContent.nodeId].getTemplate()
          }
        })
        this.flowEditContentVisible = false
      },
      // async getFlowInfo(){
      //   const res =  await this.$axios.get('/api/get-flow-info',{params:{username:this.userinfo.username}})
      //   if(res.data.flowInfo.length){
      //     this.data.lineList = res.data.lineList
      //     this.data.flowInfo = res.data.flowInfo[0]
      //     this.data.nodeList = res.data.nodeList
      //   }
      //   jsPlumb.setSuspendDrawing(true);
      //   this.jsPlumb = jsPlumb.getInstance();
      //   this.$nextTick(() => {
      //     this.init();
      //   });
      //   this.editFlow()
      // },
      init() {
        const _this = this
        this.jsPlumb.ready(function() {

          // 导入默认配置
          _this.jsPlumb.importDefaults(_this.jsplumbSetting)
          // 会使整个jsPlumb立即重绘。
          _this.jsPlumb.setSuspendDrawing(false, true);
          // 初始化节点
          _this.loadEasyFlow()
          // 单点连接线（编辑label）,
          _this.jsPlumb.bind('click', function(conn, originalEvent) {
            //clearTimeout(this.timer);
            //this.timer = setTimeout(function () { // 这里采用执行自定义事件的方式
            //    console.log("click", conn);
            //}, 300); // 延迟300ms执行单击事件,区分双击事件
            console.log("click", originalEvent)
            console.log("click", conn);
            // console.log(conn.getOverlay("label-1"));
            //conn.getOverlay("label-1").setLabel('大肥肚'); //初始化label
          })
          // 双击连接线（删除）,
          // _this.jsPlumb.bind('dblclick', function (conn, originalEvent) {
          //    clearTimeout(this.timer);
          //    console.log("dblclick", conn)
          //    _this.$confirm('确定删除所点击的线吗?', '提示', {
          //        confirmButtonText: '确定',
          //        cancelButtonText: '取消',
          //        type: 'warning'
          //    }).then(() => {
          //        _this.jsPlumb.deleteConnection(conn)
          //    }).catch(() => { })
          // })
          // 连线
          _this.jsPlumb.bind("connection", function(evt) {
            console.log('connection', evt)
            let from = evt.source.id
            let to = evt.target.id
            if (_this.loadEasyFlowFinish) {
              _this.data.lineList.push({
                from: from,
                to: to,
                label: '',
                id: _this.getUUID(),
                Remark: '',
              })
            }
          })

          // 删除连线
          _this.jsPlumb.bind("connectionDetached", function(evt) {
            console.log('connectionDetached', evt)
            _this.deleteLine(evt.sourceId, evt.targetId)
          })

          // 改变线的连接节点
          // _this.jsPlumb.bind("connectionMoved", function(evt) {
          //   console.log('connectionMoved', evt)
          //   _this.changeLine(evt.originalSourceId, evt.originalTargetId)
          // })

          // 单击endpoint
          // jsPlumb.bind("endpointClick", function (evt) {
          //   console.log('endpointClick', evt)
          // })
          //
          // // 双击endpoint
          // jsPlumb.bind("endpointDblClick", function (evt) {
          //   console.log('endpointDblClick', evt)
          // })

          // contextmenu 右键
          _this.jsPlumb.bind("contextmenu", function(evt) {
            console.log('contextmenu', evt)
          })

          // beforeDrop
          _this.jsPlumb.bind("beforeDrop", function(evt) {
            console.log('beforeDrop', evt)
            let from = evt.sourceId
            let to = evt.targetId
            if (from === to) {
              _this.$message.error('不能连接自己');
              return false
            }
            if (_this.hasLine(from, to)) {
              _this.$message.error('不能重复连线');
              return false
            }
            if (_this.hashOppositeLine(from, to)) {
              _this.$message.error('不能回环哦');
              return false
            }
            return true
          })

          // beforeDetach
          _this.jsPlumb.bind("beforeDetach", function(evt) {
            console.log('beforeDetach', evt)
          })
        })

      },
      // 加载流程图
      loadEasyFlow() {
        // 初始化节点
        for (var i = 0; i < this.data.nodeList.length; i++) {
          let node = this.data.nodeList[i]
          // 设置源点，可以拖出线连接其他节点
          this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
          // // 设置目标点，其他源点拖出的线可以连接该节点
          this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
          // jsPlumb.addEndpoint(node.id)
          // 设置可拖拽
          // jsPlumb.draggable(node.id, {
          //     containment: 'parent',
          //     grid: [10, 10]
          // })
          this.jsPlumb.draggable(node.id, {
            containment: 'parent'
          })
        }
        // 初始化连线
        for (var i = 0; i < this.data.lineList.length; i++) {
          let line = this.data.lineList[i]
          let connection = this.jsPlumb.connect({
            source: line.from,
            target: line.to,
          }, this.jsplumbConnectOptions);
          connection.getOverlay("label-1").setLabel(line.lineLabel); //初始化label
        }
        this.$nextTick(function() {
          this.loadEasyFlowFinish = true
        })
      },
      // 添加新的节点
      addNode(temp) {
        this.data.nodeList.push(temp);
        this.$nextTick(function() {
          this.jsPlumb.makeSource(temp.id, this.jsplumbSourceOptions)
          this.jsPlumb.makeTarget(temp.id, this.jsplumbTargetOptions)
          this.jsPlumb.draggable(temp.id, {
            containment: 'parent'
          })
          if (temp.parentId)  {
             let connection = this.jsPlumb.connect({
              source: temp.parentId,
              target: temp.id,
            }, this.jsplumbConnectOptions);
            connection.getOverlay("label-1").setLabel(temp.lineLabel);
          }
        })
      },
      // 删除线
      deleteLine(from, to) {
        this.data.lineList = this.data.lineList.filter(function(line) {
          return line.from !== from && line.to !== to
        })
      },
      // 改变连线
      changeLine(oldFrom, oldTo) {
        this.deleteLine(oldFrom, oldTo)
      },
      // 改变节点的位置
      changeNodeSite(data) {
        for (var i = 0; i < this.data.nodeList.length; i++) {
          let node = this.data.nodeList[i]
          if (node.id === data.nodeId) {
            node.left = data.left
            node.top = data.top
          }
        }
      },
      dragendHandle() {
        this.startDragging = false
      },
      // 判断是否存在分组为1 的主节点
      isExistence() {
        return this.data.nodeList.filter(item => item.groupId === 1).length
      },
      //删除节点
      deleteNode(nodeId) {
        let nodeinfo = {}
        this.data.nodeList.forEach((item, index) => {
          if (item.id === nodeId) {
            nodeinfo = item
            this.data.nodeList.splice(index, 1);
          }
        })
        this.$nextTick(function() {
          this.jsPlumb.removeAllEndpoints(nodeId);
        })
        // 删除添加空节点且是有效元素
        if (this.isExistence() && nodeinfo.groupId) {
            let newEmpty = {
              parentId : nodeinfo.parentId,
              left: parseInt(nodeinfo.left),
              top: parseInt(nodeinfo.top),
              zIndex: nodeinfo.zIndex,
              lineLabel: nodeinfo.lineLabel
            }
            this.addEmptyNode(newEmpty)
        }
        return true
      },
      //删除线
      delLine(conn) {
        this.$confirm('确定删除所点击的线吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.jsPlumb.deleteConnection(conn)
        }).catch(() => {})
      },
      // 是否具有该线
      hasLine(from, to) {
        for (var i = 0; i < this.data.lineList.length; i++) {
          var line = this.data.lineList[i]
          if (line.from === from && line.to === to) {
            return true
          }
        }
        return false
      },
      // 是否含有相反的线
      hashOppositeLine(from, to) {
        return this.hasLine(to, from)
      },
      lineLabelSave(line) {
        this.currentConnect.getOverlay("label-1").setLabel(line.label);
        //this.$set(this.currentLine, 'label', line.label);
      },
      drag(item) {
        this.currentItem = item;
        this.startDragging = true
      },
      drop(event) {
        var _obj = this.$refs.flowContent;
        let emptyNode = {}
        this.startDragging = false
        // 找到空壳子且分组1 不需要找空壳子，直接添加
        this.data.nodeList.forEach(item => {
          if(item.parentId && !item.groupId && 
             parseInt(item.left) <= event.x && (parseInt(item.left) + 229) >= event.x  && 
             parseInt(item.top) <= event.y && (parseInt(item.top) + 69) >= event.y) {
             emptyNode = item
          }
        });
        if (this.currentItem.nodeId !== 1&&!emptyNode.parentId) return
        if (this.currentItem.nodeId !== 1) {
          this.deleteNode(emptyNode.id);
        }
        var temp = {
          id: this.getUUID(),
          lineLabel: emptyNode.lineLabel ? emptyNode.lineLabel : '',
          label: this.currentItem.name,
          top: emptyNode.top ? parseInt(emptyNode.top) : event.offsetY,
          left: emptyNode.left ? parseInt(emptyNode.left) : event.offsetX,
          nodeId: this.currentItem.nodeId,
          parentId: emptyNode.parentId ? emptyNode.parentId : '',
          groupId: this.currentItem.groupId,
          events: this.currentItem.events,
          content: ''
        }
        this.addNode(temp);
        event.preventDefault();
      },
      addEmptyNode(paramet) {
        paramet.id = this.getUUID()
        this.addNode(paramet);
      },
      allowDrop(event) {
        event.preventDefault()
      },
      getUUID() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
      },
      async saveData() {
        console.log(this.data.flowInfo)
        console.log(this.data.lineList)
        console.log(this.data.nodeList)
        // this.data.lineList = []
        // this.data.flowInfo = {}
      }
    }
  }
</script>

<style lang="less">
  .custom-circular {
    display: inline-block;
    padding: 2px;
    z-index: 5;
    width: 4px;
    height: 4px;
    background-color: #fff;
    border: .5px solid #999999;
    cursor: pointer;
    border-radius: 50%;
  }
  .appcontainer {
    display: flex;
    width: 100%;
    height: 100vh;
    color: #606266;
      .flow-detail {
        flex: 1;
        background: #fff;
        border: 1px solid #EBEEF5;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        word-break: break-all;
        border-radius: 4px;
        position: relative;
      }
      #flowContent {
        width: 100%;
        height: 100%;
        position: relative;
      }
      .flow-menu {
        width: 270px;
        min-height: 100%;
        height: auto;
        background: #605e6f;
        position: fixed;
        z-index: 20;
        overflow: initial;
        top: 0px;
        left: 0;
        bottom: 0;
        .el-collapse-item{
          &:nth-child(2) {
            .features-item {
              span {
                background-color: rgb(204, 103, 255)!important; 
              }
            }
          }
          &:nth-child(3) {
            .features-item {
              span {
                background-color: rgb(108, 214, 141)!important; 
              }
            }
          }
          .el-collapse-item__header{
            padding: 0 20px;
            height: 36px;
            color: #fff;
            background-color: #605E6F;
            line-height: 36px;
            border-bottom: 1px solid #777486;
          }
          .el-collapse-item__content{
            background: #777486;
            padding: 30px 0 15px;
            color: #fff;
        
            .features {
              display: flex;
              flex-wrap: wrap;
              .features-item {
                margin: 0 10px 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                span {
                  display: inline-block;
                  width: 48px;
                  height: 48px;
                  background-color: rgb(88, 173, 214);
                  font-size: 30px;
                  border-radius: 50%;
                  color: #fff;
                  text-align: center;
                  cursor: move;
                  line-height: 48px;
                  z-index: 1000;
                }
                .name {
                  width: 68px;
                  height: 40px;
                  display: inline-block;
                  color: #fff;
                  text-align: center;
                  line-height: 40px;
                }
              }
            }
          }
          .el-collapse-item__wrap{
            border-bottom:none;
          }
        }
      }

      .flow-edit {
        width: 300px;
        padding: 0 10px;
      }

      .flow-edit-content {
        background: #FFF;
        color: #606266;
        line-height: 1.4;
        text-align: justify;
        font-size: 14px;
        border: 1px solid #EBEEF5;
        padding: 12px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        word-break: break-all;
        border-radius: 4px;
      }
      .csslabel {
            color: #434343;
            font-weight: 400;
            z-index: 10;
            font-size: 12px;
            background: #fff;
        }
        .csslabel .label-text {
            background-color: white;
        }
      .savebtn {
        position: absolute;
        top: 5px;
        right: 5px;
      }
  }
</style>
