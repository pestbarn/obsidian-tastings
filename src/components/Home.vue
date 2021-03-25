<template>
    <transition-group name="slide-fade" appear tag="div" ref="tastings-list">
        <article class="tastings" v-for="tasting in tastings" :key="tasting.date" style="background: white;">
            Tasting! {{ formatDate(tasting.date) }} {{ [...tasting.beers] }}
        </article>
    </transition-group>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import * as config from '/firebase.config'
import '../helpers.js'
const UntappdClient = require('node-untappd')

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
        },
        loadRatings() {
            const env = require('/.env.js')
            const untappd = new UntappdClient()

            untappd.setClientId(env.UNTAPPD_CLIENTID)
            untappd.setClientSecret(env.UNTAPPD_CLIENTSECRET)

            const bID = 4233317

            untappd.beerInfo((err, obj) => {
                const response = obj.response.beer
                console.dir(response)
            }, { BID: bID })
        },
        formatDate(date) {
            const year = parseInt(String(date).slice(0, 4))
            const month = parseInt(String(date).slice(4, 6))
            const day = parseInt(String(date).slice(6, 8))

            return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }
    }
}
</script>
