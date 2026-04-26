<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 class="text-xl font-semibold mb-4">我的背包</h3>
    
    <div class="space-y-4">
      <div v-if="loading" class="text-center py-8">
        加载中...
      </div>
      
      <div v-else-if="inventory.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        背包空空如也，快去商店购买商品吧！
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="item in inventory" 
          :key="item.id"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="text-lg font-medium mb-1">{{ item.product_name }}</h4>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                数量: {{ item.quantity }}
              </p>
              <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">
                购买时间: {{ formatDate(item.purchased_at) }}
              </p>
            </div>
            <button
              @click="useItem(item)"
              class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors"
            >
              使用
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="message" :class="['mt-4 p-3 rounded-md', message.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300']">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabase';
import { useAuth } from '../composables/useAuth';

const { user } = useAuth();
const inventory = ref([]);
const loading = ref(false);
const message = ref(null);

const fetchInventory = async () => {
  if (!user.value) return;
  
  loading.value = true;
  try {
    const { data } = await supabase
      .from('user_inventory')
      .select('*')
      .eq('user_id', user.value.id)
      .order('purchased_at', { ascending: false });
    inventory.value = data || [];
  } catch (error) {
    console.error('获取背包失败:', error);
  } finally {
    loading.value = false;
  }
};

const useItem = async (item) => {
  if (item.quantity <= 0) {
    showMessage('物品已用完', 'error');
    return;
  }
  
  try {
    if (item.quantity === 1) {
      await supabase
        .from('user_inventory')
        .delete()
        .eq('id', item.id);
    } else {
      await supabase
        .from('user_inventory')
        .update({ quantity: item.quantity - 1 })
        .eq('id', item.id);
    }
    
    showMessage(`使用了 ${item.product_name}！`, 'success');
    await fetchInventory();
  } catch (error) {
    console.error('使用物品失败:', error);
    showMessage('使用物品失败', 'error');
  }
};

const showMessage = (text, type) => {
  message.value = { text, type };
  setTimeout(() => {
    message.value = null;
  }, 3000);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(async () => {
  await fetchInventory();
});
</script>