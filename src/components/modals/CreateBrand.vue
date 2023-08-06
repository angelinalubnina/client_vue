<template>
    <div class="card flex justify-content-center" style="margin-top: 30px">
        <Button
            class="add"
            label="Добавить бренд"
            icon="pi pi-tags"
            @click="visible = true"
        />
        <Dialog
            v-model:visible="visible"
            modal
            header="Добавить бренд"
            :style="{ width: '50vw' }"
        >
            <div
                class="flex justify-content-start flex-wrap"
                style="margin-top: 15px"
            >
                <InputText
                    type="text"
                    v-model="brandName"
                    placeholder="Наименование"
                    style="width: 500px"
                />
            </div>
            <div class="flex justify-content-end flex-wrap">
                <!-- попробовать убрать v-if и v-else -->
                <Button
                    v-if="enabledButton"
                    label="Добавить"
                    severity="success"
                    @click="addBrand"
                />
                <Button v-else label="Добавить" severity="success" disabled />
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { $authHost } from '@/http/index'

const visible = ref(false);
const brandName = ref("");

const enabledButton = computed(() => {
    if (brandName.value === "") {
        return false;
    }
    return true;
});
const addBrand = async () => {
    const { data } = await $authHost.post('api/brand', { name: brandName.value });
    brandName.value = ""
    visible.value = false
}
</script>

<style scoped>
.add {
    width: 500px;
}
</style>
