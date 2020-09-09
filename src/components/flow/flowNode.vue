<template>
    <div class="flow-node-item flow-node-drag" 
         v-if="!node.parentId || node.groupId"
         :class="groupClass"
         ref="node"
         @mouseenter="showDelete"
         @mouseleave="hideDelete"
         :style="flowNodeContainer"
         @mouseup="changeNodeSite"
        >
        <div class="header">
            <label :class="iconClass"></label>
            <span class="bd text-overflow" @click="eidtHandle">设置{{node.label}}</span>
            <span class="icons">
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button icon="el-icon-delete" circle @click.stop="deleteNode"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="展开" placement="top">
                    <el-button :icon="expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" circle @click="expand=!expand"></el-button>
                </el-tooltip>
            </span>
        </div>
        <div class="node-content" :style="expand ? '': 'min-height:0px;height: 0px;'">
            <div class="default" v-if="!node.content">
                暂无内容请
                <el-button type="text" @click="eidtHandle">点击编辑</el-button>
            </div>
            <div v-else  v-html="node.content" style="width:100%;"> 
                <!-- 节点渲染内容区域 -->
            </div>
        </div>
        <!-- 事件 -->
        <div class="dev-popover" v-show="mouseEnter">
            <div v-for="(item, index) in node.events" :key="index"><span class="circle" @click="addEmptyNode(item)"/>{{item.eventName}}</div>
        </div>
    </div>
    <div v-else class="flow-node-drag flow-node-empty" :class="{'active': flow.startDragging}" ref="node" :style="flowNodeContainer" @mouseup="changeNodeSite">
         <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button icon="el-icon-delete" circle @click.stop="deleteNode"></el-button>
        </el-tooltip>
        <div class="text-tips">请拖入原件</div>
    </div>
</template>

<script>
    export default {
        inject: ['flow'],
        props: {
            node: Object
        },
        data() {
            return {
                mouseEnter: false,
                expand: true,
                zIndex : 8
            }
        },
        computed: {
            // 节点容器样式
            flowNodeContainer: {
                get() {
                    return {
                        top: this.node.top + 'px',
                        left: this.node.left + 'px',
                        zIndex: this.node.zIndex
                    }
                }
            },
            iconClass() {
                if (this.node.parentId && !this.node.groupId)  return ''
                let allNode = [...this.flow.userMenue, ...this.flow.aisleMenue, ...this.flow.conditionMenue]
                let ndoe = allNode.find(item => item.nodeId === this.node.nodeId)
                return ndoe.icon
            },
            groupClass() {
                if (this.node.parentId && !this.node.groupId)  return ''
                switch(this.node.groupId){
                    case 1: return 'user'
                    case 2: return 'aisle'
                    default : return 'condition'
                }
            }
        },
        methods: {
            eidtHandle() {
                this.flow.currenEditContent = this.node
                this.flow.flowEditContentVisible = true
            },
            // 删除节点
            deleteNode() {
                this.$emit('delete-node', this.node.id)
            },
            // 鼠标进入
            showDelete() {
                this.mouseEnter = true
            },
            // 鼠标离开
            hideDelete() {
                this.mouseEnter = false
            },
            // 鼠标移动后抬起
            changeNodeSite() {
                this.flow.changeNodeSite({
                    nodeId: this.node.id,
                    left: this.$refs.node.style.left,
                    top: this.$refs.node.style.top,
                })
            },
            // 添加空节点
            addEmptyNode(event) {
                let newLeft = parseInt(this.node.left) + 370
                let maxZIndex = this.zIndex
                let allZIndex = []
                let allTop  = []
                let maxTop=  parseInt(this.node.top)
                this.flow.data.nodeList.forEach(item => {
                    if(item.parentId === this.node.id) {
                       allTop.push(parseInt(item.top)) 
                       allZIndex.push(parseInt(item.zIndex))
                    }
                })
                allZIndex.length && allZIndex[0] ? maxZIndex = Math.max(...allZIndex) : ''
                allTop.length && allTop[0] ? maxTop = Math.max(...allTop) + 90 : maxTop = parseInt(maxTop) + 30
                let newEmpty = {
                    parentId : this.node.id,
                    left: newLeft,
                    top: maxTop,
                    lineLabel: event.eventName!='添加步骤' ? event.eventName : '' ,
                    zIndex: maxZIndex + 1
                }
                this.flow.addEmptyNode(newEmpty)
            }
        }
    }
