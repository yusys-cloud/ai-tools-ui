<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Name" min-width="60">
      <template slot-scope="scope">
        {{ scope.row.v.name}}
      </template>
    </el-table-column>
    <el-table-column label="API" width="195" align="center">
      <template slot-scope="scope">
        /api/kv/{{ scope.row.v.bucket}}/{{ scope.row.v.key}}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { kvReadList,kvSearch,kvCreate,kvUpdate,kvDelete} from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
       kvReadList({'b':'metadata','k':'label'}).then(response => {
        this.list = response
      })
    }
  }
}
</script>
