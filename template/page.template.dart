import 'package:flutter/material.dart';

class {{className}} extends StatelessWidget {
  const {{className}}({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('{{titleName}}'),
      ),
      body: const Center(
        child: Text('Bienvenue sur {{titleName}} !'),
      ),
    );
  }
}