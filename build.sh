#!/bin/sh
# Rebuilds index.html (deploy) and site.html (preview) from src/body.html + src/tools/*.html
cd "$(dirname "$0")"
BODY=$(awk '
  /@@DESIGN@@/ {system("cat src/tools/design.html"); next}
  /@@MOTION@@/ {system("cat src/tools/motion.html"); next}
  /@@DEV@@/    {system("cat src/tools/dev.html"); next}
  /@@AI@@/     {system("cat src/tools/ai.html"); next}
  {print}' src/body.html)
FONTS='<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&family=Figtree:wght@300..700&display=swap">'
cat > index.html <<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Behroz Asghar — Strategic &amp; Multidisciplinary Designer</title>
<meta name="description" content="Behroz Asghar is a multidisciplinary designer with 8+ years in brand identity, digital design and motion, now exploring vibe coding and SaaS animation.">
<link rel="canonical" href="https://www.behrozasghar.online/">
<meta name="theme-color" content="#0c0c0d">
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.behrozasghar.online/">
<meta property="og:title" content="Behroz Asghar — Designing Identities. Building Experiences.">
<meta property="og:description" content="Brand identity, digital design, motion and modern creative technology.">
<meta property="og:image" content="https://www.behrozasghar.online/images/behroz-cutout.png">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Behroz Asghar","jobTitle":"Strategic & Multidisciplinary Designer","url":"https://www.behrozasghar.online/","image":"https://www.behrozasghar.online/images/behroz-cutout.png","email":"mailto:behrozasghar7@gmail.com","sameAs":["https://www.linkedin.com/in/behrozasghar/","https://www.behance.net/behrozasghar"]}</script>
$FONTS
<link rel="preload" href="assets/css/style.css" as="style">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
$BODY
<script src="assets/js/main.js" defer></script>
</body>
</html>
HTML
cat > site.html <<HTML
<title>Behroz Asghar</title>
$FONTS
<link rel="stylesheet" href="assets/css/style.css">
$BODY
<script src="assets/js/main.js"></script>
HTML
echo "built index.html + site.html"
