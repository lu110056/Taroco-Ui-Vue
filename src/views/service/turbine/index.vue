<template>
  <d2-container-iframe :src="src"/>
</template>
<script>
export default {
  name: 'Taroco-Turbine',
  data () {
    return {
      src: `${process.env.VUE_APP_TURBINE_URL}/hystrix`
    }
  }
}
</script>
