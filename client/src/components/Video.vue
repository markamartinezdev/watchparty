<template>
    <section>
        <h2>{{video.name}}</h2>
        
        <button @click="openRoom">open Room</button>

        <div v-if="link.length">
            <router-link :to="'/watch-party/'+link">watch.pingadulce.com/{{link}}</router-link>
            <p>Accesskey: {{accessKey}}</p>
        </div>
    </section>
</template>

<script>
import axios from 'axios'
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
    data() {
        return {
            linkCreated: false,
            link: "",
            accessKey: ""
        }
    },
    methods: {
        openRoom() {
            axios.post('/create-room', { filePath: this.video.path, fileType: this.video.type, name: this.video.name }).then(({data}) => {
                this.linkCreated = true
                this.link = data.link
                this.accessKey = data.accessKey
            })
        }
    }
}
</script>