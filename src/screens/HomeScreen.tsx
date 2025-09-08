import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// 日本語ローカライゼーション設定
LocaleConfig.locales['jp'] = {
  monthNames: [
    '1月','2月','3月','4月','5月','6月',
    '7月','8月','9月','10月','11月','12月'
  ],
  monthNamesShort: [
    '1月','2月','3月','4月','5月','6月',
    '7月','8月','9月','10月','11月','12月'
  ],
  dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
  dayNamesShort: ['日','月','火','水','木','金','土'],
  today: '今日'
};
LocaleConfig.defaultLocale = 'jp';
import { LoadingSpinner, Card, GeneratingSummaryModal } from '../components';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { formatDate, formatTime, getTodayString } from '../utils';
import { apiClient, DashboardData } from '../services/api';



export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const queryClient = useQueryClient();

  const selectedDateString = selectedDate.toISOString().split('T')[0];

  // React Query for dashboard data
  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['dashboard', selectedDateString],
    queryFn: () => apiClient.getDashboardData(1, selectedDateString),
    retry: false,
  });

  // Mutation for generating summary
  const generateSummaryMutation = useMutation({
    mutationFn: () => apiClient.generateDailySummary(1, selectedDateString, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', selectedDateString] });
      Alert.alert('成功', '日次サマリーを生成しました');
    },
    onError: (error) => {
      console.error('Failed to generate summary:', error);
      Alert.alert('エラー', 'サマリーの生成に失敗しました');
    },
  });

  const formatDisplayDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const dateString = date.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    if (dateString === todayString) {
      return '今日';
    } else if (dateString === yesterdayString) {
      return '昨日';
    } else {
      return date.toLocaleDateString('ja-JP', {
        month: 'long',
        day: 'numeric',
      });
    }
  };


  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner message="データを読み込み中..." />
        </View>
      </SafeAreaView>
    );
  }

  // Extract data with fallbacks
  const elderlyPerson = dashboardData?.elderlyPerson || null;
  const dailySummary = dashboardData?.dailySummary || null;
  const conversations = dashboardData?.conversations || [];

  return (
    <View style={styles.container}>
      {/* Header with SafeArea */}
      <View style={styles.headerContainer}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerLeft} />
            <Image 
              source={require('../../assets/application-logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.headerRight}>
              {generateSummaryMutation.isPending ? (
                <ActivityIndicator size="small" color="#E07A5F" />
              ) : (
                <TouchableOpacity
                  onPress={() => generateSummaryMutation.mutate()}
                  style={styles.headerActionButton}
                  accessibilityLabel="サマリー生成"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
               >
                  <Ionicons name="refresh" size={22} color="#E07A5F" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => refetch()} />
        }
        showsVerticalScrollIndicator={false}
      >

        {/* Elderly Info */}
        {elderlyPerson && (
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="person-circle-outline" size={24} color="#1e293b" />
              <Text style={styles.infoTitle}>高齢者情報</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoName}>
                {elderlyPerson.last_name} {elderlyPerson.first_name}
              </Text>
              <Text style={styles.infoAge}>{elderlyPerson.age}歳</Text>
            </View>
          </View>
        )}

        {/* Today's Report */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.sectionTitle}>今日の様子</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={14} color="#E07A5F" style={styles.calendarIcon} />
              <Text style={styles.selectedDateText} numberOfLines={1} ellipsizeMode="clip">
                {formatDisplayDate(selectedDate)}
              </Text>
              <Ionicons name="chevron-down" size={12} color="#E07A5F" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.summaryScrollView} showsVerticalScrollIndicator={false}>
            {dailySummary ? (
              <Text style={styles.summaryText}>{dailySummary.summary_text}</Text>
            ) : (
              <Text style={styles.noDataText}>まだデータがありません</Text>
            )}
          </ScrollView>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>状態</Text>
            <Text style={styles.statValue}>
              {dailySummary?.emotional_state || 'データなし'}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>会話回数</Text>
            <Text style={styles.statValue}>
              {dailySummary?.conversation_count ? `${dailySummary.conversation_count}回` : 'データなし'}
            </Text>
          </View>
        </View>


        {/* Health Status */}
        <View style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <Ionicons name="heart-outline" size={20} color="#1e293b" />
            <Text style={styles.healthTitle}>健康状態</Text>
          </View>
          {dailySummary?.health_summary ? (
            <Text style={styles.healthText}>{dailySummary.health_summary}</Text>
          ) : (
            <Text style={styles.noDataText}>健康状態のデータがありません</Text>
          )}
        </View>

      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>日付を選択</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <Calendar
              current={selectedDate.toISOString().split('T')[0]}
              maxDate={new Date().toISOString().split('T')[0]}
              onDayPress={(day) => {
                setSelectedDate(new Date(day.dateString));
                setShowDatePicker(false);
              }}
              markedDates={{
                [selectedDate.toISOString().split('T')[0]]: {
                  selected: true,
                  selectedColor: '#E07A5F',
                }
              }}
              style={styles.calendar}
              theme={{
                selectedDayBackgroundColor: '#E07A5F',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#E07A5F',
                arrowColor: '#E07A5F',
                monthTextColor: '#1e293b',
                indicatorColor: '#E07A5F',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
                calendarBackground: '#ffffff',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                textSectionTitleColor: '#b6c1cd',
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Summary Generation Modal */}
      <GeneratingSummaryModal visible={generateSummaryMutation.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    
  },
  headerContainer: {
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerLogo: {
    height: 30,
    width: 100,
    flex: 1,
  },
  headerActionButton: {
    backgroundColor: '#ffffff',
    padding: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  scrollContent: {
    paddingBottom: 60,    
    flexGrow: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.error,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E07A5F',
    height: 200,
    overflow: 'hidden',
  },
  summaryHeader: {
    backgroundColor: '#E07A5F',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryScrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  summaryText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  healthCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  healthText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  datePickerButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 0,
    borderColor: '#ffffff',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    minWidth: 96,
    maxWidth: 140,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  calendarIcon: {
    marginRight: 2,
  },
  selectedDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E07A5F',
    textAlign: 'center',
    flexShrink: 1,
  },
  calendar: {
    width: 350,
    height: 350,
  },
  noDataText: {
    fontSize: 15,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    margin: 20,
    padding: 0,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  infoAge: {
    fontSize: 16,
    color: '#6b7280',
  },
});