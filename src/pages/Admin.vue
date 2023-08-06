<template>
    <create-brand></create-brand>
    <create-type></create-type>
    <create-device></create-device>
</template>

<script setup>
import { ref } from "vue";
import CreateBrand from '../components/modals/CreateBrand.vue'
import CreateType from '../components/modals/CreateType.vue'
import CreateDevice from '../components/modals/CreateDevice.vue'

const visible = ref(false);

</script>

<style scoped>
button {
    width: 500px;
}
</style>