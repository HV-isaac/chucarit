import 'package:go_router/go_router.dart';

import 'features/home/home_screen.dart';

/// App routes. New screens are added here as features land (auth, report flow, detail).
final router = GoRouter(
  routes: [GoRoute(path: '/', builder: (context, state) => const HomeScreen())],
);
