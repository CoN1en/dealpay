<template>
  <div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold mb-6">{{ isLogin ? '登录' : '注册' }}</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="!isLogin" class="">
        <label class="block text-sm font-medium mb-1" for="username">
          用户名
        </label>
        <input
          v-model="form.username"
          type="text"
          id="username"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          required
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1" for="email">
          邮箱
        </label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          required
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1" for="password">
          密码
        </label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          required
        />
      </div>
      
      <div v-if="error" class="text-red-500 text-sm">
        {{ error.message }}
      </div>
      
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {{ loading ? '处理中...' : (isLogin ? '登录' : '注册') }}
      </button>
      
      <p class="text-center text-sm mt-4">
        <button
          @click="isLogin = !isLogin"
          class="text-blue-500 hover:underline"
          type="button"
        >
          {{ isLogin ? '没有账号？注册' : '已有账号？登录' }}
        </button>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const isLogin = ref(true);
const form = ref({
  username: '',
  email: '',
  password: ''
});

const { loading, error, register, login } = useAuth();

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await login(form.value.email, form.value.password);
    } else {
      await register(form.value.email, form.value.password, form.value.username);
    }
  } catch (err) {
    console.error('认证失败:', err);
  }
};
</script>