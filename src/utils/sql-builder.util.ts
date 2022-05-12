import { toSnakeKeys } from "keys-transform";
import lo from "lodash";
import { ISqlBuilderResult } from "../interfaces/sql-builder.interface";

/**
 * build where condition dynamically
 */
export function buildWhereSql(
  sql: string,
  filter: Object,
  skip: number,
  limit: number,
  injectionFilter: Function,
  operator: "AND" | "OR" = "AND"
): ISqlBuilderResult {
  let where: string = " WHERE";
  let params: any[] = [];
  let index = 0;
  for (let [key, value] of Object.entries(filter)) {
    const newKey = injectionFilter(key);
    if (index === lo.size(filter) - 1) where += ` ${newKey} = $${index + 1}`;
    else where += ` ${newKey} = $${index + 1} ${operator}`;
    params.push(value);
    index++;
  }
  sql += where;
  sql += ` ORDER BY id ASC LIMIT $${lo.size(filter) + 1} OFFSET $${
    lo.size(filter) + 2
  };`;
  params.push(limit, skip);
  return { sql, params };
}

/**
 * build aggregate where condition dynamically
 */
export function buildWhereAggrSql(
  sql: string,
  filter: Object,
  injectionFilter: Function,
  operator: "AND" | "OR" = "AND"
): ISqlBuilderResult {
  let where: string = " WHERE";
  let params: any[] = [];
  let index = 0;
  for (let [key, value] of Object.entries(filter)) {
    const newKey = injectionFilter(key);
    if (index === lo.size(filter) - 1) where += ` ${newKey} = $${index + 1}`;
    else where += ` ${newKey} = $${index + 1} ${operator}`;
    params.push(value);
    index++;
  }
  sql += where + ";";
  return { sql, params };
}

/**
 * build insert statement dynamically
 */
export function buildInsertSql(
  tableName: string,
  data: Object
): ISqlBuilderResult {
  let attrs = "";
  let paramsStr = "";
  let sql = `INSERT INTO ${tableName} `;
  const snakeObject = toSnakeKeys(data);
  const params: any[] = [];
  let counter = 0;
  for (const [k, v] of Object.entries(snakeObject)) {
    attrs = attrs + `${k},`;
    paramsStr = paramsStr + `$${++counter},`;
    params.push(v);
  }
  sql += `(${attrs.slice(0, -1)})` + " VALUES " + `(${paramsStr.slice(0, -1)})`;
  sql += ` RETURNING *;`;

  return { sql, params };
}

/**
 * build update statement dynamically
 */
export function buildUpdateSql(
  tableName: string,
  id: number,
  data: Object,
  nameOfThePrimaryId: string
): ISqlBuilderResult {
  let attrs = "";
  let sql = `UPDATE ${tableName} SET `;
  const snakeObject = toSnakeKeys(data);
  const params: any[] = [];
  let counter = 0;
  for (const [k, v] of Object.entries(snakeObject)) {
    attrs += `${k} = $${++counter},`;
    params.push(v);
  }
  sql += attrs.slice(0, -1);
  sql += ` WHERE ${nameOfThePrimaryId} = $${++counter}`;
  sql += ` RETURNING * ;`;
  params.push(id);
  return { sql, params };
}

/**
 * Build update with where SQL dynamically
 */
export function buildUpdateWithWhereSql(
  tableName: string,
  whereData: Object,
  updateData: Object
): ISqlBuilderResult {
  let attrs = "";
  let sql = `UPDATE ${tableName} SET `;
  const snakeUpdateDate = toSnakeKeys(updateData);
  const snakeWhereData = toSnakeKeys(whereData);
  const params: any[] = [];
  let counter = 0;
  for (const [k, v] of Object.entries(snakeUpdateDate)) {
    attrs += `${k} = $${++counter},`;
    params.push(v);
  }
  sql += attrs.slice(0, -1);
  let where = " WHERE ";
  for (const [k, v] of Object.entries(snakeWhereData)) {
    where += `${k} = $${++counter} AND `;
    params.push(v);
  }
  sql += where.slice(0, -4);
  sql += ` RETURNING *;`;
  return { sql, params };
}

