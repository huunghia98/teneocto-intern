<template>
    <div id="app">
        <FormUpload></FormUpload>
    </div>
</template>

<script>
import FormUpload from "./components/FormUpload.vue";

export default {
  name: 'App',
  components: {
     FormUpload
  }
}


</script>

<style>
    @import "~bootstrap/dist/css/bootstrap.min.css";
</style>
