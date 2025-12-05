import { View, Text, TouchableOpacity } from 'react-native';

interface PocketCardProps {
  title: string;
}

export const PocketCard = ({ title }: PocketCardProps) => {
  return (
    <TouchableOpacity className="bg-white/10 rounded-2xl p-4 mr-3">
      <Text className="text-white text-base font-bold">{title}</Text>
    </TouchableOpacity>
  );
};
