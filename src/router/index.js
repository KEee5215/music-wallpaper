import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/templates",
      name: "templates",
      component: () => import("../views/TemplateView.vue"),
    },
    {
      path: "/template/:id",
      name: "template-detail",
      component: () => import("../views/TemplateDetailView.vue"),
      props: true,
    },
    {
      path: "/visualizer",
      name: "visualizer",
      component: () => import("../views/AudioVisualizerView.vue"),
    },
    {
      path: "/project/:id",
      name: "project",
      component: () => import("../views/ProjectView.vue"),
    },
  ],
});

export default router;
