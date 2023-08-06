<template>
    <div>
        <navbar></navbar>
        <router-view></router-view>
    </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import jwt_decode from 'jwt-decode';
import { $authHost, $host } from '@/http/index';
import { useUserStore } from '@/stores/userStore';
import { useDeviceStore } from '@/stores/deviceStore';
import { onBeforeMount, onMounted } from 'vue';
import { mapWritableState } from 'pinia';

const deviceStore = useDeviceStore();

const fetchData = async () => {
    const deviseRes = await $host.get('api/device');
    let devices = []
    for (const device of deviseRes.data) {
        device.type = deviceStore.types.find(
            (type) => type._id === device.type,
        )?.name;
        device.brand = deviceStore.brands.find(
            (brand) => brand._id === device.brand,
        )?.name;
        devices.push(device);
    }
    deviceStore.devices = devices

    const brandRes = await $host.get('api/brand');
    deviceStore.brands = brandRes.data;

    const typeRes = await $host.get('api/type');
    deviceStore.types = typeRes.data;
};
// fetchData();

onBeforeMount(fetchData)

</script>

<style scoped></style>
