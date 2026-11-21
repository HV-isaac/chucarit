import { REPORT_STATUS_LABELS, REPORT_STATUSES } from '@chucarit/shared';

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Panel de Chucarit</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Aquí se validarán, asignarán y resolverán los reportes de la comunidad.
      </p>
      <section aria-labelledby="statuses-title" className="flex flex-col gap-3">
        <h2 id="statuses-title" className="text-lg font-medium">
          Estados de un reporte
        </h2>
        <ul className="flex flex-wrap gap-2">
          {REPORT_STATUSES.map((status) => (
            <li
              key={status}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm dark:border-zinc-800"
            >
              {REPORT_STATUS_LABELS[status]}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
