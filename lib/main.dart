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
    return const MaterialApp(home: MyHomePage());
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
      status = 'Wysyłam PING...';
    });

    sendMessage(
      'PING',
      allowInterop((response) {
        if (response == null) {
          setState(() {
            status = 'Brak odpowiedzi z background.js';
          });
          return;
        }

        final message = js_util.getProperty(response, 'message');

        setState(() {
          status = 'Odpowiedź: $message';
        });
      }),
    );
  }

  void getTitle() {
    setState(() {
      status = 'Pobieram tytuł strony...';
    });

    sendMessage(
      'GET_TITLE',
      allowInterop((response) {
        if (response == null) {
          setState(() {
            status = 'Brak odpowiedzi';
          });
          return;
        }

        final title = js_util.getProperty(response, 'title');

        setState(() {
          status = 'Tytuł strony: $title';
        });
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Flutter Extension Test')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(status, textAlign: TextAlign.center),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: pingBackground,
                child: const Text('Wyślij PING do background'),
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: getTitle,
                child: const Text('Pobierz tytuł strony'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}