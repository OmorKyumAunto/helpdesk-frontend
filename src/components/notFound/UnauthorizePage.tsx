import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

type Props = {};

const UnauthorizePage = (props: Props) => {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, Unauthorized Page the page does not permit you."
      extra={
        <Button
          onClick={() => {
            navigate(-1);
          }}
          type="primary"
        >
          Back Home
        </Button>
      }
    />
  );
};

export default UnauthorizePage;
