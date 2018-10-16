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
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleBindLeader(scope.row)">编辑</el-button>
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
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSysUserList, bindLeader } from '@/api/leader'
import Region from '../region/index.vue'

export default {
  components: { Region },
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
        name: '',
        desc: '',
        province_id: '',
        city_id: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
      console.log(data)
      this.leader.province_id = data[0]
      this.leader.city_id = data[1]
    },
    searchRegion(data) {
      this.listQuery.province_id = data[0]
      this.listQuery.city_id = data[1]
    }
  }
}
</script>
