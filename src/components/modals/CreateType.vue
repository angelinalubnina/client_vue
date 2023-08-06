<template>
    <div class="card flex justify-content-center" style="margin-top: 30px">
        <Button
            class="add"
            label="Добавить тип"
            icon="pi pi-desktop"
            @click="visible = true"
        />
        <Dialog
            v-model:visible="visible"
            modal
            header="Добавить тип"
            :style="{ width: '50vw' }"
        >
            <div
                class="flex justify-content-start flex-wrap"
                style="margin-top: 15px"
            >
                <InputText
                    type="text"
                    v-model="typeName"
                    placeholder="Наименование"
                    style="width: 500px"
                />
            </div>
            <div class="flex justify-content-end flex-wrap">
                <Button
                    v-if="enabledButton"
                    label="Добавить"
                    severity="success"
                    @click="addType"
                />
                <Button v-else label="Добавить" severity="success" disabled />
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { $authHost } from '@/http/index';
// можно добавить проверку на существование типа на клиенте

const visible = ref(false);
const typeName = ref('');

const enabledButton = computed(() => {
    if (typeName.value === '') {
        return false;
    }
    return true;
});

const addType = async () => {
    await $authHost.post('api/type', { name: typeName.value });
    typeName.value = '';
    visible.value = false
};
</script>

<style scoped>
.add {
    width: 500px;
}
</style>
