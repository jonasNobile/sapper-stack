<script>
    import Seo from 'components/Seo.svelte'
</script>

<style lang="scss">
    @import './_index.scss';
</style>

<Seo
    openGraph="{{ title: 'Open Graph Article Title', description: 'Description of open graph article', type: 'article', url: 'https://www.example.com/articles/article-title', article: { publishedTime: '2020-08-03T17:31:37Z', modifiedTime: '2020-08-20T09:31:37Z', expirationTime: '2025-12-21T17:31:37Z', section: 'Section II', authors: ['https://www.example.com/authors/@firstnameA-lastnameA', 'https://www.example.com/authors/@firstnameB-lastnameB'], tags: ['Tag A', 'Tag B', 'Tag C'] }, images: [{ url: 'https://www.example.com/images/cover.jpg', width: 850, height: 650, alt: 'Og Image Alt' }] }}"
/>

<h1>Great success!</h1>

<figure>
    <img alt="Success Kid" src="successkid.jpg" />
    <figcaption>Have fun with Sapper!</figcaption>
</figure>

<p>
    <strong>
        Try editing this file (src/routes/index.svelte) to test live reloading.
    </strong>
</p>
