<template>
    <div class="editArkClustering">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="目标用户">
                <el-select v-model="form.targetUsers" placeholder="请选择目标用户">
                    <el-option
                        v-for="(item,index) in allOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="result" v-if="form.targetUsers">
            <div class="title">总人数</div>
            <div class="statistic">
                <span class="num">{{form.targetUsers}}</span>
                <span class="unit">人</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
         return {
           form: {
              targetUsers: '',
           },
           allOptions: [{
                    value: 100,
                    label: '张三'
                }, 
                {
                    value: 200,
                    label: '李四'
                }, 
                {
                    value: 90,
                    label: '王明'
                }, 
                {
                    value: 120,
                    label: '老王'
                }, 
                {
                    value: 200,
                    label: '狗不理子'
            }]
        }   
    },
    methods: {
        getTemplate() {
              let options = this.allOptions.find(item => item.value === this.form.targetUsers)
              let template = `<div style="background: #fff;text-align: left;padding: 12px;border-radius: 0 0 4px 4px;text-align:left;">
                    <div style="margin-bottom:7px;font-size:13px;">${options.label ? options.label : '无'}</div>
                    <div style="color: #999;margin-bottom:3px;font-size:13px;">总用户人数</div>
                    <div>
                        <label style="font-size: 18px;font-weight: bolder;margin-right: 4px;">${this.form.targetUsers?this.form.targetUsers : 0 }</label>人
                    </div>
                </div>`
                return template
        }
    }
}
</script>
<style lang="less">
.editArkClustering {
    .result{
        width: 290px;
        height: 107px;
        background: #ffffff;
        -webkit-box-shadow: 1px 1px 6px 0 rgba(0,0,0,0.05);
        box-shadow: 1px 1px 6px 0 rgba(0,0,0,0.05);
        padding: 10px;
        margin-right: 2px; 
        .title {
            font-size: 12px;
            color: #444444; 
        }
        .statistic {
            text-align: center;
           .num {
               font-size: 43px;
               color: #444444;
               letter-spacing: 2px;
           } 
           .unit {
               font-size: 14px;
           }
        }
    }
}
</style>