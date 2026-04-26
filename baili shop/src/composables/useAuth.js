import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // 监听用户状态
  onMounted(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null;
    });

    // 初始检查用户状态
    checkUser();
  });

  // 检查当前用户
  const checkUser = async () => {
    loading.value = true;
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    user.value = currentUser;
    loading.value = false;
  };

  // 注册
  const register = async (email, password, username) => {
    loading.value = true;
    error.value = null;
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });
    error.value = err;
    loading.value = false;
    return data;
  };

  // 登录
  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    error.value = err;
    loading.value = false;
    return data;
  };

  // 登出
  const logout = async () => {
    loading.value = true;
    error.value = null;
    const { error: err } = await supabase.auth.signOut();
    error.value = err;
    loading.value = false;
  };

  return { user, loading, error, register, login, logout };
}