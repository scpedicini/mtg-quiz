#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the editions file
const editionsPath = path.join(__dirname, '..', 'js', 'editions.js');
const editionsContent = fs.readFileSync(editionsPath, 'utf8');

// Extract the AvailableEditions array using regex
const editionsMatch = editionsContent.match(/let AvailableEditions = (\[[\s\S]*?\]);/);
if (!editionsMatch) {
    console.error('Could not parse editions.js');
    process.exit(1);
}

// Parse the editions array
const editions = eval(editionsMatch[1]);

// Check all editions (including disabled ones)
editions.forEach(edition => {
    const cardPackPath = path.join(__dirname, '..', 'cards', edition.Filename);
    
    // Clear existing flags
    delete edition.isMissingScryfallIds;
    delete edition.isMissingMultiverseIds;
    
    try {
        let cardPackContent = fs.readFileSync(cardPackPath, 'utf8');
        // Remove BOM if present
        if (cardPackContent.charCodeAt(0) === 0xFEFF) {
            cardPackContent = cardPackContent.slice(1);
        }
        const cardPack = JSON.parse(cardPackContent);
        
        if (!cardPack.Cards || !Array.isArray(cardPack.Cards)) {
            console.error(`❌ ${edition.Edition}: No Cards array found`);
            return;
        }
        
        let missingMultiverse = false;
        let missingScryfall = false;
        
        cardPack.Cards.forEach((card) => {
            if (!card.MultiverseId || card.MultiverseId === 0) {
                missingMultiverse = true;
            }
            if (!card.ScryfallId || card.ScryfallId === '') {
                missingScryfall = true;
            }
        });
        
        // Only add flags if data is missing
        if (missingMultiverse) {
            edition.isMissingMultiverseIds = true;
        }
        if (missingScryfall) {
            edition.isMissingScryfallIds = true;
        }
        
        if (edition.Disabled !== true && (missingMultiverse || missingScryfall)) {
            console.log(`${edition.Edition} is missing data`);
        }
        
    } catch (error) {
        console.error(`❌ ${edition.Edition}: Error reading file - ${error.message}`);
    }
});

// Generate the new editions.js content
let newContent = editionsContent.replace(/let AvailableEditions = \[[\s\S]*?\];/, 
    `let AvailableEditions = ${JSON.stringify(editions, null, 2)};`);

// Write the updated content back to editions.js
fs.writeFileSync(editionsPath, newContent, 'utf8');
console.log('\nUpdated editions.js with missing ID information.');

