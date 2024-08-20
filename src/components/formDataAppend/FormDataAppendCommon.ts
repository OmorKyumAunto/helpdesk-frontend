
type IProps = {
  values: any,
  bodyFormData: any
}

export const formDataAppendCommon = ({values, bodyFormData}: IProps) => {
      for (const key in values) {
      if (Array.isArray(values[key])) {
        bodyFormData.append(key, values[key][0])
      } else {
        bodyFormData.append(key, values[key])
      }
    }
}