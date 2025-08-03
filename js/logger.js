/** @typedef {Object} LoggerConfig
 * @property {boolean} enabled - Whether logging is enabled
 */

/** @type {LoggerConfig} */
const loggerConfig = {
    enabled: typeof PRODUCTION_BUILD === 'undefined' || !PRODUCTION_BUILD
};

/**
 * Logger object that provides conditional logging functionality
 */
const logger = {
    /**
     * Sets the logging configuration
     * @param {boolean} enabled - Whether to enable logging
     */
    setEnabled: function(enabled) {
        loggerConfig.enabled = enabled;
    },
    
    /**
     * Logs messages to console if logging is enabled
     * @param {...any} args - Arguments to log
     */
    log: function(...args) {
        if (loggerConfig.enabled) {
            console.log(...args);
        }
    },
    
    /**
     * Logs error messages to console if logging is enabled
     * @param {...any} args - Arguments to log
     */
    error: function(...args) {
        if (loggerConfig.enabled) {
            console.error(...args);
        }
    },
    
    /**
     * Logs warning messages to console if logging is enabled
     * @param {...any} args - Arguments to log
     */
    warn: function(...args) {
        if (loggerConfig.enabled) {
            console.warn(...args);
        }
    },
    
    /**
     * Logs info messages to console if logging is enabled
     * @param {...any} args - Arguments to log
     */
    info: function(...args) {
        if (loggerConfig.enabled) {
            console.info(...args);
        }
    },
    
    /**
     * Logs debug messages to console if logging is enabled
     * @param {...any} args - Arguments to log
     */
    debug: function(...args) {
        if (loggerConfig.enabled) {
            console.debug(...args);
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = logger;
}