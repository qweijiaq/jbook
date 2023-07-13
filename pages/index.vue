<template>
  <div>Index</div>
  <h1>counter: {{ myStore.counter }}</h1>
  <h1>counter: {{ myStore.doubleCounter }}</h1>
  <a-button @click="myStore.counter++">点击+1</a-button>
  <!-- <a-button type="primary" @click="info">Display normal message</a-button> -->
  <h1>counter:</h1>
  <div>
    使用ele的menu图标
    <i-ep-menu />
    使用antd的menu图标
    <i-ant-design-menu />
    <i-mdi-light-account />
  </div>
</template>

<script setup>
import { useMyStore } from "../store/myStore";

const myStore = useMyStore();

// const { $message } = useNuxtApp();

// const info = () => {
//   $message.info(" This is a normal message");
// };
</script>

<style scoped></style>
