<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <Navbar />
    <main class="container mx-auto p-4">
      <Auth v-if="!user" />
      <div v-else class="space-y-6">
        <Checkin />
        <Products />
        <Inventory />
        <CoinsManagement />
        <AdminPanel v-if="isAdmin" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Auth from './components/Auth.vue';
import Checkin from './components/Checkin.vue';
import Products from './components/Products.vue';
import Inventory from './components/Inventory.vue';
import CoinsManagement from './components/CoinsManagement.vue';
import AdminPanel from './components/AdminPanel.vue';
import { useAuth } from './composables/useAuth';
import { useAdmin } from './composables/useAdmin';

const { user } = useAuth();
const { isAdmin, checkAdminStatus } = useAdmin();

// 检查管理员状态
onMounted(async () => {
  if (user.value) {
    await checkAdminStatus(user.value.id);
  }
});
</script>