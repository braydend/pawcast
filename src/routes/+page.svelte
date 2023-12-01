<main class="container">
    <section>Hourly forecast</section>
    <section>At-a-glance day rating</section>
    <section class="recommendations">Recommendations</section>
</main>

<style>
    .container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1rem;
    }

    section {
        border: 1px solid black;
    }

    .recommendations {
        grid-column: 1 / span 2;
    }
</style>
