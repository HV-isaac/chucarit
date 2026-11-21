// GENERATED FILE. DO NOT EDIT.
// Source: packages/shared/src. Regenerate with `pnpm --filter @chucarit/shared gen:dart`.
// ignore_for_file: type=lint
// dart format off

/// Estado de un reporte.
///
/// [value] es el valor que viaja en el API; [label], el texto para la UI.
enum ReportStatus {
  received('received', 'Recibido'),
  validated('validated', 'Validado'),
  assigned('assigned', 'Asignado'),
  inProgress('in_progress', 'En atención'),
  resolved('resolved', 'Resuelto'),
  rejected('rejected', 'Rechazado'),
  duplicate('duplicate', 'Duplicado'),
  ;

  const ReportStatus(this.value, this.label);

  final String value;
  final String label;

  bool get isFinal => finalReportStatuses.contains(this);

  /// The ReportStatus whose API value is [value]; throws [ArgumentError] if unknown.
  static ReportStatus fromValue(String value) => values.firstWhere(
        (item) => item.value == value,
        orElse: () => throw ArgumentError.value(value, 'value', 'Unknown ReportStatus'),
      );
}

/// Rol de una cuenta.
///
/// [value] es el valor que viaja en el API; [label], el texto para la UI.
enum Role {
  citizen('citizen', 'Ciudadano'),
  moderator('moderator', 'Moderador'),
  responder('responder', 'Responsable'),
  admin('admin', 'Administrador'),
  ;

  const Role(this.value, this.label);

  final String value;
  final String label;

  bool get isStaff => staffRoles.contains(this);

  /// The Role whose API value is [value]; throws [ArgumentError] if unknown.
  static Role fromValue(String value) => values.firstWhere(
        (item) => item.value == value,
        orElse: () => throw ArgumentError.value(value, 'value', 'Unknown Role'),
      );
}

/// Estados después de los cuales un reporte ya no cambia.
const Set<ReportStatus> finalReportStatuses = {ReportStatus.resolved, ReportStatus.rejected, ReportStatus.duplicate};

/// Estados que se consideran abiertos.
const Set<ReportStatus> openReportStatuses = {ReportStatus.received, ReportStatus.validated, ReportStatus.assigned, ReportStatus.inProgress};

/// Roles que trabajan en el panel.
const Set<Role> staffRoles = {Role.moderator, Role.responder, Role.admin};

/// Transiciones permitidas y qué roles pueden hacer cada una. El API es la autoridad;
/// la app solo la usa para decidir qué acciones mostrar.
const Map<ReportStatus, Map<ReportStatus, Set<Role>>> reportTransitions = {
  ReportStatus.received: {
    ReportStatus.validated: {Role.moderator, Role.admin},
    ReportStatus.rejected: {Role.moderator, Role.admin},
    ReportStatus.duplicate: {Role.moderator, Role.admin},
  },
  ReportStatus.validated: {
    ReportStatus.assigned: {Role.moderator, Role.admin},
  },
  ReportStatus.assigned: {
    ReportStatus.inProgress: {Role.responder, Role.admin},
  },
  ReportStatus.inProgress: {
    ReportStatus.resolved: {Role.responder, Role.admin},
  },
  ReportStatus.resolved: {},
  ReportStatus.rejected: {},
  ReportStatus.duplicate: {},
};

/// Whether [role] may move a report from [from] to [to].
bool canTransition(ReportStatus from, ReportStatus to, Role role) =>
    reportTransitions[from]?[to]?.contains(role) ?? false;

/// Statuses [role] may move a report to from [from], in table order.
List<ReportStatus> allowedTransitions(ReportStatus from, Role role) => [
      for (final entry in (reportTransitions[from] ?? const {}).entries)
        if (entry.value.contains(role)) entry.key,
    ];
