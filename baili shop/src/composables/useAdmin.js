import { ref } from 'vue';
import { supabase } from '../lib/supabase';

export function useAdmin() {
  const isAdmin = ref(false);

  const checkAdminStatus = async (userId) => {
    // 这里可以根据实际情况实现管理员判断逻辑
    // 例如：检查用户邮箱是否在管理员列表中
    const adminEmails = ['admin@example.com'];
    const { data } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();
    
    isAdmin.value = adminEmails.includes(data?.email);
    return isAdmin.value;
  };

  return { isAdmin, checkAdminStatus };
}