</script>
<style lang="less">
  .flow-node-item {
    position: absolute;
    width: 230px;
    min-height: 32px;
    border: 1px solid #d5d5d5;
    border-radius: 4px;
    background-color: #fff;
    cursor: move;
    z-index: 8; 
    .dev-popover{
        position: absolute;
        right: -76px;
        top: 0px;
        z-index: 8; 
        width: 75px;
        color: #999999;
        font-size: 12px;
        div {
            height: 21px;
            cursor: pointer;
            display: flex;
            align-items: center;
            .circle{
                display: inline-block;
                width: 13px;
                height: 13px;
                background: #EBEBEB;
                border-radius: 50%;
                margin-right: 7px;
            }
            &:hover{
                color: #4A69FF; 
                .circle{
                    background: #4A69FF;
                }
            }
        }
       
    }
    .header{
      height: 36px;
      background: #e0f8fa;
      display: flex;
      align-items: center;
      label {
        width: 24px;
        height: 24px;
        display: inline-block;
        border-radius: 50%;
        margin: 4px 10px;
        line-height: 24px;
        text-align: center; 
        background-color: #58add6;
        color: #fff;
      }
      .bd {
        display: flex;
        flex:1;
        line-height: 32px;
        width: 100px;
        color: #4a69ff;
        font-size: 14px;
        cursor: pointer;
      }
      .icons {
          width: 52px;
          display: flex;
          margin-right: 7px;
          .el-button.is-circle:hover{
            background: #cef1f3;
          }
          .el-button.is-circle {
            padding: 4px;
            background: #e0f8fa;
            border:none;
            color:#58add6;
            font-weight: 800;
          }

      }
    }
    &.user {
      .header{
        background: #e0f8fa;
        label {
            background-color: #58add6;
        }
        .icons {
            .el-button.is-circle {
                color:#58add6;
            }
        }
      }
      &:hover {
        border: 1px solid #4a69ff;   
      }
    }
     &.aisle {
      .header{
        background: #FAE9FF;
        label {
            background-color: #C96BF4;
        }
        .icons {
            .el-button.is-circle {
              color:#C96BF4;
              background: #FAE9FF;
            }
            .el-button.is-circle:hover{
             background:  #f1cffb
           }
           
        }
      }  
    }
    &.condition {
      .header{
         background: #D7F6D3;
        label {
            background-color: #6CD68D;
        }
        .icons {
            .el-button.is-circle {
                color:#6CD68D;;
                background: #D7F6D3;
            }
            .el-button.is-circle:hover{
             background:  #c8f2c2
           }
        }
      }  
    }
    .node-content {
        color: #333;
        text-align: center;
        font-size: 14px;
        background: #fff;
        border-radius: 0 0 4px 4px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 40px;
        transition: all ease .3s;
        .el-button--text {
            padding: 2px 0px;
        }
    }
  }
  .flow-node-empty {
    pointer-events: auto;
    background: #fff;
    border: 1px dashed #d5d5d5;
    text-align: center;
    color: #999;
    z-index: 1;
    position: absolute;
    width: 230px;
    min-height: 32px;
    border-radius: 4px;
    &.active {
        border: 1px dashed red;
        color: red;
        .el-button.is-circle{
           color: red;
        }
    }

    cursor: move;
    .text-tips {
        height: 70px;
        line-height: 70px;
        font-size: 14px;
    }
    .el-button.is-circle {
        padding: 0;
        border:none;
        position: absolute;
        top: 7px;
        right: 7px;
    }
  }

</style>
