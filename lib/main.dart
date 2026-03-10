import 'package:flutter/material.dart';
import 'package:js/js.dart';
import 'dart:js_util' as js_util;

@JS('chrome.runtime.sendMessage')
external void sendMessage(Object message, Function callback);

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String status = 'Jeszcze nic nie przyszło';

  void pingBackground() {
    setState(() {
      status = 'Wysyłam wiadomość...';
    });

    sendMessage(
      {'type': 'PING'},
      allowInterop((response) {
        final ok = js_util.getProperty(response, 'ok');
        final message = js_util.getProperty(response, 'message');
        final time = js_util.getProperty(response, 'time');

        setState(() {
          status = 'ok=$ok, message=$message, time=$time';
        });
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Flutter Extension Test'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                status,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 18),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: pingBackground,
                child: const Text('Wyślij PING do background'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}