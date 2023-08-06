<template>
    <div class="card flex align-items-center justify-content-center">
        <Card style="width: 50em">
            <template #title>
                <h2 style="margin: auto">
                    {{ isLoginRoute ? 'Авторизация' : 'Регистрация' }}
                </h2>
            </template>
            <template #content>
                <div class="card flex justify-content-center">
                    <InputText
                        type="text"
                        v-model="email"
                        placeholder="Введите ваш email..."
                        style="width: 300px"
                    />
                </div>
                <div class="card flex justify-content-center">
                    <Password
                        v-model="password"
                        placeholder="Введите пароль..."
                        style="width: 1000px; margin-top: 15px"
                        :feedback="true"
                    />
                </div>
            </template>
            <template #footer>
                <div class="footer flex justify-content-between">
                    <div>
                        <p>
                            {{
                                isLoginRoute ? 'Нет аккаунта?' : 'Есть аккаунт?'
                            }}
                            <router-link
                                :to="`${
                                    isLoginRoute
                                        ? REGISTRATION_ROUTE
                                        : LOGIN_ROUTE
                                }`"
                                >{{
                                    isLoginRoute
                                        ? 'Зарегистрируйтесь!'
                                        : 'Войдите!'
                                }}</router-link
                            >
                        </p>
                    </div>
                    <div>
                        <Button @click="click">
                            {{ isLoginRoute ? 'Войти' : 'Регистрация' }}
                        </Button>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, computed, defineComponent } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { REGISTRATION_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from '../utils/consts';
// import jwt_decode from 'jwt-decode';
import { $host } from '../http/index';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const password = ref('12345aA.');
const email = ref('test@mail.ru');
const route = useRoute();
const router = useRouter();
const isLoginRoute = computed(() => {
    return route.path === LOGIN_ROUTE;
});

const click = async () => {
    try {
        let userData;

        if (isLoginRoute.value) {
            userData = await login(email.value, password.value);
        } else {
            userData = await registration(email.value, password.value);
        }
        // user.setUser(userData);
        // user.setIsAuth(true);
        router.push(SHOP_ROUTE);
    } catch (e) {
        if (e.response && e.response.data) {
            let data = e.response.data;
            alert(
                data.message + '\n' + data.errors.map((e) => e.msg).join('\n'),
            );
        } else {
            alert(e.message);
        }
    }
};

const registration = async (email, password) => {
    const { data } = await $host.post('api/user/registration', {
        email,
        password,
    });
    localStorage.setItem('accessToken', data.accessToken);
    return data.user;
    // return jwt_decode(data.accessToken);
};

const login = async (email, password) => {
    const { data } = await $host.post('api/user/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    userStore.login(data)
    // return jwt_decode(data.accessToken);
};
</script>

<style scoped></style>
