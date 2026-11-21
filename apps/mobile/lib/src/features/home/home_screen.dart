import 'package:flutter/material.dart';

import '../../shared/domain.g.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Chucarit')),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          Text(
            'Reporta lo que hay que arreglar',
            style: textTheme.headlineMedium,
          ),
          const SizedBox(height: 12),
          Text(
            'Baches, alumbrado, drenajes o fugas: avísanos y sigue cómo se atiende tu reporte.',
            style: textTheme.bodyLarge,
          ),
          const SizedBox(height: 24),
          Semantics(
            header: true,
            child: Text('Así avanza un reporte', style: textTheme.titleLarge),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final status in ReportStatus.values)
                Chip(key: ValueKey(status), label: Text(status.label)),
            ],
          ),
        ],
      ),
    );
  }
}
