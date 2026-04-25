<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 class="text-xl font-semibold mb-4">商品商店</h3>
    
    <div class="space-y-4">
      <div v-if="loading" class="text-center py-8">
        加载中...
      </div>
      
      <div v-else-if="products.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        暂无商品
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <h4 class="text-lg font-medium mb-2">{{ product.name }}</h4>
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">{{ product.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-xl font-bold text-blue-600 dark:text-blue-400">
              {{ product.price }} 金币
            </span>
            <button
              @click="handlePurchase(product)"
              :disabled="balance < product.price || purchasing"
              class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {{ purchasing ? '购买中...' : '购买' }}
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="purchaseResult" class="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md">
        购买成功！
      </div>
      
      <div v-if="purchaseError" class="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
        {{ purchaseError.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabase';
import { useCoins } from '../composables/useCoins';

const { balance, spendCoins, getBalance } = useCoins();
const products = ref([]);
const loading = ref(false);
const purchasing = ref(false);
const purchaseResult = ref(null);
const purchaseError = ref(null);

// 获取商品列表
const fetchProducts = async () => {
  loading.value = true;
  try {
    const { data } = await supabase
      .from('products')
      .select('*');
    products.value = data || [];
  } catch (error) {
    console.error('获取商品失败:', error);
  } finally {
    loading.value = false;
  }
};

// 购买商品
const handlePurchase = async (product) => {
  if (balance.value < product.price) {
    purchaseError.value = { message: '金币不足' };
    return;
  }
  
  purchasing.value = true;
  purchaseError.value = null;
  purchaseResult.value = null;
  
  try {
    await spendCoins(product.price, `购买商品: ${product.name}`);
    purchaseResult.value = { success: true };
    // 3秒后清空提示
    setTimeout(() => {
      purchaseResult.value = null;
    }, 3000);
  } catch (error) {
    purchaseError.value = error;
  } finally {
    purchasing.value = false;
  }
};

onMounted(async () => {
  await fetchProducts();
  await getBalance();
});
</script>