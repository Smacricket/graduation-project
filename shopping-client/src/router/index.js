import Vue from "vue";
import VueRouter from "vue-router";

import { Message } from "element-ui";

const Home = () => import("@/views/Home.vue");
const Login = () => import("@/views/Login.vue");
const Register = () => import("@/views/Register.vue");
const Goods = () => import("@/views/Goods.vue");
const User = () => import("@/views/User.vue");
const Cart = () => import("@/views/Cart.vue");
const Order = () => import("@/views/Order.vue");
const MyOrder = () => import("@/views/User/MyOrder.vue");
const Me = () => import("@/views/User/Me.vue");
const ChangePwd = () => import("@/views/User/ChangePwd.vue");
const MyMessage = () => import("@/views/User/MyMessage.vue");
const Comment = () => import("@/views/User/Comment.vue");
const MyProfile = () => import("@/views/User/MyProfile.vue");
const CommentDetails = () => import("@/views/User/CommentDetails.vue");
const SingleCateGoods = () => import("@/views/Goods/SingleCateGoods.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { keepAlive: true }
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/goods/:id",
    name: "goods",
    component: Goods
  },
  {
    path: "/singleCate/:id",
    name: "singleCate",
    component: SingleCateGoods
  },
  {
    path: "/user",
    name: "user",
    component: User,
    children: [
      {
        path: "/me",
        name: "me",
        component: Me
      },
      {
        path: "/my_order",
        name: "my_order",
        component: MyOrder
      },
      {
        path: "/change_pwd",
        name: "change_pwd",
        component: ChangePwd
      },
      {
        path: "/my_message",
        name: "my_message",
        component: MyMessage
      },
      {
        path: "/comment",
        name: "comment",
        component: Comment
      },
      {
        path: "/my_profile",
        name: "my_profile",
        component: MyProfile
      },
      {
        path: "/commentDetails/:id",
        name: "commentDetails",
        component: CommentDetails
      }
    ]
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart
  },
  {
    path: "/order",
    name: "order",
    component: Order
  }
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  routes
});

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem("loginToken") ? true : false;
  // 判断是否在登录状态
  if (to.path === "/login" || to.path === "/" || to.path === "/register") {
    next();
  } else {
    isLogin ? next() : Message.warning("请先登录");
  }
});

export default router;