export function buildUpsertSql(
  tableName: string,
  primaryKey: string,
  data: Object,
  updateFields?: {},
  removeFromUpdateFields?: Array<string>
) {
  let attrs = "";
  let paramsStr = "";

  let insertQuery = `INSERT INTO ${tableName} `;

  const snakeObject = toSnakeKeys(data);
  const params: any[] = [];

  let counter = 0;

  for (const [k, v] of Object.entries(snakeObject)) {
    attrs = attrs + `${k},`;
    paramsStr = paramsStr + `$${++counter},`;
    params.push(v);
  }

  insertQuery +=
    `(${attrs.slice(0, -1)})` + " VALUES " + `(${paramsStr.slice(0, -1)})`;

  const conflictQuery = ` ON CONFLICT (${primaryKey}) DO `;

  let updateQuery = `UPDATE SET `;
  let updateAttrs = "";

  let updateObject = data;
  delete updateObject[primaryKey as keyof Object];

  removeFromUpdateFields?.map((field) => {
    delete updateObject[field as keyof Object];
  });

  updateObject = { ...updateObject, ...updateFields };
  let updateCounter = 1;

  for (const [k, v] of Object.entries(toSnakeKeys(updateObject))) {
    updateAttrs += `${k} = $${++updateCounter},`;
  }

  updateQuery += updateAttrs.slice(0, -1);

  return {
    sql: insertQuery + conflictQuery + updateQuery,
    params,
  };
}

export function buildTempToMainSql(
  tempTableName: string,
  mainTableName: string,
  samityId: number,
  mainTable: any,
  tempTable: any,
  nameOfThePrimaryId: string,
  returningValue: string,
  dataChange: any,
  whereCondition: any
): {
  sql: string;
  // params: any[];
} {
  let attrs = "";
  let mainTableKeys = [...mainTable];
  let tempTableKeys = [...tempTable];
  let sql = `INSERT INTO ${mainTableName}`;
  let cString = ``;
  for (const [index, value] of mainTableKeys.entries()) {
    if (index === 0) {
      cString += `${value}`;
    } else {
      cString += `,` + `${value}`;
    }
  }
  let selectSql = `SELECT `;
  let counter = 1;
  for (const element of dataChange) {
    if (tempTableKeys.includes(element)) {
      const indexOfStatus = tempTableKeys.indexOf(element);
      tempTableKeys[indexOfStatus] = `$${counter}`;
      counter = counter + 1;
    }
  }

  for (const [index, value] of tempTableKeys.entries()) {
    if (index === 0) {
      selectSql += `${value}`;
    } else {
      selectSql += `,` + `${value}`;
    }
  }
  // for (const [index, value] of tempTableKeys.entries()) {
  //   if (index === 0) {
  //     selectSql += `${toSnakeCase(value)}`;
  //   } else {
  //     selectSql += `,` + `${toSnakeCase(value)}`;
  //   }
  // }

  sql += `(${cString}) `;
  sql += `${selectSql} `;
  sql += `FROM ${tempTableName} `;
  // sql += `WHERE ${nameOfThePrimaryId}=$${counter}`;
  for (const [index, value] of whereCondition.entries()) {
    if (index == 0) {
      sql += `WHERE ${value}=$${counter} `;
      counter = counter + 1;
    } else {
      sql += `AND  ${value}=$${counter}`;
      counter = counter + 1;
    }
  }
  sql += ` RETURNING ${returningValue} ;`;
  return { sql };
}

export function buildGetSql(
  selectName: string[],
  tableName: string,
  whereCondition: Object = {}
): { queryText: string; values: any } {
  let queryText = `SELECT`;
  if (selectName) {
    for (const [index, key] of selectName.entries()) {
      if (index === 0) {
        queryText = queryText + ` ${selectName[index]} `;
      } else {
        queryText = queryText + `, ${selectName[index]} `;
      }
      // return getTheNameOfValues;
    }
  }
  queryText = queryText + ` FROM ${tableName}`;
  let count = 1;
  const keys = Object.keys(toSnakeKeys(whereCondition));
  const values = Object.values(whereCondition);
  if (whereCondition) {
    for (const [index, key] of keys.entries()) {
      if (index === 0) {
        queryText = queryText + ` WHERE ${keys[index]}= $${count} `;
        count = count + 1;
      } else {
        queryText = queryText + ` AND ${keys[index]}= $${count} `;
        count = count + 1;
      }
    }
  }
  return { queryText, values };
}
