<template>
  <el-tree
    ref="per"
    :data="permissionData"
    :default-expanded-keys="defaultCheckKeys"
    :default-checked-keys="defaultCheckKeys"
    :props="defaultProps"
    show-checkbox
    node-key="id"
    @check="checkVal"/>
</template>

<script>
export default {
  props: {
    defaultCheckOption: {
      type: Array,
      default: () => { return [5] }
    }
  },
  data() {
    return {
      permissionData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultCheckKeys: this.defaultCheckOption
    }
  },
  watch: {
    defaultCheckOption(val) {
      this.defaultCheckKeys = val
    }
  },
  created() {
    this.getPermissionJson()
    console.log(this.permissionData)
  },
  methods: {
    getPermissionJson() {
     /* getPermission().then(response => {
        this.options = response.data
      })*/
      this.permissionData = [{
         id: 1,
         name: '一级 1',
         children: [{
           id: 4,
           name: '二级 1-1'
         }]
        }, {
         id: 2,
        name: '一级 2',
         children: [{
           id: 5,
           name: '二级 2-1'
         }, {
           id: 6,
           name: '二级 2-2'
         }]
        }, {
         id: 3,
        name: '一级 3',
         children: [{
           id: 7,
           name: '二级 3-1'
         }, {
           id: 8,
           name: '二级 3-2'
         }]
        }]
    },
    checkVal(data) {
      console.log(data)
      console.log(this.$refs.per.getCheckedKeys())
      this.$emit('checkPermission', this.$refs.per.getCheckedKeys())
    }
  }
}
</script>
