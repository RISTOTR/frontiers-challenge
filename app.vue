<template>
  <div class="app">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
  background: #f6f7f9;
  color: #1f2933;
}

a {
  color: #2563eb;
  text-decoration: none;
}

a:focus,
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

a:hover {
  text-decoration: underline;
}

button {
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
