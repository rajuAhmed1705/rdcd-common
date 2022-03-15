/**
 * @param  {string} sql
 * @param  {object} filter
 * @param  {"AND"|"OR"="AND"} operator
 * @param  {Function} filterFunc
 * @param  {string} primaryId
 * @param  {number} limit?
 * @param  {number} skip?
 */
export function buildSql(
  sql: string,
  filter: any,
  operator: "AND" | "OR" = "AND",
  filterFunc: Function,
  primaryId: string,
  limit?: number,
  skip?: number
): string[] {
  let where: string = " where";
  let plainSql = "";
  const keys: string[] = Object.keys(filter);

  for (let [index, key] of keys.entries()) {
    if (typeof filter[key] == "object") {
      var newKey = filterFunc(key);
      if (index === keys.length - 1)
        where += ` ${newKey} = ANY ($${index + 1})`;
      else where += ` ${newKey} =  ANY ($${index + 1} ) ${operator}`;
    } else {
      var newKey = filterFunc(key);
      if (index === keys.length - 1) where += ` ${newKey} = $${index + 1}`;
      else where += ` ${newKey} = $${index + 1} ${operator}`;
    }
  }
  if (!(Object.keys(filter).length > 0)) {
    return [sql + ` ORDER BY ${primaryId} LIMIT ${limit} OFFSET ${skip}`, sql];
  }
  plainSql = sql + where;
  where =
    !limit && !skip
      ? where
      : where + ` ORDER BY ${primaryId} LIMIT ${limit} OFFSET ${skip}`;
  return [sql + where, plainSql];
}

// export function buildSqlCreator(
//   creatorId: string,
//   sql: string,
//   filter: object,
//   operator: "AND" | "OR" = "AND",
//   filterFunc: Function,
//   primaryId: string,
//   limit?: number,
//   skip?: number
// ): string[] {
//   const keys: string[] = Object.keys(filter);
//   let where: string = " where";
//   for (let [index, key] of keys.entries()) {
//     var newKey = filterFunc(key);
//     if (index === keys.length - 1) where += ` ${newKey} = $${index + 1}`;
//     else where += ` ${newKey} = $${index + 1} ${operator}`;
//   }
//   const countSql = sql + where + ;
//   where =
//     !limit && !skip
//       ? where + `AND created_by= ${creatorId}`
//       : where +
//         `AND created_by= ${creatorId}` +
//         ` ORDER BY ${primaryId} LIMIT ${limit} OFFSET ${skip}`;

//   return [sql + where, countSql];
// }
