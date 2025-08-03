/**
 * @typedef {Object} Card
 * @property {string} Name - The name of the card
 * @property {number} MultiverseId - The multiverse ID of the card
 * @property {string} ScryfallId - The Scryfall ID for the card
 * @property {boolean} [isBadCard] - Optional flag indicating if the card has bad artwork
 */

/**
 * @typedef {Object} CardPack
 * @property {number} [Width] - The width of the card image
 * @property {number} [Height] - The height of the card image
 * @property {number} [OffsetX1] - The X1 offset for card cropping
 * @property {number} [OffsetY1] - The Y1 offset for card cropping
 * @property {number} [OffsetX2] - The X2 offset for card cropping
 * @property {number} [OffsetY2] - The Y2 offset for card cropping
 * @property {string} [Blank] - The filename of the blank card image
 * @property {string} Edition - The name of the edition (required)
 * @property {Card[]} Cards - Array of cards in this pack (required)
 */

/**
 * @typedef {Object} Edition
 * @property {string} Edition - The name of the edition
 * @property {string} Filename - The JSON filename for this edition
 * @property {boolean} [Disabled] - Optional flag to disable the edition
 */

/**
 * @typedef {Object} Ranking
 * @property {number} MinScore - The minimum score required for this ranking
 * @property {string} Name - The name of the ranking level
 * @property {string} Description - A description of the ranking level
 */

/**
 * @typedef {Object} GameSystem
 * @property {boolean} ShowBorders - Whether to show card borders
 * @property {number} LastTime - The last recorded time
 * @property {number} Timer - The current timer value
 * @property {number} MaxSeconds - Maximum seconds allowed per guess
 * @property {number} GradeQuestions - Number of questions for grading
 * @property {string} CorrectCard - The name of the correct card
 * @property {number} MultiverseId - The multiverse ID of the current card
 * @property {string} State - The current game state
 * @property {CardPack} [Pack] - The current card pack
 * @property {number} TotalAnswered - Total number of cards answered
 * @property {number} TotalCorrect - Total number of correct answers
 * @property {Edition} [Edition] - The current edition
 */

/**
 * Game states
 * @readonly
 * @enum {string}
 */
const GameStates = {
    STATE_NA: "STATE_NA",
    STATE_LOADINGCARD: "STATE_LOADINGCARD",
    STATE_LOADINGEDITION: "STATE_LOADINGEDITION",
    STATE_WAITFORGUESS: "STATE_WAITFORGUESS",
    STATE_READY: "STATE_READY",
    STATE_GOTONEXTCARD: "STATE_GOTONEXTCARD",
    STATE_SHOWCARD: "STATE_SHOWCARD"
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GameStates
    };

    // Export types for JSDoc
    exports.Card = /** @type {Card} */ ({});
    exports.CardPack = /** @type {CardPack} */ ({});
    exports.Edition = /** @type {Edition} */ ({});
    exports.Ranking = /** @type {Ranking} */ ({});
    exports.GameSystem = /** @type {GameSystem} */ ({});
}