<script>
    import Nav from '../components/Nav.svelte'
</script>

<style lang="scss" global>
    @import 'reset-css/sass/reset';
    @import '../style/global.scss';
</style>

<Nav segment="segment" />
<main>
    <slot />
</main>
