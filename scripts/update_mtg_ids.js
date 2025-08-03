#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

// Command-line arguments
const args = process.argv.slice(2);

if (args.length !== 3) {
    console.error('Usage: node update_mtg_ids.js <mtgjson-path> <editions-file> <cards-directory>');
    console.error('Example: node update_mtg_ids.js /Volumes/other/Corpus/MTG/AllSetFiles js/editions.js ./cards');
    process.exit(1);
}

const [mtgjsonPath, editionsFile, cardsDir] = args;

// Cache file for edition mappings
const CACHE_FILE = path.join(process.cwd(), 'MTGJSON_Edition_To_File.json');

// Build mapping of edition names to MTGJSON filenames by scanning the directory
async function buildEditionMapping() {
    console.log('Building MTGJSON edition mapping...');
    const mapping = {};
    
    try {
        const files = await readdir(mtgjsonPath);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        console.log(`Found ${jsonFiles.length} JSON files in MTGJSON directory`);
        
        for (const file of jsonFiles) {
            try {
                const filePath = path.join(mtgjsonPath, file);
                const content = await readFile(filePath, 'utf8');
                const data = JSON.parse(content);
                
                if (data.data && data.data.name) {
                    mapping[data.data.name] = file;
                    process.stdout.write('.');
                }
            } catch (error) {
                // Skip files that can't be parsed
                console.error(`\nWarning: Could not parse ${file}: ${error.message}`);
            }
        }
        
        console.log('\n');
        
        // Save the mapping to cache file
        await writeFile(CACHE_FILE, JSON.stringify(mapping, null, 2));
        console.log(`Saved mapping to ${CACHE_FILE} with ${Object.keys(mapping).length} entries`);
        
        return mapping;
    } catch (error) {
        console.error('Error building edition mapping:', error.message);
        process.exit(1);
    }
}

// Load or build the edition mapping
async function getEditionMapping() {
    try {
        // Try to load from cache first
        const cacheContent = await readFile(CACHE_FILE, 'utf8');
        console.log('Loaded edition mapping from cache');
        return JSON.parse(cacheContent);
    } catch (error) {
        // Cache doesn't exist, build it
        return await buildEditionMapping();
    }
}

// Progress tracking
let currentEdition = '';
let totalEditions = 0;
let processedEditions = 0;

// CLI progress indicator using simple console output
function showProgress(message) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`[${processedEditions}/${totalEditions}] ${message}`);
}

// Load editions from the editions.js file
async function loadEditions() {
    try {
        const editionsContent = await readFile(editionsFile, 'utf8');
        // Extract the AvailableEditions array from the file
        const match = editionsContent.match(/let\s+AvailableEditions\s*=\s*(\[[\s\S]*?\]);/);
        if (!match) {
            throw new Error('Could not find AvailableEditions in editions.js');
        }
        // Use eval to parse the JavaScript array - normally dangerous but we control this file
        const editions = eval(match[1]);
        return editions.filter(e => !e.Disabled);
    } catch (error) {
        console.error('Error loading editions:', error.message);
        process.exit(1);
    }
}

// Load MTGJSON data for a specific edition
async function loadMTGJSON(filename) {
    try {
        const filePath = path.join(mtgjsonPath, filename);
        const content = await readFile(filePath, 'utf8');
        const data = JSON.parse(content);
        return data.data;
    } catch (error) {
        // Some sets might not exist in MTGJSON
        return null;
    }
}

// Load card pack data
async function loadCardPack(filename) {
    try {
        const filePath = path.join(cardsDir, filename);
        const content = await readFile(filePath, 'utf8');
        // Remove BOM if present
        const cleanContent = content.replace(/^\uFEFF/, '');
        return JSON.parse(cleanContent);
    } catch (error) {
        console.error(`Error loading card pack ${filename}:`, error.message);
        return null;
    }
}

// Save card pack data
async function saveCardPack(filename, data) {
    try {
        const filePath = path.join(cardsDir, filename);
        // Add BOM to match existing files
        const content = '\ufeff' + JSON.stringify(data, null, 4);
        await writeFile(filePath, content, 'utf8');
    } catch (error) {
        console.error(`Error saving card pack ${filename}:`, error.message);
    }
}

