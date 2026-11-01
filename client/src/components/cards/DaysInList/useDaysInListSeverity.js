/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import selectors from '../../../selectors';
import { isListArchiveOrTrash } from '../../../utils/record-helpers';
import { getDaysInList, getSeverity } from '../../../utils/time-in-list';
import { ListTypes } from '../../../constants/Enums';

// Returns 'warning' | 'danger' | null. Cards in closed lists and archive/trash are never flagged.
const useDaysInListSeverity = (cardId) => {
  const selectCardById = useMemo(() => selectors.makeSelectCardById(), []);
  const selectListById = useMemo(() => selectors.makeSelectListById(), []);

  const card = useSelector((state) => selectCardById(state, cardId));
  const list = useSelector((state) => selectListById(state, card.listId));

  if (
    !card.listChangedAt ||
    !list ||
    isListArchiveOrTrash(list) ||
    list.type === ListTypes.CLOSED
  ) {
    return null;
  }

  return getSeverity(getDaysInList(card.listChangedAt));
};

export default useDaysInListSeverity;
