<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="text-xl font-bold text-blue-600 dark:text-blue-400">
        金币系统
      </div>
      <div v-if="user" class="flex items-center space-x-4">
        <span class="text-sm">
          欢迎, {{ user.email }}
        </span>
        <button 
          @click="handleLogout" 
          class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
        >
          登出
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '../composables/useAuth';

const { user, logout } = useAuth();

const handleLogout = async () => {
  await logout();
};
</script>