// This is a shim for the account settings. When the app is run in the hosted environment, the values in this file will reflect the values from the account in which the app is running.
window.__settings = window.__settings || {};
window.__settings.account = {
    "account_id": "KO0000",
    "test": true,
    "allow_save_cards": true,
    "global_footer_html": "<a href='https://comecero.com' target='_blank'>Comecero, LLC</a> is the authorized reseller of the products and services in your order.",
    "currencies": [
        { "code": "AUD", "name": "Australian Dollar" },
        { "code": "CAD", "name": "Canadian Dollar" },
        { "code": "EUR", "name": "Euro" },
        { "code": "NZD", "name": "New Zealand Dollar" },
        { "code": "GBP", "name": "Pound Sterling" },
        { "code": "CHF", "name": "Swiss Franc" },
        { "code": "USD", "name": "US Dollar" },
        { "code": "JPY", "name": "Yen" }
    ],
    "payment_method_types": ["credit_card", "amazon_pay"],
    "card_types": [
        "Visa",
        "MasterCard",
        "American Express",
        "JCB",
        "Diners Club",
        "Discover"
    ],
    "date_utc": "2018-02-15T00:00:00Z",
    "browser_info": {
        "accept_language": "en-US,en;q=0.9,es-MX;q=0.8,es;q=0.7,fr-CA;q=0.6,fr;q=0.5",
        "locale": "en-US",
        "language": "en",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
    }
}

