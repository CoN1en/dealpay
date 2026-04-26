<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 class="text-xl font-semibold mb-4">管理员面板</h3>
    
    <!-- 选项卡 -->
    <div class="flex border-b border-gray-200 dark:border-gray-700 mb-4">
      <button 
        @click="activeTab = 'users'" 
        :class="['px-4 py-2 font-medium', activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300']"
      >
        用户管理
      </button>
      <button 
        @click="activeTab = 'products'" 
        :class="['px-4 py-2 font-medium', activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300']"
      >
        商品管理
      </button>
    </div>
    
    <!-- 用户管理 -->
    <div v-if="activeTab === 'users'" class="space-y-6">
      <!-- 用户列表 -->
      <div>
        <h4 class="text-lg font-medium mb-3">用户列表</h4>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <div 
            v-for="user in users" 
            :key="user.id"
            @click="selectUser(user)"
            :class="[
              'p-3 border rounded-md cursor-pointer',
              selectedUser?.id === user.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'
            ]"
          >
            <div class="font-medium">{{ user.email }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              金币: {{ user.coins }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 选中用户的交易记录 -->
      <div v-if="selectedUser">
        <h4 class="text-lg font-medium mb-3">
          {{ selectedUser.email }} 的交易记录
        </h4>
        <div v-if="userTransactions.length === 0" class="text-gray-500 dark:text-gray-400">
          暂无交易记录
        </div>
        <div v-else class="space-y-2 max-h-60 overflow-y-auto">
          <div 
            v-for="transaction in userTransactions" 
            :key="transaction.id"
            class="flex justify-between items-center p-2 border-b border-gray-100 dark:border-gray-700"
          >
            <div>
              <div class="text-sm font-medium">{{ transaction.description }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ new Date(transaction.created_at).toLocaleString() }}
              </div>
            </div>
            <div :class="transaction.type === 'earn' ? 'text-green-500' : 'text-red-500'">
              {{ transaction.type === 'earn' ? '+' : '-' }}{{ transaction.amount }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 商品管理 -->
    <div v-else-if="activeTab === 'products'">
      <AdminProducts />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabase';
import AdminProducts from './AdminProducts.vue';

const activeTab = ref('users');
const users = ref([]);
const selectedUser = ref(null);
const userTransactions = ref([]);

// 获取所有用户
const fetchUsers = async () => {
  const { data } = await supabase
    .from('users')
    .select('id, email, coins');
  users.value = data || [];
};

// 选择用户并获取交易记录
const selectUser = async (user) => {
  selectedUser.value = user;
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  userTransactions.value = data || [];
};

onMounted(() => {
  fetchUsers();
});
</script>