<script>
    import Nav from '../components/Nav.svelte'

    export let segment
</script>

<style lang="scss" global>
    @import '../style/global.scss';
</style>

<Nav segment="segment" />
<main>
    <slot />
</main>
