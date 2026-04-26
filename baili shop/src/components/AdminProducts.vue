<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 class="text-xl font-semibold mb-4">商品管理</h3>
    
    <!-- 添加商品表单 -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
      <h4 class="text-lg font-medium mb-3">添加商品</h4>
      <form @submit.prevent="addProduct" class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1">商品名称</label>
          <input v-model="newProduct.name" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700" required>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">价格</label>
          <input v-model.number="newProduct.price" type="number" min="1" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700" required>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">描述</label>
          <textarea v-model="newProduct.description" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700" required></textarea>
        </div>
        <button type="submit" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors">添加商品</button>
      </form>
    </div>
    
    <!-- 商品列表 -->
    <div>
      <h4 class="text-lg font-medium mb-3">商品列表</h4>
      <div v-if="products.length === 0" class="text-gray-500 dark:text-gray-400">暂无商品</div>
      <div v-else class="space-y-3">
        <div v-for="product in products" :key="product.id" class="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
          <div>
            <div class="font-medium">{{ product.name }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ product.description }}</div>
          </div>
          <div class="flex items-center space-x-3">
            <span class="font-bold">{{ product.price }} 金币</span>
            <button @click="deleteProduct(product.id)" class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabase';

const products = ref([]);
const newProduct = ref({
  name: '',
  price: 0,
  description: ''
});

const fetchProducts = async () => {
  const { data } = await supabase.from('products').select('*');
  products.value = data || [];
};

const addProduct = async () => {
  await supabase.from('products').insert(newProduct.value);
  newProduct.value = { name: '', price: 0, description: '' };
  await fetchProducts();
};

const deleteProduct = async (id) => {
  if (confirm('确定要删除这个商品吗？')) {
    await supabase.from('products').delete().eq('id', id);
    await fetchProducts();
  }
};

onMounted(fetchProducts);
</script>