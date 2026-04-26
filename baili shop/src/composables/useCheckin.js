import { ref, computed, onMounted } from 'vue';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useCheckin() {
  const { user } = useAuth();
  const loading = ref(false);
  const error = ref(null);
  const checkinResult = ref(null);
  const lastCheckin = ref(null);

  // 检查今日是否已签到
  const hasCheckedInToday = ref(false);

  // 获取今日日期
  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  // 检查签到状态
  const checkCheckinStatus = async () => {
    if (!user.value) return;
    
    loading.value = true;
    try {
      // 检查今日是否已签到
      const { data: todayCheckin } = await supabase
        .from('checkins')
        .select('id')
        .eq('user_id', user.value.id)
        .eq('checkin_date', getToday())
        .single();
      hasCheckedInToday.value = !!todayCheckin;

      // 获取最后一次签到记录
      const { data: lastCheckinData } = await supabase
        .from('checkins')
        .select('checkin_date')
        .eq('user_id', user.value.id)
        .order('checkin_date', { ascending: false })
        .limit(1)
        .single();
      if (lastCheckinData) {
        lastCheckin.value = lastCheckinData.checkin_date;
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  // 执行签到
  const checkin = async () => {
    if (!user.value) throw new Error('请先登录');
    if (hasCheckedInToday.value) throw new Error('今日已签到');

    loading.value = true;
    error.value = null;

    try {
      // 开始事务
      const { data: checkinData, error: checkinError } = await supabase
        .from('checkins')
        .insert({
          user_id: user.value.id,
          checkin_date: getToday(),
          coins_earned: 10 // 基础奖励
        })
        .select()
        .single();

      if (checkinError) throw checkinError;

      // 更新用户金币
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({ coins: supabase.raw('coins + 10') })
        .eq('id', user.value.id)
        .select()
        .single();

      if (userError) throw userError;

      // 记录交易
      await supabase
        .from('transactions')
        .insert({
          user_id: user.value.id,
          type: 'earn',
          amount: 10,
          description: '每日签到奖励'
        });

      checkinResult.value = {
        coins_earned: 10,
        total_coins: userData.coins
      };
      hasCheckedInToday.value = true;
      lastCheckin.value = getToday();
      return checkinResult.value;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    checkCheckinStatus();
  });

  return { loading, error, checkin, checkinResult, hasCheckedInToday, lastCheckin };
}