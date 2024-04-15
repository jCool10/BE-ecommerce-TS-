import _ from 'lodash'

export const getFieldByObject = ({ fields, object }: { fields: Array<string>; object: object }) =>
  _.pick(object, fields)

const getInfoData = ({ fields, object = {} }: { fields: Array<string>; object?: object }) => {
  return _.pick(object, fields)
}

const getSelectData = (select: Array<string>) => {
  return Object.fromEntries(select.map((el) => [el, 1]))
}

const unGetSelectData = (select: Array<string>) => {
  return Object.fromEntries(select.map((el) => [el, 0]))
}

export { getInfoData, getSelectData, unGetSelectData }
