<template>
    <transition name="slide-fade" appear>
        <div class="tasting">
            <div v-if="!$route.params.id">
                <main class="tasting-overview" v-for="tasting in tastings" :key="tasting.date">
                    <router-link :to="{ name: 'tastingUnique', params: { slug: tasting.date, id: '1' }}">
                        {{ tasting }}
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
const UntappdClient = require('node-untappd')

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default {
    name: 'Tasting',
    beforeRouteLeave(to, from, next) {
        console.log(to, from, next)
        // Indicate to the SubComponent that we are leaving the route
        // this.$refs.mySubComponent.prepareToExit()
        // Make sure to always call the next function, otherwise the hook will never be resolved
        // Ref: https://router.vuejs.org/en/advanced/navigation-guards.html
        // next()
    },
    data() {
        return {
            tastings: []
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
                    console.dir(tasting.val())

                    this.tastings.push(tasting.val())
                })

                Promise.all(this.tastings).then(() => {
                    if (!loading.hidden) loading.hidden = true
                })
            })
        },

        loadRatings() {
            const env = require('/.env.js')
            const untappd = new UntappdClient()

            untappd.setClientId(env.UNTAPPD_CLIENTID)
            untappd.setClientSecret(env.UNTAPPD_CLIENTSECRET)

            const bID = this.tastingID

            if (!bID.length) return

            untappd.tastingInfo((err, obj) => {
                const response = obj.response.tasting
                console.dir(response)
            }, { BID: bID })
        }
    }
}
</script>

<style scoped lang="scss">
    .tasting {
        margin: 1.5rem 2.5rem;
        border: 1px solid #1b140d;
        background: #bababa;
        box-shadow: .75rem .75rem 0 0 #1b140d;
        position: relative;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: url('../assets/boxtexture.png') repeat;
            opacity: .5;
            z-index: 0;
        }

        > * {
            position: relative;
            z-index: 1;
        }
    }
</style>
