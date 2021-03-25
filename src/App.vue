<template>
    <div>
        <header>
            <router-link to="/">
                <img src="assets/logotype.svg" class="logotype">
            </router-link>
        </header>

        <img src="assets/loading.svg" id="loading" ref="loading">

        <div class="main" ref="main">
            <keep-alive>
                <router-view :key="$route.params.slug" ref="routerView"></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import 'prefixfree'

export default {
    name: 'App',
    data() {
        return {}
    }
}
</script>
