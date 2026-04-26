import { ref } from 'vue';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useCoins() {
  const { user } = useAuth();
  const loading = ref(false);
  const error = ref(null);
  const balance = ref(0);
  const transactions = ref([]);

  // 获取余额
  const getBalance = async () => {
    if (!user.value) return 0;
    
    loading.value = true;
    try {
      const { data, error: err } = await supabase
        .from('users')
        .select('coins')
        .eq('id', user.value.id)
        .single();
      
      if (err) throw err;
      balance.value = data.coins;
      return data.coins;
    } catch (err) {
      error.value = err;
      return 0;
    } finally {
      loading.value = false;
    }
  };

  // 花费金币
  const spendCoins = async (amount, description) => {
    if (!user.value) throw new Error('请先登录');
    if (amount <= 0) throw new Error('金额必须大于0');

    loading.value = true;
    error.value = null;

    try {
      // 检查余额
      const currentBalance = await getBalance();
      if (currentBalance < amount) throw new Error('金币不足');

      // 更新余额
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({ coins: supabase.raw(`coins - ${amount}`) })
        .eq('id', user.value.id)
        .select()
        .single();

      if (userError) throw userError;

      // 记录交易
      await supabase
        .from('transactions')
        .insert({
          user_id: user.value.id,
          type: 'spend',
          amount: amount,
          description: description
        });

      balance.value = userData.coins;
      await getTransactions();

      return {
        remaining_coins: userData.coins
      };
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取交易记录
  const getTransactions = async () => {
    if (!user.value) return [];
    
    loading.value = true;
    try {
      const { data, error: err } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (err) throw err;
      transactions.value = data;
      return data;
    } catch (err) {
      error.value = err;
      return [];
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, balance, transactions, getBalance, spendCoins, getTransactions };
}