<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="搜索标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <!--<category class="filter-item" @selectChange="categorySelectChange"/>
      <territory class="filter-item" />-->
      <el-select v-model="listQuery.category_id" placeholder="请选择分类" style="width: 200px;" class="filter-item">
        <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="listQuery.territory_id" placeholder="请选择领域" style="width: 200px;" class="filter-item">
        <el-option v-for="item in territoryOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <img :src="GLOBAL.servicePath + questionDetail.image" width="180" height="180">
            <div slot="reference" class="name-wrapper">
              <img :src="GLOBAL.servicePath + questionDetail.image" width="80" height="80">
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="提问者">
        <template slot-scope="scope">
          {{ scope.row.ask_member_name }}
        </template>
      </el-table-column>
      <el-table-column label="领导名称">
        <template slot-scope="scope">
          {{ scope.row.leader }}
        </template>
      </el-table-column>
      <el-table-column label="类别">
        <template slot-scope="scope">
          {{ scope.row.category }}
        </template>
      </el-table-column>
      <el-table-column label="领域">
        <template slot-scope="scope">
          {{ scope.row.territory }}
        </template>
      </el-table-column>
      <el-table-column label="回答">
        <template slot-scope="scope">
          {{ scope.row.answer }}
        </template>
      </el-table-column>
      <el-table-column label="提问时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | timeFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190">handelQuestionDetail
        <template slot-scope="scope">
          <div style="margin-bottom: 5px">
            <span style="width: 80px">
              <el-button type="info" size="mini" @click="handelQuestionDetail(scope.row)">查看详情</el-button>
            </span>
            <span style="width: 80px">
              <el-button v-if="scope.row.answer==''" type="primary" size="mini" @click="handleUpdate(scope.row)">回答</el-button>
              <el-button v-else type="primary" size="mini" @click="handleUpdate(scope.row)">修改回答</el-button>
            </span>
          </div>
          <div>
            <span style="width: 30px">
              <el-button type="danger" size="small" icon="el-icon-delete" circle @click="deleteData(scope.row)"/>
            </span>
            <span style="width: 60px">
              <el-button v-if="scope.row.status==0 || scope.row.status==2" type="success" size="mini" @click="auditQ(scope.row, 1)">通过</el-button>
            </span>
            <span style="width: 60px">
              <el-button v-if="scope.row.status==0 || scope.row.status==1" type="danger" size="mini" @click="auditQ(scope.row, 2)">拒绝</el-button>
            </span>
          </div>
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
        <el-form-item label="回答" prop="answer">
          <el-input v-model="answer.answer"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="answerQ">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDetailVisible" title="问答详情">
      <el-form label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标题:">
          {{ questionDetail.title }}
        </el-form-item>
        <el-form-item label="提问者:">
          {{ questionDetail.ask_member_name }}
        </el-form-item>
        <el-form-item label="领导:">
          {{ questionDetail.leader_name }}
        </el-form-item>
        <el-form-item label="分类:">
          {{ questionDetail.category }}
        </el-form-item>
        <el-form-item label="领域:">
          {{ questionDetail.territory }}
        </el-form-item>
        <el-form-item label="状态:">
          <el-tag>{{ questionDetail.status | statusFilter }}</el-tag>
        </el-form-item>
        <el-form-item label="图片:">
          <img :src="GLOBAL.servicePath + questionDetail.image" width="200" height="200">
        </el-form-item>
        <el-form-item label="问题详情:">
          {{ questionDetail.content }}
        </el-form-item>
        <el-form-item label="问题详情:">
          {{ questionDetail.content }}
        </el-form-item>
        <el-form-item label="回答:">
          {{ questionDetail.answer }}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getList, answerQ, audit, deleteQuestion, getQusetionDetail } from '@/api/question'
import { getCategory } from '@/api/category'
import { getTerritory } from '@/api/territory'
import Category from '../category/category.vue'
import Territory from '../territory/territory.vue'

export default {
  components: { Category, Territory },
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
        title: null,
        category_id: null,
        territory_id: null
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
      },
      selectOption: '',
      dialogDetailVisible: false,
      questionDetail: {
        member_id: '',
        leader_id: '',
        status: '',
        title: '',
        content: '',
        answer: '',
        ask_member_name: '',
        category: '',
        territory: '',
        likes: '',
        leader_name: '',
        create_time: '',
        image: ''
      },
      categoryOptions: [],
      territoryOptions: []
    }
  },
  created() {
    this.getList()
    this.getCategoryJson()
    this.getTerritoryJson()
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
    getCategoryJson() {
      getCategory().then(response => {
        this.categoryOptions = response.data
      })
    },
    getTerritoryJson() {
      getTerritory().then(response => {
        this.territoryOptions = response.data
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
      const deleteData = { id: row.id }
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
      const auditData = { id: row.id, status: status }
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
    },
    categorySelectChange(data) {
      console.log(data)
      this.listQuery.category_id = data
    },
    territorySelectChange(data) {
      console.log(data)
      this.listQuery.territory_id = data
    },
    handelQuestionDetail(row) {
      const param = { id: row.id }
      getQusetionDetail(param).then(res => {
        this.questionDetail = res.data
        this.dialogDetailVisible = true
      })
    }
  }
}
</script>
<style scoped>
  span {
    display:-moz-inline-box;
    display:inline-block;
  }
</style>
