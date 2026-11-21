import 'package:chucarit/src/features/home/home_screen.dart';
import 'package:chucarit/src/shared/domain.g.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('shows every report status with its Spanish label', (
    tester,
  ) async {
    await tester.pumpWidget(const MaterialApp(home: HomeScreen()));

    expect(find.byType(Chip), findsNWidgets(ReportStatus.values.length));
    for (final status in ReportStatus.values) {
      expect(find.text(status.label), findsOneWidget);
    }
  });
}
