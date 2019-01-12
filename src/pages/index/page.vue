<template>
  <d2-container class="page">
    <d2-page-cover
      title="Spring Cloud微服务脚手架"
      sub-title="简单、易用、开源">
      <img src="./image/taroco.png"/>
      <template slot="footer">
        <div class="page__btn-group">
          <span @click="$open('https://github.com/liuht777/Taroco')">后端地址</span> |
          <span @click="$open('https://github.com/liuht777/Taroco-UI-NEW')">配套前端</span>
        </div>
      </template>
    </d2-page-cover>
  </d2-container>
</template>

<script>
import D2HelpBtn from './components/d2-help-btn'
export default {
  components: {
    D2HelpBtn
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/style/public.scss';
.page {
  .page__btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    span {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
    }
  }
}
</style>
