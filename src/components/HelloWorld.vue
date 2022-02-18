<template>
  <div class="xterm" />
</template>
<script>
import "xterm/dist/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { io } from 'socket.io-client';

export default {
  mounted() {
    this.$term = new Terminal({ cursorBlink: true });
    this.$fitAddon = new FitAddon();
    this.$term.loadAddon(this.$fitAddon);

    this.$term.open(this.$el);
    //this.$fitAddon.fit()
    this.$term.onTitleChange((title) => this.$emit("title-change", title));

    const socket = io("http://192.168.68.15:7777").connect();
    

    socket.on("connect", () => {

      this.$term.write("\r\n*** Connected to backend***\r\n");
      this.$term.onData((data) => {
        socket.emit("data", data);
      });

      socket.on("data", (data) => {
        this.$term.write(data);
      });

      socket.on("disconnect", () => {
        this.$term.write("\r\n*** Disconnected from backend***\r\n");
      });
    });
  },

  methods: {
    fit() {
      this.$fitAddon.fit();
    },
    focus() {
      this.$term.focus();
    },
    blur() {
      this.$term.blur();
    },
    paste(data) {
      this.$term.paste(data);
    },
  },
};
</script>
<style scoped>
.xterm {
  height: 100%;
  width: 100%;
}
</style>
