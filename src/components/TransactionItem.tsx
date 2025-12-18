import { Text, TouchableOpacity } from 'react-native';

interface TransactionItemProps {
  title: string;
  amount: string;
}

export const TransactionItem = ({ title, amount }: TransactionItemProps) => {
  return (
    <TouchableOpacity className="flex-row justify-between p-4 bg-white/5 rounded-2xl mb-3">
      <Text className="text-white text-base">{title}</Text>
      <Text className="text-white text-base">₮{amount}</Text>
    </TouchableOpacity>
  );
};
