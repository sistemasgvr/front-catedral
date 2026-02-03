import LoginAdminView from "../views/LoginAdminView.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginAdminView,
    props: { step: 0 },
  }
];

export default routes;
