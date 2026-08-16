<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Expiry Alert Threshold
    |--------------------------------------------------------------------------
    |
    | Used when an item's own expiry_alert_threshold_days is null. Admin's
    | System Configuration screen (a later module) is meant to own this
    | value; until it exists, it is env-backed here rather than hardcoded
    | inline in the alert query.
    |
    */

    'default_expiry_alert_threshold_days' => env('INVENTORY_DEFAULT_EXPIRY_ALERT_THRESHOLD_DAYS', 30),

];
