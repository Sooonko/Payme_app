import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function StatisticsScreen() {
  const weekData = [
    { day: 'M', value: 1200, height: 30 },
    { day: 'T', value: 1800, height: 45 },
    { day: 'W', value: 1400, height: 35 },
    { day: 'T', value: 2800, height: 70 },
    { day: 'F', value: 3000, height: 75 },
    { day: 'S', value: 2400, height: 60 },
    { day: 'S', value: 2600, height: 65 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className="text-white text-2xl font-bold text-center">Statistic</Text>
        </View>

        {/* Income/Expense Toggle */}
        <View className="px-5 mb-6">
          <View className="bg-card rounded-2xl p-1 flex-row">
            <TouchableOpacity className="flex-1 bg-card rounded-xl py-3">
              <Text className="text-text-muted text-center font-semibold">Income</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-background rounded-xl py-3">
              <Text className="text-white text-center font-semibold">Expense</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Income */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text-muted text-sm">Total Income</Text>
            <TouchableOpacity className="bg-card px-3 py-1.5 rounded-lg flex-row items-center gap-2">
              <Text className="text-white text-sm">This week</Text>
              <Text className="text-white text-xs">▼</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-white text-4xl font-bold">$14,500</Text>
        </View>

        {/* Chart */}
        <View className="px-5 mb-6">
          <View className="flex-row items-end justify-between h-48 px-2">
            {weekData.map((item, index) => (
              <View key={index} className="items-center flex-1">
                <View className="flex-1 justify-end mb-2 w-full items-center">
                  <View
                    className="bg-primary rounded-t-lg"
                    style={{ height: `${item.height}%`, width: 32 }}
                  />
                </View>
                <Text className="text-text-muted text-xs mt-1">{item.day}</Text>
              </View>
            ))}
          </View>
          <View className="flex-row justify-between mt-4 px-2">
            <Text className="text-text-muted text-xs">0</Text>
            <Text className="text-text-muted text-xs">1K</Text>
            <Text className="text-text-muted text-xs">2K</Text>
            <Text className="text-text-muted text-xs">3K</Text>
          </View>
        </View>

        {/* Detail Transactions */}
        <View className="px-5 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">Detail Transactions</Text>
            <TouchableOpacity>
              <Text className="text-primary text-sm font-semibold">See All</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            <TransactionRow
              icon="🎵"
              iconBg="#00BA88"
              title="Spotify"
              date="22 Aug 2023 • 10:00 am"
              amount="+$400"
              isPositive
            />
            <TransactionRow
              icon="👤"
              iconBg="#00BA88"
              title="Mudryk"
              date="22 Aug 2023 • 08:00 am"
              amount="+$80"
              isPositive
            />
            <TransactionRow
              icon="🎵"
              iconBg="#7F3DFF"
              title="Mia"
              date="21 Aug 2023 • 05:00 pm"
              amount="+$120"
              isPositive
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TransactionRow({ icon, iconBg, title, date, amount, isPositive }: any) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: iconBg }}>
          <Text className="text-xl">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-semibold text-base">{title}</Text>
          <Text className="text-text-muted text-sm">{date}</Text>
        </View>
      </View>
      <Text className={`font-bold text-base ${isPositive ? 'text-success' : 'text-danger'}`}>
        {amount}
      </Text>
    </View>
  );
}
