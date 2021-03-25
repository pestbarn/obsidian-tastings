<template>
    <div>
        <p>Test!</p>
        <article class="tasting" v-for="tasting in tastings" :key="tasting">
            Tasting! {{ tasting }}
        </article>
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import * as config from '/firebase.config'
import '../helpers.js'

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default {
    name: 'Home',
    data() {
        return {
            tastings: [],
        }
    },
    mounted() {
        this.loadTastings()
        this.toTop()
    },
    methods: {
        toTop() {
            window.scrollTo(0, 0)
        },
        loadTastings() {
            let loading = this.$findRefByName('loading')

            const db = firebase.database()

            db.ref('/').once('value').then(snap => {
                const array = []

                snap.forEach(tasting => {
                    array.push(tasting.val())
                })

                array.forEach(val => this.tastings.push(val))

                if (!loading.hidden) loading.hidden = true
            })
        }
    }
}
</script>
