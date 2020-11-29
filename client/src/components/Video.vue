<template>
    <section class="video">
        <h2>{{video.name}}</h2>
        
        <div v-if="linkCreated">
            <router-link class="video__room-link" :to="'/watch-party/'+link">{{baseURL}}watch-party/{{link}}</router-link>
            <p class="video__room-data video__room-access-key">Accesskey: {{accessKey}}</p>
            <p class="video__room-data">Room Id: {{link}}</p>
        </div>

        <button class="btn" v-else @click="openRoom">open Room</button>
    </section>
</template>

<script>
import axios from '@/axios'
export default {
    props: {
        video:{
            type: Object,
            default: () => ({
                name: "",
                path: "",
                type: ""
            })
        }
    },
    mounted() {
        this.baseURL = process.env.VUE_APP_BASEURL
    },
    data() {
        return {
            linkCreated: false,
            link: "",
            accessKey: "",
            baseURL: process.env.VUE_APP_BASEURL
        }
    },
    methods: {
        openRoom() {
            axios.post('api/create-room', { filePath: this.video.path, fileType: this.video.type, name: this.video.name }).then(({data}) => {
                this.linkCreated = true
                this.link = data.link
                this.accessKey = data.accessKey
            })
        }
    }
}
</script>

<style >
.video {
    max-width: 400px;
    box-shadow: 0 0 9px 0 #919fd0;
    padding: 16px;
    background: #85c7ff;
    border-radius: 10px;
}
.video__room-data {
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
}
.video__room-access-key {
    font-size: 20px;
    display: block;
    background: white;
    padding: 10px;
}
.video__room-link {
    color: black;
    background: white;
    font-size: 20px;
    font-weight: bold;
    padding: 17px;
    display: inline-block;
}
</style>