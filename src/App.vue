<template>
    <div id="app">
        <header>
            <ObsidianLogo></ObsidianLogo>
            <router-link to="/">
                <img src="assets/logotype.svg" class="logotype">
            </router-link>

            <footer>
                <ul>
                    <li>
                        <a href="https://github.com/pestbarn/obsidian">
                            github
                        </a>
                    </li>
                    <li>
                        <a href="https://untappd.com/ObsidianCraftBrewery">
                            untappd
                        </a>
                    </li>
                </ul>
            </footer>
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
import ObsidianLogo from './components/ObsidianLogo.vue'
import 'prefixfree'

export default {
    name: 'App',
    components: {
        ObsidianLogo
    }
}
</script>
