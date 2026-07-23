import {
  CheckOutlined,
  InfoCircleOutlined,
  LockOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../app/slice/modalSlice";
import notification from "../../common/utils/Notification";
import { useChangeEmployeePasswordMutation } from "../../modules/employee/api/employeeEndPoint";
import "./profile-ui.css";

/**
 * Advisory strength rules. The API does not enforce these — it accepts any
 * non-empty password — so they are guidance, checked here before submit rather
 * than silently skipped.
 */
const RULES = [
  { key: "len", label: "At least 6 characters", test: (v: string) => v.length >= 6 },
  { key: "letter", label: "Contains a letter", test: (v: string) => /[a-zA-Z]/.test(v) },
  { key: "number", label: "Contains a number", test: (v: string) => /\d/.test(v) },
];

const ChangeEmployeePassword = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [update, { isLoading, isSuccess }] =
    useChangeEmployeePasswordMutation();

  const newPassword = Form.useWatch("new_password", form) || "";

  const onFinish = (data: any) => {
    if (data.new_password === data.old_password) {
      return notification(
        "error",
        "Old password and new password cannot be the same"
      );
    }
    // Only the two fields the API knows about — confirm_password is local.
    update({
      old_password: data.old_password,
      new_password: data.new_password,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess]);

  return (
    <div className="pf">
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark={false}
        className="cp"
      >
        <div className="cp-note">
          <InfoCircleOutlined />
          <span>
            You will stay signed in on this device. Anyone using your account
            elsewhere will need the new password next time they sign in.
          </span>
        </div>

        <Form.Item
          name="old_password"
          label="Current Password"
          rules={[{ required: true, message: "Enter your current password" }]}
          style={{ marginBottom: 14 }}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Enter current password"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item
          name="new_password"
          label="New Password"
          rules={[
            { required: true, message: "Enter a new password" },
            { min: 6, message: "Use at least 6 characters" },
          ]}
          style={{ marginBottom: 10 }}
        >
          <Input.Password
            size="large"
            prefix={<SafetyOutlined />}
            placeholder="Enter new password"
            autoComplete="new-password"
          />
        </Form.Item>

        <div className="cp-rules">
          {RULES.map((r) => {
            const met = r.test(newPassword);
            return (
              <div
                key={r.key}
                className={`cp-rule${met ? " cp-rule--met" : ""}`}
              >
                <span className="cp-rule__mark">
                  <CheckOutlined />
                </span>
                {r.label}
              </div>
            );
          })}
        </div>

        <Form.Item
          name="confirm_password"
          label="Confirm New Password"
          dependencies={["new_password"]}
          rules={[
            { required: true, message: "Re-enter the new password" },
            // Caught here rather than after a round trip that would have
            // succeeded with a password the user mistyped.
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
          style={{ marginBottom: 4 }}
        >
          <Input.Password
            size="large"
            prefix={<SafetyOutlined />}
            placeholder="Re-enter new password"
            autoComplete="new-password"
          />
        </Form.Item>

        <div className="cp-footer">
          <Button onClick={() => dispatch(setCommonModal())}>Cancel</Button>
          <Button
            htmlType="submit"
            type="primary"
            icon={<LockOutlined />}
            loading={isLoading}
          >
            Update Password
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ChangeEmployeePassword;
