/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

// Nullable on purpose: null = default thresholds (30 / 90 days), 0 = that level disabled.
module.exports.up = (knex) =>
  knex.schema.alterTable('board', (table) => {
    table.integer('warning_days');
    table.integer('danger_days');
  });

module.exports.down = (knex) =>
  knex.schema.alterTable('board', (table) => {
    table.dropColumn('warning_days');
    table.dropColumn('danger_days');
  });
