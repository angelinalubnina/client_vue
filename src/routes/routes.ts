import {
    ADMIN_ROUTE,
    BASKET_ROUTE,
    DEVICE_ROUTE,
    LOGIN_ROUTE,
    REGISTRATION_ROUTE,
    SHOP_ROUTE,
    ORDERING_ROUTE,
} from '@/utils/consts';
import { createRouter, createWebHashHistory } from 'vue-router';
import Admin from '../pages/Admin.vue';
import Basket from '../pages/Basket.vue';
import Auth from '../pages/Auth.vue';
import DevicePage from '../pages/DevicePage.vue';
import Shop from '../pages/Shop.vue';
import Test from '../pages/Test.vue';
import Ordering from '../pages/Ordering.vue';
import PersonalDemo from '@/components/PersonalDemo.vue';
import SeatDemo from '@/components/SeatDemo.vue';
import PaymentDemo from '@/components/PaymentDemo.vue';
import Confirmation from '@/components/Confirmation.vue';

const routes = [
    {
        path: ADMIN_ROUTE,
        component: Admin,
    },
    {
        path: BASKET_ROUTE,
        component: Basket,
    },
    {
        path: SHOP_ROUTE,
        component: Shop,
    },
    {
        path: LOGIN_ROUTE,
        component: Auth,
    },
    {
        path: REGISTRATION_ROUTE,
        component: Auth,
    },
    // {
    //     path: DEVICE_ROUTE + '/:id',
    //     component: DevicePage,
    // },
    {
        path: DEVICE_ROUTE + '/:name',
        component: DevicePage,
    },
    {
        path: ORDERING_ROUTE,
        component: Ordering,
    },
    {
        path: '/personal',
        component: PersonalDemo,
    },
    {
        path: '/seat',
        component: SeatDemo,
    },
    {
        path: '/payment',
        component: PaymentDemo,
    },
    {
        path: '/confirmation',
        component: Confirmation,
    },
    {
        path: '/test',
        component: Test,
    },
];

const router = createRouter({
    routes,
    history: createWebHashHistory(process.env.BASE_URL),
});

export default router;
