import { PocketCard } from '@/src/components/PocketCard';
import { TransactionItem } from '@/src/components/TransactionItem';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Bike,
  CreditCard,
  Eye,
  Home as HomeIcon,
  MoreHorizontal,
  Music
} from 'lucide-react-native';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* Fixed Gradient Header */}
      <LinearGradient
        colors={['#7F3DFF', '#E024EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 50,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <Text className="text-white text-base">👤</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-white/80 text-xs">Hello,</Text>
              <Text className="text-white text-sm font-bold">Bang Toyib</Text>
            </View>
          </View>
          <TouchableOpacity className="w-9 h-9 rounded-full bg-white/20 items-center justify-center">
            <Bell size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* Balance */}
        <View className="mb-4">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-white/80 text-xs">Balance</Text>
            <TouchableOpacity>
              <Eye size={14} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-white text-3xl font-bold">$68,960.21</Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <View className="flex-1 items-center">
            <TouchableOpacity className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center mb-1.5">
              <ArrowUpRight size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xs">Transfer</Text>
          </View>
          <View className="flex-1 items-center">
            <TouchableOpacity className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center mb-1.5">
              <ArrowDownLeft size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xs">Receive</Text>
          </View>
          <View className="flex-1 items-center">
            <TouchableOpacity className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center mb-1.5">
              <CreditCard size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xs">Top up</Text>
          </View>
          <View className="flex-1 items-center">
            <TouchableOpacity className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center mb-1.5">
              <MoreHorizontal size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xs">More</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* My Pockets */}
        <View className="mt-5 mb-5">
          <View className="px-5 flex-row items-center justify-between mb-3">
            <Text className="text-white text-base font-bold">My Pockets</Text>
            <TouchableOpacity>
              <Text className="text-primary text-xs font-semibold">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            <PocketCard
              icon={HomeIcon}
              title="Home"
              target="250,000"
              current="172,500"
              progress={69}
            />
            <PocketCard
              icon={Bike}
              title="Motorcycle"
              target="1,250"
              current="862"
              progress={69}
            />
          </ScrollView>
        </View>

        {/* Recent Transactions */}
        <View className="mb-6">
          <View className="px-5 flex-row items-center justify-between mb-3">
            <Text className="text-white text-base font-bold">Recent Transactions</Text>
            <TouchableOpacity>
              <Text className="text-primary text-xs font-semibold">See All</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TransactionItem
              icon={Music}
              iconBg="#FF4B4B"
              title="Youtube Premium"
              date="22 Aug 2023 • 10:00 am"
              amount="20"
              isPositive={false}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
