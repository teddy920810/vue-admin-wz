<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="搜索标题" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="标题" width="195">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="内容" width="195">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="提问者" width="95">
        <template slot-scope="scope">
          {{ scope.row.ask_member_name }}
        </template>
      </el-table-column>
      <el-table-column label="回答" width="195">
        <template slot-scope="scope">
          {{ scope.row.answer }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status==0">
            <el-button type="success" size="small" @click="auditQ(scope.row, 1)" round>审核通过</el-button>
            <el-button type="danger" size="small" @click="auditQ(scope.row, 2)" round>审核拒绝</el-button>
          </div>
          <span v-else>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">回答</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteData(scope.row)">删除</el-button>
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
    <!-- 回答 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="answer" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="answer">
          <el-input v-model="answer.answer"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="answerQ">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, answerQ, audit, deleteQuestion } from '@/api/question'

export default {
  filters: {
    statusFilter(role) {
      const roleMap = {
        0: '待审核',
        1: '审核通过',
        2: '审核拒绝'
      }
      return roleMap[role]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        title: null
      },
      answer: {
        id: undefined,
        answer: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        answer: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    resetAnswer() {
      this.answer = {
        id: undefined,
        answer: ''
      }
    },
    handleCreate() {
      this.resetAnswer()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.answer = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    answerQ() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          answerQ(this.answer).then(() => {
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
    deleteData(row) {
      const  deleteData = {id: row.id}
      deleteQuestion(deleteData).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    auditQ(row, status) {
      const auditData = {id: row.id,status: status}
      audit(auditData).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
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
    }
  }
}
</script>
