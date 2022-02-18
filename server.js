const { Server } = require("socket.io");
var SSHClient = require("ssh2").Client;
var utf8 = require("utf8");
const express = require("express");
const path = require("path");
const app = express(),
  bodyParser = require("body-parser");
port = 3080;

// place holder for the data
const users = [];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./dist")));

const io = new Server({ cors: {} });

io.on("connection", (socket) => {
  console.log("connected");
  var ssh = new SSHClient();
  ssh
    .on("ready", function () {
      console.log("SSH COnnected");
      socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
      connected = true;
      ssh.shell(function (err, stream) {
        if (err)
          return socket.emit(
            "data",
            "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n"
          );
        socket.on("data", function (data) {
          stream.write(data);
        });
        stream
          .on("data", function (d) {
            socket.emit("data", utf8.decode(d.toString("binary")));
          })
          .on("close", function () {
            ssh.end();
          });
      });
    })
    .on("close", function () {
      console.log("SSH Closed");
      socket.emit("data", "\r\n*** SSH CONNECTION CLOSED ***\r\n");
    })
    .on("error", function (err) {
      console.log(err);
      socket.emit(
        "data",
        "\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n"
      );
    })
    .connect({
      host: "127.0.0.1",
      port: "22", // Generally 22 but some server have diffrent port for security Reson
      username: "pi", // user name
      password: "pi", // Set password or use PrivateKey
      // privateKey: require("fs").readFileSync("PATH OF KEY ") // <---- Uncomment this if you want to use privateKey ( Example : AWS )
    });

  socket.on("disconnect", function () {
    console.log("Got disconnect!!!!");
    ssh.end()    

  });


});

io.listen(7777);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});



app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
