/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core';
import startCase from 'lodash/startCase';

import {
  MetadataTable,
  MetadataTableItem,
  MetadataList,
  MetadataListItem,
} from './MetadataTable';

const listStyle = {
  root: {
    margin: '0 0',
    listStyleType: 'none',
  },
};

const nestedListStyle = {
  root: {
    ...listStyle.root,
    paddingLeft: '8px',
  },
};

function renderList(list, options, nested) {
  const values = list.map((item, index) => (
    <MetadataListItem key={index}>{toValue(item)}</MetadataListItem>
  ));
  return nested ? (
    <StyledNestedList>{values}</StyledNestedList>
  ) : (
    <StyledList>{values}</StyledList>
  );
}

function renderMap(map, options, nested) {
  const values = Object.keys(map).map(key => {
    const value = toValue(map[key], true);
    const fmtKey =
      options && options.titleFormat
        ? options.titleFormat(key)
        : startCase(key);
    return (
      <MetadataListItem key={key}>
        {`${fmtKey}: `}
        {value}
      </MetadataListItem>
    );
  });

  return nested ? (
    <StyledNestedList>{values}</StyledNestedList>
  ) : (
    <StyledList>{values}</StyledList>
  );
}

function toValue(value, options, nested) {
  if (React.isValidElement(value)) {
    return <Fragment>{value}</Fragment>;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return renderMap(value, options, nested);
  }

  if (Array.isArray(value)) {
    return renderList(value, options, nested);
  }

  return <Fragment>{value}</Fragment>;
}

function mapToItems(info, options) {
  return Object.keys(info).map(key => (
    <TableItem key={key} title={key} value={info[key]} options={options} />
  ));
}

// Sub Components
const StyledList = withStyles(listStyle)(({ classes, children }) => (
  <MetadataList classes={classes}>{children}</MetadataList>
));
const StyledNestedList = withStyles(
  nestedListStyle,
)(({ classes, children }) => (
  <MetadataList classes={classes}>{children}</MetadataList>
));
const ItemValue = ({ value, options }) => (
  <Fragment>{toValue(value, options)}</Fragment>
);
const TableItem = ({ title, value, options }) => {
  return (
    <MetadataTableItem
      title={
        options && options.titleFormat
          ? options.titleFormat(title)
          : startCase(title)
      }
    >
      <ItemValue value={value} options={options} />
    </MetadataTableItem>
  );
};

export default class StructuredMetadataTable extends Component {
  render() {
    const { metadata, dense, options } = this.props;
    const metadataItems = mapToItems(metadata, options || {});

    return <MetadataTable dense={dense}>{metadataItems}</MetadataTable>;
  }
}
