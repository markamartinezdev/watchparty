<template>
    <section>
        <h2>{{video.name}}</h2>
        
        <button @click="openRoom">open Room</button>

        <div v-if="link.length">
            <router-link :to="'/watch-party/'+link">{{baseURL}}watch-party/{{link}}</router-link>
            <p>Accesskey: {{accessKey}}</p>
        </div>
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