<template>
  <d2-container-iframe :src="src"/>
</template>
<script>
export default {
  name: 'Taroco-Admin',
  data () {
    return {
      src: `${process.env.VUE_APP_ADMIN_URL}`
    }
  }
}
</script>
