import { REPORT_STATUS_LABELS, REPORT_STATUSES } from '@chucarit/shared';
import { useTheme } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Reporta lo que hay que arreglar</Text>
      <Text style={[styles.body, { color: colors.text }]}>
        Baches, alumbrado, drenajes o fugas: avísanos y sigue cómo se atiende tu reporte.
      </Text>
      <Text accessibilityRole="header" style={[styles.subtitle, { color: colors.text }]}>
        Así avanza un reporte
      </Text>
      <View style={styles.statuses}>
        {REPORT_STATUSES.map((status) => (
          <Text
            key={status}
            testID="report-status"
            style={[styles.status, { color: colors.text, borderColor: colors.border }]}
          >
            {REPORT_STATUS_LABELS[status]}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: '700' },
  body: { fontSize: 17, lineHeight: 24 },
  subtitle: { fontSize: 20, fontWeight: '600', marginTop: 8 },
  statuses: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  status: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 15,
  },
});
