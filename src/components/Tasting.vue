<template>
    <transition name="slide-fade" appear>
        <div class="tasting">
            <div v-if="!$route.params.id">
                <main class="tasting-overview" v-for="tasting in tastings" :key="tasting.date">
                    <h2>{{ tasting.title }}</h2>

                    <ul v-for="(beer, i) in tasting.beers" :key="i">
                        <li v-if="beerName[i]">
                            <strong>{{ breweryName[i] }} - {{ beerName[i] }}</strong>
                            <p>({{ beerStyle[i] }})</p>
                        </li>
                    </ul>

                    <router-link :to="{ name: 'tastingUnique', params: { slug: tasting.date, id: '1' }}">
                        Begin
                    </router-link>
                </main>
            </div>

            <div v-else>
                <article class="tasting-detailed-view" v-if="$route.params.slug">
                    {{ $route.params }}
                </article>
            </div>
        </div>
    </transition>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import * as config from '/firebase.config'
import '../helpers.js'
import '../tasting.scss'
const UntappdClient = require('node-untappd')

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default {
    name: 'Tasting',
    data() {
        return {
            tastings: [],
            beers: [],
            beerName: [],
            breweryName: [],
            beerStyle: []
        }
    },
    beforeMount() {
        this.loadtasting(this.$route.params.slug)
    },
    methods: {
        loadtasting(slug) {
            let loading = this.$findRefByName('loading')

            if (loading.hidden) loading.hidden = false

            firebase.database().ref('/').once('value').then(snap => {
                snap.forEach(tasting => {
                    const date = tasting.val().date
                    if (date !== parseInt(slug)) return

                    this.tastings.push(tasting.val())
                    this.beers = tasting.val().beers.filter(Boolean)
                })

                Promise.all(this.tastings).then(() => {
                    if (!loading.hidden) loading.hidden = true
                })

                this.loadUntappd()
            })
        },

        loadUntappd() {
            const env = require('/.env.js')
            const untappd = new UntappdClient()

            untappd.setClientId(env.UNTAPPD_CLIENTID)
            untappd.setClientSecret(env.UNTAPPD_CLIENTSECRET)

            console.dir(this.beers)

            this.beers.forEach(beer => {
                untappd.beerInfo((err, obj) => {
                    const res = obj.response.beer
                    console.dir(res)
                    /*
                        beer_style
                        brewery.brewery_name
                    */

                    this.beerName.push(res.beer_name)
                    this.breweryName.push(res.brewery.brewery_name)
                    this.beerStyle.push(res.beer_style)
                }, { BID: beer })
            })
        }
    }
}
</script>
