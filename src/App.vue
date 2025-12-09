<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div class="min-h-screen w-full flex flex-col">
    <Navbar />
    <main class="flex-1 w-full">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
</style>
