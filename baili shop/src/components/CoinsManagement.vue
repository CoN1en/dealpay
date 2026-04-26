<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 class="text-xl font-semibold mb-4">金币管理</h3>
    
    <div class="space-y-6">
      <!-- 余额显示 -->
      <div class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-300">当前余额:</span>
        <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ balance }}</span>
      </div>
      
      <!-- 花费金币表单 -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 class="text-lg font-medium mb-3">花费金币</h4>
        <form @submit.prevent="handleSpend" class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1" for="amount">
              金额
            </label>
            <input
              v-model="spendForm.amount"
              type="number"
              id="amount"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1" for="description">
              描述
            </label>
            <input
              v-model="spendForm.description"
              type="text"
              id="description"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              required
            />
          </div>
          
          <div v-if="spendError" class="text-red-500 text-sm">
            {{ spendError.message }}
          </div>
          
          <button
            type="submit"
            :disabled="spendLoading"
            class="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {{ spendLoading ? '处理中...' : '确认花费' }}
          </button>
        </form>
      </div>
      
      <!-- 交易记录 -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 class="text-lg font-medium mb-3">交易记录</h4>
        <div v-if="transactions.length === 0" class="text-gray-500 dark:text-gray-400">
          暂无交易记录
        </div>
        <div v-else class="space-y-2 max-h-60 overflow-y-auto">
          <div 
            v-for="transaction in transactions" 
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCoins } from '../composables/useCoins';

const { 
  loading, 
  error, 
  balance, 
  transactions, 
  getBalance, 
  spendCoins, 
  getTransactions 
} = useCoins();

const spendForm = ref({
  amount: '',
  description: ''
});

const spendLoading = ref(false);
const spendError = ref(null);

const handleSpend = async () => {
  spendLoading.value = true;
  spendError.value = null;
  
  try {
    await spendCoins(parseInt(spendForm.value.amount), spendForm.value.description);
    // 重置表单
    spendForm.value = {
      amount: '',
      description: ''
    };
  } catch (err) {
    spendError.value = err;
  } finally {
    spendLoading.value = false;
  }
};

onMounted(async () => {
  await getBalance();
  await getTransactions();
});
</script>