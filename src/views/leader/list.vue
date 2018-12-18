<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="搜索名称" class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="hasButton('RR_LEADER_ADD')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
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
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="所属地域" width="310" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领导描述" width="310" align="center">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="hasButton('RR_LEADER_EDIT')" type="primary" size="small" @click="handleEditLeader(scope.row)">编辑</el-button>
          <el-button v-if="hasButton('RR_LEADER_ROLE') && scope.row.leader_name" type="info" size="mini" @click="handleRoleLeader(scope.row)">角色配置</el-button>
          <el-button v-if="hasButton('RR_LEADER_DEL')" type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
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
        <el-form-item label="选择用户" prop="user_name">
          <el-input v-model="leader.user_name" disabled style="width: 60%"/>
          <el-popover
            v-model="userListVisible"
            placement="right"
            width="300"
            trigger="manual">
            <div class="filter-container">
              <el-input v-model="userListQuery.user_name" placeholder="账号" class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilterUser"/>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterUser"/>
            </div>
            <el-table
              :data="userList"
              highlight-current-row
              @row-click="handleUserSelectChange">
              <el-table-column width="150" property="user_id" label="用户ID"/>
              <el-table-column width="150" property="user_name" label="用户账户"/>
            </el-table>
            <el-pagination
              :current-page="userListQuery.page"
              :page-size="listQuery.page_size"
              :total="userTotal"
              small
              layout="prev, pager, next"
              @size-change="handleSizeChangeUser"
              @current-change="handleCurrentChangeUser"/>
            <el-button slot="reference" @click="userListVisible = true">选择用户</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="名称" prop="name">
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
        <el-button @click="dialogFormVisible = false; userListVisible = false">取消</el-button>
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
import { getLeaderList, editLeader, addLeader, deleteLeader, getSysUserList } from '@/api/leader'
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
      userList: null,
      userTotal: 0,
      userListQuery: {
        page: 1,
        page_size: 5,
        user_name: null
      },
      leader: {
        user_id: undefined,
        user_name: '',
        name: '',
        desc: '',
        province_id: '',
        city_id: ''
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
        user_name: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
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
      },
      selectOption: [],
      userListVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getLeaderList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getUserList() {
      getSysUserList(this.userListQuery).then(response => {
        this.userList = response.data.list
        this.userTotal = response.data.total
      })
    },
    resetLeader() {
      this.leader = {
        user_id: undefined,
        user_name: '',
        name: '',
        desc: '',
        province_id: '',
        city_id: ''
      }
    },
    handleCreate() {
      this.getUserList()
      this.resetLeader()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEditLeader(row) {
      this.getUserList()
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
          if (this.leader.id) {
            editLeader(this.leader).then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.userListVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            addLeader(this.leader).then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.userListVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
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
    handleFilterUser() {
      this.userListQuery.page = 1
      this.getUserList()
    },
    handleSizeChangeUser(val) {
      this.userListQuery.page_size = val
      this.getUserList()
    },
    handleCurrentChangeUser(val) {
      this.userListQuery.page = val
      this.getUserList()
    },
    selectRegion(data) {
      this.leader.province_id = data[0]
      this.leader.city_id = data[1]
    },
    searchRegion(data) {
      this.listQuery.province_id = data[0]
      this.listQuery.city_id = data[1]
    },
    changeOpinion(val) {
      this.role_leader.role_ids = val
    },
    deleteData(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteData = { id: row.id }
        deleteLeader(deleteData).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleUserSelectChange(val) {
      this.leader.user_id = val.user_id
      this.leader.user_name = val.user_name
      this.userListVisible = false
    }
  }
}
</script>
