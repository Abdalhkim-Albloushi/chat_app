import 'dart:developer';

import 'package:flutter/material.dart';


import 'package:socket_io_client/socket_io_client.dart' as IO;

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  @override
  void initState() {
    super.initState();
    initializeSocket();
  }
 late IO.Socket socket;
  void initializeSocket() {
    try {
      socket = IO.io("http://127.0.0.1:3000", <String, dynamic>{
        'autoConnect': false,
        'transports': ['websocket'],
      });
      socket.connect();
      socket.onConnect((_) {
        log('Connection established');
      });
    

      socket.onDisconnect((_) => log('Connection Disconnection'));
      socket.onConnectError((err) => log(err.toString()));
      socket.onError((err) => log(err.toString()));

      log("-----------------");
    } catch (e) {
      log('disconnect---------->$e');
    }
  }

  // Send Location to Server
  sendLocation(Map<String, dynamic> data) {
    socket.emit("location", data);
  }

  // Listen to Location updates of connected users from server
  handleLocationListen(data) async {
    print(data);
  }

  // Send update of user's typing status
  sendTyping(bool typing) {
    socket.emit("typing", {
      "id": socket.id,
      "typing": typing,
    });
  }

  // Listen to update of typing status from connected users
  void handleTyping(data) {
    print(data);
  }

  // Send a Message to the server
  sendMessage(String message) {
    socket.emit(
      "message",
      {
        "id": socket.id,
        "message": message, // Message to be sent
        "timestamp": DateTime.now().millisecondsSinceEpoch,
      },
    );
  }

  void handleMessage(data) {
    print(data);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            TextButton(
              child: Text('_counter'),
              onPressed: () => sendTyping(true),
            ),
          ],
        ),
      ),
    );
  }
}
