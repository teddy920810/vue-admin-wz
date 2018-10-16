<template>
  <el-select v-model="selectData" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
      @change="handleValueChang"
    />
  </el-select>
</template>

<script>
import { getTerritory } from '@/api/territory'
export default {
  props: {
    selectOption: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: [],
      value: '',
      selectData: this.selectOption
    }
  },
  watch: {
    selectOption(val) {
      this.selectData = val
    }
  },
  created() {
    this.getTerritoryJson()
  },
  methods: {
    getTerritoryJson() {
      getTerritory().then(response => {
        this.options = response.data
      })
    },
    handleValueChang(val) {
      console.log(val)
      // this.$emit('selectChange', val)
    }
  }
}
</script>
