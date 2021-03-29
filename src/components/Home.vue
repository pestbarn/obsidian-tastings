<template>
    <div>
        <article class="tasting tasting-root" v-for="tasting in tastings" :key="tasting.date">
            <h2>
                <router-link :to="{ name: 'tasting', params: { slug: tasting.date }}" @click.native="toTop">
                    {{ tasting.title && tasting.title }}
                </router-link>
                <p>
                    {{ tasting.beers.length - 1 }} beers
                    <time>{{ formatDate(tasting.date) }}</time>
                </p>
            </h2>
        </article>
        <article class="tasting tasting-root" ref="no-tastings" hidden>
            <h2>
                <p><a href="//mattias.pw/#message">Get in touch</a> if you want information about organizing a tasting!</p>
            </h2>
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
        this.toTop()
        this.loadTastings()
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
                const today = new Date()
                const dateString = today.getFullYear() + ('0' + (today.getMonth() + 1)).slice(-2) + ('0' + today.getDate()).slice(-2)

                snap.forEach(tasting => {
                    if (dateString < tasting.val().date) array.push(tasting.val())
                    else return
                })

                if (array.length) array.forEach(val => this.tastings.push(val))
                else this.$findRefByName('no-tastings').hidden = false

                if (!loading.hidden) loading.hidden = true
            })
        },
        formatDate(date) {
            return this.$formatDate(date)
        }
    }
}
</script>
