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
        <el-form-item label="领导名称" prop="office_name">
          <el-input v-model="leader.leader_name"/>
        </el-form-item>
        <el-form-item label="描述" prop="office_desc">
          <el-input v-model="leader.leader_desc"/>
        </el-form-item>
        <el-form-item label="所属地区" prop="leader_city_id">
          <region :select-option="[leader.leader_province_id,leader.leader_city_id]" @selectRegion="selectRegion"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bindGovernment } from '@/api/leader'
import Region from '../region/index.vue'

export default {
  name: 'Dashboard',
  components: { Region },
  data() {
    return {
      dialogFormVisible: false,
      leader: {
        user_id: undefined,
        leader_name: '',
        leader_desc: '',
        leader_province_id: '',
        leader_city_id: ''
      },
      rules: {
        leader_name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        leader_desc: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        leader_city_id: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.dialogFormVisible = Object.is('', this.name)
  },
  methods: {
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          bindGovernment(this.leader).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    selectRegion(data) {
      this.leader.leader_province_id = data[0]
      this.leader.leader_city_id = data[1]
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
