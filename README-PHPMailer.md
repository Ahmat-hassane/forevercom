# Configuration PHPMailer

## Installation

### Option 1: Avec Composer (Recommandé)
\`\`\`bash
composer install
\`\`\`

### Option 2: Installation manuelle
1. Téléchargez PHPMailer depuis https://github.com/PHPMailer/PHPMailer
2. Décompressez dans un dossier `PHPMailer/`
3. Décommentez les lignes d'inclusion manuelle dans contact.php

## Configuration SMTP

Modifiez les paramètres dans `contact.php` :

\`\`\`php
$config = [
    'smtp_host' => 'smtp.gmail.com', // Votre serveur SMTP
    'smtp_port' => 587,
    'smtp_username' => 'votre-email@gmail.com',
    'smtp_password' => 'votre-mot-de-passe-app',
    'from_email' => 'noreply@agence-creative.fr',
    'to_email' => 'contact@agence-creative.fr'
];
\`\`\`

## Serveurs SMTP populaires

### Gmail
- Host: smtp.gmail.com
- Port: 587
- Sécurité: STARTTLS
- Note: Utilisez un mot de passe d'application

### OVH
- Host: ssl0.ovh.net
- Port: 587
- Sécurité: STARTTLS

### Hostinger
- Host: smtp.hostinger.com
- Port: 587
- Sécurité: STARTTLS
