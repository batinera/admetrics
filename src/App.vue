<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useAuth } from "./composables/useAuth";

const { fetchMe } = useAuth();
onMounted(() => {
  fetchMe();
});
</script>
