<template>
  <div class="chat-window">
    <h2>Chat with {{ user.name }}</h2>
    <div class="messages" ref="messages">
      <div class="message" v-for="(message, index) in messages" :key="index">
        <div class="message-meta">
          <div class="message-sender">{{ message.sender }}</div>
          <div class="message-time">{{ message.time }}</div>
        </div>
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>
    <form class="message-input" @submit.prevent="sendMessage">
      <input type="text" v-model="message" placeholder="Type a message...">
      <button type="submit">Send</button>
    </form>
    <div class="call-controls">
      <button class="audio-call-button" @click="startAudioCall">
        <i class="fa fa-phone"></i> Audio Call
      </button>
      <button class="video-call-button" @click="startVideoCall">
        <i class="fa fa-video-camera"></i> Video Call
      </button>
      <button class="hangup-button" @click="stopCall">
        <i class="fa fa-phone-slash"></i> Hang Up
      </button>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import SimplePeer from 'simple-peer';

export default {
  name: 'ChatWindow',
  data() {
    return {
      user: null,
      message: '',
      messages: [],
      socket: null,
      peer: null,
      callType: null,
      localStream: null,
      remoteStream: null,
      peerSignal: null,
    };
  },
  created() {
    const userId = this.$route.params.userId;
    this.user = this.$store.getters.getUserById(userId);
    this.socket = io(process.env.VUE_APP_API_URL);
    this.socket.emit('join', { userId: userId });
    this.socket.on('message', (data) => {
      this.messages.push(data);
      this.scrollMessagesToBottom();
    });
    this.socket.on('call', (data) => {
      if (this.peer) {
        // busy
        this.socket.emit('busy', { from: data.from });
        return;
      }
      this.callType = data.type;
      this.peerSignal = data.signal;
      this.showCallControls();
    });
    this.socket.on('busy', () => {
      this.stopCall();
      alert('User is busy.');
    });
  },
  beforeDestroy() {
    this.socket.emit('leave', { userId: this.user.id });
    this.socket.disconnect();
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
      this.callType = null;
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
      this.remoteStream = null;
      this.hideCallControls();
    }
  },
  methods: {
    sendMessage() {
      if (this.message.trim() !== '') {
        const message = {
          sender: this.$store.state.currentUser.name,
          content: this.message.trim(),
          time: new Date().toLocaleTimeString(),
        };
        this.messages.push(message);
        this.scrollMessagesToBottom();
        this.socket.emit('message', {
          senderId: this.$store.state.currentUser.id,
          receiverId: this.user.id,
          content: message.content,
        });
        this.message = '';
      }
    },
    scrollMessagesToBottom() {
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
    },
    startAudioCall() {
      this.startCall('audio');
    },
    startVideoCall() {
      this.startCall('video');
    },
    startCall(type) {
      this.callType = type;
      navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true })
        .then((stream) => {
          this.localStream = stream;
          this.showCallControls();
          this.peer = new SimplePeer({ initiator: true, stream: stream });
          this.peer.on('signal', (signal) => {
            this.peerSignal = signal;
            this.socket.emit('call', { from: this.$store.state.currentUser.id, to: this.user.id, type: type, signal: signal });
          });
          this.peer.on('stream', (stream) => {
            this.remoteStream = stream;
            this.$refs.remoteVideo.srcObject = stream;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    stopCall() {
      if (this.peer) {
        this.peer.destroy();
        this.peer = null;
        this.callType = null;
        this.localStream.getTracks().forEach((track) => track.stop());
        this.localStream = null;
        this.remoteStream = null;
        this.hideCallControls();
      }
    },
    showCallControls() {
      this.$refs.localVideo.srcObject = this.localStream;
      this.$refs.callControls.style.display = 'flex';
      this.$refs.messages.style.maxHeight = 'calc(100% - 400px - 8em)';
    },
    hideCallControls() {
      this.$refs.localVideo.srcObject = null;
      this.$refs.remoteVideo.srcObject = null;
      this.$refs.callControls.style.display = 'none';
      this.$refs.messages.style.maxHeight = 'calc(100% - 400px - 3em)';
    },
  },
};
</script>

<style scoped>
.chat-window {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  color: #333;
  padding: 1em;
}

.chat-window h2 {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 0.5em;
}

.messages {
  width: 100%;
  height: calc(100% - 250px);
  overflow-y: scroll;
  padding: 0.5em;
  border: 1px solid #ccc;
}

.message {
  margin-bottom: 1em;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-sender {
  font-weight: bold;
}

.message-time {
  font-size: 0.8rem;
}

.message-content {
  margin-top: 0.5em;
}

.message-content img {
  max-width: 100%;
  max-height: 200px;
}

.message-content video {
  max-width: 100%;
}

.message-content .emoji {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: cover;
  background-repeat: no-repeat;
  margin-right: 0.2em;
  vertical-align: middle;
}

.message-content .emoji.emoji-smile {
  background-image: url('/assets/emojis/smile.png');
}

.message-content .emoji.emoji-laugh {
  background-image: url('/assets/emojis/laugh.png');
}

.message-content .emoji.emoji-cry {
  background-image: url('/assets/emojis/cry.png');
}

.message-content .emoji.emoji-heart {
  background-image: url('/assets/emojis/heart.png');
}

.message-input {
  display: flex;
  margin-bottom: 1em;
}

.message-input input[type="text"] {
  flex-grow: 1;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 0.5em;
}

.message-input button[type="submit"] {
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  cursor: pointer;
}

.call-controls {
  margin-top: 1em;
}

.call-controls button {
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  margin-right: 0.5em;
  cursor: pointer;
}

.local-video,
.remote-video {
  width: 200px;
  height: 150px;
  margin-top: 1em;
}
</style>
