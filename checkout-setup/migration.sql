-- Back up the database first. Run ONCE against the existing resource_orders table.
-- Existing orders remain Beacon orders. No existing price or payment status is changed.
ALTER TABLE resource_orders ADD COLUMN storefront VARCHAR(16) NOT NULL DEFAULT 'beacon';
