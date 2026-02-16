<script setup>
import { ref, onMounted, computed } from "vue";
import NavBar from '@/components/NavBar.vue'
import { searchQuery } from '@/composables/useSearch';
</script>


<template>
    <NavBar />
    <div>
        <div class="title">
            <h1 class="page-title">About</h1>
        </div>

        <div>
            <h2>Story</h2>
            <p>We are a local and proudly South African fashion focused company focused on bringing afforable fashion to
                the youth of South Africa. Combating the expansive and expensive sector that is fahion.</p>
        </div>

        <div>
            <h2>Mission</h2>
            <p>
                To bring a more affordable,user firendly as well as hassle free thrifting website that is afforable and
                available to all university and college students.
                Allowing a fashion forrward society built for scholars by scholars.Allowing the youth of today to
                express them selves without compromising their wallets and hectic schedules while keeping the quality in
                our catalogue at a high standard.
            </p>
        </div>

        <div>
            <h2>Vision</h2>
            <p>We are planning to scale this website to be accessible to all third level institutes in SouthAfrica and
                scale up as progress goes .As well as add distribution points and authntication for pick ups and deliveries on each institution. </p>
        </div>

        < </div>
</template>

<style></style>