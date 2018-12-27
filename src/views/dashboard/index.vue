<template>
  <div class="dashboard-container">
    问政组件管理平台
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="完善领导信息">
      <el-form ref="dataForm" :rules="rules" :model="leader" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="领导名称" prop="name">
          <el-input v-model="leader.name"/>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="leader.desc"/>
        </el-form-item>
        <el-form-item label="所属地区" prop="city_id">
          <region :select-option="[leader.province_id,leader.city_id]" @selectRegion="selectRegion"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { initLeader } from '@/api/leader'
import Region from '../region/index.vue'

export default {
  name: 'Dashboard',
  components: { Region },
  data() {
    return {
      dialogFormVisible: false,
      leader: {
        user_id: undefined,
        name: '',
        desc: '',
        province_id: '',
        city_id: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        city_id: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'addRouters'
    ])
  },
  created() {
    if (this.roles.length === 0) { // 无权限跳转401
      this.$router.push({ path: '/401' })
    } else if (this.addRouters.length > 0) { // 有权限
      if (this.roles.indexOf('*') >= 0 || !Object.is('', this.name)) { // 超管或已完善信息跳转第一个路由
        this.$router.push({ path: this.addRouters[0].path })
      } else if (Object.is('', this.name)) { // 不是超管 且未完善信息 弹出层
        this.dialogFormVisible = Object.is('', this.name)
      }
    }
  },
  methods: {
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          initLeader(this.leader).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.$router.push({ path: this.addRouters[0].path })
          })
        }
      })
    },
    selectRegion(data) {
      this.leader.province_id = data[0]
      this.leader.city_id = data[1]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
