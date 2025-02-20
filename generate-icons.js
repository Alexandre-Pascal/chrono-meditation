const fs = require('fs');
const { createCanvas } = require('canvas');

// Fonction pour créer une image simple
function createImage(width, height, filename, color = '#4CAF50') {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fond
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    // Cercle au centre
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width / 3, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Sauvegarde
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
}

// Créer le dossier assets s'il n'existe pas
if (!fs.existsSync('./app/assets')) {
    fs.mkdirSync('./app/assets', { recursive: true });
}

// Générer les icônes
createImage(1024, 1024, './app/assets/icon.png');
createImage(1024, 1024, './app/assets/adaptive-icon.png');
createImage(1242, 2436, './app/assets/splash.png', '#FFFFFF'); 