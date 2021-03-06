﻿<a name="2.2.5"></a>
# 2.2.5

- Add product headline to cart, invoice, review and receipt pages

<a name="2.2.4"></a>
# 2.2.4

- Add option to redirect receipt page to external URL
- Show strike-through pricing based on "compare at" product pricing

<a name="2.2.3"></a>
# 2.2.3

- Add support for graceful handling of inventory controls

<a name="2.2.2"></a>
# 2.2.2

- Bug fix on review screen for PayPal, Amazon Pay payments for invoice payments when determining if the payment can be automatically completed

<a name="2.2.1"></a>
# 2.2.1

- Integrate Kit version 1.0.15

<a name="2.2.0"></a>
# 2.2.0

- Support for up sells in cart, on load or on payment submit
- PayPal and Amazon Pay review screens will be skipped if there is no additional action is review is required by the customer (order total did not change, no shipping methods to select, no required data to provide)
- Integrate Kit version 1.0.14

<a name="2.1.1"></a>
# 2.1.1

- Bug fix in displaying license codes for digital products on receipt page
- Integrate Kit version ﻿1.0.13. See Kit release notes for details.

<a name="2.1.0"></a>
# 2.1.0

- Add support for cross-sells in the cart.
- Integrate Kit version 1.0.12. See Kit release notes for details.

<a name="2.0.0"></a>
# 2.0.0

- Redesigned from the ground up! A fresh new design, including the option for one-column and two-column layouts.
- Integrate Kit version 1.0.10. See Kit release notes for details.

<a name="1.2.1"></a>
# 1.2.1

- Integrate Kit version 1.0.9. See Kit release notes for details.

<a name="1.2.0"></a>
# 1.2.0

- Add support for Amazon Pay
- Add support for Chinese (simplified) language
- Ouput license code instructions if provided with the license
- Integrate Kit version 1.0.8. See Kit release notes for details.

<a name="1.1.1"></a>
# 1.1.1

- Remove third party CDNs and replace with Comecero CDN for static assets
- Add settings to allow users to set the value of the quantity stepper background and text color

<a name="1.1.0"></a>
# 1.1.0

- Add support for the following languages: Czech, German, Greek, Spanish, Finnish, French, Italian, Japanese, Korean, Dutch, Polish, Portuguese, Russian, Swedish
- Add new stepper control for changing the item quantities in the cart
- Add support for a customer that signs into a cart or invoice to pay with a saved Amazon Pay payment method

<a name="1.0.9"></a>
# 1.0.9

- Allow customers that sign into the page to pay with an existing PayPal account if saved as a customer payment method
- Integrate Kit version 1.0.6. See Kit release notes for changes.
- Bug fix that prevents product images from disappearing when a cart, invoice or order is updated or refreshed
- Other minor bug fixes

<a name="1.0.8"></a>
# 1.0.8

- New setting to allow a choice between square or default image shapes for product icons

<a name="1.0.7"></a>
# 1.0.7

- Bug fix when logging out of cart.
- Big fix displaying product images on payment review and receipt page.
- Integrate Kit version 1.0.5. See Kit release notes for changes.

<a name="1.0.6"></a>
# 1.0.6

- Fix bug that prevented cart from loading when a bad coupon code was passed through the URL string.
- Update way that analytics and conversions are loaded to provide more complete data.
- Integrate Kit version 1.0.4. See Kit release notes for changes.

<a name="1.0.5"></a>
# 1.0.5

- Bug fix to prevent "getting license" spinner from appearing when a digital product is not configured to obtain a license.

<a name="1.0.4"></a>
# 1.0.4

- Integrate Kit version 1.0.3. See Kit release notes for changes.
- Add support for PayPal recurring.
- Bug fix for container width in scss variables file.

<a name="1.0.3"></a>
# 1.0.3

- Allow PayPal payments for invoices.

<a name="1.0.2"></a>
# 1.0.2

- Integrate Kit version 1.0.2. See Kit release notes for changes.
- Bug fix: Shipping address name was being set as billing address name.

<a name="1.0.1"></a>
# 1.0.1

- Integration of the latest Kit release (1.0.1) which includes bug fixes
- A new option (under app settings) that allows you to indicate if you want a Continue Shopping button to appear below the cart summary.
- Removal of double global footer

<a name="1.0.0"></a>
# 1.0.0

This is the initial public release of the Comecero Cart application. Cart has been in use in a production environment for quite some time, but this '1.0' release represents the public, open source release of the project, including an MIT license.
