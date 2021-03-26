<template>
    <transition-group name="slide-fade" appear tag="div" ref="tastings-list">
        <article class="tastings" v-for="tasting in tastings" :key="tasting.date" style="background: white;">
            <router-link :to="{ name: 'tasting', params: { slug: tasting.date }}" @click.native="toTop">
                {{ tasting.title && tasting.title }} {{ formatDate(tasting.date) }}
            </router-link>
        </article>
    </transition-group>
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
                console.dir(snap)

                snap.forEach(tasting => {
                    array.push(tasting.val())
                })

                array.forEach(val => this.tastings.push(val))

                if (!loading.hidden) loading.hidden = true
            })
        },
        formatDate(date) {
            return this.$formatDate(date)
        }
    }
}
</script>
