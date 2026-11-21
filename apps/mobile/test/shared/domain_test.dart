import 'package:chucarit/src/shared/domain.g.dart';
import 'package:flutter_test/flutter_test.dart';

// The table itself is tested in packages/shared; these tests cover the generated Dart helpers.
void main() {
  group('ReportStatus', () {
    test('round-trips API values', () {
      for (final status in ReportStatus.values) {
        expect(ReportStatus.fromValue(status.value), status);
      }
      expect(ReportStatus.fromValue('in_progress'), ReportStatus.inProgress);
    });

    test('rejects unknown API values', () {
      expect(() => ReportStatus.fromValue('cancelled'), throwsArgumentError);
    });

    test('splits open and final statuses', () {
      expect(
        openReportStatuses.union(finalReportStatuses),
        ReportStatus.values.toSet(),
      );
      expect(openReportStatuses.intersection(finalReportStatuses), isEmpty);
    });
  });

  group('canTransition', () {
    test('matches the shared table', () {
      expect(
        canTransition(
          ReportStatus.received,
          ReportStatus.validated,
          Role.moderator,
        ),
        isTrue,
      );
      expect(
        canTransition(
          ReportStatus.received,
          ReportStatus.validated,
          Role.citizen,
        ),
        isFalse,
      );
      expect(
        canTransition(ReportStatus.resolved, ReportStatus.received, Role.admin),
        isFalse,
      );
    });

    test('lists allowed transitions in table order', () {
      expect(allowedTransitions(ReportStatus.received, Role.moderator), [
        ReportStatus.validated,
        ReportStatus.rejected,
        ReportStatus.duplicate,
      ]);
      expect(allowedTransitions(ReportStatus.received, Role.citizen), isEmpty);
    });
  });
}
