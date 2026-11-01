/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useSelector } from "react-redux";

import selectors from "../../../selectors";
import { isListArchiveOrTrash } from "../../../utils/record-helpers";

import styles from "./DaysInList.module.scss";

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const DaysInList = React.memo(({ cardId, className }) => {
  const selectCardById = useMemo(() => selectors.makeSelectCardById(), []);
  const selectListById = useMemo(() => selectors.makeSelectListById(), []);

  const card = useSelector((state) => selectCardById(state, cardId));
  const list = useSelector((state) => selectListById(state, card.listId));

  if (!card.listChangedAt || isListArchiveOrTrash(list)) {
    return null;
  }

  const days = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(card.listChangedAt).getTime()) / MS_IN_DAY,
    ),
  );

  return (
    <span
      className={classNames(styles.wrapper, className)}
      title={`In this column for ${days} ${days === 1 ? "day" : "days"}`}
    >
      {days}d
    </span>
  );
});

DaysInList.propTypes = {
  cardId: PropTypes.string.isRequired,
  className: PropTypes.string,
};

DaysInList.defaultProps = {
  className: undefined,
};

export default DaysInList;
