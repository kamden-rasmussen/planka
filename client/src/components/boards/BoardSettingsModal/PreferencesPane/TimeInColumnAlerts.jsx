/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Input, Message, Segment } from 'semantic-ui-react';

import selectors from '../../../../selectors';
import entryActions from '../../../../entry-actions';
import { DEFAULT_DANGER_DAYS, DEFAULT_WARNING_DAYS } from '../../../../utils/time-in-list';

import styles from './TimeInColumnAlerts.module.scss';

const toText = (value) => (value === null || value === undefined ? '' : String(value));

const parse = (text) => {
  const trimmed = text.trim();

  if (trimmed === '') {
    return null;
  }

  return /^\d+$/.test(trimmed) ? parseInt(trimmed, 10) : undefined;
};

const TimeInColumnAlerts = React.memo(() => {
  const selectBoardById = useMemo(() => selectors.makeSelectBoardById(), []);

  const boardId = useSelector((state) => selectors.selectCurrentModal(state).params.id);
  const board = useSelector((state) => selectBoardById(state, boardId));

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const [drafts, setDrafts] = useState({});

  const getText = (fieldName) =>
    fieldName in drafts ? drafts[fieldName] : toText(board[fieldName]);

  const effective = (text, fallback) => {
    const value = parse(text);
    return value === null ? fallback : value;
  };

  const warningText = getText('warningDays');
  const dangerText = getText('dangerDays');
  const warning = effective(warningText, DEFAULT_WARNING_DAYS);
  const danger = effective(dangerText, DEFAULT_DANGER_DAYS);

  const isInvalid =
    parse(warningText) === undefined ||
    parse(dangerText) === undefined ||
    (!!warning && !!danger && danger <= warning);

  const handleChange = useCallback((_, { name, value }) => {
    setDrafts((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback(
    (event) => {
      const { name } = event.target;

      if (!(name in drafts) || isInvalid) {
        return;
      }

      const value = parse(drafts[name]);

      if (value !== (board[name] ?? null)) {
        dispatch(entryActions.updateBoard(boardId, { [name]: value }));
      }

      setDrafts((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    },
    [board, boardId, drafts, isInvalid, dispatch],
  );

  return (
    <Segment basic>
      <p className={styles.hint}>{t('common.timeInColumnAlertsHint')}</p>
      <Form error={isInvalid}>
        <Form.Field>
          <label htmlFor="warningDays">{t('common.warningAfterDays')}</label>
          <Input
            id="warningDays"
            name="warningDays"
            type="number"
            min="0"
            placeholder={String(DEFAULT_WARNING_DAYS)}
            value={warningText}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor="dangerDays">{t('common.dangerAfterDays')}</label>
          <Input
            id="dangerDays"
            name="dangerDays"
            type="number"
            min="0"
            placeholder={String(DEFAULT_DANGER_DAYS)}
            value={dangerText}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Form.Field>
        <Message error content={t('common.dangerMustBeGreaterThanWarning')} />
      </Form>
    </Segment>
  );
});

export default TimeInColumnAlerts;
