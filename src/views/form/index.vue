<template>
  <div class="app-container">
    <avue-form-design style="height: 86vh;"
                      :options="options"
                      storage
                      :showGithubStar="false"
                      @submit="handleSubmit">
                      </avue-form-design>
  </div>
</template>

<script>
// import { kvReadList,kvSearch,kvCreate,kvUpdate,kvDelete} from '@/api/table'
export default {
  data() {
    return {
      options: {column: []}
    }
  },
  methods: {
    handleSubmit(data){
      console.log(data)
    },
     handleGetData(data) {
          console.log(data)
        }
  }
}
</script>
