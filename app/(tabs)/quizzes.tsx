import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';

export default function QuizzesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quizzes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
});
