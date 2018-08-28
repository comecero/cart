// Make a copy of this file and name it account.js, then place custom values to customize the app's behavior.
// At runtime, the account settings will be automatically injected, providing the account info to the app.
window.__settings = window.__settings || {}; window.__settings.account =
    {
        "development": true,
        "account_id": "AA0000",
        "test": true,
        "allow_save_cards": true,
        "global_footer_html": null,
        "currencies": [{ "code": "AUD", "name": "Australian Dollar" }, { "code": "CAD", "name": "Canadian Dollar" }, { "code": "EUR", "name": "Euro" }, { "code": "NZD", "name": "New Zealand Dollar" }, { "code": "GBP", "name": "Pound Sterling" }, { "code": "CHF", "name": "Swiss Franc" }, { "code": "USD", "name": "US Dollar" }],
        "payment_method_types": ["amazon_pay", "credit_card", "paypal"],
        "allow_customer_subscription_cancel": true,
        "company_name": "Kompania",
        "support_website": "https://comecero.com",
        "support_email": "joe@example.com",
        "date_utc": "2018-08-26T00:00:00Z",
        "browser_info": {
            "accept_language": "en-US,en;q=0.9",
            "locale": "en-US",
            "language": "en",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
        }
    };