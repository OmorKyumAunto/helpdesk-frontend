import { FrownOutlined } from "@ant-design/icons"
import { Result } from "antd"

export const DataNotFound = ({ data }: any) => {
    return <Result
        icon={<FrownOutlined style={{ color: 'red' }} />}
        title={`${data} not found!`}
    />
}