// Update cards in a pack based on MTGJSON data
function updateCards(cardPack, mtgjsonData) {
    const mtgCards = mtgjsonData.cards;
    const cardsByName = new Map();
    
    // Build a map of cards from MTGJSON
    for (const card of mtgCards) {
        // Skip cards without multiverse ID
        if (!card.identifiers || !card.identifiers.multiverseId) {
            continue;
        }
        
        // Use the first printing with a multiverse ID
        if (!cardsByName.has(card.name)) {
            cardsByName.set(card.name, {
                Name: card.name,
                MultiverseId: parseInt(card.identifiers.multiverseId),
                ScryfallId: card.identifiers.scryfallId || ''
            });
        }
    }
    
    // Update existing cards and track which ones to keep
    const updatedCards = [];
    const stats = { updated: 0, added: 0, removed: 0 };
    
    // Update existing cards
    for (const existingCard of cardPack.Cards) {
        const mtgCard = cardsByName.get(existingCard.Name);
        if (mtgCard) {
            // Update the card with new IDs
            const updatedCard = {
                Name: existingCard.Name,
                MultiverseId: mtgCard.MultiverseId,
                ScryfallId: mtgCard.ScryfallId
            };
            // Preserve isBadCard flag if it exists
            if (existingCard.isBadCard) {
                updatedCard.isBadCard = true;
            }
            updatedCards.push(updatedCard);
            cardsByName.delete(existingCard.Name); // Mark as processed
            stats.updated++;
        } else {
            // Card not found in MTGJSON - remove it
            stats.removed++;
        }
    }
    
    // Add new cards from MTGJSON
    for (const [name, card] of cardsByName) {
        updatedCards.push(card);
        stats.added++;
    }
    
    // Sort cards by name for consistency
    updatedCards.sort((a, b) => a.Name.localeCompare(b.Name));
    
    return { cards: updatedCards, stats };
}

// Main processing function
async function main() {
    // Get edition mapping first
    const editionMapping = await getEditionMapping();
    
    console.log('Loading editions...');
    const editions = await loadEditions();
    totalEditions = editions.length;
    
    console.log(`Found ${totalEditions} enabled editions to process`);
    console.log('');
    
    let totalStats = { updated: 0, added: 0, removed: 0 };
    
    for (const edition of editions) {
        currentEdition = edition.Edition;
        processedEditions++;
        
        showProgress(`Processing ${currentEdition}...`);
        
        const mtgjsonFilename = editionMapping[edition.Edition];
        if (!mtgjsonFilename) {
            showProgress(`Warning: No MTGJSON mapping for ${currentEdition}`);
            console.log('');
            continue;
        }
        
        // Load MTGJSON data
        const mtgjsonData = await loadMTGJSON(mtgjsonFilename);
        if (!mtgjsonData) {
            showProgress(`Warning: No MTGJSON data found for ${currentEdition} (${mtgjsonFilename})`);
            console.log('');
            continue;
        }
        
        // Load existing card pack
        const cardPack = await loadCardPack(edition.Filename);
        if (!cardPack) {
            showProgress(`Error: Could not load card pack for ${currentEdition}`);
            console.log('');
            continue;
        }
        
        // Update cards
        const { cards, stats } = updateCards(cardPack, mtgjsonData);
        cardPack.Cards = cards;
        
        // Save updated card pack
        await saveCardPack(edition.Filename, cardPack);
        
        totalStats.updated += stats.updated;
        totalStats.added += stats.added;
        totalStats.removed += stats.removed;
        
        showProgress(`✓ ${currentEdition}: ${stats.updated} updated, ${stats.added} added, ${stats.removed} removed`);
        console.log('');
    }
    
    console.log('');
    console.log('=== Summary ===');
    console.log(`Total editions processed: ${processedEditions}`);
    console.log(`Total cards updated: ${totalStats.updated}`);
    console.log(`Total cards added: ${totalStats.added}`);
    console.log(`Total cards removed: ${totalStats.removed}`);
}

// Run the script
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});