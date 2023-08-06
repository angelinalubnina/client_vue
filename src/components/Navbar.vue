<template>
    <div>
        <Menubar :model="items"> </Menubar>
    </div>
</template>

<script setup name="navbar">
import { ref, onMounted, onBeforeMount } from 'vue';
import {
    BASE_URL,
    ADMIN_ROUTE,
    BASKET_ROUTE,
    LOGIN_ROUTE,
    SHOP_ROUTE,
} from '@/utils/consts';
import { useUserStore } from '@/stores/userStore';
import { $authHost } from '../http/index';
import jwt_decode from 'jwt-decode';

const isAuth = ref(false);
const isAdmin = ref(false);
const items = ref([]);
const email = ref('');
const userStore = useUserStore();

onBeforeMount(async () => {
    const userStore = useUserStore();

    const check = async () => {
        try {
            const { data } = await $authHost.get('api/user/auth');
            localStorage.setItem('accessToken', data.accessToken);
            return jwt_decode(data.accessToken);
        } catch (e) {
            console.log(e.message);
        }
    };
    await check().then((data) => {
        userStore.$reset();
        if (data) {
            userStore.login(data);
        } else {
            userStore.logout();
        }
        isAuth.value = userStore.getIsAuth();
        isAdmin.value = userStore.getUser()?.role === 'ADMIN';
        email.value = userStore.getUser()?.email;
    });

    items.value = [
        {
            label: 'КупиДевайс',
            url: BASE_URL + SHOP_ROUTE,
        },
        {
            label: 'Войти',
            icon: 'pi pi-fw pi-user',
            url: BASE_URL + LOGIN_ROUTE,
            visible: !isAuth.value,
        },
        {
            label: 'Корзина',
            icon: 'pi pi-cart-plus',
            url: BASE_URL + BASKET_ROUTE,
            visible: isAuth.value,
        },
        {
            icon: 'pi pi-fw pi-user',  
            label: email,
            visible: isAuth.value,
            items:
            [
                {
                    label: 'Личный кабинет',
                    icon: 'pi pi-fw pi-cog',
                    // url: вписать адрес страницы настроек,
                },
                {
                    label: 'Админ панель',
                    icon: 'pi pi-user-edit',
                    url: BASE_URL + ADMIN_ROUTE,
                    visible: isAdmin.value,
                },
                {
                    label: 'Выйти',
                    icon: 'pi pi-sign-out',
                    command: logout,
                    visible: isAuth.value,
                },
            ]
        },
    ];
});

const logout = () => {
    userStore.logout();
    localStorage.removeItem('accessToken');
};
</script>

<style scoped></style>
