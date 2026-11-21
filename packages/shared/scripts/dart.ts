// Renders the domain constants of @chucarit/shared as Dart for the Flutter app.
// Pure function (no I/O) so the CLI and the freshness test share it.
import type { ReportStatus, Role } from '../src/index.ts';

export const DART_OUTPUT_PATH = 'apps/mobile/lib/src/shared/domain.g.dart';

export interface DartDomain {
  reportStatuses: readonly ReportStatus[];
  reportStatusLabels: Readonly<Record<ReportStatus, string>>;
  finalReportStatuses: readonly ReportStatus[];
  openReportStatuses: readonly ReportStatus[];
  roles: readonly Role[];
  roleLabels: Readonly<Record<Role, string>>;
  staffRoles: readonly Role[];
  reportTransitions: Readonly<Record<ReportStatus, Partial<Record<ReportStatus, readonly Role[]>>>>;
}

const camel = (value: string): string =>
  value.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase());

const dartString = (value: string): string =>
  `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$')}'`;

const statusRef = (status: ReportStatus): string => `ReportStatus.${camel(status)}`;
const roleRef = (role: Role): string => `Role.${camel(role)}`;

const set = (items: readonly string[]): string => `{${items.join(', ')}}`;

function renderEnum(
  name: string,
  doc: string,
  values: readonly string[],
  labels: Readonly<Record<string, string>>,
  extra: string[],
): string[] {
  return [
    `/// ${doc}`,
    '///',
    '/// [value] es el valor que viaja en el API; [label], el texto para la UI.',
    `enum ${name} {`,
    ...values.map((value) => {
      const label = labels[value];
      if (label === undefined) throw new Error(`Missing label for ${name}.${value}`);
      return `  ${camel(value)}(${dartString(value)}, ${dartString(label)}),`;
    }),
    '  ;',
    '',
    `  const ${name}(this.value, this.label);`,
    '',
    '  final String value;',
    '  final String label;',
    ...extra,
    '',
    `  /// The ${name} whose API value is [value]; throws [ArgumentError] if unknown.`,
    `  static ${name} fromValue(String value) => values.firstWhere(`,
    '        (item) => item.value == value,',
    `        orElse: () => throw ArgumentError.value(value, 'value', 'Unknown ${name}'),`,
    '      );',
    '}',
  ];
}

export function renderDart(domain: DartDomain): string {
  const transitionEntries = domain.reportStatuses.map((from) => {
    const targets = Object.entries(domain.reportTransitions[from]) as [
      ReportStatus,
      readonly Role[],
    ][];
    if (targets.length === 0) return `  ${statusRef(from)}: {},`;
    return [
      `  ${statusRef(from)}: {`,
      ...targets.map(([to, roles]) => `    ${statusRef(to)}: ${set(roles.map(roleRef))},`),
      '  },',
    ].join('\n');
  });

  const lines = [
    '// GENERATED FILE. DO NOT EDIT.',
    '// Source: packages/shared/src. Regenerate with `pnpm --filter @chucarit/shared gen:dart`.',
    '// ignore_for_file: type=lint',
    '// dart format off',
    '',
    ...renderEnum(
      'ReportStatus',
      'Estado de un reporte.',
      domain.reportStatuses,
      domain.reportStatusLabels,
      ['', '  bool get isFinal => finalReportStatuses.contains(this);'],
    ),
    '',
    ...renderEnum('Role', 'Rol de una cuenta.', domain.roles, domain.roleLabels, [
      '',
      '  bool get isStaff => staffRoles.contains(this);',
    ]),
    '',
    '/// Estados después de los cuales un reporte ya no cambia.',
    `const Set<ReportStatus> finalReportStatuses = ${set(domain.finalReportStatuses.map(statusRef))};`,
    '',
    '/// Estados que se consideran abiertos.',
    `const Set<ReportStatus> openReportStatuses = ${set(domain.openReportStatuses.map(statusRef))};`,
    '',
    '/// Roles que trabajan en el panel.',
    `const Set<Role> staffRoles = ${set(domain.staffRoles.map(roleRef))};`,
    '',
    '/// Transiciones permitidas y qué roles pueden hacer cada una. El API es la autoridad;',
    '/// la app solo la usa para decidir qué acciones mostrar.',
    'const Map<ReportStatus, Map<ReportStatus, Set<Role>>> reportTransitions = {',
    ...transitionEntries,
    '};',
    '',
    '/// Whether [role] may move a report from [from] to [to].',
    'bool canTransition(ReportStatus from, ReportStatus to, Role role) =>',
    '    reportTransitions[from]?[to]?.contains(role) ?? false;',
    '',
    '/// Statuses [role] may move a report to from [from], in table order.',
    'List<ReportStatus> allowedTransitions(ReportStatus from, Role role) => [',
    '      for (final entry in (reportTransitions[from] ?? const {}).entries)',
    '        if (entry.value.contains(role)) entry.key,',
    '    ];',
    '',
  ];
  return lines.join('\n');
}
