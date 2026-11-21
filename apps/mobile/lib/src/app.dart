import 'package:flutter/material.dart';

import 'router.dart';

class ChucaritApp extends StatelessWidget {
  const ChucaritApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Chucarit',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1F7A4D)),
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1F7A4D),
          brightness: Brightness.dark,
        ),
      ),
      routerConfig: router,
    );
  }
}
