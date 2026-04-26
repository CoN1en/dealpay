<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 class="text-xl font-semibold mb-4">每日签到</h3>
    
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-300">当前金币:</span>
        <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ coinsBalance }}</span>
      </div>
      
      <div v-if="lastCheckin" class="text-sm text-gray-500 dark:text-gray-400">
        上次签到: {{ lastCheckin }}
      </div>
      
      <button
        @click="handleCheckin"
        :disabled="hasCheckedInToday || loading"
        class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {{ loading ? '处理中...' : (hasCheckedInToday ? '今日已签到' : '立即签到') }}
      </button>
      
      <div v-if="checkinResult" class="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md">
        {{ checkinResult.coins_earned }} 金币已添加到您的账户！
        <br>
        当前余额: {{ checkinResult.total_coins }}
      </div>
      
      <div v-if="error" class="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
        {{ error.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCheckin } from '../composables/useCheckin';
import { useCoins } from '../composables/useCoins';

const { loading, error, checkin, checkinResult, hasCheckedInToday, lastCheckin } = useCheckin();
const { balance, getBalance } = useCoins();
const coinsBalance = ref(0);

const handleCheckin = async () => {
  try {
    await checkin();
    await getBalance();
  } catch (err) {
    console.error('签到失败:', err);
  }
};

onMounted(async () => {
  await getBalance();
  coinsBalance.value = balance.value;
});
</script>