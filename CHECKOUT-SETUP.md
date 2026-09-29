# Repository packaging

The public Rylami files are at the repository root and resources/. Shared private PHP source is preserved under checkout-setup/private-app/ with .txt appended so deployment to the public website cannot execute it. Install those files without the .txt suffix in the private server directory specified below. The database migration is checkout-setup/migration.sql. Beacon wrappers remain in the original setup package. No credentials or purchased PDFs are included. This commit does not install the private application or apply database changes. Rylami return/download URLs in the supplied package use HTTPS; HTTP-only hosting has not been tested with this package.

# Rylami / Beacon shared checkout — sandbox installation

Prepared for the existing PHP + MySQL server. Not installed or live-tested.
Between Two Homes is $17.99 USD (1799 cents). No approved price was provided for
Two Homes, One Heart, so new checkout attempts for that product are disabled.
Its existing test downloads are retained.

## Before installing

- Back up the existing four PHP files and `resource_orders` database table.
- Keep the existing Square environment set to `sandbox`. This package does not
  change credentials or switch the account to production.
- Confirm valid HTTPS certificates for both `rylami.com` and
  `www.beaconofhopenc.com`, and PHP 7.3+ with PDO MySQL and cURL.
- Confirm the PHP processes for both websites can read the existing private
  configuration files and product directory. Same server alone does not grant
  cross-account file permissions; do not make secrets publicly readable.
- This package uses the existing table/columns visible in the supplied code.
  It cannot verify your real schema. Use a test copy before changing the table.
- Select the final purchased PDF. The supplied catalog serves one PDF for
  Between Two Homes; it does not assemble a multi-file bundle. Sandbox can use
  the current test PDF. Replace it with the approved final deliverable before launch.

## Install on the server

1. Place the CONTENTS of `private-app` in the private directory
   `/home/nhnqsp8jasbe/bohc-resource-app/`, outside all public website roots.
   Restrict write access to the server owner and permit the website PHP process
   to read it.
2. Apply `migration.sql` ONCE to the database in `bohc-db-config.php`.
   Existing orders default to storefront `beacon`. If `storefront` already exists,
   stop and inspect its definition instead of running this SQL again.
3. Run the private `create-download-secret.php` once with server PHP. It creates
   `/home/nhnqsp8jasbe/bohc-download-secret.php` without printing the secret.
   Keep this file private, backed up, and unchanged across retries.
4. Copy the `beacon/resources` wrapper files into Beacon's public `resources`
   folder, replacing the backed-up versions. Copy `rylami/resources` into
   Rylami's public `resources` folder. Copy `rylami/checkout.html` to Rylami's root.
   Do not link this test checkout from the public product page yet.
5. Keep the existing configured Square webhook endpoint and signature key.
   If it currently points to `https://teamcasparius.com/BoHC/resources/square-webhook.php`,
   install the Beacon `square-webhook.php` wrapper at that endpoint too. Do not
   change the webhook URL casually: the exact URL is part of signature validation.
   Legacy test emails and redirects also require the old purchase-complete and
   download wrappers at their existing teamcasparius paths.
6. Update Beacon's HTML to show $17.99 and its `data-price` values to `17.99` for
   Between Two Homes. Remove/disable the second product's purchase checkbox until
   a price is approved. Check `resources-store.js` for hardcoded prices and
   integer rounding. The server always uses 1799 cents regardless of HTML.

## Sandbox acceptance checks

- Begin at `https://rylami.com/checkout.html`. Use a test email and Square's
  sandbox payment methods. Do not enter a real card in the sandbox.
- Confirm Square charges the test order exactly $17.99 USD.
- Confirm the database records storefront `rylami`, total `1799`, and Square IDs.
- Confirm Square returns to Rylami's `/resources/purchase-complete.php`.
- Confirm only an authentic completed payment with matching amount/currency
  changes the order to Paid and triggers the email.
- Confirm the email uses Rylami as the display name, with the existing verified
  Resend sender address, and links to Rylami's `/resources/download.php`.
- Confirm PDF delivery and the Back to Resources link work on Rylami.
- Start a Beacon order and confirm its return/download links stay on Beacon.
- Replay a notification and check that Sent orders are not emailed again.
- Interrupt an unsent delivery and retry it. A database lock prevents concurrent
  sends; retries retain the token and Resend idempotency key. Resend deduplicates
  requests for 24 hours, not forever. If email acceptance was uncertain longer
  than 24 hours ago, check Resend logs before replaying the event.
- Invalid, expired, unpaid, wrong-storefront, or unpurchased-product downloads
  must fail. Visiting the return page alone must never mark an order Paid.
- Test failed email delivery: confirmation should show a help message, not
  refresh indefinitely. A later Square retry can still resume delivery.

## Before production

Verify the final document, email sender, product description, licensing, and
price. Archive/remove sandbox orders and invalidate their download links before
real sales; sandbox Paid orders must not grant access to a subsequently replaced
production PDF. Do not alter real paid orders. Switch Square configuration to
the matching production token/location and configure its production webhook
signature/URL deliberately. Remove the sandbox notice only after verifying the
production setup. Resend Sent means the service accepted the email, not proof
that it reached the buyer's inbox.

No public purchase button should be enabled until the installed checkout passes
the acceptance checks. Installing PHP on the server and pushing the static
Rylami repository are separate steps. Confirm that Rylami's deployment manager
preserves `resources/*.php`; if it wipes files absent from GitHub, the wrappers
must be included in the Rylami repository before its next deployment.

After ready Rylami changes are pushed to main, use the normal Deployment Manager:
http://rylami.com/rylami-deploy/
READY → DEPLOY LATEST WEBSITE → PENDING → RUNNING → COMPLETE ✓.
Then open http://rylami.com/. Do not deploy repeatedly while pending/running.
If FAILED, bring the result back for diagnosis.

## Rollback

Restore the backed-up PHP files and HTML. Leave the added storefront column in
place; older code ignores it. Preserve order records and secrets. Do not revert
Square credentials or webhook settings without checking which environment was
active before installation.
