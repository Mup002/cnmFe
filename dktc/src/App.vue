<template>
  <main class="flex-1 min-w-0 min-h-screen bg-sky-50">
    <router-view></router-view>
  </main>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
