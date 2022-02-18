<template>
   <div>
  <div class="xterm" />
  <button @click="sendCmd">ls -l</button>
  <button @click="sendCmdDetect">Detect</button>
  <button @click="sendCmdKill">Kill</button>
  </div>
</template>
<script>
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { io } from "socket.io-client";
import { useStore } from "vuex";

/*import axios from 'axios'
var axiosInstance = axios.create({
    baseURL: `${location.protocol}//${location.hostname}:3080`,
})
*/
export default {
  data() {
    return {
      hostIP: "",
      store: null,
    };
  },
  created() {
    window.addEventListener(
      "beforeunload",
      function (event) {
        this.socket.emit("end");
        console.log("leaving", event); // logs to my logger
      },
      false
    );
  },
  ready: function () {},
  mounted() {
    this.store = useStore();
    this.store.commit("insertHostIP", `${location.hostname}`);
    console.log(this.store.state.hostIP)
    this.hostIP = this.store.state.hostIP
    console.log(this.hostIP)

    this.$term = new Terminal({ cursorBlink: true });
    this.$fitAddon = new FitAddon();
    this.$term.loadAddon(this.$fitAddon);

    this.$term.open(this.$el);
    this.$fitAddon.fit()
    this.$term.onTitleChange((title) => this.$emit("title-change", title));

    this.socket = io("http://" + this.hostIP + ":7777").connect();

    this.socket.on("connect", () => {
      this.$term.write("\r\n*** Connected to backend***\r\n");
      this.$term.onData((data) => {
        this.socket.emit("data", data);
      });

      this.socket.on("data", (data) => {
        this.$term.write(data);
        if (data.indexOf("pi@pi") >= 0){
          console.log("promt!!!!")
        }
      });

      this.socket.on("disconnect", () => {
        this.$term.write("\r\n*** Disconnected from backend***\r\n");
        console.log("Disconnected");
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
    sendCmd(){
      this.socket.emit("data", "python3 /home/pi/python/tt/yolo/yolo_to_onnx.py -m /home/pi/python/tt/yolo/custom-yolov4-tiny-detector\r\n");
    },
    sendCmdDetect(){
      this.socket.emit("data", "python3 linorobot_ws/src/kidbright_tpu_nanopi/scripts/gpu_detect.py /home/pi/python/tt/yolo yolov4-tiny-288\r\n");
    },
    sendCmdKill(){
      this.socket.emit("data","pkill -9 -f gpu_detect.py")
    }
    
  },
};
</script>
<style scoped>
.xterm {
  height: 100%;
  width: 100%;
}
</style>
