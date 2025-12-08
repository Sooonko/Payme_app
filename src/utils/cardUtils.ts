// Card utility functions for validation and type detection

export type CardType = 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER' | 'UNKNOWN';

/**
 * Detect card type from card number
 */
export const detectCardType = (cardNumber: string): CardType => {
    const cleaned = cardNumber.replace(/\s/g, '');

    // Visa: starts with 4
    if (/^4/.test(cleaned)) {
        return 'VISA';
    }

    // Mastercard: starts with 51-55 or 2221-2720
    if (/^5[1-5]/.test(cleaned) || /^2(22[1-9]|2[3-9]\d|[3-6]\d{2}|7[01]\d|720)/.test(cleaned)) {
        return 'MASTERCARD';
    }

    // American Express: starts with 34 or 37
    if (/^3[47]/.test(cleaned)) {
        return 'AMEX';
    }

    // Discover: starts with 6011, 622126-622925, 644-649, or 65
    if (/^6011|^622(12[6-9]|1[3-9]\d|[2-8]\d{2}|9[01]\d|92[0-5])|^64[4-9]|^65/.test(cleaned)) {
        return 'DISCOVER';
    }

    return 'UNKNOWN';
};

/**
 * Validate card number using Luhn algorithm
 */
export const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');

    // Must be digits only
    if (!/^\d+$/.test(cleaned)) {
        return false;
    }

    // Must be 13-19 digits
    if (cleaned.length < 13 || cleaned.length > 19) {
        return false;
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

/**
 * Validate expiry date
 */
export const validateExpiryDate = (month: number, year: number): boolean => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-indexed

    // Check valid month
    if (month < 1 || month > 12) {
        return false;
    }

    // Check if expired
    if (year < currentYear) {
        return false;
    }

    if (year === currentYear && month < currentMonth) {
        return false;
    }

    return true;
};

/**
 * Generate mock card token for development
 * TODO: Replace with real payment gateway tokenization
 */
export const generateMockCardToken = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);

    // Mock token format: tok_dev_[last4]_[timestamp]_[random]
    const last4 = cleaned.slice(-4);
    return `tok_dev_${last4}_${timestamp}_${random}`;
};

/**
 * Get last 4 digits of card number
 */
export const getCardLast4 = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.slice(-4);
};

/**
 * Format card number with spaces
 */
export const formatCardNumber = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
};
