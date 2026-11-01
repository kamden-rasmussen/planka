/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import selectors from '../../../selectors';
import { isListArchiveOrTrash } from '../../../utils/record-helpers';
import {
  formatExactDuration,
  formatShortDuration,
  getDaysInList,
} from '../../../utils/time-in-list';
import useDaysInListSeverity from './useDaysInListSeverity';

import styles from './DaysInList.module.scss';

const DaysInList = React.memo(({ cardId, isExact, className }) => {
  const selectCardById = useMemo(() => selectors.makeSelectCardById(), []);
  const selectListById = useMemo(() => selectors.makeSelectListById(), []);

  const card = useSelector((state) => selectCardById(state, cardId));
  const list = useSelector((state) => selectListById(state, card.listId));
  const severity = useDaysInListSeverity(cardId);

  if (!card.listChangedAt || isListArchiveOrTrash(list)) {
    return null;
  }

  const days = getDaysInList(card.listChangedAt);

  return (
    <span
      className={classNames(
        styles.wrapper,
        severity === 'warning' && styles.warning,
        severity === 'danger' && styles.danger,
        className,
      )}
      title={`In this column for ${formatExactDuration(card.listChangedAt)} (${days} ${
        days === 1 ? 'day' : 'days'
      })`}
    >
      {isExact ? formatExactDuration(card.listChangedAt) : formatShortDuration(days)}
    </span>
  );
});

DaysInList.propTypes = {
  cardId: PropTypes.string.isRequired,
  isExact: PropTypes.bool,
  className: PropTypes.string,
};

DaysInList.defaultProps = {
  isExact: false,
  className: undefined,
};

export default DaysInList;
