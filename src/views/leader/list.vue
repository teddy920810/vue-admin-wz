<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="搜索名称" class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter"/>
      <!--<region :select-option="selectOption" class="filter-item" @selectRegion="searchRegion"/>-->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{ scope.row.user_name }}
        </template>
      </el-table-column>
      <el-table-column label="领导名称">
        <template slot-scope="scope">
          {{ scope.row.leader_name }}
        </template>
      </el-table-column>
      <el-table-column label="所属地域" width="310" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.leader_province }}</span>
          <span>{{ scope.row.leader_city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领导描述" width="310" align="center">
        <template slot-scope="scope">
          {{ scope.row.leader_desc }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190">
        <template slot-scope="scope">
          <el-button v-if="hasButton('RR_LEADER_EDIT')" type="primary" size="small" icon="el-icon-edit" @click="handleBindLeader(scope.row)">编辑</el-button>
          <el-button v-if="hasButton('RR_LEADER_ROLE') && scope.row.leader_name" type="info" size="mini" @click="handleRoleLeader(scope.row)">角色配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.page_size"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    <!-- 新增/修改领导 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="leader" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="leader_name">
          <el-input v-model="leader.leader_name"/>
        </el-form-item>
        <el-form-item label="描述" prop="leader_desc">
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
    <!-- 角色配置 -->
    <el-dialog :visible.sync="dialogRoleFormVisible" title="角色配置">
      <el-form ref="dataRoleForm" :model="role_leader" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称">
          <el-input v-model="role_leader.leader_name" :disabled="true"/>
        </el-form-item>
        <el-form-item label="角色">
          <role-select :default-value="role_leader.role_ids" @change="changeOpinion"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRoleData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSysUserList, bindLeader } from '@/api/leader'
import { editUserRole, getUserRoleInfoByUserId } from '@/api/role'
import Region from '../region/index.vue'
import RoleSelect from '../role/role-select.vue'

export default {
  components: { Region, RoleSelect },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        name: null,
        province_id: null,
        city_id: null
      },
      leader: {
        user_id: undefined,
        leader_name: '',
        leader_desc: '',
        leader_province_id: '',
        leader_city_id: ''
      },
      role_leader: {
        user_id: undefined,
        leader_name: '',
        role_ids: []
      },
      dialogFormVisible: false,
      dialogRoleFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
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
      },
      selectOption: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSysUserList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleBindLeader(row) {
      this.leader = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetRoleLeader() {
      this.role_leader = {
        user_id: undefined,
        leader_name: '',
        role_ids: []
      }
    },
    handleRoleLeader(row) {
      this.resetRoleLeader()
      this.role_leader.user_id = row.user_id
      this.role_leader.leader_name = row.leader_name
      getUserRoleInfoByUserId(this.role_leader.user_id).then((res) => {
        res.data.forEach((role) => {
          this.role_leader.role_ids.push(role.id)
        })
        this.dialogRoleFormVisible = true
      })
    },
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.leader.name = this.leader.leader_name
          this.leader.desc = this.leader.leader_desc
          this.leader.city_id = this.leader.leader_city_id
          this.leader.province_id = this.leader.leader_province_id
          bindLeader(this.leader).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    saveRoleData() {
      this.$refs['dataRoleForm'].validate((valid) => {
        if (valid) {
          delete this.role_leader.leader_name
          editUserRole(this.role_leader).then(() => {
            this.getList()
            this.dialogRoleFormVisible = false
            this.$notify({
              title: '成功',
              message: '角色配置成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    selectRegion(data) {
      this.leader.leader_province_id = data[0]
      this.leader.leader_city_id = data[1]
    },
    searchRegion(data) {
      this.listQuery.province_id = data[0]
      this.listQuery.city_id = data[1]
    },
    changeOpinion(val) {
      this.role_leader.role_ids = val
    }
  }
}
</script>
